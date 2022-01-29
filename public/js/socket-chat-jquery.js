const params = new URLSearchParams(window.location.search);
const room = params.get('room');

const roomDom = document.getElementById('roomDom');
roomDom.innerText = room;

const divUsers = $('#divUsers');
const form = $('#form');
const txtMessage = $('#txtMessage');
const divChatbox = $('#divChatbox');

const renderUsers = (users) => {
	let HTML = '';

	HTML += `<li>
        <a href="javascript:void(0)" class="active"><span>${room}</span> chat</a>
    </li>`;

	for (let i = 0; i < users.length; i++) {
		HTML += `
        <li>
            <a data-id="${users[i].id}" href="javascript:void(0)"
                ><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle" />
                <span>${users[i].name} <small class="text-success">online</small></span></a
            >
        </li>
        `;
	}

	divUsers.html(HTML);
};

const renderMessages = (message, me) => {
	let HTML = '';
	let date = new Date(message.date);
	let hour = date.getHours() + ':' + date.getMinutes();
	let adminClass = 'info';

	if (message.name === 'Admin') {
		adminClass = 'danger';
	}

	if (me) {
		HTML += `
            <li class="reverse animated fadeIn">
                <div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-inverse">${message.message}</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">>${hour}</div>
            </li>
        `;
	} else {
		HTML += `
            <li class="animated fadeIn">`;
		if (message.name !== 'Admin') {
			HTML += `<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>`;
		}
		HTML += `<div class="chat-content">
                    <h5>${message.name}</h5>
                    <div class="box bg-light-${adminClass}">${message.message}</div>
                </div>
                <div class="chat-time">${hour}</div>
            </li>
        `;
	}

	divChatbox.append(HTML);
};

const scrollBottom = () => {
	// selectors
	let newMessage = divChatbox.children('li:last-child');

	// heights
	let clientHeight = divChatbox.prop('clientHeight');
	let scrollTop = divChatbox.prop('scrollTop');
	let scrollHeight = divChatbox.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let lastMessageHeight = newMessage.prev().innerHeight() || 0;

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		divChatbox.scrollTop(scrollHeight);
	}
};

divUsers.on('click', 'a', function () {
	const id = $(this).data('id');
	if (id) {
		console.log(id);
	}
});

form.on('submit', function (e) {
	e.preventDefault();

	if (txtMessage.val().trim().length === 0) {
		return;
	}

	socket.emit(
		'send-message',
		{
			message: txtMessage.val(),
		},
		(message) => {
			txtMessage.val('').focus();
			renderMessages(message, true);
			scrollBottom();
		}
	);
});
