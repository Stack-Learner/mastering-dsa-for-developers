function combination(choices = [], path = [], result = []) {
	if (choices.length === path.length) {
		result.push([...path]);
		return;
	}

	for (let i = 0; i < choices.length; i++) {
		if (path.includes(choices[i])) continue;

		path.push(choices[i]);
		combination(choices, path, result);
		path.pop();
	}
}

const result = [];

combination(['A', 'B', 'C'], [], result);

console.log('result', result);

/**
 * Choices: A, B
 * A -> ??
 *  recursive()
 * B -> ??
 *  recursive()
 */
