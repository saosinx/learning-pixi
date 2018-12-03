import * as PIXI from 'pixi.js'
import 'pixi-sound'

import { alignCenter, addButtonEventListener, disableButton, enableButton } from './services'

const clickSound = PIXI.sound.Sound.from('assets/sounds/button_click.wav')

const {
	Container,
	Sprite,
	utils: { TextureCache },
} = PIXI

export default function makePaytable(id) {
	const paytableBar = new Sprite(id['info-bar.png'])
	const paytableCross = new Sprite(id['exit-sign.png'])
	const paytableLeftArrow = new Sprite(id['arrow-left.png'])
	const paytableLeftBtnBg = new Sprite(id['page-left.png'])
	const paytableMiddleBtnBg = new Sprite(id['btn-exit.png'])
	const paytableRightArrow = new Sprite(id['arrow-right.png'])
	const paytableRightBtnBg = new Sprite(id['page-right.png'])

	const Paytable = new Container()
	const PaytableLeftButton = new Container()
	const PaytableMiddleButton = new Container()
	const PaytableRightButton = new Container()

	Paytable.name = 'PaytableBar'

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

	PaytableLeftButton.name = 'PaytableLeftButton'
	PaytableLeftButton.addChild(paytableLeftBtnBg, paytableLeftArrow)
	alignCenter(paytableLeftArrow)

	PaytableMiddleButton.name = 'PaytableMiddleButton'
	PaytableMiddleButton.addChild(paytableMiddleBtnBg, paytableCross)
	alignCenter(paytableCross)

	PaytableRightButton.name = 'PaytableRightButton'
	PaytableRightButton.addChild(paytableRightBtnBg, paytableRightArrow)
	alignCenter(paytableRightArrow)

	Paytable.addChild(paytableBar, PaytableLeftButton, PaytableMiddleButton, PaytableRightButton)

	PaytableLeftButton.position.set(145, 60)
	PaytableMiddleButton.position.set(300, 60)
	PaytableRightButton.position.set(440, 60)

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

	Paytable.paytableMiddleBtnBg = paytableMiddleBtnBg

	initPaytable()

	return Paytable
}
