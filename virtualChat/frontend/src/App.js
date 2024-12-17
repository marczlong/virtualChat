// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Reemplaza con la URL de tu backend

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // Para almacenar los mensajes del chat

  useEffect(() => {
    // Conexión al servidor
    socket.on('connect', () => {
      console.log('Conectado al servidor');
    });

    // Desconexión del servidor
    socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });

    // Recibir nuevos mensajes
    socket.on('newMessage', (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    // Limpiar la conexión al desmontar el componente
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newMessage');
    };
  }, [messages]); // Dependencia de 'messages' para actualizar el estado

  const sendMessage = () => {
    socket.emit('sendMessage', { content: message });
    setMessage('');
  };

  return (
    <div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.content}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}

export default App;
