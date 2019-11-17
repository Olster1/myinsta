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
		callback(data.result, data.message, data.data);
	}).catch((error) => {
		callback("ERROR", "Server error", {});
	});
}



///////////////////////************ Our api *************////////////////////

export function registerUser(email, password, callback) {

	let request = buildPostRequest('http://localhost:8080/user/register', {
			email: email,
			password: password
		});

	sendRequest(request, callback)
}


export function loginUser(email, password, callback) {

	let request = buildPostRequest('http://localhost:8080/user/login', {
			email: email,
			password: password
		});

	sendRequest(request, callback)
}


export function isLoggedIn(callback) {
	let request = buildPostRequest('http://localhost:8080/user/isLoggedIn', {});
	sendRequest(request, callback);
}

export function logout(callback) {
	let request = buildPostRequest('http://localhost:8080/user/logout', {});
	sendRequest(request, callback);
}
