class HTMLNode {
	constructor(tagName, attributes = {}, textContent = '') {
		this.tagName = tagName;
		this.attributes = attributes;
		this.textContent = textContent;
		this.children = []; // array of HTMLNodes
	}
}

class HTMLTree {
	constructor() {
		this.root = null;
	}

	// Insert a node as a child of parent node
	insert(node, parentNode = null) {
		if (!this.root) {
			this.root = node;
			return true;
		}

		if (!parentNode) {
			return false;
		}

		parentNode.children.push(node);
		return true;
	}

	// Create a new node without inserting
	createNode(tagName, attributes = {}, textContent = '') {
		return new HTMLNode(tagName, attributes, textContent);
	}

	// Find first node with matching tag
	findNodeByTag(tagName, node = this.root) {
		if (!node) return null;
		if (node.tagName === tagName) return node;

		for (const child of node.children) {
			const result = this.findNodeByTag(tagName, child);
			if (result) return result;
		}

		return null;
	}

	// Find first node with matching ID
	findNodeById(id, node = this.root) {
		if (!node) return null;
		if (node.attributes.id === id) return node;

		for (const child of node.children) {
			const result = this.findNodeById(id, child);
			if (result) return result;
		}

		return null;
	}

	// Find all nodes with matching class name
	findNodesByClass(className, node = this.root) {
		const results = [];

		const findNodes = (currentNode) => {
			if (!currentNode) return;

			const classAttr = currentNode.attributes.class;
			if (classAttr) {
				const classes = classAttr.split(' ');
				if (classes.includes(className)) {
					results.push(currentNode);
				}
			}

			for (const child of currentNode.children) {
				findNodes(child);
			}
		};

		findNodes(node);
		return results;
	}

	// Remove node and its children
	remove(tagName) {
		const removeNode = (node = this.root) => {
			if (!node) return false;

			node.children = node.children.filter((child) => {
				if (child.tagName === tagName) return false;
				return !removeNode(child);
			});

			return node.tagName === tagName;
		};

		removeNode();
	}

	// Convert tree back to HTML string
	toHTML(node = this.root, indent = 0) {
		if (!node) return '';

		const spaces = ' '.repeat(indent);
		let html = '';

		// Opening tag with attributes
		html += `${spaces}<${node.tagName}`;
		for (const [key, value] of Object.entries(node.attributes)) {
			html += ` ${key}="${value}"`;
		}
		html += '>';

		// Text content and children
		if (node.textContent) {
			html += `\n${spaces}  ${node.textContent}`;
		}

		for (const child of node.children) {
			html += '\n' + this.toHTML(child, indent + 2);
		}

		// Closing tag
		html += `\n${spaces}</${node.tagName}>`;
		return html;
	}
}

class HTMLParser {
	parse(htmlString) {
		const tree = new HTMLTree();
		const stack = [];
		let currentNode = null;
		let textBuffer = '';

		// Simple regex to match tags, attributes and content
		const tagRegex =
			/<\/?([a-zA-Z0-9]+)((?:\s+[a-zA-Z0-9]+="[^"]*")*)\s*>|([^<]+)/g;
		let match;

		while ((match = tagRegex.exec(htmlString)) !== null) {
			const [_, tagName, attributesStr, content] = match;

			if (content) {
				// Accumulate text content in buffer
				textBuffer += content;
			} else if (match[0].startsWith('</')) {
				// Closing tag
				// Add any buffered text to current node before popping
				const trimmedContent = textBuffer.trim();
				if (trimmedContent) {
					if (currentNode.children.length === 0) {
						currentNode.textContent = trimmedContent;
					} else {
						// If there are children and text, create a text node
						const textNode = new HTMLNode('text', {});
						textNode.textContent = trimmedContent;
						currentNode.children.push(textNode);
					}
				}
				textBuffer = ''; // Reset buffer

				stack.pop();
				currentNode = stack[stack.length - 1];
			} else {
				// Opening tag
				// Add any buffered text to previous node
				const trimmedContent = textBuffer.trim();
				if (trimmedContent && currentNode) {
					if (currentNode.children.length === 0) {
						currentNode.textContent = trimmedContent;
					} else {
						// If there are children and text, create a text node
						const textNode = new HTMLNode('text', {});
						textNode.textContent = trimmedContent;
						currentNode.children.push(textNode);
					}
				}
				textBuffer = ''; // Reset buffer

				const attributes = {};
				const attrRegex = /([a-zA-Z0-9]+)="([^"]*)"/g;
				let attrMatch;
				while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
					attributes[attrMatch[1]] = attrMatch[2];
				}

				const node = new HTMLNode(tagName, attributes);

				if (!tree.root) {
					tree.root = node;
				} else if (currentNode) {
					currentNode.children.push(node);
				}

				stack.push(node);
				currentNode = node;
			}
		}

		// Handle any remaining text buffer
		const trimmedContent = textBuffer.trim();
		if (trimmedContent && currentNode) {
			if (currentNode.children.length === 0) {
				currentNode.textContent = trimmedContent;
			} else {
				const textNode = new HTMLNode('text', {});
				textNode.textContent = trimmedContent;
				currentNode.children.push(textNode);
			}
		}

		return tree;
	}
}

// Example usage:
const parser = new HTMLParser();
const htmlString = `
<div class="container">
  <div>
    <h1>Hello World</h1>
    <p id="intro">This is a <span>simple</span> example.</p>
  </div>
  <div className="flex justify-end" id="button-container">
    <button>Click me</button>
  </div>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <span>Item 1</span>
      <span>Item 2</span>
      <span>Item 3</span>
    </div>
    <div>
      <span>Item 4</span>
      <span>Item 5</span>
      <span>Item 6</span>
    </div>
</div>
`;

const tree = parser.parse(htmlString);

const secondaryButton = tree.createNode(
	'button',
	{ class: 'secondary' },
	'Secondary Button'
);
const buttonContainer = tree.findNodeById('button-container');
tree.insert(secondaryButton, buttonContainer);

console.log('\n\nModified HTML:');
console.log(tree.toHTML());
