function countPathRecursive(m, n) {
	let operations = 0;
	function count(i, j) {
		if (i === 0 && j === 0) return 1;
		if (i < 0 || j < 0) return 0;

		operations++;
		return count(i - 1, j) + count(i, j - 1);
	}

	const result = count(m - 1, n - 1);
	console.log('Operations', operations);
	return result;
}
// console.log(countPathRecursive(50, 50));

function countPathTopDown(m, n) {
	const memo = new Map();
	let operations = 0;

	function count(i, j) {
		if (i === 0 && j === 0) return 1;
		if (i < 0 || j < 0) return 0;

		const key = `${i}-${j}`;
		if (memo.has(key)) return memo.get(key);

		operations++;
		const result = count(i - 1, j) + count(i, j - 1);
		memo.set(key, result);
		return result;
	}

	const result = count(m - 1, n - 1);
	console.log('Operations', operations);
	return result;
}
console.log('\n\nTop Down');
console.log(countPathTopDown(100, 100));

function countPathBottomUp(m, n) {
	const dp = new Array(m).fill(0).map(() => Array(n).fill(0));
	for (let i = 0; i < m; i++) {
		for (let j = 0; j < n; j++) {
			if (i === 0 || j === 0) {
				dp[i][j] = 1;
			} else {
				dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
			}
		}
	}
	return dp[m - 1][n - 1];
}

console.log(countPathBottomUp(100, 100));
