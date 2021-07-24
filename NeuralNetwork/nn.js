class NeuralNetwork {
	constructor(numInput, numHidden, numOutput) {
		// class constants
		this.activation = sigmoid;
		this.mutationRate = 0.1;
		this.bias = 1;

		// class variables
		this.numInput = numInput;
		this.numHidden = numHidden;
		this.numOutput = numOutput;

		this.inputWeights = new Matrix(this.numHidden, this.numInput + 1);
		this.hiddenWeights = new Matrix(this.numOutput, this.numHidden + 1);
		this.inputWeights.randomise(-1, 1);
		this.hiddenWeights.randomise(-1, 1);
	}

	predict(inputArray) {
		// feed forward - hidden nodes
		inputArray.push(this.bias);
		let inputMatrix = Matrix.fromArray(inputArray);

		let hiddenMatrix = Matrix.multiply(this.inputWeights, inputMatrix);
		hiddenMatrix.map(sigmoid);
		hiddenMatrix.addRow([this.bias]);

		// feed forward - output
		let outputMatrix = Matrix.multiply(this.hiddenWeights, hiddenMatrix);
		outputMatrix.map(sigmoid);

		return Matrix.toArray(outputMatrix);
	}
}
