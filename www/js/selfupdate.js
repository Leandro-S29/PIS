const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('message', (event) => {
    if (event.data === 'reload') {
        window.location.reload();
    }
});