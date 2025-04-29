import { gsap } from 'gsap'

const input = document.getElementById('terminal-input')
const terminal = document.querySelector('.terminal_inner')
const sendButton = document.querySelector('.button')

// 1. Récupère les commandes depuis le DOM
const commandElements = document.querySelectorAll('.commands_item')
const commands = {}

commandElements.forEach((el) => {
  const name = el.getAttribute('data-command')
  const response = el.getAttribute('data-response')
  if (name && response) {
    commands[name.toLowerCase()] = response
  }
})

// Chevrons sur target
document.addEventListener('DOMContentLoaded', function () {
  function getRealLineCount(element) {
    const clone = element.cloneNode(true)
    const style = window.getComputedStyle(element)

    // Récupérer la valeur réelle de la variable CSS pour la taille de la police (par exemple, '--font-size')
    const fontSize = style.getPropertyValue('font-size')
    const lineHeight = style.getPropertyValue('line-height') // Peut aussi être une variable CSS, vous pouvez la gérer ici si nécessaire.

    // Appliquer les styles nécessaires pour la mesure
    clone.style.position = 'absolute'
    clone.style.visibility = 'hidden'
    clone.style.height = 'auto'
    clone.style.width = style.width
    clone.style.whiteSpace = 'normal'
    clone.style.padding = style.padding
    clone.style.font = style.font // Le font appliqué au clone
    clone.style.letterSpacing = style.letterSpacing
    clone.style.wordSpacing = style.wordSpacing
    clone.style.lineHeight = lineHeight // Utilisation de la valeur récupérée
    clone.style.maxWidth = style.maxWidth

    // Appliquer la taille de la police dynamique ou variable au clone
    clone.style.fontSize = fontSize // La taille de la police récupérée avec la variable CSS

    // Placer temporairement le clone dans le body pour mesurer
    document.body.appendChild(clone)

    // Calcul du nombre de lignes en utilisant la hauteur totale et la hauteur de ligne
    const totalHeight = clone.getBoundingClientRect().height
    const lineHeightNumeric = parseFloat(lineHeight)
    const lineCount = Math.round(totalHeight / lineHeightNumeric)

    // Nettoyer le clone
    document.body.removeChild(clone)

    return lineCount
  }

  function updateChevrons() {
    const targetElement = document.querySelector('#target')
    const chevronsContainer = document.querySelector('.chevrons')

    if (!targetElement || !chevronsContainer) return

    const lineCount = getRealLineCount(targetElement)

    chevronsContainer.innerHTML = ''

    // Ajouter les chevrons en fonction du nombre de lignes
    for (let i = 0; i < lineCount; i++) {
      const chevronSpan = document.createElement('span')
      chevronSpan.classList.add('chevron')
      chevronSpan.innerHTML = '&gt;'
      chevronsContainer.appendChild(chevronSpan)
    }
  }

  // Mettre à jour les chevrons au chargement initial
  updateChevrons()

  // Observer les changements de taille du terminal
  const resizeObserver = new ResizeObserver(() => {
    updateChevrons()
  })

  const terminalElement = document.querySelector('.terminal_inner')
  if (terminalElement) {
    resizeObserver.observe(terminalElement)
  }
})

// Préfixer chaque .is-command
document.querySelectorAll('.is-command').forEach((el) => {
  const trimmed = el.textContent.trim()
  if (!trimmed.startsWith('>')) {
    el.textContent = `> ${trimmed}`
  }
})

//generer username
function generateDefaultUsername() {
  const randomDigits = Math.floor(10000 + Math.random() * 90000) // garantit 5 chiffres
  return `anon${randomDigits}`
}

function updateWelcomeText() {
  const welcomeElement = document.querySelector('.welcome')
  if (welcomeElement) {
    welcomeElement.textContent = `Welcome, ${storedUsername} !`
  }
}

// traitement commandes
let storedUsername = generateDefaultUsername()
updateWelcomeText()

