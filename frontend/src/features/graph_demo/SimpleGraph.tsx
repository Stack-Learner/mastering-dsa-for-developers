import { useState, useCallback, useMemo } from 'react';

class Graph {
	public adjacentList: { [key: string]: string[] };
	constructor() {
		this.adjacentList = {};
	}

	addNode(node: string) {
		if (!(node in this.adjacentList)) {
			this.adjacentList[node] = [];
		}
	}

	deleteNode(node: string) {
		if (node in this.adjacentList) {
			delete this.adjacentList[node];
			for (const n in this.adjacentList) {
				this.adjacentList[n] = this.adjacentList[n].filter((v) => v !== node);
			}
		}
	}

	addEdge(node1: string, node2: string) {
		if (node1 in this.adjacentList && node2 in this.adjacentList) {
			this.adjacentList[node1].push(node2);
			this.adjacentList[node2].push(node1);
		}
	}

	deleteEdge(node1: string, node2: string) {
		if (node1 in this.adjacentList && node2 in this.adjacentList) {
			this.adjacentList[node1] = this.adjacentList[node1].filter(
				(v) => v !== node2
			);
			this.adjacentList[node2] = this.adjacentList[node2].filter(
				(v) => v !== node1
			);
		}
	}

	dfs(start: string) {
		const visited = new Set();
		const result: string[] = [];
		const recursive = (node: string) => {
			visited.add(node);
			result.push(node);
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

	bfs(start: string) {
		if (!(start in this.adjacentList)) {
			return [];
		}

		const visited = new Set([start]);
		const queue: string[] = [start];
		const result: string[] = [];

		while (queue.length > 0) {
			const node = queue.shift();
			if (!node) {
				break;
			}

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
		return result || 'Graph is empty';
	}
}

interface NodePosition {
	x: number;
	y: number;
}

const GraphVisualizer = ({
	graph,
	nodePositions,
}: {
	graph: Graph;
	nodePositions: Record<string, NodePosition>;
}) => {
	return (
		<svg className='w-full h-full' viewBox='0 0 800 600'>
			{/* Draw edges first so they appear behind nodes */}
			{Object.entries(graph.adjacentList).map(([node, neighbors]) =>
				neighbors.map((neighbor) => (
					<line
						key={`${node}-${neighbor}`}
						x1={nodePositions[node].x}
						y1={nodePositions[node].y}
						x2={nodePositions[neighbor].x}
						y2={nodePositions[neighbor].y}
						className='stroke-gray-300 stroke-2'
					/>
				))
			)}

			{/* Draw nodes */}
			{Object.entries(nodePositions).map(([node, pos]) => (
				<g key={node}>
					<circle
						cx={pos.x}
						cy={pos.y}
						r={30}
						className='fill-white stroke-blue-500 stroke-2'
					/>
					<text
						x={pos.x}
						y={pos.y}
						className='text-sm fill-gray-700 select-none'
						textAnchor='middle'
						dominantBaseline='middle'
					>
						{node}
					</text>
				</g>
			))}
		</svg>
	);
};

export const SimpleGraph = () => {
	const [graph] = useState(() => {
		const g = new Graph();
		g.addNode('Alice');
		g.addNode('Bob');
		g.addNode('Charlie');
		g.addNode('Diana');
		g.addEdge('Alice', 'Bob');
		g.addEdge('Alice', 'Charlie');
		g.addEdge('Bob', 'Diana');
		return g;
	});

	const [newNode, setNewNode] = useState('');
	const [deleteNode, setDeleteNode] = useState('');
	const [edgeNode1, setEdgeNode1] = useState('');
	const [edgeNode2, setEdgeNode2] = useState('');
	const [traversalNode, setTraversalNode] = useState('');
	const [traversalType, setTraversalType] = useState('DFS');
	const [traversalResult, setTraversalResult] = useState<string[]>([]);
	const [error, setError] = useState('');
	const [updateTrigger, setUpdateTrigger] = useState(0);

	const nodePositions = useMemo(() => {
		const positions: Record<string, NodePosition> = {};
		const nodes = Object.keys(graph.adjacentList);
		const radius = 200;
		const centerX = 400;
		const centerY = 300;

		nodes.forEach((node, index) => {
			const angle = (2 * Math.PI * index) / nodes.length;
			positions[node] = {
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle),
			};
		});
		return positions;
	}, [graph.adjacentList, updateTrigger]);

	const triggerUpdate = useCallback(() => {
		setUpdateTrigger((prev) => prev + 1);
		setError('');
	}, []);

	const handleAddNode = useCallback(() => {
		if (!newNode.trim()) {
			setError('Please enter a node name!');
			return;
		}
		if (newNode in graph.adjacentList) {
			setError('Node already exists!');
			return;
		}

		graph.addNode(newNode.trim());
		setNewNode('');
		triggerUpdate();
	}, [graph, newNode, triggerUpdate]);

	const handleDeleteNode = useCallback(() => {
		if (!deleteNode.trim()) {
			setError('Please enter a node name!');
			return;
		}
		if (!(deleteNode in graph.adjacentList)) {
			setError('Node does not exist!');
			return;
		}

		graph.deleteNode(deleteNode.trim());
		setDeleteNode('');
		triggerUpdate();
	}, [graph, deleteNode, triggerUpdate]);

	const handleAddEdge = useCallback(() => {
		if (!edgeNode1.trim() || !edgeNode2.trim()) {
			setError('Please enter both node names!');
			return;
		}
		if (edgeNode1 === edgeNode2) {
			setError('Cannot connect a node to itself!');
			return;
		}
		if (
			!(edgeNode1 in graph.adjacentList) ||
			!(edgeNode2 in graph.adjacentList)
		) {
			setError('One or both nodes do not exist!');
			return;
		}
		if (graph.adjacentList[edgeNode1].includes(edgeNode2)) {
			setError('Edge already exists!');
			return;
		}

		graph.addEdge(edgeNode1.trim(), edgeNode2.trim());
		setEdgeNode1('');
		setEdgeNode2('');
		triggerUpdate();
	}, [graph, edgeNode1, edgeNode2, triggerUpdate]);

	const handleDeleteEdge = useCallback(() => {
		if (!edgeNode1.trim() || !edgeNode2.trim()) {
			setError('Please enter both node names!');
			return;
		}
		if (
			!(edgeNode1 in graph.adjacentList) ||
			!(edgeNode2 in graph.adjacentList)
		) {
			setError('One or both nodes do not exist!');
			return;
		}
		if (!graph.adjacentList[edgeNode1].includes(edgeNode2)) {
			setError('Edge does not exist!');
			return;
		}

		graph.deleteEdge(edgeNode1.trim(), edgeNode2.trim());
		setEdgeNode1('');
		setEdgeNode2('');
		triggerUpdate();
	}, [graph, edgeNode1, edgeNode2, triggerUpdate]);

	const handleTraversal = useCallback(() => {
		if (!traversalNode.trim()) {
			setError('Please enter a starting node!');
			return;
		}
		if (!(traversalNode in graph.adjacentList)) {
			setError('Starting node does not exist!');
			return;
		}

		const result =
			traversalType === 'DFS'
				? graph.dfs(traversalNode.trim())
				: graph.bfs(traversalNode.trim());
		setTraversalResult(result);
		setError('');
	}, [graph, traversalNode, traversalType]);

	return (
		<div className='flex min-h-screen bg-gray-50'>
			<div className='w-80 p-6 bg-white shadow-lg'>
				<div className='mb-8'>
					<h3 className='text-lg font-semibold mb-3'>Add Person</h3>
					<input
						type='text'
						value={newNode}
						onChange={(e) => setNewNode(e.target.value)}
						placeholder='e.g., Eve'
						className='w-full p-2 border rounded mb-2'
					/>
					<button
						onClick={handleAddNode}
						className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
					>
						Add
					</button>
				</div>

				<div className='mb-8'>
					<h3 className='text-lg font-semibold mb-3'>Remove Person</h3>
					<input
						type='text'
						value={deleteNode}
						onChange={(e) => setDeleteNode(e.target.value)}
						placeholder='e.g., Charlie'
						className='w-full p-2 border rounded mb-2'
					/>
					<button
						onClick={handleDeleteNode}
						className='w-full bg-red-500 text-white py-2 rounded hover:bg-red-600'
					>
						Remove
					</button>
				</div>

				<div className='mb-8'>
					<h3 className='text-lg font-semibold mb-3'>Manage Friendship</h3>
					<input
						type='text'
						value={edgeNode1}
						onChange={(e) => setEdgeNode1(e.target.value)}
						placeholder='Person 1'
						className='w-full p-2 border rounded mb-2'
					/>
					<input
						type='text'
						value={edgeNode2}
						onChange={(e) => setEdgeNode2(e.target.value)}
						placeholder='Person 2'
						className='w-full p-2 border rounded mb-2'
					/>
					<div className='space-y-2'>
						<button
							onClick={handleAddEdge}
							className='w-full bg-green-500 text-white py-2 rounded hover:bg-green-600'
						>
							Add Friendship
						</button>
						<button
							onClick={handleDeleteEdge}
							className='w-full bg-red-500 text-white py-2 rounded hover:bg-red-600'
						>
							Remove Friendship
						</button>
					</div>
				</div>

				<div className='mb-8'>
					<h3 className='text-lg font-semibold mb-3'>Graph Traversal</h3>
					<select
						value={traversalType}
						onChange={(e) => setTraversalType(e.target.value)}
						className='w-full p-2 border rounded mb-2'
					>
						<option value='DFS'>Depth First Search</option>
						<option value='BFS'>Breadth First Search</option>
					</select>
					<input
						type='text'
						value={traversalNode}
						onChange={(e) => setTraversalNode(e.target.value)}
						placeholder='Start person'
						className='w-full p-2 border rounded mb-2'
					/>
					<button
						onClick={handleTraversal}
						className='w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600'
					>
						Run Traversal
					</button>
				</div>
			</div>

			<div className='flex-1 p-8'>
				<h1 className='text-3xl font-bold mb-8 text-center'>
					Friendship Network Visualizer
				</h1>
				<div className='bg-white rounded-lg shadow-lg p-4 mb-6 aspect-video'>
					<GraphVisualizer graph={graph} nodePositions={nodePositions} />
				</div>

				{error && (
					<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
						{error}
					</div>
				)}

				{traversalResult.length > 0 && (
					<div className='bg-blue-100 p-4 rounded-lg'>
						<h3 className='font-semibold mb-2'>
							{traversalType} Traversal Result:
						</h3>
						<p className='text-blue-800'>{traversalResult.join(' → ')}</p>
					</div>
				)}
			</div>
		</div>
	);
};
