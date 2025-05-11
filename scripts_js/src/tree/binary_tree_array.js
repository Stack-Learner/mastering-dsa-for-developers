class BinaryTreeArray {
	constructor(size = 100) {
		this.array = new Array(size + 1).fill(null);
		this.size = size;
		this.nodeCount = 0;
	}

	insert(value) {
		if (this.nodeCount >= this.size) {
			throw new Error('Tree is full');
		}

		this.nodeCount++;
		this.array[this.nodeCount] = value;
		return true;
	}

	remove(value) {
		let index = -1;

		for (let i = 1; i <= this.nodeCount; i++) {
			if (this.array[i] === value) {
				index = i;
				break;
			}
		}

		if (index === -1) {
			return false;
		}

		// [null, 1, 2, 3, 4, 5] | index = 3,  nodeCount 5
		// [null, 1, 2, 5, 4, 5]
		// [null, 1, 2, 5, 4, null]
		this.array[index] = this.array[this.nodeCount];
		this.array[this.nodeCount] = null;
		this.nodeCount--;
		return true;
	}

	preOrder() {
		const result = [];
		const traverse = (index) => {
			if (index > this.nodeCount || !this.array[index]) return;

			result.push(this.array[index]);
			traverse(index * 2);
			traverse(index * 2 + 1);
		};

		traverse(1);
		return result;
	}

	inOrder() {
		const result = [];
		const traverse = (index) => {
			if (index > this.nodeCount || !this.array[index]) return;

			traverse(index * 2 + 1);
			result.push(this.array[index]);
			traverse(index * 2);
		};

		traverse(1);
		return result;
	}

	postOrder() {
		const result = [];
		const traverse = (index) => {
			if (index > this.nodeCount || !this.array[index]) return;

			traverse(index * 2);
			traverse(index * 2 + 1);
			result.push(this.array[index]);
		};

		traverse(1);
		return result;
	}

	getTree() {
		return this.array.slice(1, this.nodeCount + 1);
	}
}

const tree = new BinaryTreeArray();

tree.insert(1);
tree.insert(2);
tree.insert(3);
tree.insert(4);
tree.insert(5);

console.log(tree.getTree());
console.log(tree.preOrder());
console.log(tree.inOrder());
console.log(tree.postOrder());
