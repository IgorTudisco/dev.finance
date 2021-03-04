const Modal = {
    open() {
        // Abrir Modal
        // Add a class active ao modal
        document.querySelector('.modal-overlay')
        .classList.add('active')
    },
    close() {
        // Fechar Modal
        // Remover a class active do modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
};

// Eu preciso somar as entradas
// depois eu preciso somar as saídas e 
// remover das entradas o valor das saídas
// assim, eu terei o total

const Storage = {

    // Function usada para pegar os dados
    // localStorage é uma aplicação usada pelo navegador para guardar dados

    get(){
        
        // Vamos fazer o caminho inverso
        /*
            Agora vamos usar o parse para tranformar os nossos dados que estão
            no localStorage como strings devolta para array

        */
        // Caso ele não ache a minha chave, ele deve retornar um array vazio 

        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []

    },

    // Function usada para atualizar os dados
    
    set(transactions) {

        // Usando a proprieade do localStorage
        // O localStorage só guarda strings, por isso vamos usar a propriedade Json
        // O JSON.stringify transforma qualquer dado em string
        // Ao guardar os dados no localStorage "formatamos o item" usando o setItem
        // O setItem por sua vez exige uma chave e um dado em forma de string

        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))

    }
    
};

const Transaction = {

    // Passando todas as transações usando o Storage.get
    // Essa refatoração será para expandir o código

    all: Storage.get(),

    // Vamos add novas transações na nossa aplicação
    // Para isso vamos usar o metodo push, para empurar os dados para o nosso array

    add(transaction){
        Transaction.all.push(transaction);
        
        App.reload();
    },

    remove(index){

        // Splice é um método aplicado em array, e ele espera você passar o indice
        // Ele irá remover os elementos apartir do elemento que você passar

        Transaction.all.splice(index, 1);

        // Usando o reload para recaregar os nossos dados

        App.reload()

    },

    incomes() {
        
        // Iremos usar o let inves do const, porque vamos trocar o valor ao longo da função

        let income = 0;

        // Vamos pegar todas as transações e somar os valores positivos

        Transaction.all.forEach(transaction => {
            if( transaction.amout > 0 ){
            income += transaction.amout;
            }
        });

        return income
    },

    expenses() {
        
        // Iremos usar o let inves do const, porque vamos trocar o valor ao longo da função

        let expense = 0;

        // Vamos pegar todas as transações e somar os valores negativos

        Transaction.all.forEach(transaction => {
            if( transaction.amout < 0 ){
            expense += transaction.amout;
            }
        });

        return expense
    },

    total() {

        // Somando o total dos amout
        // Chamando e já retornando os valores

        return Transaction.incomes() + Transaction.expenses()
    }
};

// Eu preciso pegar as minhas transações do meu
// obj aqui no java script
// e colocar lá no HTML
// (Substituir os dados do HTML com os dados do JS)

const DOM = {

    /*  Essa funcionalidade vai procurar no meu doc html a interseção de trabalho,
        para que possamos inserir os novos dados nela.
    */

    transactionsContainer: document.querySelector('#date-table tbody'),

    addTransaction(transaction, index){

        // Será criado um elemento <tr></tr> no meu HTML
        // Depois será inserido dentro dele os lementos aboixo.

        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);

        // Passando um index para justar a minha inserção de dados
        // O index será a posição do array

        tr.dataset.index = index

        // Chamando a função para se inserida no doc html
        
        DOM.transactionsContainer.appendChild(tr);

    },
    
    innerHTMLTransaction(transaction, index) {

        // Usando uma função ternária fo if
        // podemos verificar o valor do mesmo e assim subistituir a class.

        const CssClasses = transaction.amout > 0 ? "income" : "expense"

        // Chamando a função Utils

        const amout = Utils.formatCurrency(transaction.amout)

        // Ao usar o `` fazemos uma interpolação, ou seja, podemos usar strings e numbers
        // Fazendo uma imterpolação dos dados com ${}.

        const html = 
        `
            <td class="description">${transaction.description}</td>
            <td class="${CssClasses}">${amout}</td>
            <td class="date">${transaction.date}</td>

            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>

        `
        // Para que se possa usar esses dados do HTML, temos que usar um returni para jogar esses dados para fora.

        return html // esse é o nome da função.


    },

    // Fazendo a chamada e a inserção de dados nos displays
    // Nesse caso estamos chamando o doc html pelo id

    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    // limpando os dados

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }

};

