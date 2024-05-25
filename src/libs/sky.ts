import { berlin } from "../utils/berlin-noise";
import { A } from "./A"

interface Point { x: number, y: number, opacity: number }
export class Sky {
	readonly GAP = 20;
	readonly RADIUS = 1.5;
	readonly SCALE = 200;
	readonly LENGTH = 20;
	readonly A;
	ctx: CanvasRenderingContext2D;
	dots: Map<string, Point> = new Map();

	constructor(private el: HTMLCanvasElement) {
		this.ctx = this.el.getContext("2d")!;
		this.A = new A(400, this.el)
		this.updateDots()
		this.startAnimate();
	}
	updateDots() {
		for (var x = 4; x < this.el.width; x += this.GAP) {
			for (var y = 4; y < this.el.height; y += this.GAP) {
				const opacity = Math.random() * 0.5 + 0.5
				const key = `${x}-${y}`
				if (this.dots.get(key))
					continue;
				this.dots.set(key, { x, y, opacity, })
			}
		}
	}
	getForceOnPoint({ x, y }: Point, t: number) {
		//-180 度 180度
		return (berlin(x / this.SCALE, y / this.SCALE, t) - 0.5) * 2 * Math.PI;
	}

	drawDot(p: Point) {
		const timestamp = + new Date() / 10000;
		const force = this.getForceOnPoint(p, timestamp);
		const opacity = (Math.abs(Math.cos(force)) * 0.5 + 0.5) * p.opacity
		const length = (berlin(p.x / this.SCALE, p.y / this.SCALE, timestamp * 2) + 0.5) * this.LENGTH;
		const X = Math.cos(force) * length;
		const Y = Math.sin(force) * length

		this.ctx.fillStyle = `rgba(180,180,180,${opacity})`;
		this.ctx.beginPath();

		this.ctx.arc(p.x + X, p.y + Y, this.RADIUS, 0, Math.PI * 2);
		if (this.A.checkIsPointInA(p)) {
			this.ctx.arc(p.x + X, p.y + Y, this.RADIUS, 0, Math.PI * 2);
		}
		this.ctx.fill();
	}
	dot() {
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
		for (const dot of this.dots) {
			this.drawDot(dot[1])
		}
	}
	startAnimate() {
		this.updateDots()
		this.dot();
		requestAnimationFrame(() => this.startAnimate());
	}
}

