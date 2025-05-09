import { faker } from '@faker-js/faker';
import { useState } from 'react';

interface User {
	id: number;
	name: string;
	email: string;
	phone: string;
	address: string;
	company: string;
	jobTitle: string;
}

// Generate 1000 random users
const users: User[] = Array.from({ length: 1000 }, (_, i) => ({
	id: i + 1,
	name: faker.person.fullName(),
	email: faker.internet.email(),
	phone: faker.phone.number(),
	address: faker.location.streetAddress(),
	company: faker.company.name(),
	jobTitle: faker.person.jobTitle(),
}));

// Trie node class
class TrieNode {
	children: Map<string, TrieNode>;
	isEndOfWord: boolean;
	userIds: Set<number>; // Store only IDs instead of full user objects

	constructor() {
		this.children = new Map();
		this.isEndOfWord = false;
		this.userIds = new Set();
	}
}

// Trie class for text search
class UserTrie {
	root: TrieNode;
	users: Map<number, User>; // Store users separately

	constructor() {
		this.root = new TrieNode();
		this.users = new Map();
	}

	insert(user: User): void {
		// Store user in the map
		this.users.set(user.id, user);

		// Insert into name trie
		this.insertWord(user.name.toLowerCase(), user.id);
		// Insert into email trie
		this.insertWord(user.email.toLowerCase(), user.id);
	}

	private insertWord(word: string, userId: number): void {
		let current = this.root;

		for (const char of word) {
			if (!current.children.has(char)) {
				current.children.set(char, new TrieNode());
			}
			current = current.children.get(char)!;
			current.userIds.add(userId);
		}
		current.isEndOfWord = true;
	}

	search(prefix: string): { users: User[]; count: number } {
		let searchCount = 0;
		let current = this.root;
		prefix = prefix.toLowerCase();

		// Traverse to the last node of prefix
		for (const char of prefix) {
			searchCount++;
			if (!current.children.has(char)) {
				return { users: [], count: searchCount };
			}
			current = current.children.get(char)!;
		}

		// Get users from the found node
		const userIds = Array.from(current.userIds);
		const users = userIds.map((id) => this.users.get(id)!);

		return {
			users: users,
			count: searchCount,
		};
	}
}

// Create and populate Trie
const trie = new UserTrie();

users.forEach((user) => {
	trie.insert(user);
});

console.log(trie.root);

export default function SearchUsingTrie() {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [searchCount, setSearchCount] = useState(0);

	const handleSearch = (value: string) => {
		value = value.trim().toLowerCase();
		if (!value) {
			setSearchResults([]);
			setSearchCount(0);
			return;
		}

		const { users: results, count } = trie.search(value);
		setSearchResults(results);
		setSearchCount(count);
	};

	return (
		<div className='p-4'>
			<div className='mb-4 space-y-2'>
				<div>
					<input
						type='text'
						placeholder='Search by Name or Email'
						value={searchQuery}
						onChange={(e) => {
							setSearchQuery(e.target.value);
							handleSearch(e.target.value);
						}}
						className='border p-2 rounded'
					/>
				</div>
				<div>Search operations performed: {searchCount}</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full border'>
					<thead>
						<tr className='bg-gray-100'>
							<th className='border p-2'>ID</th>
							<th className='border p-2'>Name</th>
							<th className='border p-2'>Email</th>
							<th className='border p-2'>Phone</th>
							<th className='border p-2'>Address</th>
							<th className='border p-2'>Company</th>
							<th className='border p-2'>Job Title</th>
						</tr>
					</thead>
					<tbody>
						{searchQuery.trim() === '' ? (
							users.slice(0, 10).map((user) => (
								<tr key={user.id}>
									<td className='border p-2'>{user.id}</td>
									<td className='border p-2'>{user.name}</td>
									<td className='border p-2'>{user.email}</td>
									<td className='border p-2'>{user.phone}</td>
									<td className='border p-2'>{user.address}</td>
									<td className='border p-2'>{user.company}</td>
									<td className='border p-2'>{user.jobTitle}</td>
								</tr>
							))
						) : searchResults.length > 0 ? (
							searchResults.map((user) => (
								<tr key={user.id}>
									<td className='border p-2'>{user.id}</td>
									<td className='border p-2'>{user.name}</td>
									<td className='border p-2'>{user.email}</td>
									<td className='border p-2'>{user.phone}</td>
									<td className='border p-2'>{user.address}</td>
									<td className='border p-2'>{user.company}</td>
									<td className='border p-2'>{user.jobTitle}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={7} className='border p-2 text-center'>
									No results found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
