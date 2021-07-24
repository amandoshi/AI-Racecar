let cars = new Array();
let checkPoints = new Array();
let track = new Array();
let spawnPoint;

const noiseMax = 10;
const targetCoord = [500, 150];
const total = 250;

function setup() {
	createCanvas(1000, 600);

	// set track
	setupTrack();

	// set cars
	for (let i = 0; i < total; i++) {
		let car = new Car(spawnPoint.x, spawnPoint.y);
		car.setRays();
		car.velocity.y = -4;
		cars.push(car);
	}

	// car = new Car(spawnCoord[0], spawnCoord[1]);
	// car.setRays();
	// car.velocity.x = 0.5;
	// car.velocity.y = -1;

	// track
	// let trackEdgesCoords = [
	// 	[50, 600, 50, 350],
	// 	[150, 600, 150, 350],
	// 	[50, 600, 150, 600],
	// 	[50, 350, 250, 100],
	// 	[150, 350, 350, 200],
	// 	[250, 100, 550, 100],
	// 	[350, 200, 550, 200],
	// 	[550, 100, 550, 200],
	// ];
	// for (const trackEdgeCoords of trackEdgesCoords) {
	// 	trackEdges.push(
	// 		new Boundary(
	// 			trackEdgeCoords[0],
	// 			trackEdgeCoords[1],
	// 			trackEdgeCoords[2],
	// 			trackEdgeCoords[3]
	// 		)
	// 	);
	// }
}

function draw() {
	background(0);

	// ---------------------LOGIC---------------------
	for (let i = cars.length - 1; i >= 0; i--) {
		cars[i].update(track);
		if (cars[i].dead) {
			cars.splice(i, 1);
		}
	}

	// for (const car of cars) {
	// 	car.update(track);
	// }

	// ---------------------DRAW---------------------

	// track
	for (const edge of track) {
		edge.draw();
	}

	// checkpoints
	for (const checkPoint of checkPoints) {
		checkPoint.draw();
	}

	// spawn point
	push();
	noStroke();
	fill(255, 0, 0);

	ellipse(spawnPoint.x, spawnPoint.y, 8);
	pop();

	// car
	for (const car of cars) {
		car.draw();
	}
	// car.rayIntersect(trackEdges);
}

function setupTrack() {
	let trackInner = new Array();
	let trackOuter = new Array();
	for (let i = 0; i < 360; i += 15) {
		const xOffset = map(cos(radians(i)), -1, 1, 0, noiseMax);
		const yOffset = map(sin(radians(i)), -1, 1, 0, noiseMax);

		// inner track
		const r1 = map(noise(xOffset, yOffset), 0, 1, 150, 250) - 50;
		const x1 = cos(radians(i)) * r1 + width / 2;
		const y1 = sin(radians(i)) * r1 + height / 2;

		// outer track
		const r2 = r1 + 50 * 2;
		const x2 = cos(radians(i)) * r2 + width / 2;
		const y2 = sin(radians(i)) * r2 + height / 2;

		// store vertices
		trackInner.push([x1, y1]);
		trackOuter.push([x2, y2]);

		// store checkpoints
		checkPoints.push(new Boundary(x1, y1, x2, y2));
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
