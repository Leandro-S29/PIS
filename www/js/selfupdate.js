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


if (window.location.pathname === '/html/adminPage.html' || window.location.pathname === '/html/usersAdmin.html' || window.location.pathname === '/html/categoriesAdmin.html' || window.location.pathname === '/html/ingredAdmin.html') {
    checkAdminAccess();
}

// Check if the user is logged in before accessing Favorites
async function checkLoginAccess() {
    try {
        const response = await fetch('/api/users/session');
        const result = await response.json();
        if (result.loggedIn === false) {
            alert('Access denied. Please log in.');
            window.location.href = '/html/index.html';
        }
    } catch (err) {
        console.error('Error checking login access:', err);
    }
}

if (window.location.pathname === '/html/favorites.html') {
    checkLoginAccess();
}

