'use strict'

const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}
    

// const tempClient = {
//     nome: "Marilu",
//     email: "mariluGodoi@gmail.com",
//     celular: "14997145613",
//     cidade: "Arealva"
// } //cliente temporario, modelo de como sera cadastrado


//funcoes para criar os dados
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] //conferindo os casos que ja estao registrado no L.S e transformando a string em obj
const setLocalStorage = (dbClient) => localStorage.setItem("db_client",JSON.stringify(dbClient)) //transformando objeto em string, setando a key e valeu
// CRUD --> creat read update delete

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1) //pegando a posicao e somente ela e excluindo
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage() 

const updateClient = (index, client) => {
    const dbClient = readClient() //ler tds os dados do banco
    dbClient[index] = client
    setLocalStorage(dbClient)
}

//Crud - CREAT
const creatClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client) //enviando os dados de exemplo para o L.S acrescentando uma nova posicao no array com 'push'
    setLocalStorage(dbClient) 
}


const isValideFields = () => {
    return document.getElementById('form').reportValidity()  //verifica se tds os campos do html foram preenchidos 
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

//interacao com o layout/user    

const saveClient = () => {
    if(isValideFields()){
        const client = {
            nome: document.getElementById('name').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
    const index = document.getElementById('name').dataset.index
    if(index == "new"){
        creatClient(client)
        updateTable()
        alert("cliente cadastrado com sucesso")
        closeModal()
    } else {
        updateClient(index, client)
        updateTable()
        alert("cliente alterado com sucesso")
        closeModal()
    }

    }
}

const creatRow = (client, index) => {
    const newRow = document.createElement('tr') // adicionando uma nova linha  
    newRow.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td> 
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button> 
    </td>
    ` //adicionando colunas a nova linha criada 
    //outra forma seria o id="edit"
    document.querySelector('#tableClient>tbody').appendChild(newRow) //incluindo no html, add um filho para a tabela
    
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(creatRow) //funcionamento foreach 1- elemento, 2- index 
}

const fillFields = (client) => {
   // console.log(client)
    document.getElementById('name').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('name').dataset.index = client.index
}

const editClient = (index) => {
    const clients = readClient()[index] //pegando o index desejado da pessoa a editar 
    clients.index = index //adicionando a posicao index em clients
    fillFields(clients) //preenche formulario
    openModal()
    //console.log(clients)
    
}

const editDelete = (event) => {
    if(event.target.type == 'button'){
        const [action, index] = event.target.id.split('-') //nomeando o array 
        if(action == 'edit'){
            editClient(index)
            //console.log('editando cliente')
        } else {
            const client =  readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if(response){
                deleteClient(index)
                updateTable()
                alert ("Cliente excluido com sucesso")
            }
           // console.log('deletando cliente')
        }
       // console.log(event.target.id.split('-')) //se fosse por data-action="delete-${index}" event.target.dataset.action, split(transforma em array a acao e o indice)
    }
    
}

updateTable();

//Eventos --> banco de dados irá ser o localStorage
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)