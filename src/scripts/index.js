import * as PIXI from 'pixi.js'
import 'pixi-sound'
import scaleToWindow from './scaleToWindow'

const clickSound = PIXI.sound.Sound.from('assets/sounds/button_click.wav')

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

const alignVertical = function(sprite) {
	sprite.y = sprite.parent.height / 2 - sprite.height / 2
}

const alignHorizontal = function(sprite) {
	sprite.x = sprite.parent.width / 2 - sprite.width / 2
}

const alignCenter = function(sprite) {
	alignVertical(sprite)
	alignHorizontal(sprite)
}

const addButtonEventListener = function(sprite, events = []) {
	const texture = sprite.texture.textureCacheIds[0]
	const re = /(?:\.([^.]+))?$/
	const textureWithoutExtension = texture.replace(/\.[^/.]+$/, '')
	const textureExtension = re.exec(texture)[0]
	events.forEach((event) => {
		switch (event) {
			case 'mouseover':
				sprite.on(event, () => {
					if (!sprite.disabled) {
						sprite.texture = TextureCache[`${textureWithoutExtension}_hover${textureExtension}`]
					}
				})
				break
			case 'pointerdown':
				sprite.on(event, () => {
					if (!sprite.disabled) {
						sprite.texture = TextureCache[`${textureWithoutExtension}_click${textureExtension}`]
					}
				})
				break
			case 'mouseout':
				sprite.on(event, () => {
					if (!sprite.disabled) sprite.texture = TextureCache[texture]
				})
				break
			default:
				return false
		}
	})
}

const disableButton = function(sprite, texture = null) {
	if (texture) sprite.texture = TextureCache[texture]
	sprite.interactive = false
	sprite.buttonMode = false
	sprite.disabled = true
}

const enableButton = function(sprite, texture = null) {
	if (texture) sprite.texture = TextureCache[texture]
	sprite.interactive = true
	sprite.buttonMode = true
	sprite.disabled = false
}

const decorateButton = function(sprite) {
	enableButton(sprite)
	sprite.hitArea = new Circle(sprite.width / 2, sprite.height / 2, sprite.width / 2)
}

const getLocalizedCurrencyValue = function(value) {
	const localizedValue = value.toLocaleString('zh-CN', {
		style: 'currency',
		currency: 'CNY',
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	})

	return localizedValue
}

const getCoinValue = function(value) {
	return value / 15
}

