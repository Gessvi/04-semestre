// [Manter todo o código anterior e adicionar:]

// Sistema de Login
const loginScreen = document.getElementById('login-screen');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');

const users = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    { username: 'user', password: 'user123', role: 'user', name: 'Usuário Padrão' }
];

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Login bem-sucedido
        loginScreen.style.display = 'none';
        appContainer.style.display = 'block';
        
        // Mostra o nome do usuário no header
        const header = document.querySelector('header');
        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.innerHTML = `
            <span>Olá, ${user.name}</span>
            <span class="${user.role}-badge">${user.role}</span>
            <button id="logout-btn" class="btn btn-small"><i class="fas fa-sign-out-alt"></i></button>
        `;
        header.appendChild(userInfo);
        
        // Verifica permissões
        if (user.role === 'user') {
            document.getElementById('nav-relatorios').style.display = 'none';
        }
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', function() {
            if (confirm('Deseja sair do sistema?')) {
                location.reload();
            }
        });
    } else {
        alert('Usuário ou senha incorretos!');
    }
});

// Sistema de Fotos
const fotoModal = document.getElementById('foto-modal');
const fotoInput = document.getElementById('foto-input');
const fotoPreview = document.getElementById('foto-preview');
const semFoto = document.getElementById('sem-foto');
const removerFotoBtn = document.getElementById('remover-foto');
const confirmarFotoBtn = document.getElementById('confirmar-foto');
let currentVehicleId = null;

function abrirModalFoto(veiculoId) {
    currentVehicleId = veiculoId;
    const veiculo = veiculos.find(v => v.id === veiculoId);
    
    if (veiculo && veiculo.foto) {
        fotoPreview.src = veiculo.foto;
        fotoPreview.style.display = 'block';
        semFoto.style.display = 'none';
    } else {
        fotoPreview.style.display = 'none';
        semFoto.style.display = 'flex';
    }
    
    fotoModal.style.display = 'block';
}

fotoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            fotoPreview.src = event.target.result;
            fotoPreview.style.display = 'block';
            semFoto.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
});

removerFotoBtn.addEventListener('click', function() {
    fotoPreview.src = '';
    fotoPreview.style.display = 'none';
    semFoto.style.display = 'flex';
});

confirmarFotoBtn.addEventListener('click', function() {
    const veiculoIndex = veiculos.findIndex(v => v.id === currentVehicleId);
    if (veiculoIndex !== -1) {
        if (fotoPreview.src && fotoPreview.src !== '') {
            veiculos[veiculoIndex].foto = fotoPreview.src;
        } else {
            delete veiculos[veiculoIndex].foto;
        }
        salvarVeiculos();
        renderizarVeiculos();
    }
    fotoModal.style.display = 'none';
});

// Gráficos
function renderizarGraficos() {
    // Veículos por marca
    const marcas = {};
    veiculos.forEach(v => {
        marcas[v.marca] = (marcas[v.marca] || 0) + 1;
    });
    
    new Chart(
        document.getElementById('marca-chart'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(marcas),
                datasets: [{
                    label: 'Veículos por Marca',
                    data: Object.values(marcas),
                    backgroundColor: '#3498db'
                }]
            }
        }
    );
    
    // Distribuição por ano
    const anos = {};
    veiculos.forEach(v => {
        anos[v.ano] = (anos[v.ano] || 0) + 1;
    });
    
    new Chart(
        document.getElementById('ano-chart'),
        {
            type: 'line',
            data: {
                labels: Object.keys(anos).sort(),
                datasets: [{
                    label: 'Veículos por Ano',
                    data: Object.keys(anos).sort().map(a => anos[a]),
                    borderColor: '#2ecc71',
                    fill: false
                }]
            }
        }
    );
    
    // Cadastros mensais (simulado)
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const cadastros = meses.map(() => Math.floor(Math.random() * 10));
    
    new Chart(
        document.getElementById('cadastro-chart'),
        {
            type: 'pie',
            data: {
                labels: meses,
                datasets: [{
                    label: 'Cadastros Mensais',
                    data: cadastros,
                    backgroundColor: [
                        '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
                        '#1abc9c', '#d35400', '#34495e', '#7f8c8d', '#27ae60',
                        '#2980b9', '#8e44ad'
                    ]
                }]
            }
        }
    );
}

// Exportação de dados
document.getElementById('export-json').addEventListener('click', function() {
    const dataStr = JSON.stringify(veiculos, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'veiculos.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

document.getElementById('export-csv').addEventListener('click', function() {
    const headers = ['Placa,Marca,Modelo,Ano'];
    const data = veiculos.map(v => 
        `"${v.placa}","${v.marca}","${v.modelo}","${v.ano}"`
    );
    
    const csv = headers.concat(data).join('\n');
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csv);
    
    const exportFileDefaultName = 'veiculos.csv';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
});

document.getElementById('export-pdf').addEventListener('click', function() {
    alert('Para exportar em PDF, instale a versão PWA do sistema');
});

// Atualizar a renderização para incluir fotos
function renderizarVeiculos(lista = veiculos) {
    // [Manter o código anterior e modificar a linha da tabela para:]
    html += `
        <tr>
            <td>${veiculo.placa}</td>
            <td>${veiculo.marca}</td>
            <td>${veiculo.modelo}</td>
            <td>${veiculo.ano}</td>
            <td>
                ${veiculo.foto ? '<i class="fas fa-camera" style="color:#3498db"></i>' : ''}
                <button class="action-btn foto-btn" data-id="${veiculo.id}"><i class="fas fa-camera"></i></button>
                <button class="action-btn edit-btn" data-id="${veiculo.id}">Editar</button>
                <button class="action-btn delete-btn" data-id="${veiculo.id}">Excluir</button>
            </td>
        </tr>
    `;
    
    // Adicionar evento aos botões de foto
    document.querySelectorAll('.foto-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            abrirModalFoto(this.getAttribute('data-id'));
        });
    });
}