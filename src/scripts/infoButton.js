import * as PIXI from 'pixi.js'
import 'pixi-sound'

import { alignCenter, addButtonEventListener, decorateButton, makeInteractive } from './services'

const { Container, Sprite } = PIXI

export default function makeInfoButton(id) {
	const infoBtnBg = new Sprite(id['btn.png'])
	const infoBtnSign = new Sprite(id['info-sign.png'])

	const InfoButton = new Container()

	InfoButton.name = 'InfoButton'
	InfoButton.position.set(130, 60)
	InfoButton.addChild(infoBtnBg, infoBtnSign)

	makeInteractive(InfoButton)
	decorateButton(infoBtnBg)
	alignCenter(infoBtnSign)

	addButtonEventListener(infoBtnBg, ['mouseover', 'mouseout', 'pointerdown'])

	InfoButton.infoBtnBg = infoBtnBg
	return InfoButton
}
