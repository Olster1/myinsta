///////////// ACTIONS ////////////////

export const setUserData = (userInfo) => ({
	type: 'SET_USER',
	userInfo: userInfo
})

export const setLoadingUser = (value) => ({
	type: 'SET_LOADING',
	loading: value
})


//////////// REDUCERS //////////////////

export function userInfo(state = {}, action) {

	switch(action.type) {
		case 'SET_USER': {
			return action.userInfo;
		}
		default: 
			return state;
	}
}

export function userIsLoading(state = false, action) {

	switch(action.type) {
		case 'SET_LOADING': {
			return action.loading;
		}
		default: 
			return state;
	}
}