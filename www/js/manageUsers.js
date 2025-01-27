document.addEventListener('DOMContentLoaded', async () => {
    const userList = document.querySelector('.user-list');

    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.classList.add('user-card');

            const userInfo = document.createElement('div');
            userInfo.classList.add('user-info');
            userInfo.innerHTML = `
                <p><strong>Username:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
            `;

            const userActions = document.createElement('div');
            userActions.classList.add('user-actions');
            userActions.innerHTML = `
                <button onclick="editUser(${user.user_id}, '${user.username}', '${user.email}')">Edit</button>
                <button onclick="deleteUser(${user.user_id})">Delete</button>
            `;

            userCard.appendChild(userInfo);
            userCard.appendChild(userActions);
            userList.appendChild(userCard);
        });
    } catch (err) {
        console.error('Error fetching users:', err);
    }
});

// Edit user details
function editUser(userId, username, email) {
    console.log('Editing user:', userId, username, email);
    const userListPanel = document.querySelector('.user-list-panel');
    const editUserPanel = document.querySelector('.edit-user-panel');

    if (userListPanel && editUserPanel) {
        userListPanel.classList.add('hidden');
        editUserPanel.classList.remove('hidden');
    } else {
        console.error('Panels not found');
    }

    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;

    const editUserForm = document.getElementById('editUserForm');
    editUserForm.onsubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedUsername = event.target.username.value;
            const updatedEmail = event.target.email.value;
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: updatedUsername, email: updatedEmail })
            });
            if (response.ok) {
                alert('User updated successfully.');
                window.location.reload();
            } else {
                alert('Failed to update user.');
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };
}

// Cancel user edit
function cancelEdit() {
    console.log('Cancel edit');
    const userListPanel = document.querySelector('.user-list-panel');
    const editUserPanel = document.querySelector('.edit-user-panel');

    if (userListPanel && editUserPanel) {
        userListPanel.classList.remove('hidden');
        editUserPanel.classList.add('hidden');
    } else {
        console.error('Panels not found');
    }
}

// Delete user
async function deleteUser(userId) {
    console.log('Deleting user:', userId);
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                alert('User deleted successfully.');
                window.location.reload();
            } else {
                alert('Failed to delete user.');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    }
}