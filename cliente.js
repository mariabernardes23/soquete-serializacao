const net = require('net');
const readline = require('readline');

// Criar um cliente de socket
const client = net.createConnection({
  host: 'localhost',
  port: 3001
});

// Guarda os dados do cliente 
const person = {
  name: '',
  message: '',
  friend: '',
}

// Configura a interface para leitura do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('---CHAT---\n1 - Mensagem privada');
console.log('Digite seu nome: ');
// Define a instrução no console
// rl.setPrompt('Digite seu nome: ');
// rl.prompt();

function getNameFriend() {
  rl.question('Nome do destinatario: ', (input) => {
    person.friend = input;
  })
}

// Pega os valores de entrado do cliente
rl.on('line', (text) => {
  if(text == 'stop') {
    client.end();
    return;
  }

  if(person.name.trim() == '') {
    person.name = text;
    return;
  }

  if(text == 1) {
    getNameFriend();
    return;
  }

  person.message = text;
  pushMessage(person);
})

// Enviar uma mensagem para o servidor
function pushMessage(person) {
  client.write(JSON.stringify(person));
  person.friend = ''
}

// Lidar com mensagens do servidor
client.on('data', (message) => {
  console.log(message.toString('utf8'));
});

// Lida com a desconexão do servidor
client.on('close', () => {
  console.log('Conexão fechada');
  // Fechar a interface de leitura
  rl.close(); 
});