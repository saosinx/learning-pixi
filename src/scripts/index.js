import * as PIXI from 'pixi.js'
import scaleToWindow from './scaleToWindow'

const {
	Application,
	Sprite,
	Rectangle,
	TextureCache,
	loader,
	loader: { resources },
} = PIXI

let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
	type = 'canvas'
}

PIXI.utils.sayHello(type)

const app = new Application({
	width: 3840,
	height: 2160,
	transparent: true,
})
console.log(app)
console.log(PIXI)

const { renderer, stage, view } = app

document.body.appendChild(view)

const game = {
	element: view,
	width: 3840,
	height: 2160,
	safeWidth: 3840,
	safeHeight: 2160,
}

function resizeGame() {
	let newGameWidth = 0
	let newGameHeight = 0
	let newGameX = 0
	let newGameY = 0

	const viewport = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	if (game.height / game.width > viewport.height / viewport.width) {
		if (game.safeHeight / game.width > viewport.height / viewport.width) {
			newGameHeight = (viewport.height * game.height) / game.safeHeight
			newGameWidth = (newGameHeight * game.width) / game.height
		} else {
			newGameWidth = viewport.width
			newGameHeight = (newGameWidth * game.height) / game.width
		}
	} else if (game.height / game.safeWidth > viewport.height / viewport.width) {
		newGameHeight = viewport.height
		newGameWidth = (newGameHeight * game.width) / game.height
	} else {
		newGameWidth = (viewport.width * game.width) / game.safeWidth
		newGameHeight = (newGameWidth * game.height) / game.width
	}

	game.element.style.width = `${newGameWidth}px`
	game.element.style.height = `${newGameHeight}px`

	newGameX = (viewport.width - newGameWidth) / 2
	newGameY = (viewport.height - newGameHeight) / 2

	game.element.style.margin = `${newGameY}px ${newGameX}px`
}

window.addEventListener('resize', resizeGame)
resizeGame()

let state
let moveForward = true
function play(delta, sprite) {
	sprite.y = moveForward ? sprite.y + 1 : sprite.y - 1
	if (moveForward && sprite.y + sprite.height >= view.height) {
		moveForward = !moveForward
	}

	if (!moveForward && sprite.y === 0) {
		moveForward = !moveForward
	}
}

function gameLoop(delta, sprite) {
	state(delta, sprite)
}

function setup() {
	const id = resources['assets/images/atlas.json'].textures
	const bntInfo = {
		normal: new Sprite(id['btn_normal.png']),
		hover: new Sprite(id['btn_hover.png']),
		click: new Sprite(id['btn_click.png']),
		disable: new Sprite(id['btn_disable.png']),
	}

	const bottomBar = new Sprite(resources['assets/images/bottom-bar.png'].texture)
	bntInfo.click.x = bntInfo.click.width * 2
	bntInfo.disable.x = bntInfo.disable.width * 3
	stage.addChild(...Object.values(bntInfo), bottomBar)

	bottomBar.position.set(view.width / 2 - bottomBar.width / 2, view.height - bottomBar.height)
	console.log(view.width)
	console.log(bottomBar.width)
	state = play
	app.ticker.add((delta) => gameLoop(delta, bntInfo.normal))
}

loader
	.add('assets/images/atlas.json')
	.add('assets/images/bottom-bar.png')
	.load(setup)
