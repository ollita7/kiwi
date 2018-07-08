const loadtest = require('loadtest');

const options = {
	url: 'http://localhost:8086',
	concurrent: 5,
	method: 'POST',
	body:'',
	requestsPerSecond:5,
	maxSeconds:30,
	requestGenerator: (params, options, client, callback) => {
		const message = '{"name": "guille"}';
		options.headers['Content-Length'] = message.length;
		options.headers['Content-Type'] = 'application/json';
		options.body = '';
		options.path = '/testcontroller/postAction/1';
		const request = client(options, callback);
		request.write(message);
		return request;
	}
};

loadtest.loadTest(options, (error, results) => {
	if (error) {
		return console.error('Got an error: %s', error);
	}
	console.log(results);
	console.log('Tests run successfully');
});
