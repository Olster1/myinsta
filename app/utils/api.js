///////////////////////*********** Helper functions **************////////////////////

function handle500Error(response) {
	if(!response.ok) {
		console.log(response);
		throw Error("Server error");
	}

	return response;
}

function buildPostRequest(url, data) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	

	const request = new Request(url, {
		method: 'POST',
		body: JSON.stringify(data), 
		headers: myHeaders

	});

	return request;
}

function sendRequest(request, callback) {
	fetch(request)
	.then(handle500Error)
	.then((resp) => resp.json())
	.then((data) => {
		console.log(data);
		callback(data.result, data.message, data.data);
	}).catch((error) => {
		console.log(error);
		callback("ERROR", "Server error", {});
	});
}



///////////////////////************ Our api *************////////////////////

export function registerUser(email, password, callback) {

	let request = buildPostRequest('/user/register', {
			email: email,
			password: password
		});

	sendRequest(request, callback)
}


export function loginUser(email, password, callback) {

	let request = buildPostRequest('/user/login', {
			email: email,
			password: password
		});

	sendRequest(request, callback)
}


export function isLoggedIn(callback) {
	let request = buildPostRequest('/user/isLoggedIn', {});
	sendRequest(request, callback);
}

export function logout(callback) {
	let request = buildPostRequest('/user/logout', {});
	sendRequest(request, callback);
}


export function payFor(callback) {
	let request = buildPostRequest('/checkout/membership', {
		paymentType: 'level0'
	});
	sendRequest(request, callback);
}

export function getPlansForUser(callback) {
	let request = buildPostRequest('/learningPlans/getPlansForUser', {});
	sendRequest(request, callback);
}

export function addPlanForUser(objective, isPublic, endDate, callback) {
	let request = buildPostRequest('/learningPlans/createPlan', {
		objective: objective, 
		isPublic: isPublic,
		endDate: endDate
	});
	sendRequest(request, callback);
}

export function removePlanFromUser(id, callback) {
	let request = buildPostRequest('/learningPlans/deletePlan', { 
		planId: id
	});
	sendRequest(request, callback);
}

export function addMilestoneToPlan(planId, objective, type, parentId, content, depth, callback) {
	let request = buildPostRequest('/milestone/createMilestone', { 
		planId: planId, 
		objective: objective, 
		type: type, 
		parentId: parentId, 
		content: content, 
		depth: depth
	});
	sendRequest(request, callback);
}

export function updateMilestone(milestoneId, finished, planId, callback) {
	let request = buildPostRequest('/milestone/updateMilestone', { 
		finished: finished, 
		planId: planId, 
		milestoneId: milestoneId
	});
	sendRequest(request, callback);
}

export function deleteMilestone(planId, milestoneId, parentId, depth) {
	let request = buildPostRequest('/milestone/deleteMilestone', { 
		planId: planId, 
		milestoneId: milestoneId,
		parentMilestoneId: parentId, 
		depth: depth
	});
	sendRequest(request, callback);
}






