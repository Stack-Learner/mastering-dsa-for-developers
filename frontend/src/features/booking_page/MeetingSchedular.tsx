import React, { useState, useEffect } from 'react';

type Meeting = {
	start: string;
	end: string;
};

type MeetingSchedulerProps = {
	startTime?: string;
	endTime?: string;
	blockedHours?: [string, string][];
	upcomingMeetings?: Meeting[];
};

const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
	startTime = '09:00',
	endTime = '19:00',
	blockedHours = [
		['12:00', '13:00'], // Lunch break
		// Daily meeting
		['11:00', '11:30'], // Daily meeting
	],
	upcomingMeetings = [
		{ start: '09:00', end: '10:00' },
		{ start: '10:30', end: '11:30' },
		{ start: '13:00', end: '14:00' },
		{ start: '14:00', end: '15:30' },
		{ start: '16:00', end: '17:00' },
	],
}) => {
	const [schedulableMeetings, setSchedulableMeetings] = useState<Meeting[][]>(
		[]
	);
	const [maxNonOverlapping, setMaxNonOverlapping] = useState<Meeting[]>([]);

	const timeToMinutes = (time: string): number => {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	};

	const hasOverlap = (meeting1: Meeting, meeting2: Meeting): boolean => {
		const start1 = timeToMinutes(meeting1.start);
		const end1 = timeToMinutes(meeting1.end);
		const start2 = timeToMinutes(meeting2.start);
		const end2 = timeToMinutes(meeting2.end);
		return start1 < end2 && start2 < end1;
	};

	const isWithinWorkingHours = (meeting: Meeting): boolean => {
		const meetingStart = timeToMinutes(meeting.start);
		const meetingEnd = timeToMinutes(meeting.end);
		const dayStart = timeToMinutes(startTime);
		const dayEnd = timeToMinutes(endTime);

		return meetingStart >= dayStart && meetingEnd <= dayEnd;
	};

	const isOverlappingWithBlocked = (meeting: Meeting): boolean => {
		for (const [blockStart, blockEnd] of blockedHours) {
			const blocked: Meeting = { start: blockStart, end: blockEnd };
			if (hasOverlap(meeting, blocked)) {
				return true;
			}
		}
		return false;
	};

	const findValidCombinations = (
		currentMeetings: Meeting[],
		remainingMeetings: Meeting[],
		startIdx: number,
		result: Meeting[][]
	) => {
		result.push([...currentMeetings]);

		for (let i = startIdx; i < remainingMeetings.length; i++) {
			const meeting = remainingMeetings[i];

			// Skip if meeting is outside working hours or overlaps with blocked hours
			if (!isWithinWorkingHours(meeting) || isOverlappingWithBlocked(meeting)) {
				continue;
			}

			let canAdd = true;
			for (const scheduledMeeting of currentMeetings) {
				if (hasOverlap(meeting, scheduledMeeting)) {
					canAdd = false;
					break;
				}
			}

			if (canAdd) {
				currentMeetings.push(meeting);
				findValidCombinations(
					currentMeetings,
					remainingMeetings,
					i + 1,
					result
				);
				currentMeetings.pop();
			}
		}
	};

	useEffect(() => {
		const result: Meeting[][] = [];
		findValidCombinations([], upcomingMeetings, 0, result);
		setSchedulableMeetings(result.filter((combo) => combo.length > 0));

		// Find maximum non-overlapping set
		const maxSet = result.reduce(
			(max, current) => (current.length > max.length ? current : max),
			[]
		);
		setMaxNonOverlapping(maxSet);
	}, [upcomingMeetings, startTime, endTime, blockedHours]);

	const getRandomColor = (index: number) => {
		const colors = [
			'bg-blue-100',
			'bg-green-100',
			'bg-yellow-100',
			'bg-purple-100',
			'bg-pink-100',
			'bg-indigo-100',
		];
		return colors[index % colors.length];
	};

	return (
		<div className='p-6 flex gap-8'>
			{/* Left side - Meeting List */}
			<div className='w-1/3'>
				<h2 className='text-xl font-bold mb-4'>Upcoming Meetings</h2>
				<div className='space-y-2'>
					{upcomingMeetings.map((meeting, idx) => (
						<div
							key={idx}
							className={`p-3 border rounded-md shadow-sm ${
								!isWithinWorkingHours(meeting) ||
								isOverlappingWithBlocked(meeting)
									? 'bg-red-50 border-red-200'
									: 'bg-white'
							}`}
						>
							{meeting.start} - {meeting.end}
							{(!isWithinWorkingHours(meeting) ||
								isOverlappingWithBlocked(meeting)) && (
								<div className='text-sm text-red-500 mt-1'>
									Cannot be scheduled (conflicts with working hours or blocked
									time)
								</div>
							)}
						</div>
					))}
				</div>

				<h3 className='text-lg font-semibold mt-6 mb-2'>Blocked Hours</h3>
				<div className='space-y-2'>
					{blockedHours.map(([start, end], idx) => (
						<div key={idx} className='p-3 bg-gray-100 border rounded-md'>
							{start} - {end}
						</div>
					))}
				</div>
			</div>

			{/* Right side - Valid Combinations */}
			<div className='w-2/3'>
				<h2 className='text-xl font-bold mb-4'>
					Possible Meeting Schedule Combinations
				</h2>
				<div className='space-y-4'>
					{schedulableMeetings.map((combination, idx) => (
						<div
							key={idx}
							className={`p-4 rounded-md ${getRandomColor(idx)} ${
								JSON.stringify(combination) ===
								JSON.stringify(maxNonOverlapping)
									? 'border-2 border-green-500'
									: ''
							}`}
						>
							<div className='font-semibold mb-2'>
								Schedule Option {idx + 1}
								{JSON.stringify(combination) ===
									JSON.stringify(maxNonOverlapping) && ' (Maximum Meetings)'}
							</div>
							<div className='space-y-2'>
								{combination.map((meeting, meetingIdx) => (
									<div key={meetingIdx} className='bg-white p-2 rounded'>
										{meeting.start} - {meeting.end}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MeetingScheduler;
