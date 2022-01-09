class Ray {
	constructor(angle, length) {
		this.direction = p5.Vector.fromAngle(angle, length);
		this.length = length;
	}

	draw(start, end) {
		push();

		// set draw state
		stroke(0);

		// draw ray
		line(start.x, start.y, end.x, end.y);

		pop();
	}

	intersect(walls, position, offset, carVelocity) {
		// get start & end coordinates
		let { startPosition, endPosition } = this.position(
			position,
			offset,
			carVelocity
		);

		// draw ray
		if (drawRays) {
			this.draw(startPosition, endPosition);
		}

		// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
		let minDistanceSquared = Infinity;
		let intersect = createVector();

		// ray coordiantes
		const x1 = startPosition.x;
		const y1 = startPosition.y;
		const x2 = endPosition.x;
		const y2 = endPosition.y;

		for (const wall of walls) {
			// wall coordinates
			const x3 = wall.start.x;
			const y3 = wall.start.y;
			const x4 = wall.end.x;
			const y4 = wall.end.y;

			const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
			if (denominator == 0) {
				continue;
			}

			const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
			const u = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

			if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
				const ptX = x1 + t * (x2 - x1);
				const ptY = y1 + t * (y2 - y1);

				const distanceSquared =
					(startPosition.x - ptX) ** 2 + (startPosition.y - ptY) ** 2;
				if (distanceSquared < minDistanceSquared) {
					minDistanceSquared = distanceSquared;
					intersect.x = ptX;
					intersect.y = ptY;
				}
			}
		}

		// draw intersection
		if (minDistanceSquared < Infinity) {
			if (drawRayIntersections) {
				push();

				// draw state
				stroke(255, 0, 0);
				fill(255, 0, 0);

				// draw intersection
				ellipse(intersect.x, intersect.y, 8);

				pop();
			}

			return minDistanceSquared;
		} else {
			return this.length ** 2;
		}
	}

	position(position, offset, carVelocity) {
		// start coordinate
		let startPosition = position.copy();
		startPosition.add(offset);

		// end coordinate
		let endPosition = startPosition.copy();
		let directionOffset = this.direction.copy();
		directionOffset.setHeading(
			directionOffset.heading() + carVelocity.heading()
		);
		endPosition.add(directionOffset);

		return { startPosition, endPosition };
	}
}
