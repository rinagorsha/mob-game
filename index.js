const startEl = document.getElementById('start')
const startButton = document.getElementById('start-button')
const gameEl = document.getElementById('game')
const scoreEl = document.getElementById('score')
const ultEl = document.getElementById('ult')
const ultFillEl = document.getElementById('ult-fill')
const ultChargeEl = document.getElementById('ult-charge')
const ultContainerEl = document.getElementById('ult-container')
const ultContainerImg = document.getElementById('ult-container-img')
const ultContainerButton = document.getElementById('ult-container-button')
const winEl = document.getElementById('win')
const winButton = document.getElementById('win-button')
const audio = document.getElementById('audio')
const audioButton = document.getElementById('audio-button')

const ultImages = ['ult1', 'ult2', 'ult3', 'ult4', 'ult5']
const EMENY_SIZE = 150
const ENEMY_SPEED = 0.3
const MAX_ENEMY_COUNT = window.innerWidth > 1024
  ? 15
  : window.innerWidth > 900
    ? 10
    : 7
const ENEMY_PER_ULT = 10
const ULT_ACTIVE_CLASS = 'active'
const ENEMY_CLASS_NAME = 'enemy'
const HIDDEN_CLASS_NAME = 'hidden'
const AUDIO_DISABLED_CLASS = 'disabled'

let score = 0
let ultScore = 0
let ultImgIndex = 0

startButton.addEventListener('click', onStartButtonClick)
ultEl.addEventListener('click', onUltClick)
ultContainerButton.addEventListener('click', onUltContainerButtonClick)
winButton.addEventListener('click', onWinButtonClick)
audioButton.addEventListener('click', onAudioButtonClick)

// -------

function init() {
  for (let i = 0; i < MAX_ENEMY_COUNT; i++) {
    addEnemy()
  }

  render()
}

function getEnemyMaxPos() {
  const maxEnemyLeft = gameEl.offsetWidth - EMENY_SIZE
  const maxEnemyTop = gameEl.offsetHeight - EMENY_SIZE

  return {maxEnemyTop, maxEnemyLeft}
}

function addEnemy() {
  const {maxEnemyTop, maxEnemyLeft} = getEnemyMaxPos()

  const enemy = document.createElement('DIV')
  enemy.classList.add(ENEMY_CLASS_NAME)
  enemy.addEventListener('click', onEnemyClick)

  const left = Math.random() * maxEnemyLeft
  const top = Math.random() * maxEnemyTop
  enemy.style.transform = `translate(${left}px, ${top}px)`
  enemy.style.opacity = 0

  gameEl.appendChild(enemy)
  setTimeout(() => {
    enemy.style.opacity = 1
  })
  move(enemy)
}

function onAudioButtonClick() {
  if (audio.paused) {
    audio.play()
    this.classList.remove(AUDIO_DISABLED_CLASS)
  } else {
    audio.pause()
    this.classList.add(AUDIO_DISABLED_CLASS)
  }
}

function onStartButtonClick() {
  startEl.classList.add(HIDDEN_CLASS_NAME)
  gameEl.classList.remove(HIDDEN_CLASS_NAME)
  audio.play()
  audioButton.classList.remove(HIDDEN_CLASS_NAME)
  init()
}

function onEnemyClick() {
  score++
  ultScore += 10
  render()
  this.remove()
  setTimeout(() => {
    addEnemy()
  }, 1000)
}

function onUltClick() {
  if (ultScore < 100) return

  score += ENEMY_PER_ULT
  ultScore = 0

  killAllEnemies()

  this.classList.remove(ULT_ACTIVE_CLASS)
  ultContainerEl.classList.remove(HIDDEN_CLASS_NAME)
  gameEl.classList.add(HIDDEN_CLASS_NAME)

  ultContainerImg.src = `assets/${ultImages[ultImgIndex]}.gif`
  ultImgIndex++
  if (ultImgIndex >= ultImages.length) {
    ultImgIndex = 0
  }
}

function onUltContainerButtonClick() {
  ultContainerEl.classList.add(HIDDEN_CLASS_NAME)
  gameEl.classList.remove(HIDDEN_CLASS_NAME)
  ultContainerImg.src = ''
  setTimeout(() => {
    init()
  })
}

function onWinButtonClick() {
  score = 0
  ultScore = 0
  killAllEnemies()
  winEl.classList.add(HIDDEN_CLASS_NAME)
  gameEl.classList.remove(HIDDEN_CLASS_NAME)
  init()
}

function killAllEnemies() {
  const enemies = [...document.getElementsByClassName(ENEMY_CLASS_NAME)]
  for (const enemy of enemies) {
    enemy.remove()
  }
}

function move(el) {
  const {maxEnemyTop, maxEnemyLeft} = getEnemyMaxPos()

  const {left, top} = el.getBoundingClientRect()

  const newLeft = Math.random() * maxEnemyLeft
  const newTop = Math.random() * maxEnemyTop

  const time = Math.max(
    Math.abs(left - newTop),
    Math.abs(top - newLeft),
  ) * 3

  el.style.transform = `translate(${newLeft}px, ${newTop}px)`
  el.style.transitionDuration = `${time}ms`

  setTimeout(() => {
    move(el)
  }, time + 200)
}

function render() {
  if (score >= 100) {
    winEl.classList.remove(HIDDEN_CLASS_NAME)
    gameEl.classList.add(HIDDEN_CLASS_NAME)
    return
  }

  scoreEl.innerText = score
  ultScore = Math.min(ultScore, 100)

  ultFillEl.style.height = `${ultScore}%`
  ultChargeEl.innerText = ultScore
  if (ultScore >= 100) {
    ultEl.classList.add(ULT_ACTIVE_CLASS)
  } else {
    ultEl.classList.remove(ULT_ACTIVE_CLASS)
  }
}
