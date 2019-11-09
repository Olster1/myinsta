export function followers(state = [], action) {

	switch(action.type) {
		case 'GET_FOLLOWERS': {
			return action.followers;
		}
		default: 
			return state;
	}
}

export function following(state = [], action) {

	switch(action.type) {
		case 'GET_FOLLOWING': {
			return action.following;
		}
		default: 
			return state;
	}
}

export function followersIsLoading(state = false, action) {

	switch(action.type) {
		case 'SET_FOLLOWERS_LOADING': {
			return action.loading;
		}
		default: 
			return state;
	}
}

export function followingIsLoading(state = false, action) {

	switch(action.type) {
		case 'SET_FOLLOW_LOADING': {
			return action.loading;
		}
		default: 
			return state;
	}
}
