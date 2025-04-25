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

    // Appliquer les styles nécessaires pour la mesure
    clone.style.position = 'absolute'
    clone.style.visibility = 'hidden'
    clone.style.height = 'auto'
    clone.style.width = style.width
    clone.style.whiteSpace = 'normal'
    clone.style.padding = style.padding
    clone.style.font = style.font
    clone.style.letterSpacing = style.letterSpacing
    clone.style.wordSpacing = style.wordSpacing
    clone.style.lineHeight = style.lineHeight
    clone.style.maxWidth = style.maxWidth

    // Placer temporairement le clone dans le body pour mesurer
    document.body.appendChild(clone)
    const lineHeight = parseFloat(style.lineHeight)
    const totalHeight = clone.getBoundingClientRect().height
    const lineCount = Math.round(totalHeight / lineHeight)

    document.body.removeChild(clone)
    return lineCount
  }

  function updateChevrons() {
    const targetElement = document.querySelector('#target')
    const chevronsContainer = document.querySelector('.chevrons')

    if (!targetElement || !chevronsContainer) return

    const lineCount = getRealLineCount(targetElement)

    chevronsContainer.innerHTML = ''

    for (let i = 0; i < lineCount; i++) {
      const chevronSpan = document.createElement('span')
      chevronSpan.classList.add('chevron')
      chevronSpan.innerHTML = '&gt;'
      chevronsContainer.appendChild(chevronSpan)
    }
  }

  updateChevrons()

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

// 3. Fonction pour traiter une commande
function processCommand(command) {
  const typed = document.createElement('span')
  typed.innerHTML = `&gt; ${command}`
  terminal.appendChild(typed)

  const responseText = commands[command]

  if (responseText) {
    const lines = responseText.split('\n')
    lines.forEach((line, index) => {
      setTimeout(() => {
        const outputLine = document.createElement('span')
        outputLine.classList.add('is-answer')
        outputLine.innerHTML = `&gt; ${line}`
        terminal.appendChild(outputLine)
        terminal.scrollTop = terminal.scrollHeight
      }, index * 100) // 100ms entre chaque ligne, ajustable
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
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    const command = input.value.trim().toLowerCase()
    if (command) {
      processCommand(command)
      input.value = ''
    }
  }
})

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

  // Fonction pour basculer entre les vues
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

  // Ajouter les événements au click
  terminalBtn.addEventListener('click', () => toggleView(true))
  snakeBtn.addEventListener('click', () => toggleView(false))

  // Fonction pour ajouter un effet de survol sur les flèches
  function addHoverArrowEffect(btn, arrow) {
    btn.addEventListener('mouseenter', () => {
      if (!btn.classList.contains('is-active')) {
        arrow.style.opacity = '1'
        arrow.classList.remove('animate')
        void arrow.offsetWidth // Cela force une reflow pour l'animation
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

  // Appelle la fonction pour chaque paire bouton/flèche
  addHoverArrowEffect(
    document.getElementById('manifesto'),
    document.getElementById('left-arrow')
  )
  addHoverArrowEffect(
    document.getElementById('game'),
    document.getElementById('right-arrow')
  )
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
    cells.forEach((cell) => (cell.className = 'cell'))
    snake.forEach((i) => cells[i].classList.add('snake'))
    if (food !== null) cells[food].classList.add('food')
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
