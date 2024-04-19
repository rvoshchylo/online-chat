import React, { useState } from "react";
import styles from './Main.module.css';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const FIELDS = {
  name: 'name',
  room: 'room',
}

interface User {
  name: string;
  room: string;
}

const socket = io('http://localhost:5000');


const Main: React.FC = () => {
  const { name, room } = FIELDS;
  
  const [users, setUsers] = useState<User[]>([]);
  const [values, setValues] = useState({ [name]: '', [room]: '' });

  console.log(users);

  socket.on('joinRoom', ({ data }) => {
    setUsers(data.users);
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isDisabled = Object.values(values).some(value => !value);

    if (isDisabled) {
      e.preventDefault();
    }
  }

  return (
      <div className={styles.wrap}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Join</h1>
          <form className={styles.form}>
            <div className={styles.group}>
              <input 
                type="text" 
                name='name' 
                value={values[name]}
                placeholder='name'
                className={styles.input}
                onChange={handleOnChange}
                autoComplete='off'
                required
               />
            </div>
            <div className={styles.group}>
              <input 
                type="text" 
                name='room' 
                value={values[room]} 
                placeholder='Chat ID'
                className={styles.input}
                onChange={handleOnChange}
                autoComplete='off'
                required
               />
            </div>
            <Link 
              to={`/chat?name=${values[name]}&room=${values[room]}`}
              onClick={handleClick}
            >
              <button className={styles.button} type='submit'>
                Join
              </button>
            </Link>
          </form>
        </div>
      </div>
  );
}

export default Main;