import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import styles from './Chat.module.css';
import { Message } from '../../types/Messages';
import { Messages } from '../Messages';

const socket = io('https://online-chat-server-fl6f.onrender.com');

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { search } = useLocation();
  const [params, setParams] = useState<{ [k: string]: string; }>({room: '', name: ''});
  const [userMessage, setUserMessage] = useState<string>('');
  const [users, setUsers] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit('join', searchParams)
  }, [search]);

  useEffect(() => {
    socket.on('message', ({ data }) => {
      setMessages((prevMessages) => [ ...prevMessages, data ]);
    });
  }, []);

  useEffect(() => {
    socket.on('joinRoom', ({ data }) => {
      setUsers(data.users.length);
    });
  }, []);

  const handleLeftRoom = () => {
    socket.emit('leftRoom', { params });
    navigate('/');
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userMessage) {
      socket.emit('sendMessage', { userMessage, params });
      setUserMessage('');
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>
          {params.room}
        </div>
        <div className={styles.users}>
          {`${users} users in this room`}
        </div>
        <button 
          className={styles.left} 
          onClick={handleLeftRoom}
        >
          Left the Room
        </button>
      </div>
      <Messages messages={messages} name={params.name} />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input 
            type="text" 
            name='message' 
            value={userMessage}
            placeholder='Type a message...'
            className={styles.input}
            onChange={handleOnChange}
            autoComplete='off'
            required
            />
          </div>
          <div className={styles.button}>
            <button 
              value='Send a message'
              type='submit'
            />
          </div>
      </form>
    </div>
  );
}

export default Chat;