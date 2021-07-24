class Matrix {
	constructor(numRows, numColumns) {
		this.numRows = numRows;
		this.numColumns = numColumns;
		this.data = new Array();

		this.populate(0);
	}

	addRow(newRow) {
		this.numRows += 1;
		this.data.push(newRow);
	}

	copy() {
		let matrixCopy = new Matrix(this.numRows, this.numColumns);
		for (let i = 0; i < this.numRows; i++) {
			for (let j = 0; j < this.numColumns; j++) {
				matrixCopy.data[i][j] = this.data[i][j];
			}
		}
		return matrixCopy;
	}

	map(func) {
		for (let i = 0; i < this.numRows; i++) {
			for (let j = 0; j < this.numColumns; j++) {
				this.data[i][j] = func(this.data[i][j]);
			}
		}
	}

	populate(val) {
		for (let i = 0; i < this.numRows; i++) {
			this.data.push(new Array(this.numColumns).fill(val));
		}
	}

	randomise(lower, upper) {
		for (let i = 0; i < this.numRows; i++) {
			for (let j = 0; j < this.numColumns; j++) {
				this.data[i][j] = Math.random() * (upper - lower) + lower;
			}
		}
	}

	static fromArray(array) {
		let matrix = new Matrix(array.length, 1);
		for (let i = 0; i < array.length; i++) {
			matrix.data[i][0] = array[i];
		}

		return matrix;
	}

	static toArray(matrix) {
		let array = new Array(matrix.numRows);
		for (let i = 0; i < matrix.numRows; i++) {
			array[i] = matrix.data[i][0];
		}

		return array;
	}

	static multiply(a, b) {
		if (a.numColumns != b.numRows) {
			return;
		}

		let m = new Matrix(a.numRows, b.numColumns);

		for (let i = 0; i < a.numRows; i++) {
			for (let j = 0; j < b.numColumns; j++) {
				let sum = 0;
				for (let k = 0; k < a.numColumns; k++) {
					sum += a.data[i][k] * b.data[k][j];
				}
				m.data[i][j] = sum;
			}
		}
		return m;
	}
}
