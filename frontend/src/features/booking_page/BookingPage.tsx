import React from 'react';

type BookingPageProps = {
	startTime: string;
	endTime: string;
	duration: number;
	blockedHours: [string, string][];
};

const timeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
};

const minutesToTime = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours.toString().padStart(2, '0')}:${mins
		.toString()
		.padStart(2, '0')}`;
};

const hasOverlap = (
	start1: number,
	end1: number,
	start2: number,
	end2: number
): boolean => {
	return start1 < end2 && start2 < end1;
};

const findAvailableSlots = (
	startTime: string,
	endTime: string,
	duration: number,
	blockedHours: [string, string][]
): [string, string][] => {
	const startMinutes = timeToMinutes(startTime);
	const endMinutes = timeToMinutes(endTime);
	const blockedIntervals = blockedHours.map(([start, end]) => [
		timeToMinutes(start),
		timeToMinutes(end),
	]);

	const availableSlots: [string, string][] = [];

	for (
		let slotStart = startMinutes;
		slotStart + duration <= endMinutes;
		slotStart += duration
	) {
		const slotEnd = slotStart + duration;
		let isValid = true;

		for (const [blockStart, blockEnd] of blockedIntervals) {
			if (hasOverlap(slotStart, slotEnd, blockStart, blockEnd)) {
				isValid = false;
				break;
			}
		}

		if (isValid) {
			availableSlots.push([minutesToTime(slotStart), minutesToTime(slotEnd)]);
		}
	}

	return availableSlots;
};

const getDayName = (date: Date): string => {
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'short',
		day: 'numeric',
	});
};

const BookingPage: React.FC<BookingPageProps> = ({
	startTime,
	endTime,
	duration,
	blockedHours,
}) => {
	const today = React.useMemo(() => new Date(), []);

	const handleSlotClick = (start: string, end: string) => {
		console.log(`Selected slot: ${getDayName(today)} ${start} - ${end}`);
		// Handle slot selection here
	};

	const availableSlots = React.useMemo(
		() => findAvailableSlots(startTime, endTime, duration, blockedHours),
		[startTime, endTime, duration, blockedHours]
	);

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-6'>Available Booking Slots</h1>
			<div className='max-w-[240px]'>
				<h2 className='font-semibold mb-4'>{getDayName(today)}</h2>
				<div className='flex flex-col gap-2 max-h-[600px] overflow-y-auto p-1'>
					{availableSlots.map(([start, end], index) => (
						<button
							key={index}
							onClick={() => handleSlotClick(start, end)}
							className='px-6 py-3 bg-white border border-gray-200 rounded-md shadow-sm 
									hover:bg-gray-50 hover:translate-y-[-1px] transition-all duration-200
									focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
						>
							{start} - {end}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default BookingPage;
