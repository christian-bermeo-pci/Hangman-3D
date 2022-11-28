import styles from './Keyboard.module.css';

const KEYS = [
  'q',
  'w',
  'e',
  'r',
  't',
  'y',
  'u',
  'i',
  'o',
  'p',
  'a',
  's',
  'd',
  'f',
  'g',
  'h',
  'j',
  'k',
  'l',
  'z',
  'x',
  'c',
  'v',
  'b',
  'n',
  'm',
];

type KeyboardProps = {
  disabled?: boolean;
  activeLetters: string[];
  inactiveLetters: string[];
  addGuessedLetter: (letter: string) => void;
};

export const Keyboard = ({
  disabled = false,
  activeLetters,
  inactiveLetters,
  addGuessedLetter,
}: KeyboardProps) => {
  return (
    <div
      style={{
        width: '50%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {KEYS.map((key) => {
        const isActive = activeLetters.includes(key);
        const isInactive = inactiveLetters.includes(key);
        return (
          <>
            <button
              onClick={() => addGuessedLetter(key)}
              className={`
            ${styles.btn} 
            ${isActive && styles.active}
            ${isInactive && styles.inactive}
            `}
              disabled={isInactive || isActive || disabled}
              key={key}
            >
              {key}
            </button>
          </>
        );
      })}
    </div>
  );
};
