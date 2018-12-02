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
	const paytableBar = new Sprite(id['info_bottom_bar.png'])
	const paytableLeftArrow = new Sprite(id['info_bottom_bar_control-left-arrow_disabled.png'])
	const paytableCross = new Sprite(id['info_bottom_bar_control-middle-cross.png'])
	const paytableRightArrow = new Sprite(id['info_bottom_bar_control-right-arrow.png'])
	const paytableLeftBtnBg = new Sprite(id['info_bottom_bar_control-left_disabled.png'])
	const paytableMiddleBtnBg = new Sprite(id['info_bottom_bar_control-middle_normal.png'])
	const paytableRightBtnBg = new Sprite(id['info_bottom_bar_control-right_normal.png'])
	const btnInfo = new Sprite(id['btn_normal.png'])
	const btnInfoSign = new Sprite(id['btn_info_sign.png'])
	const totalBetBg = new Sprite(id['bg_totalbet.png'])
	const coinBg = new Sprite(id['bg_coin.png'])
	const btnDec = new Sprite(id['btn-sm_normal.png'])
	const btnInc = new Sprite(id['btn-sm_normal.png'])
	const minusSign = new Sprite(id['minus_sign.png'])
	const plusSign = new Sprite(id['plus_sign.png'])
	const winBoxBg = new Sprite(id['win_bg.png'])
	const turboOnBg = new Sprite(id['bg_turbo-on.png'])
	const btnTurbo = new Sprite(id['btn_turbo.png'])
	const btnAuto = new Sprite(id['btn_auto.png'])
	const btnSpin = new Sprite(id['btn_spin.png'])
	const spinSign = new Sprite(id['spin_sign.png'])

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

	btnInfo.on('mouseover', () => (btnInfo.texture = TextureCache['btn_hover.png']))
	btnInfo.on('mouseout', () => (btnInfo.texture = TextureCache['btn_normal.png']))
	btnInfo.on('pointerdown', () => (btnInfo.texture = TextureCache['btn_click.png']))
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

	btnDec.on('mouseover', () => {
		if (!btnDec.disabled) btnDec.texture = TextureCache['btn-sm_hover.png']
	})
	btnDec.on('mouseout', () => {
		if (!btnDec.disabled) btnDec.texture = TextureCache['btn-sm_normal.png']
	})
	btnDec.on('pointerdown', () => {
		if (!btnDec.disabled) btnDec.texture = TextureCache['btn-sm_click.png']
	})
	btnDec.on('pointerup', () => {
		if (!btnDec.disabled) {
			clickSound.play()
			btnDec.texture = TextureCache['btn-sm_hover.png']
		}

		enableButton(btnInc, 'btn-sm_normal.png')
		plusSign.texture = TextureCache['plus_sign.png']

		if (betMapIndex - 1 === 0) {
			betMapIndex -= 1
			minusSign.texture = TextureCache['minus_sign_disabled.png']
			// minusSign.disabled = true
			disableButton(btnDec, 'btn-sm_disable.png')
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

	btnInc.on('mouseover', () => {
		if (!btnInc.disabled) btnInc.texture = TextureCache['btn-sm_hover.png']
	})
	btnInc.on('mouseout', () => {
		if (!btnInc.disabled) btnInc.texture = TextureCache['btn-sm_normal.png']
	})
	btnInc.on('pointerdown', () => {
		if (!btnInc.disabled) btnInc.texture = TextureCache['btn-sm_click.png']
	})
	btnInc.on('pointerup', () => {
		if (!btnInc.disabled) {
			clickSound.play()
			btnInc.texture = TextureCache['btn-sm_hover.png']
		}

		minusSign.texture = TextureCache['minus_sign.png']
		// minusSign.disabled = false
		enableButton(btnDec, 'btn-sm_normal.png')

		if (betMapIndex + 1 === betMap.length - 1) {
			betMapIndex += 1
			plusSign.texture = TextureCache['plus_sign_disabled.png']
			// plusSign.disabled = true
			disableButton(btnInc, 'btn-sm_disable.png')
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

	btnTurbo.on('mouseover', () => (btnTurbo.texture = TextureCache['btn_turbo_hover.png']))
	btnTurbo.on('mouseout', () => (btnTurbo.texture = TextureCache['btn_turbo.png']))
	btnTurbo.on('pointerdown', () => (btnTurbo.texture = TextureCache['btn_turbo_click.png']))
	btnTurbo.on('pointerup', () => {
		clickSound.play()

		if (btnTurbo.isOn) {
			btnTurbo.isOn = !btnTurbo.isOn
			btnTurbo.texture = TextureCache['btn_turbo_hover.png']
			turboOnBg.texture = TextureCache['bg_turbo-off.png']
			turboBtnContainer.position.set(
				turboBtnContainer.parent.width / 2 - turboBtnContainer.width / 2,
				turboContainer.height - btnTurbo.height
			)
		} else {
			btnTurbo.isOn = !btnTurbo.isOn
			btnTurbo.texture = TextureCache['btn_turbo_hover.png']
			turboOnBg.texture = TextureCache['bg_turbo-on.png']
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

	btnAuto.on('mouseover', () => (btnAuto.texture = TextureCache['btn_auto_hover.png']))
	btnAuto.on('mouseout', () => (btnAuto.texture = TextureCache['btn_auto.png']))
	btnAuto.on('pointerdown', () => (btnAuto.texture = TextureCache['btn_auto_click.png']))
	btnAuto.on('pointerup', () => {
		clickSound.play()
		btnAuto.texture = TextureCache['btn_auto_hover.png']
	})

	spinContainer.name = 'SpinButton'
	spinContainer.position.set(2100, -60)
	spinContainer.addChild(btnSpin, spinSign)

	btnSpin.on('mouseover', () => (btnSpin.texture = TextureCache['btn_spin_hover.png']))
	btnSpin.on('mouseout', () => (btnSpin.texture = TextureCache['btn_spin.png']))
	btnSpin.on('pointerdown', () => (btnSpin.texture = TextureCache['btn_spin_click.png']))
	btnSpin.on('pointerup', () => {
		clickSound.play()
		btnSpin.texture = TextureCache['btn_spin_hover.png']
	})

	decorateButton(btnSpin)
	alignCenter(spinSign)

	// Paytable Container
	paytableContainer.name = 'PaytableBar'

	const paytableBook = {
		currentPage: 0,
		pages: 4,
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

	paytableLeftBtnBg.on('mouseover', () => {
		if (!paytableLeftBtnBg.disabled) {
			paytableLeftBtnBg.texture = TextureCache['info_bottom_bar_control-left_hover.png']
		}
	})
	paytableLeftBtnBg.on('mouseout', () => {
		if (!paytableLeftBtnBg.disabled) {
			paytableLeftBtnBg.texture = TextureCache['info_bottom_bar_control-left_normal.png']
		}
	})
	paytableLeftBtnBg.on('pointerdown', () => {
		if (!paytableLeftBtnBg.disabled) {
			paytableLeftBtnBg.texture = TextureCache['info_bottom_bar_control-left_click.png']
		}
	})
	paytableLeftBtnBg.on('pointerup', () => {
		if (!paytableLeftBtnBg.disabled) {
			clickSound.play()
			paytableLeftBtnBg.texture = TextureCache['info_bottom_bar_control-left_hover.png']
		}

		if (paytableBook.currentPage - 1 === 0) {
			paytableBook.currentPage -= 1

			paytableLeftArrow.texture = TextureCache['info_bottom_bar_control-left-arrow_disabled.png']
			disableButton(paytableLeftBtnBg, 'info_bottom_bar_control-left_disabled.png')
		} else if (paytableBook.currentPage - 1 > 0) {
			paytableBook.currentPage -= 1

			paytableRightArrow.texture = TextureCache['info_bottom_bar_control-right-arrow.png']
			enableButton(paytableRightBtnBg, 'info_bottom_bar_control-right_normal.png')
		}
	})

	paytableRightBtnBg.on('mouseover', () => {
		if (!paytableRightBtnBg.disabled) {
			paytableRightBtnBg.texture = TextureCache['info_bottom_bar_control-right_hover.png']
		}
	})
	paytableRightBtnBg.on('mouseout', () => {
		if (!paytableRightBtnBg.disabled) {
			paytableRightBtnBg.texture = TextureCache['info_bottom_bar_control-right_normal.png']
		}
	})
	paytableRightBtnBg.on('pointerdown', () => {
		if (!paytableRightBtnBg.disabled) {
			paytableRightBtnBg.texture = TextureCache['info_bottom_bar_control-right_click.png']
		}
	})
	paytableRightBtnBg.on('pointerup', () => {
		if (!paytableRightBtnBg.disabled) {
			clickSound.play()
			paytableRightBtnBg.texture = TextureCache['info_bottom_bar_control-right_hover.png']
		}

		if (paytableBook.currentPage + 1 === paytableBook.pages) {
			paytableBook.currentPage += 1

			paytableRightArrow.texture = TextureCache['info_bottom_bar_control-right-arrow_disabled.png']
			disableButton(paytableRightBtnBg, 'info_bottom_bar_control-right_disabled.png')
		} else if (paytableBook.currentPage + 1 < paytableBook.pages) {
			paytableBook.currentPage += 1

			paytableLeftArrow.texture = TextureCache['info_bottom_bar_control-left-arrow.png']
			enableButton(paytableLeftBtnBg, 'info_bottom_bar_control-left_normal.png')
		}
	})

	paytableMiddleBtnBg.on(
		'mouseover',
		() => (paytableMiddleBtnBg.texture = TextureCache['info_bottom_bar_control-middle_hover.png'])
	)
	paytableMiddleBtnBg.on(
		'mouseout',
		() => (paytableMiddleBtnBg.texture = TextureCache['info_bottom_bar_control-middle_normal.png'])
	)
	paytableMiddleBtnBg.on(
		'pointerdown',
		() => (paytableMiddleBtnBg.texture = TextureCache['info_bottom_bar_control-middle_click.png'])
	)
	paytableMiddleBtnBg.on('pointerup', () => {
		clickSound.play()
		paytableMiddleBtnBg.texture = TextureCache['info_bottom_bar_control-middle_hover.png']
		paytableContainer.visible = false
		bottomBarContainer.visible = true
	})

	paytableContainer.position.set(
		view.width / 2 - paytableContainer.width / 2,
		view.height - bottomBar.height - 170
	)

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
