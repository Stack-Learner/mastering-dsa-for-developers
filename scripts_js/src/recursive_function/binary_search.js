// We should not use slice on array inside a recursive function
function binarySearch(arr = [], target) {
	if (arr.length === 0) return -1;

	const mid = Math.floor(arr.length / 2);
	if (arr[mid] === target) return mid;

	if (arr[mid] < target) {
		return binarySearch(arr.slice(mid + 1), target);
	}

	return binarySearch(arr.slice(0, mid), target);
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// console.log(binarySearch(data, 10));

// Binary Search Correct Way
function binarySearch2(arr = [], low = 0, high = arr.length - 1, target) {
	if (low > high) return -1;

	const mid = Math.floor((low + high) / 2);
	if (arr[mid] === target) return mid;

	if (arr[mid] < target) {
		return binarySearch2(arr, mid + 1, high, target);
	}

	return binarySearch2(arr, low, mid - 1, target);
}

console.log(binarySearch2(data, 0, data.length - 1, 7));
