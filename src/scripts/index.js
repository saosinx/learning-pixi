import * as PIXI from 'pixi.js'
import tweenManager from 'pixi-tween'
import 'pixi-sound'

import {
	alignCenter,
	addButtonEventListener,
	disableButton,
	enableButton,
	decorateButton,
	getLocalizedCurrencyValue,
	getCoinValue,
	getBetMap,
} from './services'

import makeAutoPlayButton from './autoPlayButton'
import makePlayButton from './playButton'
import makeSpinSelect from './spinSelect'
import makeTotalBet from './totalBet'
import makeTurboPlay from './turboPlay'
import makeWinBox from './winBox'
import scaleToWindow from './scaleToWindow'

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
	const btnInfo = new Sprite(id['btn.png'])
	const btnInfoSign = new Sprite(id['info-sign.png'])
	const coinBg = new Sprite(id['coin_bg.png'])
	const paytableBar = new Sprite(id['info-bar.png'])
	const paytableCross = new Sprite(id['exit-sign.png'])
	const paytableLeftArrow = new Sprite(id['arrow-left.png'])
	const paytableLeftBtnBg = new Sprite(id['page-left.png'])
	const paytableMiddleBtnBg = new Sprite(id['btn-exit.png'])
	const paytableRightArrow = new Sprite(id['arrow-right.png'])
	const paytableRightBtnBg = new Sprite(id['page-right.png'])

	const AutoPlay = new Container()
	const bottomBarContainer = new Container()
	const buttonInfoContainer = new Container()
	const coinContainer = new Container()
	const infoBarContainer = new Container()
	const paytableContainer = new Container()
	const paytableLeftButton = new Container()
	const paytableMiddleButton = new Container()
	const paytableRightButton = new Container()

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
	buttonInfoContainer.name = 'InfoButton'
	buttonInfoContainer.position.set(130, 60)
	buttonInfoContainer.addChild(btnInfo, btnInfoSign)

	decorateButton(btnInfo)
	alignCenter(btnInfoSign)

	addButtonEventListener(btnInfo, ['mouseover', 'mouseout', 'pointerdown'])
	btnInfo.on('pointerup', () => {
		clickSound.play()
		btnInfo.texture = TextureCache['btn_hover.png']
		bottomBarContainer.visible = false
		paytableContainer.visible = true
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
	paytableContainer.name = 'PaytableBar'

	const paytableBook = {
		currentPage: 0,
		pages: 4,
	}

	const initPaytable = function() {
		if (paytableBook.currentPage === 0) {
			paytableLeftArrow.texture = TextureCache['arrow-left_disabled.png']
			disableButton(paytableLeftBtnBg, 'page-left_disabled.png')
		} else if (paytableBook.currentPage === paytableBook.pages) {
			paytableRightArrow.texture = TextureCache['arrow-right_disabled.png']
			disableButton(paytableRightBtnBg, 'page-right_disabled.png')
		}
	}

	paytableLeftButton.name = 'PaytableLeftButton'
	paytableLeftButton.addChild(paytableLeftBtnBg, paytableLeftArrow)
	alignCenter(paytableLeftArrow)

	paytableMiddleButton.name = 'PaytableMiddleButton'
	paytableMiddleButton.addChild(paytableMiddleBtnBg, paytableCross)
	alignCenter(paytableCross)

	paytableRightButton.name = 'PaytableRightButton'
	paytableRightButton.addChild(paytableRightBtnBg, paytableRightArrow)
	alignCenter(paytableRightArrow)

	paytableContainer.addChild(
		paytableBar,
		paytableLeftButton,
		paytableMiddleButton,
		paytableRightButton
	)

	paytableLeftButton.position.set(145, 60)
	paytableMiddleButton.position.set(300, 60)
	paytableRightButton.position.set(440, 60)

	disableButton(paytableLeftBtnBg)
	enableButton(paytableMiddleBtnBg)
	enableButton(paytableRightBtnBg)

	addButtonEventListener(paytableLeftBtnBg, ['mouseover', 'mouseout', 'pointerdown'])
	paytableLeftBtnBg.on('pointerup', () => {
		if (!paytableLeftBtnBg.disabled) {
			clickSound.play()
			paytableLeftBtnBg.texture = TextureCache['page-left_hover.png']
		}

		if (paytableBook.currentPage - 1 === 0) {
			paytableBook.currentPage -= 1

			paytableLeftArrow.texture = TextureCache['arrow-left_disabled.png']
			disableButton(paytableLeftBtnBg, 'page-left_disabled.png')
		} else if (paytableBook.currentPage - 1 > 0) {
			paytableBook.currentPage -= 1

			paytableRightArrow.texture = TextureCache['arrow-right.png']
			enableButton(paytableRightBtnBg, 'page-right.png')
		}
	})

	addButtonEventListener(paytableRightBtnBg, ['mouseover', 'mouseout', 'pointerdown'])
	paytableRightBtnBg.on('pointerup', () => {
		if (!paytableRightBtnBg.disabled) {
			clickSound.play()
			paytableRightBtnBg.texture = TextureCache['page-right_hover.png']
		}

		if (paytableBook.currentPage + 1 === paytableBook.pages) {
			paytableBook.currentPage += 1

			paytableRightArrow.texture = TextureCache['arrow-right_disabled.png']
			disableButton(paytableRightBtnBg, 'page-right_disabled.png')
		} else if (paytableBook.currentPage + 1 < paytableBook.pages) {
			paytableBook.currentPage += 1

			paytableLeftArrow.texture = TextureCache['arrow-left.png']
			enableButton(paytableLeftBtnBg, 'page-left.png')
		}
	})

	addButtonEventListener(paytableMiddleBtnBg, ['mouseover', 'mouseout', 'pointerdown'])
	paytableMiddleBtnBg.on('pointerup', () => {
		clickSound.play()
		paytableMiddleBtnBg.texture = TextureCache['btn-exit_hover.png']
		paytableContainer.visible = false
		bottomBarContainer.visible = true
	})

	paytableContainer.position.set(
		view.width / 2 - paytableContainer.width / 2,
		view.height - bottomBar.height - 170
	)

	initPaytable()

	// BottomBar Container
	bottomBarContainer.name = 'BottomBar'
	bottomBarContainer.addChild(
		infoBarContainer,
		buttonInfoContainer,
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

	paytableContainer.visible = false

	stage.addChild(bottomBarContainer, paytableContainer)

	state = play
	app.ticker.add((delta) => gameLoop(delta))
}

loader
	.add('assets/images/bottom-bar.png')
	.add('assets/images/atlas.json')
	.load(setup)
