document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    
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

    let users = JSON.parse(localStorage.getItem('users')) || [];

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (password !== confirmPassword) {
            showError('register-confirm', 'As senhas não coincidem');
            return;
        }
        
        if (users.some(user => user.email === email)) {
            showError('register-email', 'Este email já está cadastrado');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Cadastro realizado com sucesso! Faça login para continuar.');
        registerForm.reset();
        registerForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {

            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            window.location.href = 'dashboard.html';
        } else {
            showError('login-password', 'Email ou senha incorretos');
        }
    });

    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;

        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        input.parentNode.appendChild(errorElement);
        errorElement.style.display = 'block';

        input.style.borderColor = '#e74c3c';
        setTimeout(() => {
            input.style.borderColor = '#ddd';
        }, 2000);
    }
});
