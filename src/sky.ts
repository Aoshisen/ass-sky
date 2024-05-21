interface Point {
	x: PointValue,
	y: PointValue,
	opacity: Value
}
interface PointValue extends Value {
	static_value: number
}

interface Value {
	value: number;
	action: Action
}
enum Action {
	ADD,
	SUB
}
export class Sky {
	ctx: CanvasRenderingContext2D;
	dots: Point[]
	frames: number = 0
	constructor(el: HTMLCanvasElement) {
		this.ctx = el.getContext("2d")!
		this.dots = this.getDotsPosition()
		this.init()
		this.startAnimation()
	}
	init() {
		this.dots.forEach((point) => {
			this.dot(point)
		})
	}
	getDotsPosition(): Point[] {
		let result = []
		for (let x = 0; x < this.ctx.canvas.width; x += 30) {
			for (let y = 0; y < this.ctx.canvas.height; y += 30) {
				result.push({
					x: {
						value: x,
						static_value: x,
						action: Math.random() > 0.5 ? Action.ADD : Action.SUB
					}, y: {
						value: y,
						static_value: y,
						action: Math.random() > 0.5 ? Action.ADD : Action.SUB
					}, opacity: {
						value: Math.random() * 0.5,
						action: Math.random() > 0.5 ? Action.ADD : Action.SUB
					}
				})
			}
		}
		return result;
	}
	dot(p: Point) {
		this.ctx.beginPath();
		this.ctx.arc(p.x.value, p.y.value, 1, 0, Math.PI * 2);
		this.ctx.fillStyle = `rgba(255,255,255,${p.opacity.value})`;
		this.ctx.fill();
		this.ctx.closePath();
	}
	moveDots() {
		this.dots = this.dots.map(dot => this.getNextDot(dot))
	}
	getNextDot(point: Point): Point {
		return {
			x: this.getNext(point.x),
			y: this.getNext(point.y),
			opacity: this.getNextOpacity(point.opacity)
		}
	}
	getNext(p: PointValue) {
		if (p.action === Action.ADD) {
			const Max = p.static_value + 5
			const nextValue = Math.min(Max, p.value + 0.01);
			return {
				...p,
				value: nextValue,
				action: nextValue >= Max ? Action.SUB : Action.ADD
			}
		}
		else {
			const Min = p.static_value - 5
			const nextValue = Math.max(Min, p.value - 0.01);
			return {
				...p,
				value: nextValue,
				action: nextValue <= Min ? Action.ADD : Action.SUB
			}
		}
	}
	getNextOpacity(op: Value): Value {
		if (op.action === Action.ADD) {
			const value = Math.min(1, op.value + 0.002);
			return {
				value,
				action: value >= 0.5 ? Action.SUB : Action.ADD
			}
		} else {
			const value = Math.max(0, op.value - 0.002);
			return {
				value,
				action: value <= 0 ? Action.ADD : Action.SUB
			}
		}
	}
	startAnimation() {
		this.frames++
		if (this.frames === 600) {
			this.frames = 0
		}
		this.moveDots();
		this.updateDots()
		this.dots.forEach((point) => {
			this.dot(point);
		});
		requestAnimationFrame(() => {
			this.startAnimation();
		});
	}
	updateDots() {
		this.dots.forEach((point) => {
			// Clear previous dot
			this.ctx.clearRect(point.x.value - 2, point.y.value - 2, 5, 5);
			// Draw new dot
			this.dot(point);
		});
	}
}