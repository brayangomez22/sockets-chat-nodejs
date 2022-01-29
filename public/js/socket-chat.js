const socket = io();

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
		renderUsers(resp);
	});
});

socket.on('disconnect', () => {});

socket.on('send-message', (message) => {
	renderMessages(message, false);
	scrollBottom();
});

socket.on('list-persons', (users) => {
	renderUsers(users);
});

socket.on('private-message', (message) => {
	console.log('private message: ', message);
});
