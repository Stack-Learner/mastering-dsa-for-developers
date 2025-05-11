import { useEffect, useRef } from 'react';

import { useState } from 'react';

interface TrieNode {
	children: Map<string, TrieNode>;
	isEndOfWord: boolean;
	userId?: number;
}

class Trie {
	root: TrieNode;

	constructor() {
		this.root = {
			children: new Map(),
			isEndOfWord: false,
		};
	}

	insert(word: string, userId: number): void {
		let current = this.root;
		for (const char of word.toLowerCase()) {
			if (!current.children.has(char)) {
				current.children.set(char, {
					children: new Map(),
					isEndOfWord: false,
				});
			}
			current = current.children.get(char)!;
		}
		current.isEndOfWord = true;
		current.userId = userId;
	}

	search(prefix: string): Array<{ name: string; id: number }> {
		const results: Array<{ name: string; id: number }> = [];
		let current = this.root;

		// Traverse to the last node of prefix
		for (const char of prefix.toLowerCase()) {
			if (!current.children.has(char)) {
				return results;
			}
			current = current.children.get(char)!;
		}

		// Find all words with the prefix
		this.findAllWords(current, prefix, results);
		return results;
	}

	private findAllWords(
		node: TrieNode,
		prefix: string,
		results: Array<{ name: string; id: number }>
	): void {
		if (node.isEndOfWord && node.userId !== undefined) {
			results.push({
				name: prefix,
				id: node.userId,
			});
		}

		for (const [char, childNode] of node.children) {
			this.findAllWords(childNode, prefix + char, results);
		}
	}
}

const users = [
	{ id: 1, name: 'Alice Johnson' },
	{ id: 2, name: 'Alice Smith' },
	{ id: 3, name: 'Alice Williams' },
	{ id: 4, name: 'Andrew Brown' },
	{ id: 5, name: 'Andrew Davis' },
	{ id: 6, name: 'Benjamin Miller' },
	{ id: 7, name: 'Benjamin Wilson' },
	{ id: 8, name: 'Benjamin Taylor' },
	{ id: 9, name: 'Catherine Anderson' },
	{ id: 10, name: 'Catherine Thomas' },
	{ id: 11, name: 'Daniel Martinez' },
	{ id: 12, name: 'Daniel Garcia' },
	{ id: 13, name: 'Elizabeth Robinson' },
	{ id: 14, name: 'Elizabeth Clark' },
	{ id: 15, name: 'Emily Rodriguez' },
	{ id: 16, name: 'Emily White' },
	{ id: 17, name: 'Emma Lee' },
	{ id: 18, name: 'Emma King' },
	{ id: 19, name: 'Frank Scott' },
	{ id: 20, name: 'Frank Green' },
	{ id: 21, name: 'George Wilson' },
	{ id: 22, name: 'George Brown' },
	{ id: 23, name: 'Hannah Davis' },
	{ id: 24, name: 'Hannah Smith' },
	{ id: 25, name: 'Ian Johnson' },
	{ id: 26, name: 'Ian Williams' },
	{ id: 27, name: 'James Miller' },
	{ id: 28, name: 'James Taylor' },
	{ id: 29, name: 'Katherine Anderson' },
	{ id: 30, name: 'Katherine Thomas' },
	{ id: 31, name: 'Laura Martinez' },
	{ id: 32, name: 'Laura Garcia' },
	{ id: 33, name: 'Michael Robinson' },
	{ id: 34, name: 'Michael Clark' },
	{ id: 35, name: 'Nathan Rodriguez' },
	{ id: 36, name: 'Nathan White' },
	{ id: 37, name: 'Oliver Lee' },
	{ id: 38, name: 'Oliver King' },
	{ id: 39, name: 'Patricia Scott' },
	{ id: 40, name: 'Patricia Green' },
	{ id: 41, name: 'Rachel Wilson' },
	{ id: 42, name: 'Rachel Brown' },
	{ id: 43, name: 'Sarah Davis' },
	{ id: 44, name: 'Sarah Smith' },
	{ id: 45, name: 'Thomas Johnson' },
	{ id: 46, name: 'Thomas Williams' },
	{ id: 47, name: 'Victoria Miller' },
	{ id: 48, name: 'Victoria Taylor' },
	{ id: 49, name: 'William Anderson' },
	{ id: 50, name: 'William Thomas' },
	{ id: 51, name: 'Alexander Martinez' },
	{ id: 52, name: 'Alexander Garcia' },
	{ id: 53, name: 'Benjamin Robinson' },
	{ id: 54, name: 'Benjamin Clark' },
	{ id: 55, name: 'Christopher Rodriguez' },
	{ id: 56, name: 'Christopher White' },
	{ id: 57, name: 'Daniel Lee' },
	{ id: 58, name: 'Daniel King' },
	{ id: 59, name: 'Edward Scott' },
	{ id: 60, name: 'Edward Green' },
	{ id: 61, name: 'Frederick Wilson' },
	{ id: 62, name: 'Frederick Brown' },
	{ id: 63, name: 'Gregory Davis' },
	{ id: 64, name: 'Gregory Smith' },
	{ id: 65, name: 'Henry Johnson' },
	{ id: 66, name: 'Henry Williams' },
	{ id: 67, name: 'Isabella Miller' },
	{ id: 68, name: 'Isabella Taylor' },
	{ id: 69, name: 'Jonathan Anderson' },
	{ id: 70, name: 'Jonathan Thomas' },
	{ id: 71, name: 'Katherine Martinez' },
	{ id: 72, name: 'Katherine Garcia' },
	{ id: 73, name: 'Lawrence Robinson' },
	{ id: 74, name: 'Lawrence Clark' },
	{ id: 75, name: 'Margaret Rodriguez' },
	{ id: 76, name: 'Margaret White' },
	{ id: 77, name: 'Nicholas Lee' },
	{ id: 78, name: 'Nicholas King' },
	{ id: 79, name: 'Olivia Scott' },
	{ id: 80, name: 'Olivia Green' },
	{ id: 81, name: 'Patrick Wilson' },
	{ id: 82, name: 'Patrick Brown' },
	{ id: 83, name: 'Rebecca Davis' },
	{ id: 84, name: 'Rebecca Smith' },
	{ id: 85, name: 'Samuel Johnson' },
	{ id: 86, name: 'Samuel Williams' },
	{ id: 87, name: 'Theodore Miller' },
	{ id: 88, name: 'Theodore Taylor' },
	{ id: 89, name: 'Victoria Anderson' },
	{ id: 90, name: 'Victoria Thomas' },
	{ id: 91, name: 'William Martinez' },
	{ id: 92, name: 'William Garcia' },
	{ id: 93, name: 'Xavier Robinson' },
	{ id: 94, name: 'Xavier Clark' },
	{ id: 95, name: 'Zachary Rodriguez' },
	{ id: 96, name: 'Zachary White' },
	{ id: 97, name: 'Andrew Lee' },
	{ id: 98, name: 'Andrew King' },
	{ id: 99, name: 'Benjamin Scott' },
	{ id: 100, name: 'Benjamin Green' },
];

