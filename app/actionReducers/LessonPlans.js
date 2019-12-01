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

export const addMilestone = (milestone, learningPlanId, parentId, isChild) => ({
	type: 'ADD_MILESTONE',
	milestone: milestone,
	learningPlanId: learningPlanId,
	parentId: parentId, 
	isChild: isChild
})

export const removeMilestone = (id) => ({
	type: 'REMOVE_MILESTONE',
	id: id
})

//////////// REDUCERS //////////////////

function findMilestoneRecursive(parentId, milestone){
	let result = null;
	if(milestone.items) {
		for (let i = milestone.items.length - 1; i >= 0 && result === null; i--) {
			let m = milestone.items[i];

			if(m._id === parentId) {
				result = m;
				break;
			} else if(m.items.length > 0) { //has children
				result = findMilestoneRecursive(parentId, m);
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

				if(state[i]._id === action.learningPlanId) {
					index = i;
					break;
				} 
			}

			let newState =  Object.assign([], state);  //@speed there should be a better way

			if(index >= 0) {
				let milestone = newState[index];
				console.log("PARENT IA"+ action.parentId)
				console.log("PARENT IF"+ (action.parentId > 0))
				if(action.isChild) { //is valid
					console.log("PARENT IF"+ action.parentId)
					milestone = findMilestoneRecursive(action.parentId, newState[index]);	
				} 

				milestone.items = milestone.items.concat([ action.milestone ]);

			}

			return newState;
		}
		case 'REMOVE_MILESTONE': {
			return state;
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
