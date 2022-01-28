class Users {
	constructor() {
		this.persons = [];
	}

	addPerson(id, name, room) {
		let person = { id, name, room };
		this.persons.push(person);
		return this.persons;
	}

	getPersonById(id) {
		let person = this.persons.filter((person) => person.id === id)[0];
		return person;
	}

	getPersons() {
		return this.persons;
	}

	getPeopleInRoom(room) {
		let peopleInRoom = this.persons.filter((person) => person.room === room);
		return peopleInRoom;
	}

	deletePersonById(id) {
		let eliminatedPerson = this.getPersonById(id);
		this.persons = this.persons.filter((person) => person.id != id);
		return eliminatedPerson;
	}
}

module.exports = {
	Users,
};
