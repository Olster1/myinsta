///////////// ACTIONS ////////////////


//////////// REDUCERS //////////////////

export function feedPosts(state = [], action) {

	switch(action.type) {
		case 'SET_FEED_POSTS': {
			return action.posts;
		}
		default: 
			return state;
	}
}

export function feedIsLoading(state = false, action) {

	switch(action.type) {
		case 'FEED_SET_LOADING': {
			return action.loading;
		}
		default: 
			return state;
	}
}    