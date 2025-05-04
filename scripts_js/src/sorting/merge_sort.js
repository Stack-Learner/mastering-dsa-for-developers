function mergeSort(arr) {
	if (arr.length <= 1) return arr;

	const mid = Math.floor(arr.length / 2);
	const left = mergeSort(arr.slice(0, mid));
	const right = mergeSort(arr.slice(mid));

	const result = merge(left, right);
	return result;
}

function merge(left = [], right = []) {
	const result = [];
	let i = 0;
	let j = 0;

	while (i < left.length && j < right.length) {
		if (left[i] < right[j]) {
			result.push(left[i]);
			i++;
		} else {
			result.push(right[j]);
			j++;
		}
	}

	return result.concat(left.slice(i)).concat(right.slice(j));
}

console.log(mergeSort([5, 1, 3, 2, 9, 7, 8, 6, 4]));

function mergeSortGood(arr = [], low = 0, high = arr.length - 1) {
	if (low === high) return [arr[low]];

	const mid = Math.floor((low + high) / 2);
	const left = mergeSortGood(arr, low, mid);
	const right = mergeSortGood(arr, mid + 1, high);

	const result = mergeGood(left, right);
	return result;
}

function mergeGood(left = [], right = []) {
	const result = [];
	let i = 0;
	let j = 0;

	while (i < left.length && j < right.length) {
		if (left[i] < right[j]) {
			result.push(left[i]);
			i++;
		} else {
			result.push(right[j]);
			j++;
		}
	}

	while (i < left.length) {
		result.push(left[i++]);
	}

	while (j < right.length) {
		result.push(right[j++]);
	}

	return result;
}

console.log(mergeSortGood([5, 1, 3, 2, 9, 7, 8, 6, 4]));
