class Heap {
	constructor(isMinHeap = false, size = 100) {
		this.heap = new Array(size + 1).fill(null);
		this.size = size;
		this.nodeCount = 0;
		this.isMinHeap = isMinHeap;
	}

	insert(value) {
		if (this.nodeCount >= this.size) {
			throw new Error('Heap is full');
		}

		// Add value to the next available position
		this.nodeCount++;
		this.heap[this.nodeCount] = value;

		// Bubble up the value to its correct position
		this.#bubbleUp(this.nodeCount);
	}

	getHeap() {
		return this.heap.slice(1, this.nodeCount + 1);
	}

	extract() {
		if (this.nodeCount === 0) {
			throw new Error('Heap is Empty');
		}

		// Store the root value
		const root = this.heap[1];

		// Replace the root with the last element
		this.heap[1] = this.heap[this.nodeCount];
		this.heap[this.nodeCount] = root; // TODO: We will get back to here
		this.nodeCount--;

		// Bubble down the root to its correct position
		if (this.nodeCount > 1) {
			this.#bubbleDown(1);
		}

		return root;
	}

	getSize() {
		return this.nodeCount;
	}

	buildHeap(array) {
		if (array.length > this.size) {
			throw new Error('Array is too large');
		}

		this.nodeCount = array.length;
		for (let i = 0; i < array.length; i++) {
			this.heap[i + 1] = array[i];
		}

		for (let i = Math.floor(this.nodeCount / 2); i >= 1; i--) {
			this.#bubbleDown(i);
		}
	}

	sort() {
		let index = 0;
		for (let i = this.nodeCount; i > 0; i--) {
			this.extract();
			index++;
		}
		console.log(index);
		return this.heap.slice(1, index + 1);
	}

	#bubbleUp(index) {
		while (index > 1) {
			const parentIndex = Math.floor(index / 2);

			// check if the current node is out of order
			const shouldSwap = this.isMinHeap
				? this.heap[index] < this.heap[parentIndex]
				: this.heap[index] > this.heap[parentIndex];

			if (!shouldSwap) break;

			[this.heap[index], this.heap[parentIndex]] = [
				this.heap[parentIndex],
				this.heap[index],
			];

			index = parentIndex;
		}
	}

	#bubbleDown(index) {
		while (true) {
			let target = index;
			const leftChild = index * 2;
			const rightChild = index * 2 + 1;

			// Compare with left child
			if (leftChild <= this.nodeCount) {
				const shouldSwap = this.isMinHeap
					? this.heap[leftChild] < this.heap[target]
					: this.heap[leftChild] > this.heap[target];

				if (shouldSwap) {
					target = leftChild;
				}
			}

			// Compare with right child
			if (rightChild <= this.nodeCount) {
				const shouldSwap = this.isMinHeap
					? this.heap[rightChild] < this.heap[target]
					: this.heap[rightChild] > this.heap[target];

				if (shouldSwap) {
					target = rightChild;
				}
			}

			if (target === index) break;

			[this.heap[index], this.heap[target]] = [
				this.heap[target],
				this.heap[index],
			];

			index = target;
		}
	}
}

const array = [5, 30, 2, 6, 34, 22, 500, 20, 10, 7, 3, 15, 20];
const heap = new Heap(false, array.length);
heap.buildHeap(array);
console.log(heap.sort());
