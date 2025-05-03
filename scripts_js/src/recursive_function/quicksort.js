function partition(arr, low, high) {
	let pivot = arr[high];
	let i = low - 1;

	for (let j = low; j < high; j++) {
		if (arr[j] < pivot) {
			i++;
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
	}

	[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
	return i + 1;
}

function quickSort(arr, low = 0, high = arr.length - 1) {
	if (low >= high) return;

	const pivot = partition(arr, low, high);
	console.log('Pivot', pivot);
	console.log('Left Array', arr.slice(0, pivot));
	console.log('Right Array', arr.slice(pivot + 1));
	quickSort(arr, low, pivot - 1);
	quickSort(arr, pivot + 1, high);

	return arr;
}

const data = [10, 7, 8, 9, 1, 5];
console.log('Before');
console.log(data);
quickSort(data);
console.log('After');
console.log(data);