// Constante que conterar uma função de formatação contábil.

const Utils = {

    // Formatando o numero de entrada
    // Todo o numero de entrada vem como uma string

    formatAmout(value){
        value = Math.round(value * 100)

        return value
    },
    
    // Formatando a date

    formatDate(date){
        // Vamos fazer um array com a date
        // Porque o valor vem no formato ISO (2021-03-01)

        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {

        // Essa função vai inserir o senal de negativo

        const signal = Number(value) < 0 ? "-" : ""

        // Essa formatação vai mudar o tipo da variavel de num para string,
        // além disso irá tirar ou substituir as ocorrências.
        // Ao usar a contra barra mais o d (/\D/g), indicamos que queremos substituir tudo que não for
        // numero pelo argumento seguinte.
        // O g indica que essa ocorrência será global.

        value = String(value).replace(/\D/g, "")

        // Agora vamos dividir o valor por 100 para que o sinal de decimal apareça caso precise

        value = Number(value) / 100

        // Ao chamar essa função, ela irá tranforma o valor em formato moeda.
        // No estilo da localidade.

        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value

    }
};

// Criando as funcionalidades do formulário

const Form = {

    // Pegando os ele mentos dos inputs
    // Assim é como se tivessemos criando um link

    description: document.querySelector('input#description'),
    amout: document.querySelector('input#amout'),
    date: document.querySelector('input#date'),

    // Separando os ele mentos do inputs
    // Usando o metodo getValues

    getValues(){
        return{
            description: Form.description.value,
            amout: Form.amout.value,
            date: Form.date.value
        }
    },

    // Validando os campos
    /*
        Usando o meto de desestruturação para tirar os elementos de dentro
        do getValues, passando os memos para uma variavel.
    */

    validateFields(){

        const {description, amout, date} = Form.getValues();

        // Verificando se os campos estão vazios
        /* 
            Usando o metodo trim() para eliminar os espaços vazios
            assim se não sobrar nada, vazio será igual a vazio
        */ 

        if (description.trim() === "" || amout.trim() === "" || date === ""){
            throw new Error("Por favor, preencha todos os campos")
        }

    },

    // Retornando os dados já formatados

    FormatValues(){
        let {description, amout, date} = Form.getValues()

        amout = Utils.formatAmout(amout)

        date = Utils.formatDate(date)
        

        // Usando o método short no retorno, pois o nome da variável é igual o nome da chave

        return{
            description,
            amout,
            date
        }
    },

    // Função que limpa os campos

    clearFields(){
        Form.description.value = ""
        Form.amout.value = ""
        Form.date.value = ""
    },

    // Função que será chamada pela function onsubmite lá no html 

    submit(event){

        // Essa função tira o comportamento padrão do submit

        event.preventDefault()

        // Usando a estrutura try catch para pegar o erro que será gerado pelo validateFields

        try {
            
            // verificar se todas as informações foram preenchidas

            Form.validateFields()

            // Formatar os dados para salvar

            const transaction = Form.FormatValues()

            // Salvar os dados
            // Usando a função add

            Transaction.add(transaction)

            // Apagar os dados do formulário

            Form.clearFields()

            // Fechar o modal
            // Chamando a function Modal
            // Atualizar a plicação, pois no close chama o reload

            Modal.close()

        } catch (error) {
            // Usando um método mais tranquilo de mostrar a nossa mensagem de erro personalizada
            // Usando o método alert para usar o próprio alerta do browze
            alert(error.message)
        }
    }
};


const App = {

    init(){

        // Passando o forEach no array transaction, podemos usar a function e passar o aparametro
        // que vai conter os dados que já existem.
        // Porêm nesse caso iremos trocar pela arrow function

        /*

        Ao passar os memos parâmetros da function na arrowFunction,
        podemos suprimir os parâmetros e passar a function como atalho
        
        Transaction.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index);
        });
        */
                       
        // Chamando a função add

       Transaction.all.forEach(DOM.addTransaction);

        // Chamando o updateBalance

        DOM.updateBalance();

        // Trasendo todos os dados que estão guardados no Storage

        Storage.set(Transaction.all)

    },

    reload(){

        // Limpando todos os dados já existentes

        DOM.clearTransactions();

        App.init();
        
    }

};

// Chamando a função init

App.init();
