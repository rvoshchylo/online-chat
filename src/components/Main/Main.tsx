import { useEffect, useState } from "react";
import styles from './Main.module.css';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import cn from 'classnames';

const FIELDS = {
  name: 'name',
  room: 'room',
}

const Main: React.FC = () => {
  const { name, room } = FIELDS;
  
  const [values, setValues] = useState({ [name]: '', [room]: '' });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('error', (errorMessage: string) => {
      setError(errorMessage);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setError('');
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const socket = io('http://localhost:5001');
    let errorOccurred = false;

    socket.emit('joinCheck', { name: values[name], room: values[room] });

    socket.on('error', (errorMessage: string) => {
      setError(errorMessage);
      errorOccurred = true;
    });


    setTimeout(() => {
      if (!errorOccurred) {
        navigate(`/chat?name=${values[name]}&room=${values[room]}`);
      }
    }, 100);
  }

  return (
      <div className={styles.wrap}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Join</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.group}>
              <input 
                type="text" 
                name='name' 
                value={values[name]}
                placeholder='name'
                className={cn(styles.input, { [styles.error]: error.length > 0 })}
                onChange={handleOnChange}
                autoComplete='off'
                required
               />
              <div className={styles.errorMessage}>
                  {error}
              </div>
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
            <button className={styles.button} type='submit'>
                Join
            </button>
          </form>
        </div>
      </div>
  );
}

export default Main;