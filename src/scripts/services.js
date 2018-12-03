import * as PIXI from 'pixi.js'

const {
	Circle,
	utils: { TextureCache },
} = PIXI

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

const addButtonEventListener = function(sprite, events = []) {
	const texture = sprite.texture.textureCacheIds[0]
	const re = /(?:\.([^.]+))?$/
	const textureWithoutExtension = texture.replace(/\.[^/.]+$/, '')
	const textureExtension = re.exec(texture)[0]
	// eslint-disable-next-line consistent-return
	events.forEach((event) => {
		switch (event) {
			case 'mouseover':
				sprite.on(event, () => {
					if (!sprite.disabled) {
						sprite.texture = TextureCache[`${textureWithoutExtension}_hover${textureExtension}`]
					}
				})
				break
			case 'pointerdown':
				sprite.on(event, () => {
					if (!sprite.disabled) {
						sprite.texture = TextureCache[`${textureWithoutExtension}_click${textureExtension}`]
					}
				})
				break
			case 'mouseout':
				sprite.on(event, () => {
					if (!sprite.disabled) sprite.texture = TextureCache[texture]
				})
				break
			default:
				return false
		}
	})
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

const getBetMap = function() {
	const betMap = {
		index: 6,
		bets: [],
	}

	betMap.bets = [5]
	for (let i = 0; i < 6; i += 1) {
		const base = betMap.bets[betMap.bets.length - 1]
		for (let j = 0; j < 3; j += 1) {
			if (i === 0 && j === 2) continue
			betMap.bets.push(base * 2 + base * j)
		}
	}

	return betMap
}

export {
	addButtonEventListener,
	alignCenter,
	alignHorizontal,
	alignVertical,
	decorateButton,
	disableButton,
	enableButton,
	getBetMap,
	getCoinValue,
	getLocalizedCurrencyValue,
}
