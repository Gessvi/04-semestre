document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Elementos do DOM
    const logoutBtn = document.getElementById('logout-btn');
    const currentUserElement = document.getElementById('current-user');
    const applyPeriodBtn = document.getElementById('apply-period');
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportExcelBtn = document.getElementById('export-excel');
    const printReportBtn = document.getElementById('print-report');

    // Mostrar usuário atual
    if (currentUserElement) {
        currentUserElement.textContent = currentUser.name;
    }

    // Carregar dados
    const vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Renderizar gráficos
    renderCharts();

    // Aplicar filtro de período
    applyPeriodBtn.addEventListener('click', function() {
        renderCharts();
    });

    // Exportar PDF
    exportPdfBtn.addEventListener('click', function() {
        alert('Exportando para PDF...');
        // Implementação real exigiria uma biblioteca como jsPDF
    });

    // Exportar Excel
    exportExcelBtn.addEventListener('click', function() {
        alert('Exportando para Excel...');
        // Implementação real exigiria uma biblioteca como SheetJS
    });

    // Imprimir relatório
    printReportBtn.addEventListener('click', function() {
        window.print();
    });

    // Renderizar gráficos
    function renderCharts() {
        const startDate = document.getElementById('report-start').value;
        const endDate = document.getElementById('report-end').value;

        // Filtrar veículos por período (se aplicável)
        let filteredVehicles = [...vehicles];
        if (startDate && endDate) {
            filteredVehicles = vehicles.filter(v => {
                const vehicleDate = new Date(v.createdAt || new Date());
                return vehicleDate >= new Date(startDate) && vehicleDate <= new Date(endDate);
            });
        }

        // Gráfico de veículos por marca
        const brands = {};
        filteredVehicles.forEach(v => {
            brands[v.brand] = (brands[v.brand] || 0) + 1;
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

        // Gráfico de distribuição por ano
        const years = {};
        filteredVehicles.forEach(v => {
            years[v.year] = (years[v.year] || 0) + 1;
        });
        
        const sortedYears = Object.keys(years).sort();
        new Chart(document.getElementById('year-chart'), {
            type: 'line',
            data: {
                labels: sortedYears,
                datasets: [{
                    label: 'Distribuição por Ano',
                    data: sortedYears.map(y => years[y]),
                    borderColor: '#2ecc71',
                    fill: false
                }]
            }
        });

        // Gráfico de cadastros mensais (exemplo simplificado)
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dec'];
        const monthlyData = months.map((_, i) => {
            return filteredVehicles.filter(v => {
                const date = new Date(v.createdAt || new Date());
                return date.getMonth() === i;
            }).length;
        });
        
        new Chart(document.getElementById('monthly-chart'), {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Cadastros Mensais',
                    data: monthlyData,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true
                }]
            }
        });

        // Gráfico de novos usuários (exemplo)
        const userMonths = months.map((_, i) => {
            return users.filter(u => {
                const date = new Date(u.createdAt);
                return date.getMonth() === i;
            }).length;
        });
        
        new Chart(document.getElementById('users-chart'), {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Novos Usuários',
                    data: userMonths,
                    backgroundColor: '#9b59b6'
                }]
            }
        });
    }

    // Logout
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
});