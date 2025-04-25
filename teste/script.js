  // Função de cálculo interativa
  function calculate(operation) {
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);
    const resultElement = document.getElementById("calc-result");
    
    // Verifica se os números são válidos
    if (isNaN(num1) || isNaN(num2)) {
        resultElement.textContent = "Por favor, insira dois números válidos!";
        resultElement.style.color = "var(--error-color)";
        resultElement.style.display = "block";
        return;
    }
    
    let result;
    let operationSymbol;
    
    switch(operation) {
        case 'add':
            result = num1 + num2;
            operationSymbol = '+';
            break;
        case 'subtract':
            result = num1 - num2;
            operationSymbol = '-';
            break;
        case 'multiply':
            result = num1 * num2;
            operationSymbol = '×';
            break;
        case 'divide':
            if (num2 === 0) {
                resultElement.textContent = "Erro: Divisão por zero!";
                resultElement.style.color = "var(--error-color)";
                resultElement.style.display = "block";
                return;
            }
            result = num1 / num2;
            operationSymbol = '÷';
            break;
        default:
            result = "Operação inválida";
    }
    
    // Exibe o resultado formatado
    resultElement.innerHTML = `
        <strong>${num1} ${operationSymbol} ${num2} = ${result}</strong>
    `;
    resultElement.style.color = "var(--dark-color)";
    resultElement.style.display = "block";
    
    // Preenche automaticamente a descrição no formulário
    document.getElementById("description").value = `Cálculo realizado: ${num1} ${operationSymbol} ${num2} = ${result}`;
}

// Validação de Formulário
function fixFormValidation() {
    const form = document.getElementById("maintenance-form");
    const element = document.getElementById("form-error");
    
    // Verifica cada campo obrigatório individualmente
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const responsible = document.getElementById("responsible").value;
    
    if (!date || !description || !responsible) {
        element.innerHTML = "❌ Preencha todos os campos obrigatórios marcados!";
        element.classList.remove("success");
        element.classList.add("error");
        
        // Destaca os campos vazios
        if (!date) document.getElementById("date").style.borderColor = "var(--error-color)";
        if (!description) document.getElementById("description").style.borderColor = "var(--error-color)";
        if (!responsible) document.getElementById("responsible").style.borderColor = "var(--error-color)";
    } else {
        element.innerHTML = "✅ Validação corrigida! Todos os campos obrigatórios estão preenchidos corretamente.";
        element.classList.remove("error");
        element.classList.add("success");
        
        // Remove destaque dos campos
        document.getElementById("date").style.borderColor = "";
        document.getElementById("description").style.borderColor = "";
        document.getElementById("responsible").style.borderColor = "";
    }
}

// Gerar relatório
function generateReport() {
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const responsible = document.getElementById("responsible").value;
    
    if (!date || !description || !responsible) {
        alert("Por favor, preencha todos os campos obrigatórios antes de gerar o relatório.");
        fixFormValidation(); // Chama a validação para mostrar os erros
        return;
    }
    
    const report = `📝 Relatório de Cálculo\n\n
Data: ${date}
Tipo de Operação: Cálculo Matemático
Descrição: ${description}
Responsável: ${responsible}\n\n
Relatório gerado em: ${new Date().toLocaleString()}`;

    alert(report);
}

// Limpar formulário
function clearForm() {
    document.getElementById("maintenance-form").reset();
    document.getElementById("form-error").classList.remove("success", "error");
    document.getElementById("form-error").textContent = "O formulário não está validando corretamente os campos obrigatórios.";
    document.getElementById("form-error").classList.add("error");
    document.getElementById("calc-result").style.display = "none";
}