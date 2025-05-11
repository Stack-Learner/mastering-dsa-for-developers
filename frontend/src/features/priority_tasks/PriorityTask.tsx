import { useState, useRef } from 'react';

// Priority values mapping
const PRIORITY_VALUES = {
	low: 1,
	medium: 5,
	high: 10,
	urgent: 50,
};

type Priority = keyof typeof PRIORITY_VALUES;

interface Task {
	id: string;
	title: string;
	description: string;
	priority: Priority;
	priorityValue: number;
}

// Heap implementation for priority queue
class PriorityQueue {
	private heap: Task[] = [];

	private getParentIndex(index: number): number {
		return Math.floor((index - 1) / 2);
	}

	private getLeftChildIndex(index: number): number {
		return 2 * index + 1;
	}

	private getRightChildIndex(index: number): number {
		return 2 * index + 2;
	}

	private swap(index1: number, index2: number): void {
		const temp = this.heap[index1];
		this.heap[index1] = this.heap[index2];
		this.heap[index2] = temp;
	}

	private heapifyUp(index: number): void {
		while (index > 0) {
			const parentIndex = this.getParentIndex(index);
			if (
				this.heap[parentIndex].priorityValue >= this.heap[index].priorityValue
			) {
				break;
			}
			this.swap(index, parentIndex);
			index = parentIndex;
		}
	}

	private heapifyDown(index: number): void {
		while (true) {
			let maxIndex = index;
			const leftChild = this.getLeftChildIndex(index);
			const rightChild = this.getRightChildIndex(index);

			if (
				leftChild < this.heap.length &&
				this.heap[leftChild].priorityValue > this.heap[maxIndex].priorityValue
			) {
				maxIndex = leftChild;
			}
			if (
				rightChild < this.heap.length &&
				this.heap[rightChild].priorityValue > this.heap[maxIndex].priorityValue
			) {
				maxIndex = rightChild;
			}

			if (maxIndex === index) break;

			this.swap(index, maxIndex);
			index = maxIndex;
		}
	}

	enqueue(task: Task): void {
		this.heap.push(task);
		this.heapifyUp(this.heap.length - 1);
	}

	dequeue(): Task | undefined {
		if (this.heap.length === 0) return undefined;

		const result = this.heap[0];
		const last = this.heap.pop()!;

		if (this.heap.length > 0) {
			this.heap[0] = last;
			this.heapifyDown(0);
		}

		return result;
	}

	peek(): Task | undefined {
		return this.heap[0];
	}

	get tasks(): Task[] {
		return [...this.heap];
	}
}

export default function PriorityTask() {
	const taskQueueRef = useRef(new PriorityQueue());
	const [tasks, setTasks] = useState<Task[]>([]);
	const [currentTask, setCurrentTask] = useState<Task | null>(null);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		priority: 'low' as Priority,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newTask: Task = {
			id: Date.now().toString(),
			title: formData.title,
			description: formData.description,
			priority: formData.priority,
			priorityValue: PRIORITY_VALUES[formData.priority],
		};

		taskQueueRef.current.enqueue(newTask);
		setTasks(taskQueueRef.current.tasks);
		setFormData({ title: '', description: '', priority: 'low' });
	};

	const handleNextTask = () => {
		if (currentTask) {
			taskQueueRef.current.dequeue();
			setTasks(taskQueueRef.current.tasks);
		}
		const nextTask = taskQueueRef.current.peek();
		setCurrentTask(nextTask || null);
	};

	return (
		<div className='flex h-screen bg-gray-100'>
			{/* Sidebar */}
			<div className='w-80 bg-white p-6 shadow-lg'>
				<h2 className='text-2xl font-bold mb-6 text-gray-800'>Task Queue</h2>
				<div className='space-y-4'>
					{tasks.map((task) => (
						<div
							key={task.id}
							className={`p-4 rounded-xl transition-all duration-200 ${
								currentTask?.id === task.id
									? 'bg-blue-50 border-2 border-blue-500 shadow-md'
									: 'bg-white border border-gray-200 hover:shadow-md'
							}`}
						>
							<h3 className='font-semibold text-gray-800 mb-2'>{task.title}</h3>
							<span
								className={`
                inline-block px-3 py-1 text-xs font-medium rounded-full
                ${
									task.priority === 'urgent'
										? 'bg-red-100 text-red-800'
										: task.priority === 'high'
										? 'bg-orange-100 text-orange-800'
										: task.priority === 'medium'
										? 'bg-yellow-100 text-yellow-800'
										: 'bg-green-100 text-green-800'
								}
              `}
							>
								{task.priority}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Main Content */}
			<div className='flex-1 p-8 bg-gray-50'>
				<div className='max-w-2xl mx-auto'>
					{/* Current Task */}
					<div className='bg-white p-8 rounded-2xl shadow-lg mb-8'>
						<h2 className='text-2xl font-bold mb-6 text-gray-800'>
							Current Task
						</h2>
						{currentTask ? (
							<div className='space-y-6'>
								<h3 className='text-xl font-semibold text-gray-800'>
									{currentTask.title}
								</h3>
								<p className='text-gray-600 leading-relaxed'>
									{currentTask.description}
								</p>
								<div className='flex items-center justify-between'>
									<span
										className={`
                    inline-block px-4 py-2 rounded-full text-sm font-medium
                    ${
											currentTask.priority === 'urgent'
												? 'bg-red-100 text-red-800'
												: currentTask.priority === 'high'
												? 'bg-orange-100 text-orange-800'
												: currentTask.priority === 'medium'
												? 'bg-yellow-100 text-yellow-800'
												: 'bg-green-100 text-green-800'
										}
                  `}
									>
										{currentTask.priority}
									</span>
									<button
										onClick={handleNextTask}
										className='bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-200'
									>
										Complete & Next Task
									</button>
								</div>
							</div>
						) : (
							<div className='text-center py-12'>
								<p className='text-gray-500 mb-6'>No task selected</p>
								<button
									onClick={handleNextTask}
									className='bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200'
								>
									Start Next Task
								</button>
							</div>
						)}
					</div>

					{/* Task Form */}
					<div className='bg-white p-6 rounded-2xl shadow-lg'>
						<h2 className='text-xl font-bold mb-4 text-gray-800'>
							Create New Task
						</h2>
						<form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
							<div className='col-span-1'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Title
								</label>
								<input
									type='text'
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
									placeholder='Enter task title'
									required
								/>
							</div>
							<div className='col-span-1'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Priority
								</label>
								<select
									value={formData.priority}
									onChange={(e) =>
										setFormData({
											...formData,
											priority: e.target.value as Priority,
										})
									}
									className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
								>
									{Object.keys(PRIORITY_VALUES).map((priority) => (
										<option key={priority} value={priority}>
											{priority.charAt(0).toUpperCase() + priority.slice(1)}
										</option>
									))}
								</select>
							</div>
							<div className='col-span-2'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Description
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									className='w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200'
									rows={2}
									placeholder='Enter task description'
								/>
							</div>
							<div className='col-span-2'>
								<button
									type='submit'
									className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200'
								>
									Add Task
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
