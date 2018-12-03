import * as PIXI from 'pixi.js'

const { Container, Sprite, Text, TextStyle } = PIXI

export default function makeWinBox(id, { darkTextstyle }) {
	const winBoxBg = new Sprite(id['win_bg.png'])

	const WinBox = new Container()

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

	WinBox.name = 'WinBox'
	WinBox.position.set(857, 17)
	WinBox.addChild(winBoxBg, winBoxText)
	winBoxText.position.set(
		winBoxText.parent.width / 2 - winBoxText.width / 2,
		winBoxText.parent.height / 2 - winBoxText.height / 2
	)

	return WinBox
}
