import React, { useState, useEffect } from 'react';

// Types
type Attribute = {
	name: string;
	values: string[];
};

type Variation = {
	combination: { [key: string]: string };
	stock: number;
};

// Logic for generating variations using backtracking
const generateVariations = (
	attributes: Attribute[]
): { [key: string]: string }[] => {
	const variations: { [key: string]: string }[] = [];
	const currentCombination: { [key: string]: string } = {};

	const backtrack = (index: number) => {
		if (index === attributes.length) {
			variations.push({ ...currentCombination });
			return;
		}

		const currentAttribute = attributes[index];
		for (const value of currentAttribute.values) {
			currentCombination[currentAttribute.name] = value;
			backtrack(index + 1);
		}
	};

	backtrack(0);
	return variations;
};

// Main Component
const ProductVariation: React.FC = () => {
	const [attributes, setAttributes] = useState<Attribute[]>([]);
	const [newAttributeName, setNewAttributeName] = useState('');
	const [newAttributeValues, setNewAttributeValues] = useState('');
	const [variations, setVariations] = useState<Variation[]>([]);

	useEffect(() => {
		const generatedVariations = generateVariations(attributes).map(
			(combination) => ({
				combination,
				stock: 0,
			})
		);
		setVariations(generatedVariations);
	}, [attributes]);

	const handleAddAttribute = () => {
		if (newAttributeName && newAttributeValues) {
			setAttributes([
				...attributes,
				{
					name: newAttributeName,
					values: newAttributeValues.split(',').map((v) => v.trim()),
				},
			]);
			setNewAttributeName('');
			setNewAttributeValues('');
		}
	};

	const handleStockUpdate = (index: number, newStock: number) => {
		const updatedVariations = [...variations];
		updatedVariations[index].stock = newStock;
		setVariations(updatedVariations);
	};

	return (
		<div className='p-6 max-w-4xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Product Variation Generator</h1>

			{/* Attribute Input Section */}
			<div className='mb-8 bg-white p-6 rounded-lg shadow'>
				<h2 className='text-xl font-semibold mb-4'>Add New Attribute</h2>
				<div className='flex gap-4 mb-4'>
					<input
						type='text'
						value={newAttributeName}
						onChange={(e) => setNewAttributeName(e.target.value)}
						placeholder='Attribute Name (e.g., Color)'
						className='flex-1 p-2 border rounded'
					/>
					<input
						type='text'
						value={newAttributeValues}
						onChange={(e) => setNewAttributeValues(e.target.value)}
						placeholder='Values (comma-separated e.g., Red,Blue,Green)'
						className='flex-1 p-2 border rounded'
					/>
					<button
						onClick={handleAddAttribute}
						className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
					>
						Add Attribute
					</button>
				</div>
			</div>

			{/* Current Attributes Display */}
			<div className='mb-8'>
				<h2 className='text-xl font-semibold mb-4'>Current Attributes</h2>
				<div className='grid grid-cols-2 gap-4'>
					{attributes.map((attr, index) => (
						<div key={index} className='bg-gray-50 p-4 rounded-lg'>
							<h3 className='font-medium'>{attr.name}</h3>
							<div className='flex flex-wrap gap-2 mt-2'>
								{attr.values.map((value, vIndex) => (
									<span
										key={vIndex}
										className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm'
									>
										{value}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Variations Table */}
			<div className='overflow-x-auto'>
				<h2 className='text-xl font-semibold mb-4'>Generated Variations</h2>
				<table className='w-full bg-white shadow rounded-lg'>
					<thead className='bg-gray-50'>
						<tr>
							{attributes.map((attr, index) => (
								<th
									key={index}
									className='px-6 py-3 text-left text-sm font-medium text-gray-500'
								>
									{attr.name}
								</th>
							))}
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-500'>
								Stock
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{variations.map((variation, index) => (
							<tr key={index}>
								{attributes.map((attr, attrIndex) => (
									<td
										key={attrIndex}
										className='px-6 py-4 text-sm text-gray-900'
									>
										{variation.combination[attr.name]}
									</td>
								))}
								<td className='px-6 py-4'>
									<input
										type='number'
										value={variation.stock}
										onChange={(e) =>
											handleStockUpdate(index, parseInt(e.target.value) || 0)
										}
										className='w-24 p-1 border rounded'
										min='0'
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ProductVariation;
