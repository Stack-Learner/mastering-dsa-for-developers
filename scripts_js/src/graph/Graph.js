class Graph {
	constructor() {
		this.adjacentList = {};
	}

	addNode(node) {
		if (!(node in this.adjacentList)) {
			this.adjacentList[node] = [];
		}
	}

	deleteNode(node) {
		if (!(node in this.adjacentList)) return;

		delete this.adjacentList[node];
		for (const key in this.adjacentList) {
			this.adjacentList[key] = this.adjacentList[key].filter((v) => v !== node);
		}
	}

	addEdge(node1, node2) {
		if (!(node1 in this.adjacentList) || !(node2 in this.adjacentList)) return;

		this.adjacentList[node1].push(node2);
		this.adjacentList[node2].push(node1);
	}

	deleteEdge(node1, node2) {
		if (!(node1 in this.adjacentList) || !(node2 in this.adjacentList)) return;

		this.adjacentList[node1] = this.adjacentList[node1].filter();
		this.adjacentList[node2] = this.adjacentList[node2].filter(
			(v) => v !== node1
		);
	}

	dfs(start) {
		const visited = new Set(); // cache
		const result = [];

		const recursive = (node) => {
			result.push(node);
			visited.add(node);

			for (const neighbor of this.adjacentList[node]) {
				if (!visited.has(neighbor)) {
					recursive(neighbor);
				}
			}
		};

		if (start in this.adjacentList) {
			recursive(start);
		}

		return result;
	}

	bfs(start) {
		if (!(start in this.adjacentList)) return;

		const queue = [start];
		const visited = new Set([start]);
		const result = [];

		while (queue.length > 0) {
			const node = queue.shift();
			if (!node) break;

			result.push(node);

			for (const neighbor of this.adjacentList[node]) {
				if (!visited.has(neighbor)) {
					visited.add(neighbor);
					queue.push(neighbor);
				}
			}
		}

		return result;
	}

	toString() {
		let result = '';
		for (const node in this.adjacentList) {
			result += `${node} -> ${this.adjacentList[node].join(', ')}\n`;
		}
		return result || 'Empty Graph';
	}
}

const graph = new Graph();

graph.addNode('A');
graph.addNode('B');
graph.addNode('C');
graph.addNode('D');

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'C');
graph.addEdge('A', 'D');

console.log(graph.toString());
console.log(graph.dfs('A'));
console.log(graph.bfs('D'));