const AutoSuggest = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState<
		Array<{ name: string; id: number }>
	>([]);
	const [selectedUser, setSelectedUser] = useState<{
		name: string;
		id: number;
	} | null>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const trie = useRef<Trie>(new Trie());

	useEffect(() => {
		// Initialize Trie with user data
		users.forEach((user) => {
			trie.current.insert(user.name, user.id);
		});

		// Click outside handler
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setSuggestions([]);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (value.trim()) {
			const searchResults = trie.current.search(value);
			setSuggestions(searchResults.slice(0, 5)); // Limit to 5 suggestions
		} else {
			setSuggestions([]);
		}
	};

	const handleSelectUser = (user: { name: string; id: number }) => {
		setSelectedUser(user);
		setSearchTerm(user.name);
		setSuggestions([]);
	};

	return (
		<div className='max-w-md mx-auto p-6'>
			<div ref={searchRef} className='relative'>
				<input
					type='text'
					value={searchTerm}
					onChange={handleSearch}
					placeholder='Search users...'
					className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>

				{suggestions.length > 0 && (
					<div className='absolute w-full mt-1 bg-white border rounded-lg shadow-lg z-10'>
						{suggestions.map((user) => (
							<div
								key={user.id}
								onClick={() => handleSelectUser(user)}
								className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
							>
								{user.name}
							</div>
						))}
					</div>
				)}
			</div>

			{selectedUser && (
				<div className='mt-4 p-4 bg-blue-50 rounded-lg'>
					<h3 className='text-lg font-semibold'>Selected User:</h3>
					<p>Name: {selectedUser.name}</p>
					<p>ID: {selectedUser.id}</p>
				</div>
			)}
		</div>
	);
};

export default AutoSuggest;
