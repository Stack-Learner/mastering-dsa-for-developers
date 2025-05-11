/**
1. **Build a Max Heap** from the input array.
2. The largest element is now at the root (index 0).
3. **Swap** the root with the last element and shrink the heap size by 1.
4. **Heapify** the root to maintain the max-heap property.
5. Repeat steps 3–4 until the heap size is 1.
 */

function heapSort(arr) {
	const n = arr.length;

	// Build a max heap
	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		heapify(arr, n, i);
	}

	// Extract all elements 1 by 1 and heapify
	for (let i = n - 1; i > 0; i--) {
		// 5, 3, 2, 1
		// 1, 4, 2, 5
		[arr[0], arr[i]] = [arr[i], arr[0]];
		heapify(arr, i, 0);
	}

	return arr;
}

function heapify(arr, heapSize, rootIndex) {
	let largest = rootIndex;
	const left = 2 * rootIndex + 1;
	const right = 2 * rootIndex + 2;

	// If left child is larger than root
	if (left < heapSize && arr[left] > arr[largest]) {
		largest = left;
	}

	// If right child is larger than root
	if (right < heapSize && arr[right] > arr[largest]) {
		largest = right;
	}

	if (largest !== rootIndex) {
		[arr[rootIndex], arr[largest]] = [arr[largest], arr[rootIndex]];
		heapify(arr, heapSize, largest);
	}
}

const arr = [12, 11, 14, 13, 5, 16, 20, 3, 4, 5, 7];
console.log(heapSort(arr));
