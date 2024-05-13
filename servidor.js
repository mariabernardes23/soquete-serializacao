const net = require('net');
const porta = 3001;
const clientList = [];
const nameList = [];

// Criar um servidor de socket
const server = net.createServer((socket) => {
  console.log('Cliente conectado');

  const client = {
    socket: socket,
    name: '',
    message: '',
  }

  clientList.push(client);

  //Pega a posição no array que o cliente está
  function getClient(socket) {
    for(let i = 0; i < clientList.length; i++) {
      if(clientList[i].socket == socket){
        return i;
      }
    }
    return -1;
  }

  //Adicina o nome do cliente
  function setName(message) {
    const index = getClient(socket);
    if(index != -1) {
      if(clientList[index].name == '') {
        clientList[index].name = JSON.parse(message).name;
        nameList.push(JSON.parse(message).name)
      }
    }
  }

  // Lidar com mensagens do cliente
  socket.on('data', (message) => {
    console.log(JSON.parse(message));
    setName(message);
    pushMessage(message);
  });

  // Enviar uma mensagem para o cliente
  function pushMessage(message) {
    clientList.forEach((client) => { 
      if(client.socket != socket && JSON.parse(message).friend == '' && JSON.parse(message).message != 'nameList') {
        client.socket.write(JSON.parse(message).name + ": " + JSON.parse(message).message);
      } else if(client.name == JSON.parse(message).friend) {
        client.socket.write(JSON.parse(message).name + ": " + JSON.parse(message).message);
      } else if(client.socket == socket && JSON.parse(message).message == 'nameList') { 
        const names = nameList.filter((name) => name != client.name)
        client.socket.write(names.length > 0 ? 'Amigos no chat: ' + names.join(' - ') : 'Não hà amigos no chat!')
      }
    }) 
  }
  
  // Enviar menssagem para o cliente
  function pushMessageExit(message) {
    clientList.forEach((client) => {
      client.socket.write(message)
    })
  }

  // Lidar com a desconexão do cliente
  socket.on('close', () => {
    const index = getClient(socket);
    const nameClient = clientList[index].name;

    if(index != -1) {
      clientList.splice(index, 1);
      nameList.splice(index, 1)
    }

    pushMessageExit(nameClient + ' saiu do chat!')
    console.log('Conexão fechada com ' + nameClient);
  });
});

// Começar a escutar por novas conexões
server.listen(porta, () => {
  console.log(`Servidor executando na porta ${porta}`);
});
