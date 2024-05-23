import { berlin } from "./utils/berlin-noise";

interface Point { x: number, y: number }
export class Sky {
	readonly GAP = 20;
	readonly AMP = 4;
	readonly RADIUS = 2;
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
		for (var x = 4; x < this.el.width; x += this.GAP) {
			for (var y = 4; y < this.el.height; y += this.GAP) {
				dots.push({ x, y });
			}
		}
		return dots;
	}
	randomOpacity({ x, y }: Point) {
		let value = berlin(x / 50, y / 50, this.time * 0.01);
		return value = (1 + value) * Math.pow(2, 6);
	}
	randomXPosition({ x, y }: Point) {
		let value2 = berlin(x / 50, y / 50, this.time * 0.01 + 10);
		return value2 = (1 + value2) * 2 * Math.pow(2, 1);
	}
	randomYPosition({ x, y }: Point) {
		let value2 = berlin(x / 50, y / 50, this.time * 0.01 + 20);
		return value2 = (1 + value2) * 2 * Math.pow(2, 1);
	}
	drawDot(p: Point) {
		const opacity = this.randomOpacity(p)
		const X = this.randomXPosition(p)
		const Y = this.randomYPosition(p)
		this.ctx.fillStyle = `rgba(${opacity},${opacity},${opacity},255)`;
		this.ctx.beginPath();
		this.ctx.arc(p.x + X, p.y + Y, this.RADIUS, 0, Math.PI * 2);
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
		this.time += this.AMP
	}
}

