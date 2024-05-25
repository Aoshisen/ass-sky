interface Point {
	x: number;
	y: number;
	skip?: boolean;
}
export class A {
	readonly WEIGHT = 20;
	readonly THETA = Math.PI / 5 * 2;
	readonly OFFSET: Point = { x: 200, y: 200 }
	readonly SPLIT_SCALE = 1 / 2;
	dots = new Map<number, Point>();
	ctx: CanvasRenderingContext2D;

	constructor(private height: number, private el: HTMLCanvasElement) {
		this.ctx = this.el.getContext("2d")!;
		this.init()
	}
	init() {
		this.getADots()
		this.draw()
	}
	private getADots() {
		const P1x = this.height / Math.tan(this.THETA)
		const P1 = { x: P1x, y: 0 }

		const P2x = P1x - this.WEIGHT;
		const P2y = Math.tan(this.THETA) * this.WEIGHT
		const P2 = { x: P2x, y: P2y }

		const P3 = { x: 0, y: this.height }

		const P4 = { x: this.WEIGHT, y: this.height }


		//三分之一处
		const y_789 = P2y + (this.height - P2y) * this.SPLIT_SCALE

		const P5x = P1x - ((y_789 + this.WEIGHT - P2y) / Math.tan(this.THETA))
		const P5 = { x: P5x, y: y_789 + this.WEIGHT };

		const P6 = { x: P1x, y: P5.y }

		const P7 = { x: P1x, y: y_789 }

		const P8x = P1x - ((y_789 - P2y) / Math.tan(this.THETA))

		const P8 = { x: P8x, y: y_789 }

		const P9 = { x: P5.x, y: y_789, skip: true }

		const P10 = { x: P1x, y: P2.y }

		const P11 = { x: 2 * P1x - this.WEIGHT, y: this.height, }

		const P12 = { x: 2 * P1x, y: this.height, }

		const P13 = { x: P1x + this.WEIGHT, y: P2y }

		const dots = [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13]
		dots.map((dot, index) => {
			this.dots.set(index, dot)
		})
	}
	draw() {
		let currentPoint: Point;
		let nextPoint: Point;
		for (const dot of this.dots) {
			const nextDot = this.dots.get(dot[0] + 1) || this.dots.get(0)!;
			const currentDot = dot[1]
			if (!currentDot.skip) {
				currentPoint = currentDot;
			}
			if (nextDot.skip) {
				continue;
			}
			nextPoint = nextDot

			this.line(currentPoint!, nextPoint);
		}
	}
	private line(start: Point, end: Point) {
		//draw line with start point and end point,set line to white
		this.ctx.strokeStyle = "white"
		this.ctx.beginPath();
		this.ctx.moveTo(start.x + this.OFFSET.x, start.y + this.OFFSET.y);
		this.ctx.lineTo(end.x + this.OFFSET.x, end.y + this.OFFSET.y);
		this.ctx.stroke();

	}
	checkIsPointInA(P: Point) {
		//三角形
		P = { x: P.x + this.OFFSET.x, y: P.y + this.OFFSET.y }
		const isInTriangle = this.checkIsInTriangle([this.dots.get(0)!, this.dots.get(1)!, this.dots.get(12)!], P)
		const isInLeftParallelogram = this.checkIsInParallelogram([this.dots.get(1)!, this.dots.get(2)!, this.dots.get(3)!, this.dots.get(9)!], P)
		const isInLeftSplitParallelogram = this.checkIsInParallelogram([this.dots.get(4)!, this.dots.get(5)!, this.dots.get(6)!, this.dots.get(8)!], P)
		const isInRightParallelogram = this.checkIsInParallelogram([this.dots.get(9)!, this.dots.get(10)!, this.dots.get(11)!, this.dots.get(12)!], P)
		return isInTriangle || isInLeftParallelogram || isInLeftSplitParallelogram || isInRightParallelogram
	}
	private checkIsInTriangle(t: Point[], P: Point) {
		P = { x: P.x + this.OFFSET.x, y: P.y + this.OFFSET.y }
		//使用叉积法来判断p是否在t 这三个点组成的三角形中
		const [A, B, C] = t
		//AB *AP
		const ABAP = this.crossProduct(B.x - A.x, B.y - A.y, P.x - A.x, P.y - A.y)
		//BC * BP
		const BCBP = this.crossProduct(C.x - B.x, C.y - B.y, P.x - B.x, P.y - B.y)
		//CA*CP
		const CACP = this.crossProduct(A.x - C.x, A.y - C.y, P.x - C.x, P.y - C.y)

		//如果ABAP BCBP CACP 都是一样的符号,那么返回true ,
		if (ABAP * BCBP > 0 && ABAP * CACP > 0) {
			return true;
		}
		return false;

	}
	private crossProduct(x1: number, y1: number, x2: number, y2: number) {
		return x1 * y2 - x2 * y1
	}
	private checkIsInParallelogram(r: Point[], P: Point) {
		//使用叉积法来判断p是否在t 这四个点组成的平行四边形中
		const [A, B, C, D] = r
		//AB *AP
		const ABAP = this.crossProduct(B.x - A.x, B.y - A.y, P.x - A.x, P.y - A.y)
		//BC * BP
		const BCBP = this.crossProduct(C.x - B.x, C.y - B.y, P.x - B.x, P.y - B.y)
		//CD *CP
		const CDCP = this.crossProduct(D.x - C.x, D.y - C.y, P.x - C.x, P.y - C.y)
		//DA*DP
		const DADP = this.crossProduct(A.x - D.x, A.y - D.y, P.x - D.x, P.y - D.y)

		//如果ABAP BCBP CDCP  DADP都是一样的符号,那么返回true ,
		if (ABAP * BCBP > 0 && ABAP * CDCP > 0 && ABAP * DADP > 0) {
			return true;
		}
		return false;
	}
}