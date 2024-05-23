import { berlin } from "./utils/berlin-noise";

interface Point { x: number, y: number, opacity: number }
export class Sky {
	readonly GAP = 30;
	readonly RADIUS = 1;
	readonly SCALE = 200;
	readonly LENGTH = 10
	ctx: CanvasRenderingContext2D;
	dots: Point[] = [];

	constructor(private el: HTMLCanvasElement) {
		this.ctx = this.el.getContext("2d")!;
		this.startAnimate();
	}
	getDots(): Point[] {
		const dots = [];
		for (var x = 4; x < this.el.width; x += this.GAP) {
			for (var y = 4; y < this.el.height; y += this.GAP) {
				dots.push({ x, y, opacity: Math.random() * 0.5 + 0.5 });
			}
		}
		return dots;
	}
	getRandomNoise(x: number, y: number, z: number) {
		return (berlin(x / this.SCALE, y / this.SCALE, z) - 0.5)
	}
	getForce(x: number, y: number, z: number) {
		return this.getRandomNoise(x, y, z) * 4 * Math.PI
	}
	getRadius(x: number, y: number) {
		const t = +new Date() / 10000;
		const rad = this.getForce(x, y, t);
		return rad
	}
	randomOpacity({ x, y, opacity }: Point) {
		const rad = this.getRadius(x, y);
		return (Math.abs(Math.cos(rad)) * 0.5 + 0.5) * opacity
	}
	randomXPosition({ x, y }: Point) {
		const rad = this.getRadius(x, y);
		return Math.cos(rad) * this.LENGTH;
	}
	randomYPosition({ x, y }: Point) {
		const rad = this.getRadius(x, y);
		return Math.sin(rad) * this.LENGTH;
	}
	drawDot(p: Point) {
		const opacity = this.randomOpacity(p)
		const X = this.randomXPosition(p)
		const Y = this.randomYPosition(p)
		this.ctx.fillStyle = `rgba(180,180,180,${opacity})`;
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
	}
}

