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

	insert(value, parentNode = null, isLeft = true) {
		const newNode = new Node(value);

		if (!this.root) {
			this.root = newNode;
			return true;
		}

		if (!parentNode) {
			return false;
		}

		if (isLeft && !parentNode.left) {
			parentNode.left = newNode;
		} else if (!isLeft && !parentNode.right) {
			parentNode.right = newNode;
		} else {
			return false;
		}

		return true;
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

const tree = new BinaryTree();
tree.insert(1);
tree.insert(2, tree.root, true);
tree.insert(3, tree.root, false);
tree.insert(4, tree.root.left, true);
tree.insert(5, tree.root.left, false);
tree.insert(6, tree.root.right, true);
tree.insert(7, tree.root.right, false);

tree.print();

console.log(tree.preOrder());
console.log(tree.inOrder());
console.log(tree.postOrder());
console.log(tree.levelOrder());