function processCommand(command) {
  const typed = document.createElement('span')
  typed.classList.add('is-answer')
  typed.innerHTML = `&gt; ${command}`
  terminal.appendChild(typed)

  // Détection et stockage du nom personnalisé
  if (command.toLowerCase().startsWith('user ')) {
    const name = command.slice(5).trim()
    if (name) {
      storedUsername = name
      const output = document.createElement('span')
      output.classList.add('is-answer')
      output.innerHTML = `&gt; Welcome, ${storedUsername} !`
      terminal.appendChild(output)
      terminal.scrollTop = terminal.scrollHeight
    } else {
      const output = document.createElement('span')
      output.classList.add('is-answer')
      output.innerHTML = `&gt; Veuillez entrer un nom après "user"`
      terminal.appendChild(output)
      terminal.scrollTop = terminal.scrollHeight
    }
    return
  }

  // Traitement des commandes standards avec injection de username
  const responseText = commands[command]

  if (responseText) {
    const lines = responseText.split('\n')
    lines.forEach((line, index) => {
      setTimeout(() => {
        const outputLine = document.createElement('span')
        outputLine.classList.add('is-answer')

        // 🔁 Remplacement de [username] dans chaque ligne
        const replacedLine = line.replace(/\[name\]/gi, storedUsername)

        outputLine.innerHTML = `&gt; ${replacedLine}`
        terminal.appendChild(outputLine)
        terminal.scrollTop = terminal.scrollHeight
      }, index * 100)
    })
  } else {
    setTimeout(() => {
      const output = document.createElement('span')
      output.classList.add('is-answer')
      output.innerHTML = `&gt; Command not found: "${command}"`
      terminal.appendChild(output)
      terminal.scrollTop = terminal.scrollHeight
    }, 100)
  }
}

// 4. Input clavier
if (input) {
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase()
      if (command) {
        processCommand(command)
        input.value = ''
      }
    }
  })
}

// 5. Bouton "Send"
sendButton.addEventListener('click', function () {
  const command = input.value.trim().toLowerCase()
  if (command) {
    processCommand(command)
    input.value = ''
  }
})

// Toggle
function initToggleView() {
  const terminalBtn = document.getElementById('manifesto')
  const snakeBtn = document.getElementById('game')
  const terminalView = document.getElementById('manifesto-view')
  const snakeView = document.getElementById('game-view')
  const leftArrow = document.getElementById('left-arrow')
  const rightArrow = document.getElementById('right-arrow')

  // Vérifie si tous les éléments nécessaires sont présents
  if (
    !terminalBtn ||
    !snakeBtn ||
    !terminalView ||
    !snakeView ||
    !leftArrow ||
    !rightArrow
  ) {
    // Un des éléments n'existe pas, on arrête ici pour éviter les erreurs
    return
  }

  function toggleView(showTerminal) {
    terminalView.classList.toggle('is-visible', showTerminal)
    snakeView.classList.toggle('is-visible', !showTerminal)

    terminalBtn.classList.toggle('is-active', showTerminal)
    snakeBtn.classList.toggle('is-active', !showTerminal)

    leftArrow.classList.toggle('is-active', showTerminal)
    rightArrow.classList.toggle('is-active', !showTerminal)

    leftArrow.style.opacity = showTerminal ? '1' : '0.5'
    rightArrow.style.opacity = showTerminal ? '0.5' : '1'
  }

  terminalBtn.addEventListener('click', () => toggleView(true))
  snakeBtn.addEventListener('click', () => toggleView(false))

  function addHoverArrowEffect(btn, arrow) {
    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('is-active')) {
        arrow.style.opacity = '1'
        arrow.classList.remove('animate')
        void arrow.offsetWidth
        arrow.classList.add('animate')
      }
    })

    btn.addEventListener('mouseleave', () => {
      if (!btn.classList.contains('is-active')) {
        arrow.style.opacity = '0.5'
      }
    })

    arrow.addEventListener('animationend', () => {
      arrow.classList.remove('animate')
    })
  }

  addHoverArrowEffect(terminalBtn, leftArrow)
  addHoverArrowEffect(snakeBtn, rightArrow)
}

// Initialiser le toggle au chargement
initToggleView()

// Appelle la fonction une fois le DOM prêt
document.addEventListener('DOMContentLoaded', initToggleView)

function addChevronToLines() {
  document.querySelectorAll('.is-terminal-text').forEach((element) => {
    // Récupérer le contenu HTML de chaque élément
    let htmlContent = element.innerHTML

    // Séparer le texte en lignes, en utilisant <br> comme délimiteur
    const lines = htmlContent.split('<br>')

    // Ajouter un ">" au début de chaque ligne tout en préservant les espaces
    const formattedLines = lines.map((line) => {
      // Trim les espaces avant et après, mais garde ceux avant le texte
      const leadingSpaces = line.match(/^\s*/)[0] // récupère les espaces au début
      const trimmedLine = line.trim() // enlève les espaces avant et après

      // Ajouter le ">" tout en gardant les espaces
      return `${leadingSpaces}&gt; ${trimmedLine}`
    })

    // Rejoindre les lignes formatées avec <br> pour créer le texte final
    element.innerHTML = formattedLines.join('<br>')
  })
}

