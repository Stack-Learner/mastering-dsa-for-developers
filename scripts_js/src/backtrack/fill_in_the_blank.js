const dictionary = ['hello', 'world', 'backtrack', 'javascript', 'algorithm'];

// Find a random word from the given dictionary
function getRandomWord(dictionary) {
	const index = Math.floor(Math.random() * dictionary.length);
	return dictionary[index];
}
function createBlanks(word = '', numOfBlanks) {
	const positions = new Set();

	// Find random positions
	while (positions.size < numOfBlanks) {
		const index = Math.floor(Math.random() * word.length);
		positions.add(index);
	}

	// Create blanks
	const blankedWord = word.split('');
	positions.forEach((pos) => {
		blankedWord[pos] = '_';
	});

	return blankedWord;
}

const originalWord = getRandomWord(dictionary);
const numOfBlanks = 3;
const blankedWord = createBlanks(originalWord, numOfBlanks);

console.log('Original Word', originalWord);
console.log('Blanked Word', blankedWord.join(''));
console.log('--------------------------------\n');

const blankedPositions = [];
blankedWord.forEach((char, index) => {
	if (char === '_') {
		blankedPositions.push(index);
	}
});

function findSolution(currentWord = [], blankIndex = 0) {
	// Base case
	if (blankIndex === blankedPositions.length) {
		if (currentWord.join('') === originalWord) {
			console.log('Solution Found', currentWord.join(''));
			return true;
		}
		return false;
	}

	// Recursive case
	const pos = blankedPositions[blankIndex];
	for (let charCode = 97; charCode <= 122; charCode++) {
		const letter = String.fromCharCode(charCode);
		currentWord[pos] = letter;
		if (findSolution(currentWord, blankIndex + 1)) {
			return true;
		}
		currentWord[pos] = '_';
	}
	return false;
}

findSolution([...blankedWord], 0);
