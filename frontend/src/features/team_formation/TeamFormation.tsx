import React, { useState } from 'react';
import { faker } from '@faker-js/faker';

// Types
type PlayerRole = {
	isCaptain: boolean;
	isWicketKeeper: boolean;
	isAllRounder: boolean;
	isBatter: boolean;
	isPaceBowler: boolean;
	isSpinBowler: boolean;
};

type Player = {
	id: string;
	name: string;
	roles: PlayerRole;
	teamId: number | null;
	battingAverage?: number;
	bowlingAverage?: number;
};

// Generate fixed 100 players
const PLAYERS: Player[] = Array.from({ length: 100 }, () => ({
	id: faker.string.uuid(),
	name: faker.person.fullName(),
	roles: {
		isCaptain: Math.random() < 0.1,
		isWicketKeeper: Math.random() < 0.15,
		isAllRounder: Math.random() < 0.2,
		isBatter: Math.random() < 0.3,
		isPaceBowler: Math.random() < 0.2,
		isSpinBowler: Math.random() < 0.15,
	},
	teamId: null,
	battingAverage: Math.floor(Math.random() * 50) + 20,
	bowlingAverage: Math.floor(Math.random() * 30) + 15,
}));

const checkTeamConstraints = (team: Player[]): boolean => {
	if (team.length !== 11) return false;

	const hasCaptain = team.filter((p) => p.roles.isCaptain).length === 1;
	const hasWicketKeeper = team.some((p) => p.roles.isWicketKeeper);
	const hasAllRounder = team.some((p) => p.roles.isAllRounder);
	const hasBatters = team.filter((p) => p.roles.isBatter).length >= 2;
	const hasPaceBowler = team.some((p) => p.roles.isPaceBowler);
	const hasSpinBowler = team.some((p) => p.roles.isSpinBowler);

	return (
		hasCaptain &&
		hasWicketKeeper &&
		hasAllRounder &&
		hasBatters &&
		hasPaceBowler &&
		hasSpinBowler
	);
};

const findAvailablePlayers = (
	players: Player[],
	role: keyof PlayerRole
): Player[] => {
	return players.filter((p) => p.roles[role] && !p.teamId);
};

const formTeam = (availablePlayers: Player[]): Player[] | null => {
	const team: Player[] = [];
	const usedIds = new Set<string>();

	// Helper function to check if we have enough players for each role
	const hasEnoughPlayers = (): boolean => {
		const requiredRoles: (keyof PlayerRole)[] = [
			'isCaptain',
			'isWicketKeeper',
			'isAllRounder',
			'isPaceBowler',
			'isSpinBowler',
		];

		const batters = findAvailablePlayers(availablePlayers, 'isBatter');
		return (
			requiredRoles.every(
				(role) => findAvailablePlayers(availablePlayers, role).length > 0
			) && batters.length >= 2
		);
	};

	// Helper function to try adding a player to the team
	const tryAddPlayer = (player: Player): Player[] | null => {
		if (!usedIds.has(player.id)) {
			team.push(player);
			usedIds.add(player.id);
			const result = backtrack(team);
			team.pop();
			usedIds.delete(player.id);
			return result;
		}
		return null;
	};

	// Helper function to check if a role is already filled
	const isRoleFilled = (role: keyof PlayerRole): boolean => {
		return team.some((p) => p.roles[role]);
	};

	// Helper function to get the first available player for a role
	const getFirstAvailablePlayer = (role: keyof PlayerRole): Player | null => {
		const players = findAvailablePlayers(availablePlayers, role);
		return players.length > 0 ? players[0] : null;
	};

	// Helper function to get available players for remaining spots
	const getRemainingPlayers = (): Player[] => {
		return availablePlayers.filter((p) => !usedIds.has(p.id));
	};

	const backtrack = (currentTeam: Player[]): Player[] | null => {
		// Base case: if we have a complete team, check if it meets all constraints
		if (currentTeam.length === 11) {
			return checkTeamConstraints(currentTeam) ? [...currentTeam] : null;
		}

		// Early pruning: if we can't possibly form a valid team with remaining players
		const remainingSpots = 11 - currentTeam.length;
		const availableUnusedPlayers = getRemainingPlayers();
		if (availableUnusedPlayers.length < remainingSpots) {
			return null;
		}

		// Try to add required roles if missing
		const requiredRoles: (keyof PlayerRole)[] = [
			'isCaptain',
			'isWicketKeeper',
			'isAllRounder',
			'isPaceBowler',
			'isSpinBowler',
		];

		for (const role of requiredRoles) {
			if (!isRoleFilled(role)) {
				const player = getFirstAvailablePlayer(role);
				if (player) {
					const result = tryAddPlayer(player);
					if (result) return result;
				}
				return null;
			}
		}

		// Try to add batters if needed
		const currentBatters = currentTeam.filter((p) => p.roles.isBatter).length;
		if (currentBatters < 2) {
			const batters = findAvailablePlayers(availablePlayers, 'isBatter');
			for (let i = 0; i < Math.min(2, batters.length); i++) {
				const result = tryAddPlayer(batters[i]);
				if (result) return result;
			}
			return null;
		}

		// Fill remaining spots with any available player
		const remainingUnusedPlayers = getRemainingPlayers();
		for (let i = 0; i < Math.min(3, remainingUnusedPlayers.length); i++) {
			const result = tryAddPlayer(remainingUnusedPlayers[i]);
			if (result) return result;
		}

		return null;
	};

	// Early check if we have enough players for each role
	if (!hasEnoughPlayers()) {
		return null;
	}

	return backtrack(team);
};

