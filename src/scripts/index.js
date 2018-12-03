import * as PIXI from 'pixi.js'
import tweenManager from 'pixi-tween'
import 'pixi-sound'

import { getLocalizedCurrencyValue, getCoinValue, getBetMap } from './services'

import makeAutoPlayButton from './autoPlayButton'
import makePlayButton from './playButton'
import makeSpinSelect from './spinSelect'
import makeTotalBet from './totalBet'
import makeTurboPlay from './turboPlay'
import makeWinBox from './winBox'
import scaleToWindow from './scaleToWindow'
import makePaytable from './paytable'
import makeInfoButton from './infoButton'

const clickSound = PIXI.sound.Sound.from('assets/sounds/button_click.wav')

const {
	Application,
	Container,
	Sprite,
	Text,
	TextStyle,
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

let state = null

const gameLoop = function(delta) {
	state(delta)
}

const play = function(delta) {
	PIXI.tweenManager.update()
}

const setup = function() {
	const id = resources['assets/images/atlas.json'].textures

	const bottomBar = new Sprite(resources['assets/images/bottom-bar.png'].texture)
	const coinBg = new Sprite(id['coin_bg.png'])

	const AutoPlay = new Container()
	const bottomBarContainer = new Container()
	const coinContainer = new Container()
	const infoBarContainer = new Container()

	const textStyle = new TextStyle({
		fontFamily: 'Noto Sans CJK SC Black',
		fontSize: 26,
		dropShadow: true,
		dropShadowAngle: Math.PI / 2,
		dropShadowDistance: 4,
	})

	const darkTextstyle = new TextStyle({
		...textStyle,
		fill: '#3d0000',
		fontSize: 32,
		dropShadowColor: '#ffc600',
		dropShadowDistance: 2,
	})

	const yellowTextStyle = new TextStyle({
		...textStyle,
		fill: '#ffea00',
		dropShadowColor: '#450005',
	})

	const pinkTextStyle = new TextStyle({
		...textStyle,
		fill: '#ff6972',
		dropShadowColor: '#4e0005',
	})

	const darkYellowTextStyle = new TextStyle({
		...textStyle,
		fill: '#ffd100',
		fontSize: 36,
		dropShadowColor: '#710008',
	})

	bottomBarContainer.addChild(bottomBar)

	// Infobar
	const infoBarLeftLabel = new Text('Line 31 wins GBP2', yellowTextStyle)
	const infoBarRightLabel = new Text('Click spin to start', yellowTextStyle)

	infoBarContainer.name = 'Infobar'
	infoBarContainer.addChild(infoBarLeftLabel, infoBarRightLabel)

	infoBarLeftLabel.x = 435
	infoBarRightLabel.x = bottomBarContainer.width - infoBarRightLabel.width - 555

	// Info Button
	const InfoButton = makeInfoButton(id)
	InfoButton.on('pointerup', () => {
		clickSound.play()
		InfoButton.infoBtnBg.texture = TextureCache['btn_hover.png']
		bottomBarContainer.visible = false
		Paytable.visible = true
	})

	// Coin contaner
	const betMap = getBetMap()
	const coinTitleText = new Text('COIN', pinkTextStyle)
	const coinValueText = new Text(
		getLocalizedCurrencyValue(getCoinValue(betMap.bets[betMap.index])),
		darkYellowTextStyle
	)

	const TotalBet = makeTotalBet(id, { pinkTextStyle, darkYellowTextStyle, coinValueText })

	coinContainer.name = 'CoinDisplay'
	coinContainer.position.set(660, 60)
	coinContainer.addChild(coinBg, coinTitleText, coinValueText)

	coinTitleText.position.set(coinContainer.width / 2 - coinTitleText.width / 2, 15)
	coinValueText.position.set(coinContainer.width / 2, 75)
	coinValueText.anchor.set(0.5, 0.5)

	const WinBox = makeWinBox(id, { darkTextstyle })
	const TurboPlay = makeTurboPlay(id, { darkTextstyle })
	const AutoPlayButton = makeAutoPlayButton(id, { darkTextstyle })
	const SpinSelect = makeSpinSelect(id, { darkYellowTextStyle })

	const spinSelectCurtain = new PIXI.Graphics()
	spinSelectCurtain.beginFill(0x000000)
	spinSelectCurtain.drawRect(1895, -240, SpinSelect.width, SpinSelect.height)
	spinSelectCurtain.endFill()
	SpinSelect.mask = spinSelectCurtain

	AutoPlay.addChild(SpinSelect, AutoPlayButton)
	AutoPlay.position.set(1895, 60)

	AutoPlay.interactive = true
	AutoPlay.buttonMode = true

	const spinSelectMouseOutHandler = function(delta) {
		if (SpinSelect.y >= 0) {
			SpinSelect.y = 0
		} else {
			SpinSelect.y += 1 * delta
		}

		app.renderer.render(app.stage)
	}
	const spinSelectMouseOverHandler = function(delta) {
		if (SpinSelect.y <= -300) {
			SpinSelect.y = -300
		} else {
			SpinSelect.y -= 1 * delta
		}

		app.renderer.render(app.stage)
	}

	const autoPlayTicker = new PIXI.ticker.Ticker()
	autoPlayTicker.autoStart = true
	autoPlayTicker.speed = 10

	AutoPlay.on('mouseover', () => {
		autoPlayTicker.remove(spinSelectMouseOutHandler)
		autoPlayTicker.add(spinSelectMouseOverHandler)
	}).on('mouseout', () => {
		autoPlayTicker.remove(spinSelectMouseOverHandler)
		autoPlayTicker.add(spinSelectMouseOutHandler)
	})

	// Play button
	const PlayButton = makePlayButton(id)
	PlayButton.startSpinRotating()

	// Paytable Container
	const Paytable = makePaytable(id, { app })
	Paytable.paytableMiddleBtnBg.on('pointerup', () => {
		clickSound.play()
		Paytable.paytableMiddleBtnBg.texture = TextureCache['btn-exit_hover.png']
		Paytable.visible = false
		bottomBarContainer.visible = true
	})

	Paytable.position.set(view.width / 2 - Paytable.width / 2, view.height - bottomBar.height - 170)

	// BottomBar Container
	bottomBarContainer.name = 'BottomBar'
	bottomBarContainer.addChild(
		infoBarContainer,
		InfoButton,
		TotalBet,
		coinContainer,
		WinBox,
		TurboPlay,
		AutoPlay,
		PlayButton,
		spinSelectCurtain
	)

	bottomBarContainer.position.set(
		view.width / 2 - bottomBar.width / 2,
		view.height - bottomBar.height - 170
	)

	Paytable.visible = false

	stage.addChild(bottomBarContainer, Paytable)

	state = play
	app.ticker.add((delta) => gameLoop(delta))
}

loader
	.add('assets/images/bottom-bar.png')
	.add('assets/images/atlas.json')
	.load(setup)
