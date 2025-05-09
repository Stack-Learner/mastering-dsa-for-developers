class Node {
	constructor(value) {
		this.value = value;
		this.children = []; // array of nodes
	}
}

class GeneralTree {
	constructor() {
		this.root = null;
	}

	insert(value, parentValue = null) {
		const newNode = new Node(value);

		if (!this.root) {
			this.root = newNode;
			return;
		}

		if (!parentValue) {
			return false;
		}

		// Find the parent node by value
		const parentNode = this.search(parentValue);
		if (!parentNode) {
			return false;
		}

		parentNode.children.push(newNode);
	}

	search(value) {
		const searchImpl = (node) => {
			if (!node) return null;
			if (node.value === value) return node;

			for (const child of node.children) {
				const result = searchImpl(child);
				if (result) return result;
			}

			return null;
		};

		return searchImpl(this.root);
	}

	// Pre Order
	preOrder() {
		const result = [];
		const traverse = (node) => {
			if (!node) return;
			result.push(node.value);

			for (const child of node.children) {
				traverse(child);
			}
		};

		traverse(this.root);
		return result;
	}

	inOrder() {
		const result = [];
		const traverse = (node) => {
			if (!node) return;
			for (const child of node.children) {
				traverse(child);
			}

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
			if (!node) continue;

			result.push(node.value);

			for (const child of node.children) {
				queue.push(child);
			}
		}

		return result;
	}

	print() {
		const result = [];
		const traverse = (node, prefix = '', isLast = true) => {
			if (!node) return;

			result.push(prefix + (isLast ? '└── ' : '├── ') + node.value);

			const childPrefix = prefix + (isLast ? '    ' : '│   ');

			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i];
				const isLastChild = i === node.children.length - 1;
				traverse(child, childPrefix, isLastChild);
			}
		};

		traverse(this.root, '', true);
		console.log(result.join('\n'));
	}
}

const tree = new GeneralTree();
tree.insert(1);
tree.insert(2, 1);
tree.insert(3, 1);
tree.insert(4, 1);
tree.insert(5, 2);
tree.insert(6, 2);
tree.insert(7, 4);
tree.insert(8, 4);

tree.print();

console.log('Pre Order', tree.preOrder());
console.log('In Order', tree.inOrder());
console.log('Level Order', tree.levelOrder());
