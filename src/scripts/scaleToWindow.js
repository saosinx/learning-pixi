export default function scaleToWindow() {
	let newGameWidth = 0
	let newGameHeight = 0
	let newGameX = 0
	let newGameY = 0

	const viewport = {
		width: window.innerWidth,
		height: window.innerHeight,
	}

	if (this.height / this.width > viewport.height / viewport.width) {
		newGameHeight = viewport.height
		newGameWidth = (newGameHeight * this.width) / this.height
	} else {
		newGameWidth = viewport.width
		newGameHeight = (newGameWidth * this.height) / this.width
	}

	this.style.width = `${newGameWidth}px`
	this.style.height = `${newGameHeight}px`

	newGameX = (viewport.width - newGameWidth) / 2
	newGameY = (viewport.height - newGameHeight) / 2

	this.style.margin = `${newGameY}px ${newGameX}px`
}
