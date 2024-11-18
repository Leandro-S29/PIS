// Existing toggleMenu function
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('open');
}

// Check session status and update navbar
async function updateNavbar() {
    try {
        const response = await fetch('/api/users/session');
        const result = await response.json();
        const navLinks = document.querySelector('.nav-links');
        const getStartedButton = document.getElementById('getStartedButton');

        if (result.loggedIn) {
            const logoutLink = document.createElement('li');
            logoutLink.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
            navLinks.appendChild(logoutLink);
            if (getStartedButton) {
                getStartedButton.style.display = 'none';
            }
        } else {
            if (getStartedButton) {
                getStartedButton.style.display = 'show';
            }
        }
    } catch (err) {
        console.error('Error checking session status:', err);
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/users/logout');
        if (response.ok) {
            alert('You have successfully logged out.');
            window.location.reload();
        } else {
            console.error('Logout failed');
        }
    } catch (err) {
        console.error('Error logging out:', err);
    }
}

// Call updateNavbar on page load
document.addEventListener('DOMContentLoaded', updateNavbar);