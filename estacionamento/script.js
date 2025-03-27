document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre seções
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove a classe active de todos os links e seções
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Adiciona a classe active ao link clicado
            this.classList.add('active');
            
            // Mostra a seção correspondente
            const target = this.id.replace('nav-', '');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Sistema de CRUD para veículos
    const formVeiculo = document.getElementById('form-veiculo');
    const listaVeiculos = document.getElementById('lista-veiculos');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    // Modal de edição
    const modal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const closeBtn = document.querySelector('.close');
    
    // Armazenamento local (simulando um banco de dados)
    let veiculos = JSON.parse(localStorage.getItem('veiculos')) || [];
    
    // Função para salvar veículos no localStorage
    function salvarVeiculos() {
        localStorage.setItem('veiculos', JSON.stringify(veiculos));
    }
    
    // Função para renderizar a lista de veículos
    function renderizarVeiculos(lista = veiculos) {
        if (lista.length === 0) {
            listaVeiculos.innerHTML = '<p>Nenhum veículo cadastrado.</p>';
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Placa</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Ano</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        lista.forEach(veiculo => {
            html += `
                <tr>
                    <td>${veiculo.placa}</td>
                    <td>${veiculo.marca}</td>
                    <td>${veiculo.modelo}</td>
                    <td>${veiculo.ano}</td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${veiculo.id}">Editar</button>
                        <button class="action-btn delete-btn" data-id="${veiculo.id}">Excluir</button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        listaVeiculos.innerHTML = html;
        
        // Adiciona eventos aos botões de editar e excluir
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editarVeiculo);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', excluirVeiculo);
        });
    }
    
    // Função para cadastrar um novo veículo
    function cadastrarVeiculo(e) {
        e.preventDefault();
        
        const placa = document.getElementById('placa').value.toUpperCase();
        const marca = document.getElementById('marca').value;
        const modelo = document.getElementById('modelo').value;
        const ano = document.getElementById('ano').value;
        
        // Validação simples
        if (!placa || !marca || !modelo || !ano) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Verifica se a placa já existe
        if (veiculos.some(v => v.placa === placa)) {
            alert('Já existe um veículo cadastrado com esta placa.');
            return;
        }
        
        // Cria um ID único
        const id = Date.now().toString();
        
        // Adiciona o veículo ao array
        veiculos.push({
            id,
            placa,
            marca,
            modelo,
            ano
        });
        
        // Salva no localStorage
        salvarVeiculos();
        
        // Limpa o formulário
        formVeiculo.reset();
        
        // Atualiza a lista
        renderizarVeiculos();
        
        // Mostra mensagem de sucesso
        alert('Veículo cadastrado com sucesso!');
    }
    
    // Função para editar um veículo
    function editarVeiculo(e) {
        const id = e.target.getAttribute('data-id');
        const veiculo = veiculos.find(v => v.id === id);
        
        if (!veiculo) return;
        
        // Preenche o formulário de edição
        document.getElementById('edit-id').value = veiculo.id;
        document.getElementById('edit-placa').value = veiculo.placa;
        document.getElementById('edit-marca').value = veiculo.marca;
        document.getElementById('edit-modelo').value = veiculo.modelo;
        document.getElementById('edit-ano').value = veiculo.ano;
        
        // Abre o modal
        modal.style.display = 'block';
    }
    
    // Função para salvar as alterações
    function salvarEdicao(e) {
        e.preventDefault();
        
        const id = document.getElementById('edit-id').value;
        const placa = document.getElementById('edit-placa').value.toUpperCase();
        const marca = document.getElementById('edit-marca').value;
        const modelo = document.getElementById('edit-modelo').value;
        const ano = document.getElementById('edit-ano').value;
        
        // Validação
        if (!placa || !marca || !modelo || !ano) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Verifica se a placa já existe (exceto para o próprio veículo)
        if (veiculos.some(v => v.placa === placa && v.id !== id)) {
            alert('Já existe um veículo cadastrado com esta placa.');
            return;
        }
        
        // Atualiza o veículo
        const index = veiculos.findIndex(v => v.id === id);
        if (index !== -1) {
            veiculos[index] = {
                id,
                placa,
                marca,
                modelo,
                ano
            };
            
            // Salva no localStorage
            salvarVeiculos();
            
            // Atualiza a lista
            renderizarVeiculos();
            
            // Fecha o modal
            modal.style.display = 'none';
            
            // Mostra mensagem de sucesso
            alert('Veículo atualizado com sucesso!');
        }
    }
    
    // Função para excluir um veículo
    function excluirVeiculo(e) {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) {
            return;
        }
        
        const id = e.target.getAttribute('data-id');
        
        // Remove o veículo do array
        veiculos = veiculos.filter(v => v.id !== id);
        
        // Salva no localStorage
        salvarVeiculos();
        
        // Atualiza a lista
        renderizarVeiculos();
        
        // Mostra mensagem de sucesso
        alert('Veículo excluído com sucesso!');
    }
    
    // Função para buscar veículos
    function buscarVeiculos() {
        const termo = searchInput.value.toLowerCase();
        
        if (!termo) {
            renderizarVeiculos();
            return;
        }
        
        const resultados = veiculos.filter(v => 
            v.placa.toLowerCase().includes(termo) ||
            v.marca.toLowerCase().includes(termo) ||
            v.modelo.toLowerCase().includes(termo) ||
            v.ano.toString().includes(termo)
        );
        
        renderizarVeiculos(resultados);
    }
    
    // Event Listeners
    formVeiculo.addEventListener('submit', cadastrarVeiculo);
    editForm.addEventListener('submit', salvarEdicao);
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    searchBtn.addEventListener('click', buscarVeiculos);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            buscarVeiculos();
        }
    });
    
    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Inicializa a aplicação
    renderizarVeiculos();
    
    // Formatação automática da placa
    document.getElementById('placa').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        
        if (value.length > 3) {
            value = value.substring(0, 3) + '-' + value.substring(3, 7);
        }
        
        e.target.value = value;
    });
    
    document.getElementById('edit-placa').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        
        if (value.length > 3) {
            value = value.substring(0, 3) + '-' + value.substring(3, 7);
        }
        
        e.target.value = value;
    });
});