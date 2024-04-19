import styles from '../Chat/Chat.module.css';
import { Message } from '../../types/Messages';

interface Props {
  messages: Message[];
  name: string;
}

const Messages: React.FC<Props> = ({ messages, name }) => {
  return (
    <div className={styles.messages}>
      {messages.map(({ user }, index) => {
          const isMyMessage = user.name.toLowerCase().trim() === name.toLowerCase().trim();
          const className = isMyMessage ? styles.me : styles.user;
          return (
            <div key={index} className={`${styles.message} ${className}`}>
              <span className={styles.user}>
                {user.name}
              </span>
              <span className={styles.text}>
                {user.message}
              </span>
            </div>
          );
      })}
    </div>
  );
};

export default Messages;