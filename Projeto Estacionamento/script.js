document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
    // Alternar entre formulários
    showRegister.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.remove('active-form');
        registerForm.classList.add('active-form');
    });
    
    showLogin.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
    });
    
    // Armazenamento de usuários (simulando banco de dados)
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Cadastro de novo usuário
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        
        // Validações
        if (password !== confirmPassword) {
            showError('register-confirm', 'As senhas não coincidem');
            return;
        }
        
        if (users.some(user => user.email === email)) {
            showError('register-email', 'Este email já está cadastrado');
            return;
        }
        
        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // Em aplicações reais, usar bcrypt para hash
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        registerForm.reset();
        registerForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
    });
    
    // Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Salvar usuário logado na sessão
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirecionar para dashboard
            window.location.href = 'dashboard.html';
        } else {
            showError('login-password', 'Email ou senha incorretos');
        }
    });
    
    // Mostrar mensagem de erro
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Remove mensagens de erro anteriores
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        input.parentNode.appendChild(errorElement);
        errorElement.style.display = 'block';
        
        // Destacar campo com erro
        input.style.borderColor = '#e74c3c';
        setTimeout(() => {
            input.style.borderColor = '#ddd';
        }, 2000);
    }
});