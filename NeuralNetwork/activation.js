function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}

function tanh(x) {
	return Math.tanh(x);
}

function ReLU(x) {
	return Math.max(0, x);
}

function inverseCoshSquared(x) {
	return Math.pow(Math.cosh(x), -2);
}
