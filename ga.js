class GeneticAlgorithm {
	constructor() {
		this.totalFitness = 0;
	}

	calculateTotalFitness() {
		for (let i = 0; i < total; i++) {
			this.totalFitness += carsDead[i].fitness;
		}
	}

	nextGeneration() {
		this.calculateTotalFitness();

		let checkpoint;
		if (customTrack) {
			checkpoint = 0;
		} else {
			checkpoint = floor(checkpoints.length / 2) + 1;
		}

		for (let i = 0; i < total; i++) {
			let index = this.pickOne();
			// console.log(index, i);

			// create new generation of self-driving agents
			let car = new Car(
				spawnPoint.x,
				spawnPoint.y,
				checkpoint,
				carsDead[index].brain
			);
			car.setRays();
			car.velocity.x = 1;
			cars.push(car);
		}

		// reset
		carsDead = [];
		this.totalFitness = 0;
		generationCount++;
	}

	pickOne() {
		let index = 0;
		let fitnessAim = this.totalFitness * Math.random();

		while (fitnessAim > 0) {
			fitnessAim -= carsDead[index].fitness;
			index++;
		}

		return index - 1;
	}
}
