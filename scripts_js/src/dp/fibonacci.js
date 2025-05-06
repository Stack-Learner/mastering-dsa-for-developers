let operations = 0;

function fib(n) {
	if (n <= 1) return n;
	operations++;
	return fib(n - 1) + fib(n - 2);
}

let operationsMemo = 0;
function fibMemo(n, memo = {}) {
	if (n <= 1) return n;
	if (n in memo) return memo[n];

	operationsMemo++;

	const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
	memo[n] = result;

	return result;
}

function fibTab(n) {
	if (n <= 1) return n;
	const table = new Array(n + 1).fill(0);
	table[1] = 1;

	for (let i = 2; i <= n; i++) {
		table[i] = table[i - 1] + table[i - 2];
	}

	return table[n];
}

console.log(fibTab(1000));

function fibTabOpt(n) {
	if (n <= 1) return n;
	let prev = 0;
	let cur = 1;

	for (let i = 2; i <= n; i++) {
		const next = prev + cur;
		prev = cur;
		cur = next;
	}

	return cur;
}

console.log(fibTabOpt(1000));
