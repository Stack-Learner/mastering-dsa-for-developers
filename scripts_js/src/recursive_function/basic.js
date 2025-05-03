function countDown(n) {
	if (n === 0) return;
	countDown(n - 1);
	console.log(n);
}

// countDown(5);

function sumOfArray(arr = [], start = 0) {
	if (start === arr.length) return 0;

	return arr[start] + sumOfArray(arr, start + 1);
}

// console.log(sumOfArray([1, 2, 3, 4, 5]));

function printDigits(n, arr = []) {
	if (n < 10) {
		arr.push(n);
		return arr;
	}

	arr.push(n % 10);
	return printDigits(Math.floor(n / 10), arr);
}

// 1234 = 1 2 3 4
// 1234 % 10 = 4
// 123 % 10 = 3
// 12 % 10 = 2
// 1 % 10 = 1

console.log(printDigits(1234).sort((a, b) => a - b));

function factorial(n) {
	if (n === 0) return 1;
	return n * factorial(n - 1);
}

// 0 1 1 2 3 5 8
// 0 1 2 3 4 5 6

function fib(n) {
	if (n <= 1) return n;
	return fib(n - 1) + fib(n - 2);
}

console.time('fib');
console.log(fib(5));
console.timeEnd('fib');

function recursiveMap(arr = [], index = 0, result = [], cb) {
	if (index === arr.length) return result;
	const cbResult = cb(arr[index], index, arr);
	result.push(cbResult);

	return recursiveMap(arr, index + 1, result, cb);
}

const data = [1, 2, 3, 4, 5];
const mappedData = [];
recursiveMap(data, 0, mappedData, (item) => item * 2);
console.log(mappedData);
