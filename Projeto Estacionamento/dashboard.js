document.addEventListener('DOMContentLoaded', function() {
   
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    
    document.getElementById('user-name').textContent = currentUser.name;
    
    
    document.getElementById('logout-btn').addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
    
   
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const vehicleForm = document.getElementById('vehicle-form');
    const vehicleModal = document.getElementById('vehicle-modal');
    const addVehicleBtn = document.getElementById('add-vehicle');
    const closeModalBtn = document.querySelector('.close-modal');

    addVehicleBtn.addEventListener('click', function() {
        document.getElementById('modal-title').textContent = 'Adicionar Novo Veículo';
        document.getElementById('vehicle-id').value = '';
        vehicleForm.reset();
        vehicleModal.style.display = 'flex';
    });
    
    closeModalBtn.addEventListener('click', function() {
        vehicleModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === vehicleModal) {
            vehicleModal.style.display = 'none';
        }
    });
    
    document.getElementById('vehicle-plate').addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        
        if (value.length > 3) {
            value = value.substring(0, 3) + '-' + value.substring(3, 7);
        }
        
        e.target.value = value;
    });
    
    vehicleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('vehicle-id').value;
        const plate = document.getElementById('vehicle-plate').value;
        const brand = document.getElementById('vehicle-brand').value;
        const model = document.getElementById('vehicle-model').value;
        const year = document.getElementById('vehicle-year').value;

        if (!plate || !brand || !model || !year) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        if (vehicles.some(v => v.plate === plate && v.id !== id)) {
            alert('Já existe um veículo com esta placa.');
            return;
        }
        
        if (id) {
            const index = vehicles.findIndex(v => v.id === id);
            if (index !== -1) {
                vehicles[index] = { id, plate, brand, model, year };
            }
        } else {

            const newVehicle = {
                id: Date.now().toString(),
                plate,
                brand,
                model,
                year,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.id
            };
            vehicles.push(newVehicle);
        }
        
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        renderVehicleTable();

        vehicleModal.style.display = 'none';
        alert(`Veículo ${id ? 'atualizado' : 'cadastrado'} com sucesso!`);
    });
    
    function renderVehicleTable(filteredVehicles = vehicles) {
        const tbody = document.querySelector('#vehicle-table tbody');
        tbody.innerHTML = '';
        
        if (filteredVehicles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum veículo cadastrado</td></tr>';
            return;
        }
        
        filteredVehicles.forEach(vehicle => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${vehicle.plate}</td>
                <td>${vehicle.brand}</td>
                <td>${vehicle.model}</td>
                <td>${vehicle.year}</td>
                <td>
                    <button class="btn btn-primary action-btn edit-btn" data-id="${vehicle.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger action-btn delete-btn" data-id="${vehicle.id}">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const vehicleId = this.getAttribute('data-id');
                editVehicle(vehicleId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const vehicleId = this.getAttribute('data-id');
                deleteVehicle(vehicleId);
            });
        });
    }

    function editVehicle(vehicleId) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) return;
        
        document.getElementById('modal-title').textContent = 'Editar Veículo';
        document.getElementById('vehicle-id').value = vehicle.id;
        document.getElementById('vehicle-plate').value = vehicle.plate;
        document.getElementById('vehicle-brand').value = vehicle.brand;
        document.getElementById('vehicle-model').value = vehicle.model;
        document.getElementById('vehicle-year').value = vehicle.year;
        
        vehicleModal.style.display = 'flex';
    }

    function deleteVehicle(vehicleId) {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) {
            return;
        }
        
        vehicles = vehicles.filter(v => v.id !== vehicleId);
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
        renderVehicleTable();
        alert('Veículo excluído com sucesso!');
    }

    document.getElementById('search-vehicle').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterVehicles(searchTerm);
    });
    
    function filterVehicles(searchTerm = '') {
        const filtered = vehicles.filter(vehicle => {
            return (
                vehicle.plate.toLowerCase().includes(searchTerm) ||
                vehicle.brand.toLowerCase().includes(searchTerm) ||
                vehicle.model.toLowerCase().includes(searchTerm) ||
                vehicle.year.toString().includes(searchTerm)
            );
        });
        
        renderVehicleTable(filtered);
    }

    function populateFilters() {
        const brandSelect = document.getElementById('filter-brand');
        const yearSelect = document.getElementById('filter-year');

        const brands = [...new Set(vehicles.map(v => v.brand))].sort();
        const years = [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a);

        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });

        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });

        brandSelect.addEventListener('change', function() {
            applyFilters();
        });
        
        yearSelect.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    function applyFilters() {
        const brand = document.getElementById('filter-brand').value;
        const year = document.getElementById('filter-year').value;
        const searchTerm = document.getElementById('search-vehicle').value.toLowerCase();
        
        const filtered = vehicles.filter(vehicle => {
            return (
                (brand === '' || vehicle.brand === brand) &&
                (year === '' || vehicle.year.toString() === year) &&
                (
                    vehicle.plate.toLowerCase().includes(searchTerm) ||
                    vehicle.brand.toLowerCase().includes(searchTerm) ||
                    vehicle.model.toLowerCase().includes(searchTerm) ||
                    vehicle.year.toString().includes(searchTerm)
                )
            );
        });
        
        renderVehicleTable(filtered);
    }

    renderVehicleTable();
    populateFilters();
});

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const sidebarLinks = document.querySelectorAll('.sidebar-nav li');
    const contentSections = document.querySelectorAll('.content-section');
    const logoutBtn = document.getElementById('logout-btn');
    const currentUserElement = document.getElementById('current-user');

    if (currentUserElement) {
        currentUserElement.textContent = currentUser.name;
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');

            sidebarLinks.forEach(item => item.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
  
            this.classList.add('active');

            document.getElementById(`${sectionId}-section`).classList.add('active');

            loadSectionData(sectionId);
        });
    });

    function loadSectionData(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                loadDashboardData();
                break;
            case 'veiculos':
                loadVehiclesData();
                break;
            case 'usuarios':
                loadUsersData();
                break;
            case 'relatorios':
                loadReportsData();
                break;
        }
    }

    function loadDashboardData() {
        console.log("Carregando dados do dashboard...");
        updateDashboardStats();
    }

    function loadVehiclesData() {
        console.log("Carregando dados de veículos...");
    }

    function loadUsersData() {
        console.log("Carregando dados de usuários...");
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const usersSection = document.getElementById('usuarios-section');
        
        usersSection.innerHTML = `
            <div class="section-header">
                <h4><i class="fas fa-users"></i> Gerenciamento de Usuários</h4>
                <button id="add-user" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Adicionar Usuário
                </button>
            </div>
            <div class="table-container">
                <table id="users-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Cadastrado em</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn-edit-user" data-id="${user.id}">Editar</button>
                                    ${user.id !== currentUser.id ? 
                                        `<button class="btn-delete-user" data-id="${user.id}">Excluir</button>` : 
                                        '<span>Usuário atual</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        document.getElementById('add-user')?.addEventListener('click', showUserForm);
        document.querySelectorAll('.btn-edit-user').forEach(btn => {
            btn.addEventListener('click', (e) => editUser(e.target.getAttribute('data-id')));
        });
        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => deleteUser(e.target.getAttribute('data-id')));
        });
    }

    function loadReportsData() {
        console.log("Carregando dados de relatórios...");
        const reportsSection = document.getElementById('relatorios-section');
        
        reportsSection.innerHTML = `
            <div class="section-header">
                <h4><i class="fas fa-chart-bar"></i> Relatórios</h4>
            </div>
            <div class="reports-grid">
                <div class="report-card">
                    <h5>Veículos por Marca</h5>
                    <canvas id="brand-chart"></canvas>
                </div>
                <div class="report-card">
                    <h5>Distribuição por Ano</h5>
                    <canvas id="year-chart"></canvas>
                </div>
                <div class="report-card">
                    <h5>Cadastros Mensais</h5>
                    <canvas id="monthly-chart"></canvas>
                </div>
            </div>
            <div class="report-actions">
                <button id="export-pdf" class="btn"><i class="fas fa-file-pdf"></i> Exportar PDF</button>
                <button id="export-excel" class="btn"><i class="fas fa-file-excel"></i> Exportar Excel</button>
            </div>
        `;
        renderCharts();
    }

    function showUserForm() {
        console.log("Mostrar formulário de usuário");
    }

    function editUser(userId) {
        console.log("Editar usuário:", userId);
    }

    function deleteUser(userId) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.filter(user => user.id !== userId);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsersData();
        }
    }

    function renderCharts() {
        const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        
        const brands = {};
        vehicles.forEach(vehicle => {
            brands[vehicle.brand] = (brands[vehicle.brand] || 0) + 1;
        });
        
        new Chart(document.getElementById('brand-chart'), {
            type: 'bar',
            data: {
                labels: Object.keys(brands),
                datasets: [{
                    label: 'Veículos por Marca',
                    data: Object.values(brands),
                    backgroundColor: '#3498db'
                }]
            }
        });
        const years = {};
        vehicles.forEach(vehicle => {
            years[vehicle.year] = (years[vehicle.year] || 0) + 1;
        });
        
        const sortedYears = Object.keys(years).sort();
        new Chart(document.getElementById('year-chart'), {
            type: 'line',
            data: {
                labels: sortedYears,
                datasets: [{
                    label: 'Distribuição por Ano',
                    data: sortedYears.map(year => years[year]),
                    borderColor: '#2ecc71',
                    fill: false
                }]
            }
        });
    }
    function updateDashboardStats() {
        const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        document.getElementById('total-vehicles').textContent = vehicles.length;
        document.getElementById('total-users').textContent = users.length;
        
        if (vehicles.length > 0) {
            const years = vehicles.map(v => parseInt(v.year));
            document.getElementById('oldest-vehicle').textContent = Math.min(...years);
            document.getElementById('newest-vehicle').textContent = Math.max(...years);
        }
    }
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    loadDashboardData();
});
