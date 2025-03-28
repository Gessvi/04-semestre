document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Elementos do DOM
    const usersTable = document.getElementById('users-table');
    const addUserBtn = document.getElementById('add-user');
    const userModal = document.getElementById('user-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const userForm = document.getElementById('user-form');
    const logoutBtn = document.getElementById('logout-btn');
    const currentUserElement = document.getElementById('current-user');

    // Mostrar usuário atual
    if (currentUserElement) {
        currentUserElement.textContent = currentUser.name;
    }

    // Carregar usuários
    let users = JSON.parse(localStorage.getItem('users')) || [];
    renderUsersTable();

    // Abrir modal para adicionar usuário
    addUserBtn.addEventListener('click', function() {
        document.getElementById('modal-user-title').textContent = 'Adicionar Usuário';
        document.getElementById('user-id').value = '';
        userForm.reset();
        userModal.style.display = 'flex';
    });

    // Fechar modal
    closeModalBtn.addEventListener('click', function() {
        userModal.style.display = 'none';
    });

    // Salvar usuário
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('user-id').value;
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        const confirmPassword = document.getElementById('user-confirm-password').value;

        // Validações
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

        // Verificar email único
        if (users.some(u => u.email === email && u.id !== userId)) {
            alert('Este email já está cadastrado!');
            return;
        }

        // Criar ou atualizar usuário
        if (userId) {
            // Atualizar
            const index = users.findIndex(u => u.id === userId);
            if (index !== -1) {
                users[index].name = name;
                users[index].email = email;
                if (password) {
                    users[index].password = password;
                }
            }
        } else {
            // Criar novo
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            users.push(newUser);
        }

        // Salvar no localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Atualizar tabela
        renderUsersTable();

        // Fechar modal
        userModal.style.display = 'none';
    });

    // Renderizar tabela de usuários
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

        // Adicionar eventos aos botões
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

    // Editar usuário
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

    // Excluir usuário
    function deleteUser(userId) {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        renderUsersTable();
    }

    // Logout
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});