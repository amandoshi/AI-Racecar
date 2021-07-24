class Boundary {
	constructor(x1, y1, x2, y2) {
		this.start = createVector(x1, y1);
		this.end = createVector(x2, y2);
	}

	draw() {
		push();

		// set drawing state
		stroke(255);

		// draw line
		line(this.start.x, this.start.y, this.end.x, this.end.y);

		pop();
	}
}
