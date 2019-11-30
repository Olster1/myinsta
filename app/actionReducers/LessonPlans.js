///////////// ACTIONS ////////////////

export const addUserLessons = (lessons) => ({
	type: 'SET_USER_LESSONS',
	lessons: lessons
})

export const addLessonPlan = (p) => ({
	type: 'SET_USER_SINGLE_LESSON',
	lesson: p
})

export const removeLessonPlan = (id) => ({
	type: 'REMOVE_USER_SINGLE_LESSON',
	id: id
})

export const addMilestone = (milestone, learningPlanId, parentId) => ({
	type: 'ADD_MILESTONE',
	milestone: milestone,
	learningPlanId: learningPlanId,
	parentId: parentId, 
})

export const removeMilestone = (id) => ({
	type: 'REMOVE_MILESTONE',
	id: id
})

//////////// REDUCERS //////////////////

function findMilestoneRecursive(parentId, itemsArray){
	let result = null;
	if(itemsArray) {
		for (var i = itemsArray.length - 1; i >= 0 && result === null; i--) {
			m = itemsArray[i];

			if(m._id === parentId) {
				result = m;
				break;
			} else if(m.items.length > 0) { //has children
				result = findMilestoneRecursive(parentId, m.items);
			}
		}
	}

	return result;
} 

export function userLessons(state = [], action) {

	switch(action.type) {
		case 'ADD_MILESTONE': {
			let index = -1;
			for(let i = 0; i < state.length && index < 0; ++i) {
				console.log(action.learningPlanId);
				console.log(state[i]._id);

				if(state[i]._id === action.learningPlanId) {
					index = i;
					break;
				} 
			}

			console.log("ERROR: COUDLNT FIND PLAN" + index);

			let myArray = state[index].items;
			if(action.parentId > 0) { //is valid
				myArray = findMilestoneRecursive(parentId, state[index].items).items;	
			} 

			myArray.push(action.milestone);

			return state;
		}
		case 'REMOVE_MILESTONE': {

		}
		case 'SET_USER_LESSONS': {
			return action.lessons;
		}
		case 'SET_USER_SINGLE_LESSON': {
			return  state.concat([ action.lesson]);
		}
		case 'REMOVE_USER_SINGLE_LESSON': {

			let index = -1;
			for(let i = 0; i < state.length && index < 0; ++i) {
				if(state[i]._id === action.id) {
					index = i;
					break;
				} 
			}	

			if(index >= 0) {
				return [...array.slice(0, index), ...array.slice(index + 1)]
			} else {
				return state;
			}
		}
		default: 
			return state;
	}
}
