const { io } = require('../server');

const { sendMessage } = require('../utils/utils');
const { Users } = require('../classes/users');
const users = new Users();

io.on('connection', (client) => {
	client.on('enter-the-chat', (user, callback) => {
		if (!user.name || !user.room) {
			return callback({
				error: true,
				msg: 'Name/Room is required',
			});
		}

		client.join(user.room);

		users.addPerson(client.id, user.name, user.room);

		client.broadcast.to(user.room).emit('list-persons', users.getPeopleInRoom(user.room));
		client.broadcast.to(user.room).emit('send-message', sendMessage('Admin', `${user.name} entered the chat`));

		callback(users.getPeopleInRoom(user.room));
	});

	client.on('send-message', (data, callback) => {
		let person = users.getPersonById(client.id);
		let message = sendMessage(person.name, data.message);
		client.broadcast.to(person.room).emit('send-message', message);

		callback(message);
	});

	client.on('disconnect', () => {
		let eliminatedPerson = users.deletePersonById(client.id);

		client.broadcast.to(eliminatedPerson.room).emit('send-message', sendMessage('Admin', `${eliminatedPerson.name} left the chat`));
		client.broadcast.to(eliminatedPerson.room).emit('list-persons', users.getPeopleInRoom(eliminatedPerson.room));
	});

	client.on('private-message', (data) => {
		let person = users.getPersonById(client.id);

		client.broadcast.to(data.from).emit('private-message', sendMessage(person.name, data.message));
	});
});
