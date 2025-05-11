// import { ImageViewer } from './features/image-viewer/ImageViewer';
// import InfixCalculator from './features/infix_to_postfix/InfixToPostfix';
// import TagMatcher from './features/tag_matcher/TagMatcher';
// import UndoRedoDemo from './features/undo_redo/UndoRedoDemo';

// import SearchUsingTree from './features/search_tree/SearchUsingTree';
import GraphDemo from './features/graph_demo/GraphDemo';
import WeightedGraphDemo from './features/graph_demo/WieghtedGraphDemo';
import PriorityTask from './features/priority_tasks/PriorityTask';
import SearchUsingTrie from './features/search_tree/SearchUsingTrie';
import AutoSuggest from './features/auto_suggest/AutoSuggest';
import { SimpleGraph } from './features/graph_demo/SimpleGraph';
// import TeamFormation from './features/team_formation/TeamFormation';

// import UndoRedoDemo from './features/undo_redo/UndoRedoDemo';

// const images = [
// 	'https://picsum.photos/id/1/200/300',
// 	'https://picsum.photos/id/2/200/300',
// 	'https://picsum.photos/id/3/200/300',
// 	'https://picsum.photos/id/4/200/300',
// 	'https://picsum.photos/id/5/200/300',
// 	'https://picsum.photos/id/6/200/300',
// 	'https://picsum.photos/id/7/200/300',
// 	'https://picsum.photos/id/8/200/300',
// ];

function App() {
	return (
		<div className='container'>
			{/* <div className='flex flex-col items-center justify-center h-screen'>
				<h1 className='text-4xl font-bold'>Hello World</h1>
				<button className='bg-blue-500 text-white my-2 py-2 px-4 rounded-md'>
					Click me
				</button>
			</div> */}
			{/* <ImageViewer images={images} /> */}
			{/* <UndoRedoDemo /> */}
			{/* <TagMatcher /> */}
			{/* <InfixCalculator /> */}
			{/* <TaskScheduler /> */}
			{/* <BookingPage
				startTime='09:00'
				endTime='19:00'
				duration={60}
				blockedHours={[
					['09:00', '10:00'],
					['12:00', '13:00'],
					['14:00', '16:00'],
				]}
			/> */}
			{/* <ProductVariation /> */}
			{/* <MeetingScheduler /> */}
			{/* <TeamFormation /> */}
			{/* <SearchUsingTrie /> */}
			{/* <PriorityTask /> */}
			{/* <AutoSuggest /> */}
			{/* <GraphDemo /> */}
			<WeightedGraphDemo />
			{/* <SimpleGraph /> */}
		</div>
	);
}

export default App;
