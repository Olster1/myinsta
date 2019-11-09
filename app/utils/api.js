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

export function registerUser(email, password, onSuccess, onFail) {

	let request = buildPostRequest('http://localhost:8080/register', {
			email: email,
			password: password
		});

		fetch(request)
		.then(handle500Error)
		.then((resp) => resp.json())
		.then((data) => {
			if(data.successful) {
				console.log("successful");
				onSuccess(data.reason, data._id);	
			} else {
				console.log("not successful");
				console.log(data.reason);
				onFail(data.reason);
			}
			
		}).catch((error) => {
			console.log(error);
			onFail("Something went wrong");
		});
	}

export function loginUser(email, password, onSuccess, onFail) {

		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const url = 'http://localhost:8080/login';

		const request = new Request(url, {
			method: 'POST',
			body: JSON.stringify({
				email: email,
				password: password
			}), 
			headers: myHeaders

		});

		fetch(request)
		.then(handle500Error)
		.then((resp) => resp.json())
		.then((data) => {
			if(data.successful) {
				console.log("successful");
				onSuccess(data.reason, data._id);	
			} else {
				console.log("not successful");
				console.log(data.reason);
				onFail(data.reason);
			}
			
		}).catch((error) => {
			console.log(error);
			onFail("Something went wrong");
		});
	}

export function getSecretMessage(callback) {

		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const url = 'http://localhost:8080/getSecretMessage';

		const request = new Request(url, {
			method: 'POST',
			headers: myHeaders

		});

		fetch(request)
		.then(handle500Error)
		.then((resp) => resp.json())
		.then((data) => {
			callback(data.reason, !data.successful);
		}).catch((error) => {
			console.log(error);
			callback("Something went wrong", true);
		});
	}

export function isLoggedIn(callback) {

	let request = buildPostRequest('http://localhost:8080/isLoggedIn', {});

	fetch(request)
	.then(handle500Error)
	.then((resp) => resp.json())
	.then((data) => {
		callback(data.result, data.message, data.data);
	}).catch((error) => {
		callback("ERROR", "Server error", {});
	});
}

export function logout(callback) {
	const myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/json");
	const url = 'http://localhost:8080/logout';

	const request = new Request(url, {
		method: 'POST',
		headers: myHeaders

	});

	fetch(request)
	.then(handle500Error)
	.then((resp) => resp.json())
	.then((data) => {
		callback(data.reason, !data.successful);
	}).catch((error) => {
		console.log(error);
		callback("Something went wrong", true);
	});
}
