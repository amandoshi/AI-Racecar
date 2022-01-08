let cars = new Array();
let carsDead = new Array();
let checkpoints = new Array();
let counter = 0;
let ga = new GeneticAlgorithm();
let track = new Array();
let spawnPoint;
let gameSpeed;
let generationCount = 0;

const noiseMax = 10;
const targetCoord = [500, 150];
const total = 250;
const trackWidth = 100;

function setup() {
	createCanvas(1000, 600);
	gameSpeed = createSlider(1, 10, 1);

	// set track
	setupTrack2();

	// set cars
	// const checkpoint = floor(checkpoints.length / 2) + 1;
	const checkpoint = 0;
	for (let i = 0; i < total; i++) {
		let car = new Car(spawnPoint.x, spawnPoint.y, checkpoint);
		car.setRays();
		car.velocity.y = -4;
		cars.push(car);
	}
}

function draw() {
	background(0);

	// ---------------------LOGIC---------------------
	for (let i = 0; i < gameSpeed.value(); i++) {
		counter++;

		for (let i = cars.length - 1; i >= 0; i--) {
			cars[i].update(track, checkpoints);
			if (cars[i].dead) {
				// store car fitness
				cars[i].fitness = cars[i].score ** 2;
				ga.totalFitness += cars[i].fitness;

				carsDead.push(cars.splice(i, 1)[0]);
			}
		}

		if (counter == 4000 || cars.length == 0) {
			for (let i = cars.length - 1; i >= 0; i--) {
				cars[i].fitness = cars[i].score ** 2;
				ga.totalFitness += cars[i].fitness;

				carsDead.push(cars.splice(i, 1)[0]);
			}

			// find fastest track time
			let fastestTrackTime = Infinity;
			let fastestCarIndex = -1;
			for (let i = 0; i < carsDead.length; i++) {
				if (carsDead[i].fastestTrackTime < fastestTrackTime) {
					fastestTrackTime = carsDead[i].fastestTrackTime;
					fastestCarIndex = i;
				}
			}
			if (fastestTrackTime < Infinity) {
				const originalFitness = carsDead[fastestCarIndex].fitness;
				carsDead[fastestCarIndex].score += 500;
				carsDead[fastestCarIndex].fitness =
					carsDead[fastestCarIndex].score ** 2;
				ga.totalFitness += carsDead[fastestCarIndex].fitness - originalFitness;

				console.log(fastestTrackTime);
			}

			// reset counter
			counter = -1;

			// next generation
			ga.nextGeneration();

			// noLoop();
		}

		// if (counter % 100 == 0) {
		// 	console.log(counter);
		// }
	}

	// ---------------------DRAW---------------------

	// track
	for (const edge of track) {
		edge.draw();
	}

	// spawn point
	push();
	noStroke();
	fill(255, 0, 0);
	ellipse(spawnPoint.x, spawnPoint.y, 8);
	pop();

	// car & checkpoint
	for (const car of cars) {
		car.draw();
		checkpoints[car.checkpoint].draw();
	}
	// car.rayIntersect(trackEdges);

	textSize(24);
	fill(255);
	rectMode(CORNER);
	text(`generation: ${generationCount}`, 4, 22);
}

function setupTrack2() {
	for (let i = 0; i < trackInner.length; i++) {
		const x1 = trackInner[i][0];
		const y1 = trackInner[i][1];
		const x2 = trackOuter[i][0];
		const y2 = trackOuter[i][1];

		// store checkpoints
		checkpoints.push(new Boundary(x1, y1, x2, y2));
	}

	// store track
	const trackType = [trackInner, trackOuter];
	for (let i = 0, length = trackInner.length; i < length; i++) {
		for (let j = 0; j < 2; j++) {
			track.push(
				new Boundary(
					trackType[j][i][0],
					trackType[j][i][1],
					trackType[j][(i + 1) % length][0],
					trackType[j][(i + 1) % length][1]
				)
			);
		}
	}

	// set spawn point
	const startIndex = 0;
	const spawnX = 760;
	const spawnY = 520;
	spawnPoint = createVector(spawnX, spawnY);

	// const startIndex = floor(trackInner.length / 2);
	// const spawnX = (trackInner[startIndex][0] + trackOuter[startIndex][0]) / 2;
	// const spawnY = (trackInner[startIndex][1] + trackOuter[startIndex][1]) / 2;
	// spawnPoint = createVector(spawnX, spawnY);
}

function setupTrack() {
	let trackInner = new Array();
	let trackOuter = new Array();
	for (let i = 0; i < 360; i += 15) {
		const xOffset = map(cos(radians(i)), -1, 1, 0, noiseMax);
		const yOffset = map(sin(radians(i)), -1, 1, 0, noiseMax);

		// inner track
		const r1 = map(noise(xOffset, yOffset), 0, 1, 150, 250) - trackWidth / 2;
		const x1 = cos(radians(i)) * r1 + width / 2;
		const y1 = sin(radians(i)) * r1 + height / 2;

		// outer track
		const r2 = r1 + trackWidth;
		const x2 = cos(radians(i)) * r2 + width / 2;
		const y2 = sin(radians(i)) * r2 + height / 2;

		// store vertices
		trackInner.push([x1, y1]);
		trackOuter.push([x2, y2]);

		// store checkpoints
		checkpoints.push(new Boundary(x1, y1, x2, y2));
	}

	// store track
	const trackType = [trackInner, trackOuter];
	for (let i = 0, length = trackInner.length; i < length; i++) {
		for (let j = 0; j < 2; j++) {
			track.push(
				new Boundary(
					trackType[j][i][0],
					trackType[j][i][1],
					trackType[j][(i + 1) % length][0],
					trackType[j][(i + 1) % length][1]
				)
			);
		}
	}

	// set spawn point
	const startIndex = floor(trackInner.length / 2);
	const spawnX = (trackInner[startIndex][0] + trackOuter[startIndex][0]) / 2;
	const spawnY = (trackInner[startIndex][1] + trackOuter[startIndex][1]) / 2;
	spawnPoint = createVector(spawnX, spawnY);
}
