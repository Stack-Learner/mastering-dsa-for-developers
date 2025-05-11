class Node {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
		this.height = 0;
	}
}

class AVLTree {
	constructor() {
		this.root = null;
	}

	getHeight(node) {
		return node ? node.height : 0;
	}

	updateHeight(node) {
		if (!node) return 0;

		const leftHeight = this.getHeight(node.left);
		const rightHeight = this.getHeight(node.right);
		node.height = 1 + Math.max(leftHeight, rightHeight);
	}

	getBalance(node) {
		if (!node) return 0;
		return this.getHeight(node.left) - this.getHeight(node.right);
	}

	leftRotate(node) {
		const temp = node.right;
		node.right = temp.left;
		temp.left = node;

		this.updateHeight(node);
		this.updateHeight(temp);

		return temp;
	}

	rightRotate(node) {
		const temp = node.left;
		node.left = temp.right;
		temp.right = node;

		this.updateHeight(node);
		this.updateHeight(temp);

		return temp;
	}

	insert(value) {
		const insertNode = (node) => {
			// Base case: if tree is empty, create new node
			if (!node) return new Node(value);

			// Recursively insert into left or right subtree
			if (value < node.value) {
				node.left = insertNode(node.left);
			} else if (value > node.value) {
				node.right = insertNode(node.right);
			} else {
				return node;
			}

			// Update height of current node
			this.updateHeight(node);
			const balance = this.getBalance(node);

			// LL Case
			if (balance > 1 && value < node.left.value) {
				return this.rightRotate(node);
			}

			// RR Case
			if (balance < -1 && value > node.right.value) {
				return this.leftRotate(node);
			}

			// LR Case
			if (balance > 1 && value > node.left.value) {
				node.left = this.leftRotate(node.left);
				return this.rightRotate(node);
			}

			// RL Case
			if (balance < -1 && value < node.right.value) {
				node.right = this.rightRotate(node.right);
				return this.leftRotate(node);
			}

			return node;
		};

		this.root = insertNode(this.root);
	}

	print() {
		const result = [];
		const traverse = (node, prefix = '', isLast = true) => {
			if (!node) return;

			result.push(prefix + (isLast ? '└── ' : '├── ') + node.value);

			const childPrefix = prefix + (isLast ? '    ' : '│   ');

			if (node.left) {
				const isLastLeft = !node.right;
				traverse(node.left, childPrefix, isLastLeft);
			}

			if (node.right) {
				const isLastRight = !node.left;
				traverse(node.right, childPrefix, isLastRight);
			}
		};

		traverse(this.root);
		console.log(result.join('\n'));
		console.log('--------------------------------\n');
	}
}

const tree = new AVLTree();
console.log('Inserting 10');
tree.insert(10);
tree.print();

console.log('Inserting 20');
tree.insert(20);
tree.print();

console.log('Inserting 30');
tree.insert(30);
tree.print();

console.log('Inserting 40');
tree.insert(40);
tree.print();

console.log('Inserting 50');
tree.insert(50);
tree.print();

console.log('Inserting 60');
tree.insert(60);
tree.print();

console.log('Inserting 70');
tree.insert(70);
tree.print();

console.log('Inserting 80');
tree.insert(80);
tree.print();

console.log('Inserting 55');
tree.insert(55);
tree.print();

console.log('Inserting 45');
tree.insert(45);
tree.print();
