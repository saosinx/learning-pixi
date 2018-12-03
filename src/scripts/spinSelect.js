import * as PIXI from 'pixi.js'

const {
	Container,
	Sprite,
	Text,
	utils: { TextureCache },
} = PIXI

export default function makeSpinSelect(id, { darkYellowTextStyle }) {
	const spinSelectBg = new Sprite(id['spin_select_bg.png'])
	const spinCounterBlue = new Sprite(id['spincounter-blue.png'])
	const spinCounterRed = new Sprite(id['spincounter-red.png'])
	const spinCounterSign = new Sprite(id['spincounter-sign.png'])
	const spinCounterSignSm = new Sprite(id['spincounter-sign-sm.png'])

	const SpinSelect = new Container()
	const SpinSelectUntilFeature = new Container()
	const SpinCounter = new Container()

	const textStyle = { ...darkYellowTextStyle, fontSize: 32 }

	const spinFirstVariantText = new Text('UNTIL FEATURE', textStyle)

	SpinSelectUntilFeature.position.set(25, 30)
	SpinSelectUntilFeature.addChild(spinCounterSignSm, spinFirstVariantText)
	SpinSelectUntilFeature.interactive = true
	SpinSelectUntilFeature.buttonMode = true

	SpinSelectUntilFeature.on('mouseover', () => {
		spinFirstVariantText.style.fill = '#fff'
		spinCounterSignSm.texture = TextureCache['spincounter-sign-sm_hover.png']
	})
		.on('mouseout', () => {
			spinFirstVariantText.style.fill = darkYellowTextStyle.fill
			spinCounterSignSm.texture = TextureCache['spincounter-sign-sm.png']
		})
		.on('pointerdown', () => {
			spinFirstVariantText.style.fill = '#f48a00'
			spinCounterSignSm.texture = TextureCache['spincounter-sign-sm_click.png']
		})
		.on('pointerup', () => {
			spinFirstVariantText.style.fill = '#fff'
			spinCounterSignSm.texture = TextureCache['spincounter-sign-sm_hover.png']
		})

	spinFirstVariantText.position.set(45, -5)

	const spinVariants = []
	const spinVariantsMax = 5
	for (let i = spinVariantsMax; i > 0; i -= 1) {
		spinVariants.push(new Text(`${i * 5} SPINS`, textStyle))

		const current = spinVariants.length - 1

		spinVariants[current].position.set(25, 25 + spinVariants[current].height * spinVariants.length)

		spinVariants[current].interactive = true
		spinVariants[current].buttonMode = true

		spinVariants[current]
			.on('mouseover', () => {
				spinVariants[current].style.fill = '#fff'
			})
			.on('mouseout', () => {
				spinVariants[current].style.fill = darkYellowTextStyle.fill
			})
			.on('pointerdown', () => {
				spinVariants[current].style.fill = '#f48a00'
			})
			.on('pointerup', () => {
				spinVariants[current].style.fill = '#fff'
			})
	}
	SpinSelect.name = 'Spinselect'
	SpinSelect.addChild(spinSelectBg, SpinSelectUntilFeature, ...spinVariants)

	return SpinSelect
}
