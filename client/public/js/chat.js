const socket = io();

socket.on('connect', () => {
  socket.emit('joinRoom', { senderId, recipientId });
  console.log('Connected to socket, joined room');
});

// Listen for online/offline status updates
socket.on('userStatus', (status) => {
  if (status.userId !== recipientId) return; // Only update if it's the chat partner

  const userStatus = document.getElementById('userStatus');
  if (status.online) {
    userStatus.textContent = '● Online';
    userStatus.style.color = 'white';
  } else {
    const lastSeen = status.lastSeen
      ? new Date(status.lastSeen).toLocaleString()
      : 'Unknown';
    userStatus.textContent = `● Last seen at ${lastSeen}`;
    userStatus.style.color = '#ffffffcc';
  }
});

// Receive chat messages from server
socket.on('chatMessage', (msg) => {
  appendMessage(msg);
});

function appendMessage(msg) {
  const messagesDiv = document.getElementById('messages');
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add(msg.senderId === senderId ? 'sent' : 'received');

  div.innerHTML = `
    <div class="bubble">
      ${escapeHtml(msg.text)}
      <div class="meta">${msg.senderName} • ${new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
    </div>
  `;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Sending messages
const form = document.getElementById('chatForm');
const input = document.getElementById('msgInput');

form.addEventListener('submit', e => {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return;

  socket.emit('chatMessage', { recipientId, content });
  input.value = '';
});
