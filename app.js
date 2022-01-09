// self-driving agents
const carLifeSpan = 3000;
const carMaxCheckpointTime = 120;

let cars = new Array();
let carsDead = new Array();

// track
const customTrack = true;
const noiseMax = 10;
const trackWidth = 100;

let checkpoints = new Array();
let track = new Array();

// genetic algorithm
let ga = new GeneticAlgorithm();
let generationCount = 0;
const total = 250;

// inital game settings
const drawRays = false;
const drawRayIntersections = false;

let spawnPoint;
let gameSpeed;
let counter = 0;
let shortestSingleLapTime = Infinity;

function setup() {
	createCanvas(1000, 600);

	// slider to control the game iterations per second
	gameSpeed = createSlider(1, 10, 1);

	if (customTrack) {
		setupCustomTrack();
	} else {
		setupRandomTrack();
	}

	// initalise self-driving agents
	let checkpoint;
	if (customTrack) {
		checkpoint = 0;
	} else {
		checkpoint = floor(checkpoints.length / 2) + 1;
	}

	for (let i = 0; i < total; i++) {
		let car = new Car(spawnPoint.x, spawnPoint.y, checkpoint);
		car.setRays();
		car.velocity.x = 1;
		cars.push(car);
	}
}

function draw() {
	// ---------------------LOGIC---------------------
	for (let i = 0; i < gameSpeed.value(); i++) {
		for (let i = cars.length - 1; i >= 0; i--) {
			cars[i].update(track, checkpoints);

			// identify inactive self-driving agents
			if (cars[i].dead) {
				carsDead.push(cars.splice(i, 1)[0]);
			}
		}

		// check if all self-driving agents are inactive
		if (cars.length == 0) {
			// find fastest track time
			let fastestTrackTime = Infinity;
			let fastestCarIndex = -1;

			for (let i = 0; i < carsDead.length; i++) {
				if (carsDead[i].fastestTrackTime < fastestTrackTime) {
					fastestTrackTime = carsDead[i].fastestTrackTime;
					fastestCarIndex = i;
				}
			}

			// increase score for fastest car
			if (fastestTrackTime < Infinity) {
				carsDead[fastestCarIndex].score += 50;
			}

			ga.nextGeneration();
		}
	}

	// ---------------------DRAW---------------------
	background(200);

	// track
	if (customTrack) {
		// outer track line
		fill(100);
		beginShape();
		for (const coord of trackOuter) {
			vertex(coord[0], coord[1]);
		}
		endShape(CLOSE);

		// inner track line
		fill(200);
		beginShape();
		for (const coord of trackInner) {
			vertex(coord[0], coord[1]);
		}
		endShape(CLOSE);
	} else {
		for (const edge of track) {
			edge.draw();
		}
	}

	// spawn point
	push();
	noStroke();
	fill(255, 0, 0);
	ellipse(spawnPoint.x, spawnPoint.y, 8);
	pop();

	// car & checkpoint
	for (const car of cars) {
		push();
		fill(255, 150);
		car.draw();
		pop();

		push();
		stroke(0, 255, 0, 50);
		checkpoints[car.checkpoint].draw();
		pop();
	}

	// text settings
	textSize(24);
	fill(0);

	// current generation text
	text(`generation: ${generationCount}`, 4, 22);

	// current shortest lap time text
	let shortestSingleLapTimeString = shortestSingleLapTime;
	if (shortestSingleLapTime == Infinity) {
		shortestSingleLapTimeString = "∞";
	}
	text(`shortest lap time / frame: ${shortestSingleLapTimeString}`, 200, 22);
}

function setupCustomTrack() {
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
}

function setupRandomTrack() {
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
