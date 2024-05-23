import { perlin } from "./utils/perlin-noise";

interface Point { x: number, y: number }
export class Sky {
	ctx: CanvasRenderingContext2D;
	height: number = 0;
	dots: any[] = [];
	time: number = 0;

	constructor(private el: HTMLCanvasElement) {
		this.ctx = this.el.getContext("2d")!;
		this.startAnimate();
	}

	getDots() {
		const dots = [];
		for (var x = 4; x < this.el.width; x += 20) {
			for (var y = 4; y < this.el.height; y += 20) {
				dots.push({ x, y });
			}
		}
		return dots;
	}
	randomOpacity(x, y) {
		let value = perlin(x / 50, y / 50, this.time * 0.01);
		return value = (1 + value) * Math.pow(2, 6);
	}
	randomXPosition(x, y) {
		let value2 = perlin(x / 50, y / 50, this.time * 0.01 + 10);
		return value2 = (1 + value2) * 2 * Math.pow(2, 1);
	}
	randomYPosition(x, y) {
		let value2 = perlin(x / 50, y / 50, this.time * 0.01 + 20);
		return value2 = (1 + value2) * 2 * Math.pow(2, 1);
	}

	drawDot({ x, y }: Point) {
		const opacity = this.randomOpacity(x, y)
		const X = this.randomXPosition(x, y)
		const Y = this.randomYPosition(x, y)
		this.ctx.fillStyle = `rgba(${opacity},${opacity},${opacity},255)`;
		this.ctx.beginPath();
		this.ctx.arc(x + X, y + Y, 2, 0, Math.PI * 2);
		this.ctx.fill();
	}

	dot() {
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
		this.dots = this.getDots();
		this.dots.forEach(dot => {
			this.drawDot(dot);
		});
	}

	startAnimate() {
		this.dot();
		requestAnimationFrame(() => this.startAnimate());
		this.time++
	}
}