const getTeamStats = (team: Player[]) => {
	return {
		captains: team.filter((p) => p.roles.isCaptain).length,
		wicketKeepers: team.filter((p) => p.roles.isWicketKeeper).length,
		allRounders: team.filter((p) => p.roles.isAllRounder).length,
		batters: team.filter((p) => p.roles.isBatter).length,
		paceBowlers: team.filter((p) => p.roles.isPaceBowler).length,
		spinBowlers: team.filter((p) => p.roles.isSpinBowler).length,
		avgBattingAvg: Math.round(
			team.reduce((acc, p) => acc + (p.battingAverage || 0), 0) / team.length
		),
		avgBowlingAvg: Math.round(
			team.reduce((acc, p) => acc + (p.bowlingAverage || 0), 0) / team.length
		),
	};
};

// Component
const TeamFormation: React.FC = () => {
	const [players, setPlayers] = useState<Player[]>(PLAYERS);
	const [teams, setTeams] = useState<Player[][]>([]);

	const handleCreateTeam = () => {
		const availablePlayers = players.filter((p) => p.teamId === null);
		const newTeam = formTeam(availablePlayers);

		if (!newTeam) {
			alert('Unable to form a valid team with remaining players');
			return;
		}

		const teamId = teams.length;
		const updatedPlayers = players.map((player) =>
			newTeam.find((p) => p.id === player.id) ? { ...player, teamId } : player
		);

		setPlayers(updatedPlayers);
		setTeams([...teams, newTeam]);
	};

	return (
		<div className='p-6 flex gap-8'>
			{/* Left side - Player List */}
			<div className='w-1/3'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-xl font-bold'>Available Players</h2>
					<button
						onClick={handleCreateTeam}
						className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md'
						disabled={teams.length >= 5}
					>
						Create Team {teams.length + 1}
					</button>
				</div>
				<div className='space-y-2 max-h-[80vh] overflow-y-auto p-1 pr-4'>
					{players.map((player) => (
						<div
							key={player.id}
							className={`p-3 border rounded-lg transition-all duration-200 ${
								player.teamId !== null
									? 'bg-gray-50/50'
									: 'bg-white hover:shadow-sm'
							}`}
						>
							<div className='flex justify-between items-center'>
								<h3 className='font-medium text-gray-800'>{player.name}</h3>
								{player.teamId !== null && (
									<span className='text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-lg'>
										Team {player.teamId + 1}
									</span>
								)}
							</div>
							<div className='flex items-center gap-2 mt-2 flex-wrap'>
								{Object.entries(player.roles).map(
									([role, hasRole]) =>
										hasRole && (
											<span
												key={role}
												className='text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full'
											>
												{role.replace('is', '')}
											</span>
										)
								)}
							</div>
							<div className='flex justify-between mt-2 text-sm text-gray-500'>
								<span>Batting: {player.battingAverage}</span>
								<span>Bowling: {player.bowlingAverage}</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Right side - Teams */}
			<div className='w-2/3'>
				<h2 className='text-xl font-bold mb-4'>Teams</h2>
				<div className='space-y-8'>
					{teams.map((team, index) => {
						const stats = getTeamStats(team);
						const captain = team.find((p) => p.roles.isCaptain);
						return (
							<div
								key={index}
								className='border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition-shadow duration-200'
							>
								<div className='flex justify-between items-center mb-6'>
									<h3 className='text-2xl font-semibold text-gray-800'>
										Team {index + 1}
									</h3>
									<div className='flex items-center gap-6'>
										<div className='text-center bg-blue-50 px-4 py-2 rounded-lg'>
											<div className='text-2xl font-bold text-blue-600'>
												{stats.avgBattingAvg}
											</div>
											<div className='text-xs text-blue-600/80'>
												Batting Avg
											</div>
										</div>
										<div className='text-center bg-green-50 px-4 py-2 rounded-lg'>
											<div className='text-2xl font-bold text-green-600'>
												{stats.avgBowlingAvg}
											</div>
											<div className='text-xs text-green-600/80'>
												Bowling Avg
											</div>
										</div>
									</div>
								</div>

								<div className='bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl mb-6'>
									<div className='text-blue-800/80 text-sm mb-1'>
										Team Captain
									</div>
									<div className='text-xl font-medium text-blue-900'>
										{captain?.name}
									</div>
								</div>

								<div className='grid grid-cols-5 gap-4 mb-8'>
									<div className='bg-purple-50 p-3 rounded-xl text-center'>
										<div className='text-lg font-semibold text-purple-700'>
											{stats.wicketKeepers}
										</div>
										<div className='text-sm text-purple-600/80'>Keepers</div>
									</div>
									<div className='bg-blue-50 p-3 rounded-xl text-center'>
										<div className='text-lg font-semibold text-blue-700'>
											{stats.allRounders}
										</div>
										<div className='text-sm text-blue-600/80'>All Rounders</div>
									</div>
									<div className='bg-green-50 p-3 rounded-xl text-center'>
										<div className='text-lg font-semibold text-green-700'>
											{stats.batters}
										</div>
										<div className='text-sm text-green-600/80'>Batters</div>
									</div>
									<div className='bg-orange-50 p-3 rounded-xl text-center'>
										<div className='text-lg font-semibold text-orange-700'>
											{stats.paceBowlers}
										</div>
										<div className='text-sm text-orange-600/80'>Pace</div>
									</div>
									<div className='bg-red-50 p-3 rounded-xl text-center'>
										<div className='text-lg font-semibold text-red-700'>
											{stats.spinBowlers}
										</div>
										<div className='text-sm text-red-600/80'>Spin</div>
									</div>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									{team
										.filter((p) => !p.roles.isCaptain)
										.map((player) => (
											<div
												key={player.id}
												className='p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200'
											>
												<div className='flex items-center justify-between'>
													<p className='font-medium text-gray-800'>
														{player.name}
													</p>
													<div className='flex gap-2'>
														<span className='text-sm px-2 py-1 bg-blue-100/50 text-blue-700 rounded-lg'>
															{player.battingAverage}
														</span>
														<span className='text-sm px-2 py-1 bg-green-100/50 text-green-700 rounded-lg'>
															{player.bowlingAverage}
														</span>
													</div>
												</div>
												<div className='flex flex-wrap gap-2 mt-2'>
													{Object.entries(player.roles).map(
														([role, hasRole]) =>
															hasRole && (
																<span
																	key={role}
																	className='text-xs px-2 py-1 bg-gray-100/80 text-gray-600 rounded-full'
																>
																	{role.replace('is', '')}
																</span>
															)
													)}
												</div>
											</div>
										))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default TeamFormation;
