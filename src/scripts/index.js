import * as PIXI from 'pixi.js'
import scaleToWindow from './scaleToWindow'

const {
	Application,
	Container,
	Sprite,
	Text,
	TextStyle,
	Circle,
	loader,
	loader: { resources },
	utils: { TextureCache },
} = PIXI

let type = 'WebGL'
if (!PIXI.utils.isWebGLSupported()) {
	type = 'canvas'
}

PIXI.utils.sayHello(type)

const app = new Application({
	width: 2880,
	height: 1620,
	transparent: true,
	antialias: true,
})
console.log(app)
console.log(PIXI)

const { stage, view } = app

document.body.appendChild(view)

view.scaleToWindow = scaleToWindow.bind(view)
window.addEventListener('resize', view.scaleToWindow)
view.scaleToWindow()

const alignCenter = function(sprite) {
	sprite.position.set(
		sprite.parent.width / 2 - sprite.width / 2,
		sprite.parent.height / 2 - sprite.height / 2
	)
}

const decorateButton = function(sprite) {
	sprite.interactive = true
	sprite.buttonMode = true
	sprite.hitArea = new Circle(sprite.width / 2, sprite.height / 2, sprite.width / 2)
}

const setup = function() {
	const id = resources['assets/images/atlas.json'].textures

	const bottomBar = new Sprite(resources['assets/images/bottom-bar.png'].texture)
	const btnInfo = new Sprite(id['btn_normal.png'])
	const btnInfoSign = new Sprite(id['btn_info_sign.png'])
	const totalBetBg = new Sprite(id['bg_totalbet.png'])
	const coinBg = new Sprite(id['bg_coin.png'])
	const btnDec = new Sprite(id['btn-sm_normal.png'])
	const btnInc = new Sprite(id['btn-sm_normal.png'])
	const minusSign = new Sprite(id['minus_sign.png'])
	const plusSign = new Sprite(id['plus_sign.png'])
	const winBg = new Sprite(id['win_bg.png'])
	const turboOnBg = new Sprite(id['bg_turbo-on.png'])
	const btnTurbo = new Sprite(id['btn_turbo.png'])
	const btnAuto = new Sprite(id['btn_auto.png'])
	const btnSpin = new Sprite(id['btn_spin.png'])
	const spinSign = new Sprite(id['spin_sign.png'])

	const bottomBarContainer = new Container()
	const buttonInfoContainer = new Container()
	const totalBetContainer = new Container()
	const coinContainer = new Container()
	const btnDecContainer = new Container()
	const btnIncContainer = new Container()
	const winContainer = new Container()
	const turboContainer = new Container()
	const turboBtnContainer = new Container()
	const autoContainer = new Container()
	const spinContainer = new Container()

	buttonInfoContainer.position.set(130, 60)
	buttonInfoContainer.addChild(btnInfo, btnInfoSign)
	alignCenter(btnInfoSign)

	btnInfo.on('mouseover', () => (btnInfo.texture = TextureCache['btn_hover.png']))
	btnInfo.on('mouseout', () => (btnInfo.texture = TextureCache['btn_normal.png']))
	btnInfo.on('pointerdown', () => (btnInfo.texture = TextureCache['btn_click.png']))
	btnInfo.on('pointerup', () => (btnInfo.texture = TextureCache['btn_normal.png']))

	totalBetContainer.position.set(255, 60)
	totalBetContainer.addChild(totalBetBg, btnDecContainer, btnIncContainer)

	btnDecContainer.position.set(btnDecContainer.parent.x + 12, btnDecContainer.parent.y + 10)
	btnDecContainer.addChild(btnDec, minusSign)
	alignCenter(btnDec)
	alignCenter(minusSign)

	btnIncContainer.position.set(
		btnIncContainer.parent.x + btnIncContainer.parent.width - btnInc.width - 12,
		btnIncContainer.parent.y + 10
	)
	btnIncContainer.addChild(btnInc, plusSign)
	alignCenter(btnInc)
	alignCenter(plusSign)

	coinContainer.position.set(660, 60)
	coinContainer.addChild(coinBg)

	const winText = new Text('GOOD LUCK!', {
		fontFamily: 'Noto Sans CJK SC',
		fontSize: 120,
		fill: '#ffe400',
		fontWeight: 'bold',
		dropShadow: true,
		dropShadowColor: '#710008',
		dropShadowAngle: Math.PI / 2,
		dropShadowDistance: 4,
	})
	winContainer.position.set(857, 17)
	winContainer.addChild(winBg, winText)
	winText.position.set(
		winText.parent.width / 2 - winText.width / 2,
		winText.parent.height / 2 - winText.height / 2
	)

	const blackTextstyle = {
		fontFamily: 'Noto Sans CJK TC Black',
		fill: '#3d0000',
		fontWeight: 'bold',
		dropShadow: true,
		dropShadowColor: '#ffc600',
		dropShadowAngle: Math.PI / 2,
		dropShadowDistance: 2,
	}
	const btnTurboText = new Text(
		'TURBO',
		new TextStyle({
			...blackTextstyle,
			fontSize: 34,
		})
	)
	turboContainer.position.set(1720, 60)
	turboBtnContainer.addChild(btnTurbo, btnTurboText)
	turboContainer.addChild(turboOnBg, turboBtnContainer)
	alignCenter(btnTurboText)
	turboBtnContainer.position.set(
		turboBtnContainer.parent.width / 2 - turboBtnContainer.width / 2,
		12
	)

	const autoText = new Text(
		'AUTO',
		new TextStyle({
			...blackTextstyle,
			fontSize: 42,
		})
	)
	autoContainer.position.set(1895, 60)
	autoContainer.addChild(btnAuto, autoText)
	autoText.position.set(70, autoText.parent.height / 2 - autoText.height / 2)

	spinContainer.position.set(2100, -60)
	spinContainer.addChild(btnSpin, spinSign)
	alignCenter(spinSign)

	decorateButton(btnInfo)
	decorateButton(btnDec)
	decorateButton(btnInc)

	bottomBarContainer.position.set(
		view.width / 2 - bottomBar.width / 2,
		view.height - bottomBar.height - 170
	)
	bottomBarContainer.addChild(
		bottomBar,
		buttonInfoContainer,
		totalBetContainer,
		coinContainer,
		btnDecContainer,
		btnIncContainer,
		winContainer,
		turboContainer,
		autoContainer,
		spinContainer
	)
	stage.addChild(bottomBarContainer)
}

loader
	.add('assets/images/bottom-bar.png')
	.add('assets/images/atlas.json')
	.load(setup)
