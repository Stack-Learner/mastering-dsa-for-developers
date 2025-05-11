class Node {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
	}
}

class BinaryTree {
	constructor() {
		this.root = null;
	}

	insert(value) {
		const insertNode = (node) => {
			if (!node) {
				return new Node(value);
			}

			if (value < node.value) {
				node.left = insertNode(node.left);
			} else if (value > node.value) {
				node.right = insertNode(node.right);
			}

			return node;
		};

		this.root = insertNode(this.root);
	}

	preOrder() {
		const result = [];
		const traverse = (node) => {
			if (!node) return;
			result.push(node.value);
			traverse(node.left);
			traverse(node.right);
		};

		traverse(this.root);
		return result;
	}

	inOrder() {
		const result = [];
		const traverse = (node) => {
			if (!node) return;
			traverse(node.left);
			result.push(node.value);
			traverse(node.right);
		};

		traverse(this.root);
		return result;
	}

	postOrder() {
		const result = [];
		const traverse = (node) => {
			if (!node) return;
			traverse(node.left);
			traverse(node.right);
			result.push(node.value);
		};

		traverse(this.root);
		return result;
	}

	levelOrder() {
		const result = [];
		const queue = [this.root];

		while (queue.length) {
			const node = queue.shift();
			result.push(node.value);

			if (node.left) queue.push(node.left);
			if (node.right) queue.push(node.right);
		}

		return result;
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
				const isLastRight = true;
				traverse(node.right, childPrefix, isLastRight);
			}
		};

		traverse(this.root, '', true);
		console.log(result.join('\n'));
	}
}

const data = [10, 5, 15, 3, 7, 12, 18, 1, 9, 14, 17, 20];
const tree = new BinaryTree();

tree.print();

console.log(tree.preOrder());
console.log(tree.inOrder());
console.log(tree.postOrder());
console.log(tree.levelOrder());