// Appel de la fonction lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', addChevronToLines)

// Scramble text
function initScrambleOnHover(selector, options = {}) {
  const {
    speed = 150,
    target = null, // Permet de définir une sous-cible, ex: '.label'
  } = options

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?/[]{}'

  document.querySelectorAll(selector).forEach((el) => {
    const targetEl = target ? el.querySelector(target) : el
    if (!targetEl) return

    const finalText = targetEl.textContent

    el.addEventListener('mouseenter', () => {
      let output = ''
      let revealed = 0

      const scrambleInterval = setInterval(() => {
        output = ''

        for (let i = 0; i < finalText.length; i++) {
          if (i < revealed) {
            output += finalText[i]
          } else {
            output += chars.charAt(Math.floor(Math.random() * chars.length))
          }
        }

        targetEl.textContent = output

        if (revealed < finalText.length) {
          revealed++
        } else {
          clearInterval(scrambleInterval)
          targetEl.textContent = finalText
        }
      }, speed)
    })
  })
}
initScrambleOnHover('[data-scramble]', {
  target: '.label', // Ne scramblera QUE le contenu texte de .label
})

//Scramble Data
const dataConfig = {
  '.is-rate': {
    type: 'number',
    min: 40,
    max: 50,
    suffix: '%',
  },
  '.is-souls': {
    type: 'number',
    min: 91,
    max: 97,
    range: true,
    decimalPlaces: 3,
    suffix: '',
  },
  '.is-entropy': {
    type: 'number',
    range: true,
    min: -0.017,
    max: +0.115,
    suffix: 'Δ',
    decimalPlaces: 3,
  },
  '.is-trust': {
    type: 'text',
    options: ['███%', '███%', '██%', '--'],
  },
  '.is-initiation': {
    type: 'number',
    min: 5,
    max: 12,
    suffix: 'await.',
  },
  '.is-neural': {
    type: 'text',
    options: ['High', 'Med.', 'Null', 'Max.', 'Lost', '--', '∞'],
  },
  '.is-origin': {
    type: 'text',
    options: ['@serp', '@v0id', '--', '@Ω421', '@Ω314'],
  },
  '.is-pulse': {
    type: 'number',
    min: 10.8,
    max: 17.7,
    suffix: 'HZ',
  },
  '.is-memory': {
    type: 'number',
    min: 18,
    max: 71,
    suffix: '% Mem',
  },
  '.is-cpu': {
    type: 'number',
    min: 21,
    max: 82,
    suffix: '% CPU',
  },
}

function scrambleText(element, finalText, duration = 500) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%.-'
  let iterations = 0
  const length = Math.max(finalText.length, element.textContent.length)

  const interval = setInterval(() => {
    const scrambled = finalText
      .split('')
      .map((char, i) => {
        if (i < iterations) return finalText[i]
        return chars[Math.floor(Math.random() * chars.length)]
      })
      .join('')
    element.textContent = scrambled
    iterations++
    if (iterations >= length) {
      clearInterval(interval)
      element.textContent = finalText
    }
  }, duration / length)
}

function getRandomValue(config) {
  if (config.type === 'number') {
    if (config.range) {
      const value = Math.random() * (config.max - config.min) + config.min
      const formattedValue = value.toFixed(config.decimalPlaces || 3)
      const signedValue = value >= 0 ? `+${formattedValue}` : formattedValue
      return `${signedValue}${config.suffix || ''}` // Ajoute le suffixe (ex: Δ) sans espace
    }

    const value =
      Math.floor(Math.random() * (config.max - config.min + 1)) + config.min
    return `${value}${config.suffix || ''}`
  } else if (config.type === 'text') {
    return config.options[Math.floor(Math.random() * config.options.length)]
  }

  return ''
}

function updateDataWithScramble() {
  Object.entries(dataConfig).forEach(([selector, config]) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => {
      const newValue = getRandomValue(config)
      scrambleText(el, newValue)
    })
  })
}

setInterval(updateDataWithScramble, 4000)

