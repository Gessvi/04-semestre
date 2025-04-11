function validarTelefone(input) {
    // Remove qualquer caractere que não seja número
    input.value = input.value.replace(/[^0-9]/g, '');
}

function adicionarCliente() {
    let nome = document.getElementById('nome').value.trim();
    let email = document.getElementById('email').value.trim();
    let telefone = document.getElementById('telefone').value.trim();
    
    if (nome === '' || telefone === '') {
        alert('Nome e telefone são campos obrigatórios!');
        return;
    }
    
    if (email && !validarEmail(email)) {
        alert('Por favor, insira um e-mail válido!');
        return;
    }
    
    let tabela = document.getElementById('listaClientes');
    let novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).innerText = nome;
    novaLinha.insertCell(1).innerText = email || '-';
    novaLinha.insertCell(2).innerText = formatarTelefone(telefone);
    
    let acaoCell = novaLinha.insertCell(3);
    acaoCell.className = 'actions-cell';
    
    let botaoExcluir = document.createElement('button');
    botaoExcluir.innerText = 'Excluir';
    botaoExcluir.classList.add('btn-excluir');
    botaoExcluir.onclick = function () {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            tabela.deleteRow(novaLinha.rowIndex - 1);
        }
    };
    acaoCell.appendChild(botaoExcluir);
    
    // Limpa os campos do formulário
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatarTelefone(telefone) {
    // Formatação simples para melhor visualização
    if (telefone.length === 11) {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`;
    } else if (telefone.length === 10) {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`;
    }
    return telefone;
}
// Função para filtrar clientes
function filtrarClientes() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const tabela = document.getElementById('listaClientes');
    const linhas = tabela.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const colunas = linhas[i].getElementsByTagName('td');
        let mostrarLinha = false;
        
        // Verifica cada coluna (nome, email, telefone)
        for (let j = 0; j < 3; j++) { // Apenas as 3 primeiras colunas (ignorar ações)
            if (colunas[j]) {
                const texto = colunas[j].textContent || colunas[j].innerText;
                if (texto.toUpperCase().indexOf(filter) > -1) {
                    mostrarLinha = true;
                    break; // Se encontrou em uma coluna, não precisa verificar as outras
                }
            }
        }
        
        linhas[i].style.display = mostrarLinha ? "" : "none";
    }
}

// Função adicionarCliente atualizada
function adicionarCliente() {
    let nome = document.getElementById('nome').value.trim();
    let email = document.getElementById('email').value.trim();
    let telefone = document.getElementById('telefone').value.trim();
    
    if (nome === '' || telefone === '') {
        alert('Nome e telefone são campos obrigatórios!');
        return;
    }
    
    if (email && !validarEmail(email)) {
        alert('Por favor, insira um e-mail válido!');
        return;
    }
    
    let tabela = document.getElementById('listaClientes');
    let novaLinha = tabela.insertRow();
    novaLinha.insertCell(0).innerText = nome;
    novaLinha.insertCell(1).innerText = email || '-';
    novaLinha.insertCell(2).innerText = formatarTelefone(telefone);
    
    let acaoCell = novaLinha.insertCell(3);
    acaoCell.className = 'actions-cell';
    
    let botaoExcluir = document.createElement('button');
    botaoExcluir.innerText = 'Excluir';
    botaoExcluir.classList.add('btn-excluir');
    botaoExcluir.onclick = function() {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            tabela.deleteRow(novaLinha.rowIndex - 1);
        }
    };
    acaoCell.appendChild(botaoExcluir);
    
    // Limpa os campos e a pesquisa se existir
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput.value) {
        searchInput.value = '';
        filtrarClientes(); // Mostra todos os registros novamente
    }
}

// Funções auxiliares (mantidas as mesmas)
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatarTelefone(telefone) {
    if (telefone.length === 11) {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 7)}-${telefone.substring(7)}`;
    } else if (telefone.length === 10) {
        return `(${telefone.substring(0, 2)}) ${telefone.substring(2, 6)}-${telefone.substring(6)}`;
    }
    return telefone;
}