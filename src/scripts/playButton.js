import * as PIXI from 'pixi.js'
import 'pixi-sound'

import { addButtonEventListener, decorateButton } from './services'

const {
	Container,
	Sprite,
	utils: { TextureCache },
} = PIXI

export default function makePlayButton(id) {
	const btnSpin = new Sprite(id['btn-spin.png'])
	const spinSign = new Sprite(id['spin-sign.png'])

	const PlayButton = new Container()

	const clickSound = PIXI.sound.Sound.from('assets/sounds/button_click.wav')

	PlayButton.name = 'SpinButton'
	PlayButton.position.set(2100, -60)
	PlayButton.addChild(btnSpin, spinSign)

	addButtonEventListener(btnSpin, ['mouseover', 'mouseout', 'pointerdown'])
	btnSpin.on('pointerup', () => {
		clickSound.play()
		btnSpin.texture = TextureCache['btn-spin_hover.png']
	})

	decorateButton(btnSpin)
	spinSign.anchor.set(0.5, 0.5)
	spinSign.position.set(
		spinSign.parent.width / 2 - spinSign.width / 4,
		spinSign.parent.height / 2 - spinSign.height / 4
	)

	PlayButton.spinSign = spinSign
	PlayButton.btnSpin = btnSpin

	function startSpinRotating() {
		const tweenRotate = PIXI.tweenManager.createTween(spinSign)
		tweenRotate.from({ rotation: 0 })
		tweenRotate.easing = PIXI.tween.Easing.inOutQuint()
		tweenRotate.to({ rotation: -2 * Math.PI })
		tweenRotate.time = 2500
		tweenRotate.loop = true

		tweenRotate.start()
	}

	PlayButton.startSpinRotating = startSpinRotating

	return PlayButton
}
