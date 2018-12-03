import * as PIXI from 'pixi.js'
import 'pixi-sound'

import { alignCenter, addButtonEventListener } from './services'

const clickSound = PIXI.sound.Sound.from('assets/sounds/button_click.wav')

const {
	Container,
	Sprite,
	Text,
	utils: { TextureCache },
} = PIXI

export default function makeTurboPlay(id, { darkTextstyle }) {
	const turboPlayBg = new Sprite(id['turboplay_bg.png'])
	const turboPlayBtn = new Sprite(id['btn-turbo.png'])

	const TurboPlay = new Container()
	const TurboPlayButton = new Container()

	const btnTurboText = new Text('TURBO', darkTextstyle)

	TurboPlayButton.name = 'TurboPlayButton'
	TurboPlayButton.addChild(turboPlayBtn, btnTurboText)

	TurboPlay.name = 'TurboPlay'
	TurboPlay.position.set(1720, 60)
	TurboPlay.addChild(turboPlayBg, TurboPlayButton)

	turboPlayBtn.interactive = true
	turboPlayBtn.buttonMode = true
	turboPlayBtn.isOn = true

	addButtonEventListener(turboPlayBtn, ['mouseover', 'mouseout', 'pointerdown'])

	turboPlayBtn.on('pointerup', () => {
		clickSound.play()

		if (turboPlayBtn.isOn) {
			turboPlayBtn.isOn = !turboPlayBtn.isOn
			turboPlayBtn.texture = TextureCache['btn-turbo_hover.png']
			turboPlayBg.texture = TextureCache['turboplay_bg_disabled.png']
			TurboPlayButton.position.set(
				TurboPlayButton.parent.width / 2 - TurboPlayButton.width / 2,
				TurboPlay.height - turboPlayBtn.height
			)
		} else {
			turboPlayBtn.isOn = !turboPlayBtn.isOn
			turboPlayBtn.texture = TextureCache['btn-turbo_hover.png']
			turboPlayBg.texture = TextureCache['turboplay_bg.png']
			TurboPlayButton.position.set(TurboPlayButton.parent.width / 2 - TurboPlayButton.width / 2, 12)
		}
	})

	alignCenter(btnTurboText)
	TurboPlayButton.position.set(TurboPlayButton.parent.width / 2 - TurboPlayButton.width / 2, 12)

	return TurboPlay
}
