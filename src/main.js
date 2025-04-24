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

/* global SplitType */
/* eslint-disable no-unused-vars */
const text = new SplitType('#target')
/* eslint-enable no-unused-vars */
// 2. Ajoute '>' au début des lignes déjà présentes
document.addEventListener('DOMContentLoaded', function () {
  // Fonction pour appliquer SplitType et ajouter un chevron pour chaque ligne
  function formatLines() {
    const targetElement = document.querySelector('#target')

    // Sauvegarder le contenu d'origine, mais cette fois en s'assurant que les sauts de ligne sont bien traduits en HTML
    const originalText = targetElement.innerHTML

    // Remplacer les retours à la ligne (nouvelles lignes) et les <br> par des marqueurs HTML compatibles
    const textWithLineBreaks = originalText.replace(/(\r\n|\n|\r)/g, '<br>') // Remplacer les retours à la ligne par des balises <br>

    // Mettre à jour le contenu de #target avec le texte formaté
    targetElement.innerHTML = textWithLineBreaks

    // Appliquer SplitType sur l'élément cible
    new SplitType('#target') // Applique SplitType à l'élément avec l'ID "target"

    // Sélectionner toutes les divs générées par SplitType (chaque ligne est un div)
    const lines = document.querySelectorAll('#target .line')

    // Sélectionner la div contenant les chevrons
    const chevronsContainer = document.querySelector('.chevrons')

    // Réinitialiser le contenu de la div .chevrons à chaque mise à jour
    chevronsContainer.innerHTML = ''

    // Ajouter un chevron pour chaque ligne générée par SplitType
    lines.forEach(() => {
      const chevronSpan = document.createElement('span')
      chevronSpan.classList.add('chevron')
      chevronSpan.innerHTML = '&gt;'
      chevronsContainer.appendChild(chevronSpan)
    })
  }

  // Applique le format initial après que la page soit chargée
  formatLines()

  // Surveiller les changements de taille de la fenêtre
  const resizeObserver = new ResizeObserver(() => {
    formatLines() // Re-applique le format à chaque redimensionnement
  })

  // Commencer l'observation sur l'élément .terminal_inner pour ajuster les lignes
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
  const typed = document.createElement('div')
  typed.innerHTML = `&gt; ${command}`
  terminal.appendChild(typed)

  const output = document.createElement('span')
  output.classList.add('is-answer')

  const responseText = commands[command]

  if (responseText) {
    const lines = responseText.split('\n')
    const formatted = lines.map((line) => `&gt; ${line}`).join('<br>')
    output.innerHTML = formatted
  } else {
    output.innerHTML = `&gt; Command not found: "${command}"`
  }

  terminal.appendChild(output)
  terminal.scrollTop = terminal.scrollHeight
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
document.querySelector('.w-webflow-badge')?.remove()

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
