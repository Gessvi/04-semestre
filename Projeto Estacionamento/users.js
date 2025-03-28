document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const usersTable = document.getElementById('users-table');
    const addUserBtn = document.getElementById('add-user');
    const userModal = document.getElementById('user-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const userForm = document.getElementById('user-form');
    const logoutBtn = document.getElementById('logout-btn');
    const currentUserElement = document.getElementById('current-user');

    if (currentUserElement) {
        currentUserElement.textContent = currentUser.name;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    renderUsersTable();

    addUserBtn.addEventListener('click', function() {
        document.getElementById('modal-user-title').textContent = 'Adicionar Usuário';
        document.getElementById('user-id').value = '';
        userForm.reset();
        userModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', function() {
        userModal.style.display = 'none';
    });

    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('user-id').value;
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;

        if (!name || !email) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }

        if (!userId && (!password || !confirmPassword)) {
            alert('Para novo usuário, é necessário definir uma senha!');
            return;
        }

        if (password && password !== confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        if (users.some(u => u.email === email && u.id !== userId)) {
            alert('Este email já está cadastrado!');
            return;
        }

        if (userId) {
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index].name = name;
                users[index].email = email;
                if (password) {
                    users[index].password = password;
                }
            }
        } else {
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
        }

        localStorage.setItem('users', JSON.stringify(users));

        renderUsersTable();

        userModal.style.display = 'none';
    });

    function renderUsersTable() {
        const tbody = usersTable.querySelector('tbody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn-edit" data-id="${user.id}">Editar</button>
                    ${user.id !== currentUser.id ? 
                        `<button class="btn-delete" data-id="${user.id}">Excluir</button>` : 
                        '<span>Usuário atual</span>'}
                </td>
            `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                editUser(userId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                deleteUser(userId);
            });
        });
    }

    function editUser(userId) {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        document.getElementById('modal-user-title').textContent = 'Editar Usuário';
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-password').value = '';
        document.getElementById('user-confirm-password').value = '';

        userModal.style.display = 'flex';
    }

    function deleteUser(userId) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsersTable();
    }

    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});
