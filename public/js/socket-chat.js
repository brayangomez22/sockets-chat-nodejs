const socket = io();
const params = new URLSearchParams(window.location.search);

if (!params.has('name') || !params.has('room')) {
	window.location = 'index.html';
	throw new Error('Name or room is required');
}

const user = {
	name: params.get('name'),
	room: params.get('room'),
};

socket.on('connect', () => {
	socket.emit('enter-the-chat', user, (resp) => {
		console.log(resp);
	});
});

socket.on('disconnect', () => {});

socket.on('send-message', (message) => {
	console.log('Server:', message);
});

socket.on('list-persons', (users) => {
	console.log(users);
});

socket.emit(
	'send-message',
	{
		message: 'Hello World',
	},
	(resp) => {
		console.log('response: ', resp);
	}
);

socket.on('private-message', (message) => {
	console.log('private message: ', message);
});
