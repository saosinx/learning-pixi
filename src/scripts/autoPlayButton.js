import * as PIXI from 'pixi.js'
import 'pixi-sound'

const {
	Container,
	Sprite,
	Text,
	utils: { TextureCache },
} = PIXI

export default function makeAutoPlayButton(id, { darkTextstyle }) {
	const btnAuto = new Sprite(id['btn-auto.png'])

	const AutoPlayButton = new Container()

	const textStyle = { ...darkTextstyle, fontSize: 36 }

	const autoText = new Text('AUTO', textStyle)

	const clickSound = PIXI.sound.Sound.from('assets/sounds/button_click.wav')

	AutoPlayButton.name = 'AutoPlayButton'
	AutoPlayButton.addChild(btnAuto, autoText)

	autoText.position.set(70, autoText.parent.height / 2 - autoText.height / 2)

	btnAuto.interactive = true
	btnAuto.buttonMode = true

	btnAuto.on('mouseover', () => {
		if (!btnAuto.disabled) {
			btnAuto.texture = TextureCache['btn-auto_hover.png']
		}
	})

	btnAuto.on('mouseout', () => {
		if (!btnAuto.disabled) {
			btnAuto.texture = TextureCache['btn-auto.png']
		}
	})

	btnAuto.on('pointerdown', () => {
		if (!btnAuto.disabled) {
			btnAuto.texture = TextureCache['btn-auto_click.png']
		}
	})

	btnAuto.on('pointerup', () => {
		clickSound.play()
		btnAuto.texture = TextureCache['btn-auto_hover.png']
	})

	return AutoPlayButton
}
