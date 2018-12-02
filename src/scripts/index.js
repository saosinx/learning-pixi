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

const disabeButton = function(sprite, texture = null) {
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
	const winBoxBg = new Sprite(id['win_bg.png'])
	const turboOnBg = new Sprite(id['bg_turbo-on.png'])
	const btnTurbo = new Sprite(id['btn_turbo.png'])
	const btnAuto = new Sprite(id['btn_auto.png'])
	const btnSpin = new Sprite(id['btn_spin.png'])
	const spinSign = new Sprite(id['spin_sign.png'])

	const bottomBarContainer = new Container()
	const infoBarContainer = new Container()
	const buttonInfoContainer = new Container()
	const totalBetContainer = new Container()
	const coinContainer = new Container()
	const btnDecContainer = new Container()
	const btnIncContainer = new Container()
	const winBoxContainer = new Container()
	const turboContainer = new Container()
	const turboBtnContainer = new Container()
	const autoContainer = new Container()
	const spinContainer = new Container()

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

	const boxValueTextStyle = new TextStyle({
		...textStyle,
		fill: '#ffd100',
		fontSize: 36,
		dropShadowColor: '#710008',
	})

	const localeSettings = {
		style: 'currency',
		currency: 'CNY',
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	}

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
	btnInfo.on('pointerup', () => (btnInfo.texture = TextureCache['btn_hover.png']))

	// Totalbet container
	const localizedTotalBetValue = betMap[betMapIndex].toLocaleString('zh-CN', localeSettings)
	const totalBetTitleText = new Text('TOTAL BET', boxTitleTextStyle)
	const totalBetValueText = new Text(localizedTotalBetValue, boxValueTextStyle)

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
	totalBetValueText.position.set(totalBetContainer.width / 2 - totalBetValueText.width / 2, 45)

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
	btnDec.on('pointerup', () => {
		if (!btnDec.disabled) btnDec.texture = TextureCache['btn-sm_hover.png']
	})
	btnDec.on('pointerdown', () => {
		if (!btnDec.disabled) btnDec.texture = TextureCache['btn-sm_click.png']

		enableButton(btnInc, 'btn-sm_normal.png')
		plusSign.texture = TextureCache['plus_sign.png']
		plusSign.disabled = false

		if (betMapIndex - 1 === 0) {
			betMapIndex -= 1
			minusSign.texture = TextureCache['minus_sign_disabled.png']
			minusSign.disabled = true
			disabeButton(btnDec, 'btn-sm_disable.png')
		} else if (betMapIndex - 1 > 0) {
			betMapIndex -= 1
		}

		totalBetValueText.text = betMap[betMapIndex].toLocaleString('zh-CN', localeSettings)
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
	btnInc.on('pointerup', () => {
		if (!btnInc.disabled) btnInc.texture = TextureCache['btn-sm_hover.png']
	})
	btnInc.on('pointerdown', () => {
		if (!btnInc.disabled) btnInc.texture = TextureCache['btn-sm_click.png']

		// btnDec.texture = TextureCache['btn-sm_normal.png']
		minusSign.texture = TextureCache['minus_sign.png']
		minusSign.disabled = false
		enableButton(btnDec, 'btn-sm_normal.png')

		if (betMapIndex + 1 === betMap.length - 1) {
			betMapIndex += 1
			// btnInc.texture = TextureCache['btn-sm_disable.png']
			plusSign.texture = TextureCache['plus_sign_disabled.png']
			disabeButton(btnInc, 'btn-sm_disable.png')
			plusSign.disabled = true
		} else if (betMapIndex + 1 < betMap.length - 1) {
			betMapIndex += 1
		}

		totalBetValueText.text = betMap[betMapIndex].toLocaleString('zh-CN', localeSettings)
	})

	// Coin contaner
	const coinValue = betMap[betMapIndex] / 15
	const localizedCoinValue = coinValue.toLocaleString('zh-CN', localeSettings)
	const coinTitleText = new Text('COIN', boxTitleTextStyle)
	const coinValueText = new Text(localizedCoinValue, boxValueTextStyle)

	coinContainer.name = 'CoinDisplay'
	coinContainer.position.set(660, 60)
	coinContainer.addChild(coinBg, coinTitleText, coinValueText)

	coinTitleText.position.set(coinContainer.width / 2 - coinTitleText.width / 2, 15)
	coinValueText.position.set(coinContainer.width / 2 - coinValueText.width / 2, 45)

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
	btnAuto.on('pointerup', () => (btnAuto.texture = TextureCache['btn_auto_hover.png']))

	spinContainer.name = 'SpinButton'
	spinContainer.position.set(2100, -60)
	spinContainer.addChild(btnSpin, spinSign)
	btnSpin.on('mouseover', () => (btnSpin.texture = TextureCache['btn_spin_hover.png']))
	btnSpin.on('mouseout', () => (btnSpin.texture = TextureCache['btn_spin.png']))
	btnSpin.on('pointerdown', () => (btnSpin.texture = TextureCache['btn_spin_click.png']))
	btnSpin.on('pointerup', () => (btnSpin.texture = TextureCache['btn_spin_hover.png']))
	decorateButton(btnSpin)
	alignCenter(spinSign)

	bottomBarContainer.name = 'BottomBar'
	bottomBarContainer.position.set(
		view.width / 2 - bottomBar.width / 2,
		view.height - bottomBar.height - 170
	)

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
	stage.addChild(bottomBarContainer)
}

loader
	.add('assets/images/bottom-bar.png')
	.add('assets/images/atlas.json')
	.load(setup)
