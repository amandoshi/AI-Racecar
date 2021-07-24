class Car {
	constructor(x, y, checkpoint, brain) {
		// class constants
		this.height = 10;
		this.maxSpeed = 4;
		this.rayLength = 200;
		this.width = 25;

		// object variables
		this.position = createVector(x, y);
		this.velocity = createVector();
		this.acceleration = createVector();

		if (brain) {
			this.brain = brain.copy();
			this.brain.mutate();
		} else {
			this.brain = new NeuralNetwork(14, 28, 2);
		}

		this.checkpoint = checkpoint;
		this.dead = false;
		this.fitness;
		this.score = 1;
		this.timer = 30;
		this.rays = new Array();
	}

	checkpointReached(checkpoints) {
		let offset = p5.Vector.fromAngle(this.velocity.heading(), this.width / 2);
		for (const ray of this.rays) {
			let distanceSquared = ray.intersect(
				[checkpoints[this.checkpoint]],
				this.position,
				offset,
				this.velocity
			);

			if (distanceSquared < this.velocity.mag() ** 2) {
				this.checkpoint = (this.checkpoint + 1) % checkpoints.length;
				this.score++;
				this.timer = 30;
			}
		}
	}

	draw() {
		push();

		// set draw state
		translate(this.position);
		rotate(this.velocity.heading());
		rectMode(CENTER);
		fill(255, 150);

		// draw car
		rect(0, 0, this.width, this.height);

		pop();
	}

	rayIntersect(walls) {
		let offset = p5.Vector.fromAngle(this.velocity.heading(), this.width / 2);
		let distances = new Array();

		for (const ray of this.rays) {
			let distance = ray.intersect(walls, this.position, offset, this.velocity);
			distances.push(distance);

			if (distance < this.velocity.mag() ** 2) {
				this.dead = true;
			}
		}

		return distances;
	}

	setRays() {
		for (let i = -90; i <= 90; i += 15) {
			this.rays.push(new Ray(radians(i), this.rayLength));
		}
	}

	think(distances) {
		let inputs = new Array();

		// normalise distance
		for (const distance of distances) {
			inputs.push(map(distance, 0, this.rayLength ** 2, 1, 0));
		}

		// normalise velocity
		inputs.push(this.velocity.mag() / this.maxSpeed);

		const result = this.brain.predict(inputs);
		// console.log(result[0]);
		this.velocity.setHeading(
			this.velocity.heading() + map(result[0], 0, 1, -PI / 2, PI / 2)
		);
	}

	update(walls, checkpoints) {
		const distances = this.rayIntersect(walls);
		this.think(distances);

		this.checkpointReached(checkpoints);

		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);

		this.timer--;
		if (!this.timer) {
			this.dead = true;
		}
	}
}
