// Open and close the modal
function openModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

// Switch between Login and Register forms
function showForm(formType) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginButton = document.querySelector('.tab-button:first-child');
    const registerButton = document.querySelector('.tab-button:last-child');

    if (formType === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginButton.classList.add('active');
        registerButton.classList.remove('active');
    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerButton.classList.add('active');
        loginButton.classList.remove('active');
    }
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Handle Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (response.status === 200) {
            alert('Login successful');
            closeModal();
            window.location.reload();
        } else {
            alert(result.msg || 'Login failed');
        }
    } catch (err) {
        console.error('Login error:', err);
    }
});

// Handle Registration Form Submission
document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const result = await response.json();
        if (response.status === 201) {
            alert('Registration successful');
            showForm('login');
        } else {
            alert(result.msg || 'Registration failed');
        }
    } catch (err) {
        console.error('Registration error:', err);
    }
});