// CRT
document.addEventListener('DOMContentLoaded', () => {
  // Récupérer ou créer le conteneur principal
  const container = document.getElementById('crt-container')

  // Créer l'élément .crt
  const crt = document.createElement('div')
  crt.classList.add('crt')

  // Ajouter la div .crt dans le conteneur principal
  container.appendChild(crt)

  // Fonction pour créer les lignes
  function createLines() {
    // Supprimer toutes les lignes existantes
    crt.innerHTML = ''

    // Déterminer combien de lignes il faut en fonction de la hauteur du viewport
    const linesCount = Math.floor(window.innerHeight / 4) // Ajuster 4 selon l'épaisseur des lignes

    // Créer et ajouter les lignes .crt-line
    for (let i = 0; i < linesCount; i++) {
      const line = document.createElement('div')
      line.classList.add('crt-line')
      crt.appendChild(line)
    }
  }

  // Appeler la fonction pour créer les lignes au chargement de la page
  createLines()

  // Réinitialiser les lignes à chaque redimensionnement de la fenêtre
  window.addEventListener('resize', createLines)
})

document.addEventListener('DOMContentLoaded', function () {
  const scanElement = document.querySelector('.scan')

  // Définir les positions de départ et d'arrivée

  // GSAP Animation
  function animateScan() {
    // Animer la div scan sur 3 secondes, puis attendre 4 secondes avant de recommencer
    gsap.fromTo(
      scanElement,
      { y: '-7.375rem' }, // Position de départ
      {
        y: () => {
          // Calcule la nouvelle position de 'y' en combinant 100vh et 7.375rem
          const vh = window.innerHeight // Hauteur de la fenêtre en pixels
          const rem = parseFloat(
            getComputedStyle(document.documentElement).fontSize
          ) // Taille de 1rem en pixels
          return vh + 7.375 * rem // Ajoute 100vh + 7.375rem en pixels
        }, // Durée de l'animation
        duration: 3,
        ease: 'linear', // Transition linéaire
        repeat: -1, // Répéter indéfiniment
        repeatDelay: 14, // Délai de 4 secondes entre chaque itération
      }
    )
  }

  // Lancer l'animation dès que la page est chargée
  animateScan()
})

//Dropdown
// Récupérer les éléments
const dropdownButton = document.querySelector('.dropdown')
const dropdownInner = document.querySelector('.dropdown-inner')
const dropdownArrow = document.querySelector('.dropdown_arrow')

// Ajouter un événement de clic au bouton dropdown
dropdownButton.addEventListener('click', () => {
  // Vérifier si dropdown-inner est actuellement visible
  const isVisible = dropdownInner.style.display === 'flex'

  if (isVisible) {
    // Cacher le dropdown-inner et remettre l'arrow à 0deg
    dropdownInner.style.display = 'none'
    dropdownArrow.style.transform = 'rotate(0deg)'
  } else {
    // Afficher le dropdown-inner et faire pivoter l'arrow de 180deg
    dropdownInner.style.display = 'flex'
    dropdownArrow.style.transform = 'rotate(180deg)'
  }
})

// Game
document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.querySelector('.game_inner')
  const lostScreen = document.querySelector('.game_lost')
  const restartBtn = document.getElementById('restart')

  // Config
  const gridSize = 20
  const totalCells = gridSize * gridSize
  const cells = []

  let snake, direction, food, interval

  // Grille
  const grid = document.createElement('div')
  grid.className = 'game-grid'
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div')
    cell.className = 'cell'
    grid.appendChild(cell)
    cells.push(cell)
  }
  gameContainer.appendChild(grid)

  function draw() {
    cells.forEach((cell) => {
      cell.className = 'cell'
      cell.innerHTML = '' // Réinitialiser le contenu
    })

    snake.forEach((i) => cells[i].classList.add('snake'))

    if (food !== null) {
      const foodCell = cells[food]
      foodCell.classList.add('food')
      foodCell.innerHTML = '$'
    }
  }

  function placeFood() {
    let newFood
    do {
      newFood = Math.floor(Math.random() * totalCells)
    } while (snake.includes(newFood))
    food = newFood
  }

  function endGame() {
    clearInterval(interval)
    lostScreen.style.display = 'flex'
  }

  function move() {
    let head = snake[0]
    let next

    if (direction === 1 && head % gridSize === gridSize - 1) {
      next = head - (gridSize - 1)
    } else if (direction === -1 && head % gridSize === 0) {
      next = head + (gridSize - 1)
    } else if (direction === -gridSize && head < gridSize) {
      next = head + gridSize * (gridSize - 1)
    } else if (direction === gridSize && head >= totalCells - gridSize) {
      next = head - gridSize * (gridSize - 1)
    } else {
      next = head + direction
    }

    if (snake.includes(next)) {
      endGame()
      return
    }

    snake.unshift(next)

    if (next === food) {
      placeFood()
    } else {
      snake.pop()
    }

    draw()
  }

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== gridSize) direction = -gridSize
        break
      case 'ArrowDown':
        if (direction !== -gridSize) direction = gridSize
        break
      case 'ArrowLeft':
        if (direction !== 1) direction = -1
        break
      case 'ArrowRight':
        if (direction !== -1) direction = 1
        break
    }
  })

  function startGame() {
    snake = [42, 41, 40]
    direction = 1
    placeFood()
    draw()
    lostScreen.style.display = 'none'
    clearInterval(interval)
    interval = setInterval(move, 150)
  }

  restartBtn.addEventListener('click', () => {
    startGame()
  })

  startGame()
})

