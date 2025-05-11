import { useState, useEffect, useRef } from 'react';
import { Network, Options } from 'vis-network';
import { DataSet } from 'vis-data';

interface Node {
	id: number;
	label: string;
	color: string;
	fixed?: boolean;
}

interface Edge {
	id: string;
	from: number;
	to: number;
	color?: string;
	width?: number;
}

const GraphDemo = () => {
	const [nodes, setNodes] = useState<Node[]>([
		{ id: 1, label: 'Gulshan', color: '#EF4444' },
		{ id: 2, label: 'Banani', color: '#EF4444' },
		{ id: 3, label: 'Dhanmondi', color: '#EF4444' },
		{ id: 4, label: 'Motijheel', color: '#EF4444' },
		{ id: 5, label: 'Uttara', color: '#EF4444' },
		{ id: 6, label: 'Mirpur', color: '#EF4444' },
	]);

	const [edges, setEdges] = useState<Edge[]>([
		{ from: 1, to: 2, id: 'e1' },
		{ from: 1, to: 3, id: 'e2' },
		{ from: 2, to: 4, id: 'e3' },
		{ from: 3, to: 4, id: 'e4' },
		{ from: 4, to: 5, id: 'e5' },
		{ from: 5, to: 6, id: 'e6' },
		{ from: 2, to: 5, id: 'e7' },
	]);

	const [startStation, setStartStation] = useState('');
	const [endStation, setEndStation] = useState('');
	const [path, setPath] = useState<string[]>([]);
	const [newLocation, setNewLocation] = useState('');
	const [connectFrom, setConnectFrom] = useState('');
	const [connectTo, setConnectTo] = useState('');
	const graphRef = useRef<HTMLDivElement>(null);
	const networkRef = useRef<Network | null>(null);
	const nodesDataSet = useRef<DataSet<Node> | null>(null);
	const edgesDataSet = useRef<DataSet<Edge> | null>(null);

	useEffect(() => {
		if (graphRef.current && !networkRef.current) {
			nodesDataSet.current = new DataSet<Node>(nodes);
			edgesDataSet.current = new DataSet<Edge>(edges);

			const data = {
				nodes: nodesDataSet.current,
				edges: edgesDataSet.current,
			};

			const options: Options = {
				nodes: {
					shape: 'dot',
					size: 20,
					font: { size: 14 },
				},
				edges: {
					color: '#1F2937',
					width: 2,
				},
				physics: { enabled: false },
				height: '100%',
				width: '100%',
				manipulation: {
					enabled: true,
				},
				interaction: {
					zoomView: true,
					minZoom: 0.5,
					maxZoom: 2,
				},
			};

			networkRef.current = new Network(graphRef.current, data, options);
		}
	}, []);

	const findShortestPath = (startId: number, endId: number): number[] => {
		if (!startId || !endId || startId === endId) return [];

		const queue: number[][] = [[startId]];
		const visited = new Set<number>();
		const edgeMap = new Map<number, number[]>();

		edges.forEach((edge) => {
			if (!edgeMap.has(edge.from)) edgeMap.set(edge.from, []);
			if (!edgeMap.has(edge.to)) edgeMap.set(edge.to, []);
			edgeMap.get(edge.from)?.push(edge.to);
			edgeMap.get(edge.to)?.push(edge.from);
		});

		while (queue.length > 0) {
			const path = queue.shift()!;
			const node = path[path.length - 1];

			if (node === endId) {
				return path;
			}

			if (!visited.has(node)) {
				visited.add(node);
				const neighbors = edgeMap.get(node) || [];
				neighbors.forEach((neighbor) => {
					if (!visited.has(neighbor)) {
						queue.push([...path, neighbor]);
					}
				});
			}
		}
		return [];
	};

	const handleAddLocation = () => {
		if (newLocation.trim()) {
			const newId = Math.max(...nodes.map((n) => n.id)) + 1;
			const newNode: Node = { id: newId, label: newLocation, color: '#EF4444' };
			setNodes([...nodes, newNode]);
			nodesDataSet.current?.add(newNode);
			setNewLocation('');
		}
	};

	const handleConnectLocations = () => {
		if (connectFrom && connectTo) {
			const fromNode = nodes.find((n) => n.label === connectFrom);
			const toNode = nodes.find((n) => n.label === connectTo);

			if (fromNode && toNode) {
				const newEdgeId = `e${
					Math.max(...edges.map((e) => parseInt(e.id.slice(1)))) + 1
				}`;
				const newEdge: Edge = {
					from: fromNode.id,
					to: toNode.id,
					id: newEdgeId,
				};
				setEdges([...edges, newEdge]);
				edgesDataSet.current?.add(newEdge);
			}

			setConnectFrom('');
			setConnectTo('');
		}
	};

	const handleFindPath = () => {
		const startNode = nodes.find((node) => node.label === startStation);
		const endNode = nodes.find((node) => node.label === endStation);

		if (startNode && endNode) {
			const pathIds = findShortestPath(startNode.id, endNode.id);
			const pathLabels = pathIds.map(
				(id) => nodes.find((node) => node.id === id)!.label
			);
			setPath(pathLabels);

			const updatedNodes = nodes.map((node) => ({
				...node,
				color: '#EF4444',
			}));

			const updatedEdges = edges.map((edge) => ({
				...edge,
				color: '#1F2937',
				width: 2,
			}));

			pathIds.forEach((id) => {
				const node = updatedNodes.find((n) => n.id === id);
				if (node) node.color = '#10B981';
			});

			for (let i = 0; i < pathIds.length - 1; i++) {
				const from = pathIds[i];
				const to = pathIds[i + 1];
				const edge = updatedEdges.find(
					(e) =>
						(e.from === from && e.to === to) || (e.from === to && e.to === from)
				);
				if (edge) {
					edge.color = '#10B981';
					edge.width = 4;
				}
			}

			nodesDataSet.current?.update(updatedNodes);
			edgesDataSet.current?.update(updatedEdges);
		} else {
			setPath([]);
		}
	};

	const handleClearSelection = () => {
		const updatedNodes = nodes.map((node) => ({
			...node,
			color: '#EF4444',
		}));

		const updatedEdges = edges.map((edge) => ({
			...edge,
			color: '#1F2937',
			width: 2,
		}));

		nodesDataSet.current?.update(updatedNodes);
		edgesDataSet.current?.update(updatedEdges);
		setPath([]);
		setStartStation('');
		setEndStation('');
	};

	const handleRearrange = () => {
		if (networkRef.current) {
			networkRef.current.setOptions({
				physics: { enabled: true },
			});
			setTimeout(() => {
				networkRef.current?.setOptions({
					physics: { enabled: false },
				});
			}, 1000);
		}
	};

	return (
		<div className='flex h-screen'>
			{/* Left Sidebar */}
			<div className='w-1/4 bg-white p-6 border-r border-gray-200 overflow-y-auto'>
				<h2 className='text-2xl font-bold mb-6'>Network Management</h2>

				{/* Add Location Section */}
				<div className='mb-8'>
					<h3 className='font-semibold mb-3'>Add New Location</h3>
					<div className='space-y-2'>
						<input
							type='text'
							value={newLocation}
							onChange={(e) => setNewLocation(e.target.value)}
							placeholder='New Location Name'
							className='p-2 border rounded-lg w-full'
						/>
						<button
							onClick={handleAddLocation}
							className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full'
						>
							Add Location
						</button>
					</div>
				</div>

				{/* Connect Locations Section */}
				<div className='mb-8'>
					<h3 className='font-semibold mb-3'>Connect Locations</h3>
					<div className='space-y-2'>
						<select
							value={connectFrom}
							onChange={(e) => setConnectFrom(e.target.value)}
							className='p-2 border rounded-lg w-full'
						>
							<option value=''>Select First Location</option>
							{nodes.map((node) => (
								<option key={node.id} value={node.label}>
									{node.label}
								</option>
							))}
						</select>
						<select
							value={connectTo}
							onChange={(e) => setConnectTo(e.target.value)}
							className='p-2 border rounded-lg w-full'
						>
							<option value=''>Select Second Location</option>
							{nodes.map((node) => (
								<option key={node.id} value={node.label}>
									{node.label}
								</option>
							))}
						</select>
						<button
							onClick={handleConnectLocations}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full'
						>
							Connect
						</button>
					</div>
				</div>

				{/* Find Path Section */}
				<div className='mb-8'>
					<h3 className='font-semibold mb-3'>Find Shortest Path</h3>
					<div className='space-y-2'>
						<select
							value={startStation}
							onChange={(e) => setStartStation(e.target.value)}
							className='p-2 border rounded-lg w-full'
						>
							<option value=''>Select Start Station</option>
							{nodes.map((node) => (
								<option key={node.id} value={node.label}>
									{node.label}
								</option>
							))}
						</select>
						<select
							value={endStation}
							onChange={(e) => setEndStation(e.target.value)}
							className='p-2 border rounded-lg w-full'
						>
							<option value=''>Select End Station</option>
							{nodes.map((node) => (
								<option key={node.id} value={node.label}>
									{node.label}
								</option>
							))}
						</select>
						<button
							onClick={handleFindPath}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full'
						>
							Find Path
						</button>
						<button
							onClick={handleClearSelection}
							className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-full'
						>
							Clear Selection
						</button>
					</div>

					{path.length > 0 && (
						<div className='mt-4 bg-green-50 p-4 rounded-lg'>
							<h4 className='text-sm font-semibold text-green-800'>
								Shortest Path:
							</h4>
							<p className='text-green-700'>{path.join(' → ')}</p>
						</div>
					)}

					{startStation && endStation && path.length === 0 && (
						<div className='mt-4 bg-red-50 p-4 rounded-lg'>
							<p className='text-red-700'>
								No path exists between {startStation} and {endStation}.
							</p>
						</div>
					)}
				</div>

				<button
					onClick={handleRearrange}
					className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 w-full'
				>
					Rearrange Network
				</button>
			</div>

			{/* Main Content */}
			<div className='w-3/4 h-full p-6'>
				<div
					ref={graphRef}
					className='w-full h-full border border-gray-300 rounded-lg'
				></div>
			</div>
		</div>
	);
};

export default GraphDemo;
