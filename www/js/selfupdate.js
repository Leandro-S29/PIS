// Communication to the socket
const socket = new WebSocket('ws://localhost:3000');

socket.addEventListener('message', (event) => {
    if (event.data === 'reload') {
        window.location.reload();
    }
});

// Check if the user is admin before accessing adminPage.html
async function checkAdminAccess() {
    try {
        const response = await fetch('/api/users/session');
        const result = await response.json();
        if (result.username !== 'admin') {
            alert('Access denied. Admins only.');
            window.location.href = '/html/index.html';
        }
    } catch (err) {
        console.error('Error checking admin access:', err);
    }
}

// Call checkAdminAccess if the user tries to access adminPage.html
if (window.location.pathname === '/html/adminPage.html') {
    checkAdminAccess();
}