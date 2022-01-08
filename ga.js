class GeneticAlgorithm {
	constructor() {
		this.totalFitness = 0;
	}

	nextGeneration() {
		// console.log("next generation");
		generationCount++;

		// const checkpoint = floor(checkpoints.length / 2) + 1;
		const checkpoint = 0;

		for (let i = 0; i < total; i++) {
			let index = this.pickOne();

			let car = new Car(
				spawnPoint.x,
				spawnPoint.y,
				checkpoint,
				carsDead[index].brain
			);
			car.setRays();
			car.velocity.y = -4;
			cars.push(car);

			// cars.push(
			// 	new Car(spawnPoint[0], spawnPoint[1], checkpoint, carsDead[index].brain)

			// );
		}

		// reset
		carsDead = [];
		this.totalFitness = 0;
	}

	pickOne() {
		let index = 0;
		let fitnessAim = this.totalFitness * Math.random();
		while (fitnessAim > 0) {
			fitnessAim -= carsDead[index].fitness;
			index++;
		}
		index--;
		return index;
	}
}
