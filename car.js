class Car {
	constructor(x, y, checkpoint, brain) {
		// class constants
		this.height = 10;
		this.maxSpeed = 6;
		this.minSpeed = 0.1;
		this.speed = 2;
		this.rayLength = 200;
		this.width = 25;

		// agent variables - motion
		this.position = createVector(x, y);
		this.velocity = createVector();

		// agent variables - brain
		if (brain) {
			this.brain = brain.copy();
			this.brain.mutate();
		} else {
			this.brain = new NeuralNetwork(14, 28, 2);
		}

		// agent variables - miscellaneous
		this.age = 0;
		this.checkpoint = checkpoint;
		this.checkpointTime = 0;
		this.dead = false;
		this.fastestTrackTime = Infinity;
		this.rays = new Array();
		this.score = 1;
		this.trackTime = 0;
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

			// collision with checkpoint
			if (distanceSquared < this.velocity.mag() ** 2) {
				this.checkpoint = (this.checkpoint + 1) % checkpoints.length;
				this.score++;
				this.checkpointTime = 0;

				// lap completed
				if (this.checkpoint == 0) {
					if (this.trackTime < this.fastestTrackTime) {
						this.fastestTrackTime = this.trackTime;
					}

					if (this.fastestTrackTime < shortestSingleLapTime) {
						shortestSingleLapTime = this.fastestTrackTime;
					}

					this.trackTime = Infinity;
					this.score += 10;
				}
			}
		}
	}

	draw() {
		push();

		// set draw state
		translate(this.position);
		rotate(this.velocity.heading());
		rectMode(CENTER);

		// draw car
		rect(0, 0, this.width, this.height);

		pop();
	}

	move(deltaHeading, deltaSpeed) {
		// object direction
		const newHeading = this.velocity.heading() + deltaHeading;
		this.velocity.setHeading(newHeading);

		// object speed
		this.speed += deltaSpeed;
		if (this.speed > this.maxSpeed) {
			this.speed = this.maxSpeed;
		} else if (this.speed <= this.minSpeed) {
			this.speed = this.minSpeed;
		}

		// update object motion
		this.velocity.setMag(this.speed);
		this.position.add(this.velocity);
	}

	rayIntersect(walls) {
		let offset = p5.Vector.fromAngle(this.velocity.heading(), this.width / 2);
		let distances = new Array();

		for (const ray of this.rays) {
			let distance = ray.intersect(walls, this.position, offset, this.velocity);
			distances.push(distance);

			// check if object has collided with wall
			if (distance < (this.velocity.mag() * 1.5) ** 2) {
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
		inputs.push(this.velocity.mag() / this.speed);

		// think using NN
		const result = this.brain.predict(inputs);
		const deltaHeading = map(result[0], 0, 1, -PI / 2, PI / 2);
		const deltaSpeed = map(result[1], 0, 1, -0.2, 0.2);

		return { deltaHeading, deltaSpeed };
	}

	update(walls, checkpoints) {
		if (this.dead) {
			return;
		}

		// predict movement
		const distances = this.rayIntersect(walls);
		const { deltaHeading, deltaSpeed } = this.think(distances);

		this.move(deltaHeading, deltaSpeed);
		this.checkpointReached(checkpoints);

		// increment agent age
		this.age++;
		this.checkpointTime++;
		this.trackTime++;

		if (this.isDead) {
			this.dead = true;
		}
	}

	get fitness() {
		return this.score ** 2;
	}

	get isDead() {
		return (
			this.age >= carLifeSpan || this.checkpointTime >= carMaxCheckpointTime
		);
	}
}