const setup = function() {
	const id = resources['assets/images/atlas.json'].textures

	const bottomBar = new Sprite(resources['assets/images/bottom-bar.png'].texture)
	const paytableBar = new Sprite(id['info-bar.png'])
	const paytableLeftArrow = new Sprite(id['arrow-left.png'])
	const paytableCross = new Sprite(id['exit-sign.png'])
	const paytableRightArrow = new Sprite(id['arrow-right.png'])
	const paytableLeftBtnBg = new Sprite(id['page-left.png'])
	const paytableMiddleBtnBg = new Sprite(id['btn-exit.png'])
	const paytableRightBtnBg = new Sprite(id['page-right.png'])
	const btnInfo = new Sprite(id['btn.png'])
	const btnInfoSign = new Sprite(id['info-sign.png'])
	const totalBetBg = new Sprite(id['totalbet_bg.png'])
	const coinBg = new Sprite(id['coin_bg.png'])
	const btnDec = new Sprite(id['btn-sm.png'])
	const btnInc = new Sprite(id['btn-sm.png'])
	const minusSign = new Sprite(id['minus-sign.png'])
	const plusSign = new Sprite(id['plus-sign.png'])
	const winBoxBg = new Sprite(id['win_bg.png'])
	const turboOnBg = new Sprite(id['turboplay_bg.png'])
	const btnTurbo = new Sprite(id['btn-turbo.png'])
	const btnAuto = new Sprite(id['btn-auto.png'])
	const btnSpin = new Sprite(id['btn-spin.png'])
	const spinSign = new Sprite(id['spin-sign.png'])

	const paytableLeftButton = new Container()
	const paytableMiddleButton = new Container()
	const paytableRightButton = new Container()

	const autoContainer = new Container()
	const bottomBarContainer = new Container()
	const btnDecContainer = new Container()
	const btnIncContainer = new Container()
	const buttonInfoContainer = new Container()
	const coinContainer = new Container()
	const infoBarContainer = new Container()
	const paytableContainer = new Container()
	const spinContainer = new Container()
	const totalBetContainer = new Container()
	const turboBtnContainer = new Container()
	const turboContainer = new Container()
	const winBoxContainer = new Container()

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

	const infoBarTextStyle = new TextStyle({
		...textStyle,
		fill: '#ffea00',
		dropShadowColor: '#450005',
	})

	const boxTitleTextStyle = new TextStyle({
		...textStyle,
		fill: '#ff6972',
		dropShadowColor: '#4e0005',
	})

	const currencyTextStyle = new TextStyle({
		...textStyle,
		fill: '#ffd100',
		fontSize: 36,
		dropShadowColor: '#710008',
	})

	const betMap = [5]
	for (let i = 0; i < 6; i += 1) {
		const base = betMap[betMap.length - 1]
		for (let j = 0; j < 3; j += 1) {
			if (i === 0 && j === 2) continue
			betMap.push(base * 2 + base * j)
		}
	}

	let betMapIndex = 6
	bottomBarContainer.addChild(bottomBar)

	// Infobar
	const infoBarLeftLabel = new Text('Line 31 wins GBP2', infoBarTextStyle)
	const infoBarRightLabel = new Text('Click spin to start', infoBarTextStyle)

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

	// Totalbet container
	const totalBetTitleText = new Text('TOTAL BET', boxTitleTextStyle)
	const totalBetValueText = new Text(
		getLocalizedCurrencyValue(betMap[betMapIndex]),
		currencyTextStyle
	)

	totalBetContainer.name = 'TotalBet'
	totalBetContainer.position.set(255, 60)
	totalBetContainer.addChild(
		totalBetBg,
		totalBetTitleText,
		totalBetValueText,
		btnDecContainer,
		btnIncContainer
	)

	totalBetTitleText.position.set(totalBetContainer.width / 2 - totalBetTitleText.width / 2, 15)
	totalBetValueText.position.set(totalBetContainer.width / 2, 75)
	totalBetValueText.anchor.set(0.5, 0.5)

	btnDecContainer.name = 'DecrementButton'
	btnDecContainer.position.set(10, 10)
	btnDecContainer.addChild(btnDec, minusSign)

	alignCenter(minusSign)
	alignCenter(btnDec)
	decorateButton(btnDec)

	addButtonEventListener(btnDec, ['mouseover', 'mouseout', 'pointerdown'])
	btnDec.on('pointerup', () => {
		if (!btnDec.disabled) {
			clickSound.play()
			btnDec.texture = TextureCache['btn-sm_hover.png']
		}

		enableButton(btnInc, 'btn-sm.png')
		plusSign.texture = TextureCache['plus-sign.png']

		if (betMapIndex - 1 === 0) {
			betMapIndex -= 1
			minusSign.texture = TextureCache['minus-sign_disabled.png']
			disableButton(btnDec, 'btn-sm_disabled.png')
		} else if (betMapIndex - 1 > 0) {
			betMapIndex -= 1
		}

		totalBetValueText.text = getLocalizedCurrencyValue(betMap[betMapIndex])
		coinValueText.text = getLocalizedCurrencyValue(getCoinValue(betMap[betMapIndex]))
	})

	btnIncContainer.name = 'IncrementButton'
	btnIncContainer.position.set(btnIncContainer.parent.width - btnInc.width - 10, 10)
	btnIncContainer.addChild(btnInc, plusSign)

	alignCenter(btnInc)
	alignCenter(plusSign)
	decorateButton(btnInc)

	addButtonEventListener(btnInc, ['mouseover', 'mouseout', 'pointerdown'])
	btnInc.on('pointerup', () => {
		if (!btnInc.disabled) {
			clickSound.play()
			btnInc.texture = TextureCache['btn-sm_hover.png']
		}

		minusSign.texture = TextureCache['minus-sign.png']
		enableButton(btnDec, 'btn-sm.png')

		if (betMapIndex + 1 === betMap.length - 1) {
			betMapIndex += 1
			plusSign.texture = TextureCache['plus-sign_disabled.png']
			disableButton(btnInc, 'btn-sm_disabled.png')
		} else if (betMapIndex + 1 < betMap.length - 1) {
			betMapIndex += 1
		}

		totalBetValueText.text = getLocalizedCurrencyValue(betMap[betMapIndex])
		coinValueText.text = getLocalizedCurrencyValue(getCoinValue(betMap[betMapIndex]))
	})

	// Coin contaner
	const coinTitleText = new Text('COIN', boxTitleTextStyle)
	const coinValueText = new Text(
		getLocalizedCurrencyValue(getCoinValue(betMap[betMapIndex])),
		currencyTextStyle
	)

	coinContainer.name = 'CoinDisplay'
	coinContainer.position.set(660, 60)
	coinContainer.addChild(coinBg, coinTitleText, coinValueText)

	coinTitleText.position.set(coinContainer.width / 2 - coinTitleText.width / 2, 15)
	coinValueText.position.set(coinContainer.width / 2, 75)
	coinValueText.anchor.set(0.5, 0.5)

	// winBox container
	const winBoxText = new Text(
		'GOOD LUCK!',
		new TextStyle({
			...darkTextstyle,
			fontSize: 100,
			fill: '#ffe400',
			dropShadowColor: '#710008',
			dropShadowDistance: 4,
		})
	)

	winBoxContainer.name = 'WinBox'
	winBoxContainer.position.set(857, 17)
	winBoxContainer.addChild(winBoxBg, winBoxText)
	winBoxText.position.set(
		winBoxText.parent.width / 2 - winBoxText.width / 2,
		winBoxText.parent.height / 2 - winBoxText.height / 2
	)

	// Turboplay button
	const btnTurboText = new Text('TURBO', darkTextstyle)

	turboBtnContainer.name = 'TurboPlayButton'
	turboBtnContainer.addChild(btnTurbo, btnTurboText)

	turboContainer.name = 'TurboPlay'
	turboContainer.position.set(1720, 60)
	turboContainer.addChild(turboOnBg, turboBtnContainer)

	btnTurbo.interactive = true
	btnTurbo.buttonMode = true
	btnTurbo.isOn = true

	addButtonEventListener(btnTurbo, ['mouseover', 'mouseout', 'pointerdown'])

	btnTurbo.on('pointerup', () => {
		clickSound.play()

		if (btnTurbo.isOn) {
			btnTurbo.isOn = !btnTurbo.isOn
			btnTurbo.texture = TextureCache['btn-turbo_hover.png']
			turboOnBg.texture = TextureCache['turboplay_bg_disabled.png']
			turboBtnContainer.position.set(
				turboBtnContainer.parent.width / 2 - turboBtnContainer.width / 2,
				turboContainer.height - btnTurbo.height
			)
		} else {
			btnTurbo.isOn = !btnTurbo.isOn
			btnTurbo.texture = TextureCache['btn-turbo_hover.png']
			turboOnBg.texture = TextureCache['turboplay_bg.png']
			turboBtnContainer.position.set(
				turboBtnContainer.parent.width / 2 - turboBtnContainer.width / 2,
				12
			)
		}
	})

	alignCenter(btnTurboText)
	turboBtnContainer.position.set(
		turboBtnContainer.parent.width / 2 - turboBtnContainer.width / 2,
		12
	)

	// Autoplay button
	const autoText = new Text('AUTO', { ...darkTextstyle, fontSize: 42 })

	autoContainer.name = 'AutoPlayButton'
	autoContainer.position.set(1895, 60)
	autoContainer.addChild(btnAuto, autoText)

	autoText.position.set(70, autoText.parent.height / 2 - autoText.height / 2)

	btnAuto.interactive = true
	btnAuto.buttonMode = true

	addButtonEventListener(btnAuto, ['mouseover', 'mouseout', 'pointerdown'])
	btnAuto.on('pointerup', () => {
		clickSound.play()
		btnAuto.texture = TextureCache['btn-auto_hover.png']
	})

	spinContainer.name = 'SpinButton'
	spinContainer.position.set(2100, -60)
	spinContainer.addChild(btnSpin, spinSign)

	addButtonEventListener(btnSpin, ['mouseover', 'mouseout', 'pointerdown'])
	btnSpin.on('pointerup', () => {
		clickSound.play()
		btnSpin.texture = TextureCache['btn-spin_hover.png']
	})

	decorateButton(btnSpin)
	alignCenter(spinSign)

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
		totalBetContainer,
		coinContainer,
		winBoxContainer,
		turboContainer,
		autoContainer,
		spinContainer
	)

	bottomBarContainer.position.set(
		view.width / 2 - bottomBar.width / 2,
		view.height - bottomBar.height - 170
	)

	paytableContainer.visible = false

	stage.addChild(bottomBarContainer, paytableContainer)
}

loader
	.add('assets/images/bottom-bar.png')
	.add('assets/images/atlas.json')
	.load(setup)
