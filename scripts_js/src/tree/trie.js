class Node {
	constructor() {
		this.children = new Map();
		this.isEndOfWord = false;
	}
}

class Trie {
	constructor() {
		this.root = new Node();
	}

	// Apple -> [a, p, p, l, e]
	insert(word) {
		let current = this.root;

		for (const char of word.toLowerCase()) {
			if (!current.children.has(char)) {
				current.children.set(char, new Node());
			}
			current = current.children.get(char);
		}

		current.isEndOfWord = true;
	}

	search(word) {
		let current = this.root;
		for (const char of word.toLowerCase()) {
			if (!current.children.has(char)) {
				return false;
			}
			current = current.children.get(char);
		}

		return current.isEndOfWord;
	}

	startsWith(prefix) {
		let current = this.root;
		for (const char of prefix.toLowerCase()) {
			if (!current.children.has(char)) {
				return false;
			}
			current = current.children.get(char);
		}

		return true;
	}

	findWordsWithPrefix(prefix) {
		let current = this.root;
		const result = [];

		for (const char of prefix.toLowerCase()) {
			if (!current.children.has(char)) {
				return result;
			}
			current = current.children.get(char);
		}

		// Apple
		// App
		// Application
		// Appointment

		this.collectWords(current, prefix, result);
		return result;
	}

	collectWords(node, prefix, result = []) {
		if (node.isEndOfWord) {
			result.push(prefix);
		}

		for (const [char, childNode] of node.children.entries()) {
			this.collectWords(childNode, prefix + char, result);
		}
	}
}

const trie = new Trie();
trie.insert('apple');
trie.insert('app');
trie.insert('application');
trie.insert('appointment');
trie.insert('banana');
trie.insert('boxes');
trie.insert('box');

console.log(trie.findWordsWithPrefix('b'));
