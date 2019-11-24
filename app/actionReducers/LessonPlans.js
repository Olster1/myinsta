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

//////////// REDUCERS //////////////////

export function userLessons(state = [], action) {

	switch(action.type) {
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
