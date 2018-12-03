import * as PIXI from 'pixi.js'
import 'pixi-sound'

import {
	addButtonEventListener,
	alignCenter,
	decorateButton,
	disableButton,
	enableButton,
	getCoinValue,
	getLocalizedCurrencyValue,
	getBetMap,
} from './services'

const clickSound = PIXI.sound.Sound.from('assets/sounds/button_click.wav')

const {
	Container,
	Sprite,
	Text,
	utils: { TextureCache },
} = PIXI

export default function makeTotalBet(id, { pinkTextStyle, darkYellowTextStyle, coinValueText }) {
	const plusSign = new Sprite(id['plus-sign.png'])
	const minusSign = new Sprite(id['minus-sign.png'])
	const totalBetBg = new Sprite(id['totalbet_bg.png'])
	const btnDec = new Sprite(id['btn-sm.png'])
	const btnInc = new Sprite(id['btn-sm.png'])

	const TotalBet = new Container()
	const DecrementButton = new Container()
	const IncrementButton = new Container()

	const betMap = getBetMap()

	const totalBetTitleText = new Text('TOTAL BET', pinkTextStyle)
	const totalBetValueText = new Text(
		getLocalizedCurrencyValue(betMap.bets[betMap.index]),
		darkYellowTextStyle
	)

	const updateValueText = function() {
		totalBetValueText.text = getLocalizedCurrencyValue(betMap.bets[betMap.index])
		coinValueText.text = getLocalizedCurrencyValue(getCoinValue(betMap.bets[betMap.index]))
	}

	TotalBet.name = 'TotalBet'
	TotalBet.position.set(255, 60)
	TotalBet.addChild(
		totalBetBg,
		totalBetTitleText,
		totalBetValueText,
		DecrementButton,
		IncrementButton
	)

	totalBetTitleText.position.set(TotalBet.width / 2 - totalBetTitleText.width / 2, 15)
	totalBetValueText.position.set(TotalBet.width / 2, 75)
	totalBetValueText.anchor.set(0.5, 0.5)

	DecrementButton.name = 'DecrementButton'
	DecrementButton.position.set(10, 10)
	DecrementButton.addChild(btnDec, minusSign)

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

		if (betMap.index - 1 === 0) {
			betMap.index -= 1
			minusSign.texture = TextureCache['minus-sign_disabled.png']
			disableButton(btnDec, 'btn-sm_disabled.png')
		} else if (betMap.index - 1 > 0) {
			betMap.index -= 1
		}

		updateValueText()
	})

	IncrementButton.name = 'IncrementButton'
	IncrementButton.position.set(IncrementButton.parent.width - btnInc.width - 10, 10)
	IncrementButton.addChild(btnInc, plusSign)

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

		if (betMap.index + 1 === betMap.bets.length - 1) {
			betMap.index += 1
			plusSign.texture = TextureCache['plus-sign_disabled.png']
			disableButton(btnInc, 'btn-sm_disabled.png')
		} else if (betMap.index + 1 < betMap.bets.length - 1) {
			betMap.index += 1
		}

		updateValueText()
	})

	return TotalBet
}
