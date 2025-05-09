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

// BST Node class
class UserNode {
	user: User;
	left: UserNode | null;
	right: UserNode | null;

	constructor(user: User) {
		this.user = user;
		this.left = null;
		this.right = null;
	}
}

interface SearchResult {
	result: User | null;
	count: number;
}

interface FieldSearchResult {
	user: User;
	count: number;
}

// BST class
class UserBST {
	root: UserNode | null;

	constructor() {
		this.root = null;
	}

	insert(user: User): void {
		const insertNode = (node: UserNode | null): UserNode => {
			if (!node) {
				return new UserNode(user);
			}

			if (user.id < node.user.id) {
				node.left = insertNode(node.left);
			} else {
				node.right = insertNode(node.right);
			}

			return node;
		};

		if (!this.root) {
			this.root = new UserNode(user);
			return;
		}

		this.root = insertNode(this.root);
	}

	search(id: number): SearchResult {
		let searchCount = 0;
		const searchNode = (node: UserNode | null): SearchResult => {
			if (!node) return { result: null, count: searchCount };
			searchCount++;

			if (id === node.user.id) return { result: node.user, count: searchCount };

			if (id < node.user.id) {
				return searchNode(node.left);
			} else {
				return searchNode(node.right);
			}
		};

		return searchNode(this.root);
	}

	searchByField(value: string, field: keyof User): FieldSearchResult[] {
		let searchCount = 0;
		const results: FieldSearchResult[] = [];

		const searchNode = (node: UserNode | null): void => {
			if (!node) return;
			searchCount++;

			if (
				node.user[field].toString().toLowerCase().includes(value.toLowerCase())
			) {
				results.push({ user: node.user, count: searchCount });
			}

			// Need to search both subtrees since this is not the primary BST ordering
			searchNode(node.left);
			searchNode(node.right);
		};

		searchNode(this.root);
		return results;
	}
}

// Create and populate BST with users
const userBST = new UserBST();
users.sort(() => Math.random() - 0.5); // Shuffle users before inserting
users.forEach((user) => userBST.insert(user));

export default function SearchUsingTree() {
	const [searchId, setSearchId] = useState('');
	const [searchName, setSearchName] = useState('');
	const [searchEmail, setSearchEmail] = useState('');
	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [searchCount, setSearchCount] = useState(0);

	const handleSearch = (type: 'id' | 'name' | 'email', value: string) => {
		if (!value.trim()) {
			setSearchResults([]);
			setSearchCount(0);
			return;
		}

		if (type === 'id') {
			const { result, count } = userBST.search(parseInt(value));
			setSearchResults(result ? [result] : []);
			setSearchCount(count);
		} else {
			const results = userBST.searchByField(value, type);
			setSearchResults(results.map((r) => r.user));
			setSearchCount(results.length > 0 ? results[0].count : 0);
		}
	};

	return (
		<div className='p-4'>
			<div className='mb-4 space-y-2'>
				<div>
					<input
						type='number'
						placeholder='Search by ID'
						value={searchId}
						onChange={(e) => {
							setSearchId(e.target.value);
							handleSearch('id', e.target.value);
						}}
						className='border p-2 rounded mr-2'
					/>
					<input
						type='text'
						placeholder='Search by Name'
						value={searchName}
						onChange={(e) => {
							setSearchName(e.target.value);
							handleSearch('name', e.target.value);
						}}
						className='border p-2 rounded mr-2'
					/>
					<input
						type='text'
						placeholder='Search by Email'
						value={searchEmail}
						onChange={(e) => {
							setSearchEmail(e.target.value);
							handleSearch('email', e.target.value);
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
						{(searchResults.length > 0
							? searchResults
							: users.slice(0, 10)
						).map((user) => (
							<tr key={user.id}>
								<td className='border p-2'>{user.id}</td>
								<td className='border p-2'>{user.name}</td>
								<td className='border p-2'>{user.email}</td>
								<td className='border p-2'>{user.phone}</td>
								<td className='border p-2'>{user.address}</td>
								<td className='border p-2'>{user.company}</td>
								<td className='border p-2'>{user.jobTitle}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