function moveHomeDependingOnScreen() {
  const home = document.querySelector('.home')
  const navWrapper = document.querySelector('.nav-wrapper')
  const header = document.querySelector('.header')

  if (!home || !navWrapper || !header) return

  const mobileMediaQuery = window.matchMedia('(max-width: 991px)')

  function handleScreenChange(e) {
    if (e.matches) {
      // On est en mobile
      if (home.parentElement !== navWrapper) {
        navWrapper.insertBefore(home, navWrapper.firstChild)
      }
    } else {
      // On est en desktop
      if (home.parentElement !== header) {
        header.insertBefore(home, navWrapper)
      }
    }
  }

  // On initialise au chargement
  handleScreenChange(mobileMediaQuery)

  // On écoute les changements de taille d'écran
  mobileMediaQuery.addEventListener('change', handleScreenChange)
}

window.addEventListener('DOMContentLoaded', moveHomeDependingOnScreen)

function startLoaderAnimation() {
  gsap.registerPlugin()

  const logos = ['.logo-2', '.logo-3', '.logo-4', '.logo-5', '.logo-6']
  const logs = document.querySelectorAll('.loader_log')
  const bgItems = Array.from(document.querySelectorAll('.loader_bg-item'))
  const totalDuration = 3
  const durationPerLogo = 3 / logos.length
  const durationPerLog = 3 / logs.length

  const timeline = gsap.timeline({
    onComplete: fadeOutLoaderElements,
  })

  timeline.set('.loader', { display: 'flex' }, 0)

  // Assurer la visibilité initiale
  timeline.set(
    ['.loader_logos', '.loader_logs', '.loader_progress'],
    { display: 'block', opacity: 1 },
    0
  )

  // Logos un par un
  logos.forEach((selector, index) => {
    timeline.set(selector, { display: 'block' }, index * durationPerLogo)
  })

  // Logs un par un
  logs.forEach((log, index) => {
    timeline.set(log, { display: 'block' }, index * durationPerLog)
  })

  // Progression du pourcentage
  timeline.to(
    '.progress-amount',
    {
      innerText: 100,
      duration: totalDuration,
      roundProps: 'innerText',
      onUpdate: function () {
        const progress = this.targets()[0].innerText
        this.targets()[0].innerText = `[ ${progress}% ]`
      },
      ease: 'none',
    },
    0
  )

  // Étape suivante : fondre les éléments principaux
  function fadeOutLoaderElements() {
    gsap.to(['.loader_logos', '.loader_logs', '.loader_progress'], {
      opacity: 0,
      duration: 0.3,
      onComplete: fadeOutBgItemsWave,
    })
  }

  // Vagues instantanées de disparition
  function fadeOutBgItemsWave() {
    const firstBatch = getRandomSubset(bgItems, Math.ceil(bgItems.length * 0.3))
    const remainingAfterFirst = bgItems.filter((i) => !firstBatch.includes(i))
    const secondBatch = getRandomSubset(
      remainingAfterFirst,
      Math.ceil(bgItems.length * 0.3)
    )
    const finalBatch = remainingAfterFirst.filter(
      (i) => !secondBatch.includes(i)
    )

    // Disparition instantanée, sans transition
    gsap.set(firstBatch, { opacity: 0 })
    gsap.delayedCall(0.3, () => {
      gsap.set(secondBatch, { opacity: 0 })
    })
    gsap.delayedCall(0.5, () => {
      gsap.set(finalBatch, { opacity: 0 })
      // Masquer complètement le loader à la fin
      gsap.set('.loader', { display: 'none' })
    })
  }

  function getRandomSubset(array, count) {
    const shuffled = array.slice().sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
}

startLoaderAnimation()
