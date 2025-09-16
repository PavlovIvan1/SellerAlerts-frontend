import styles from './Input.module.css'

export function Input() {
  return (
    <div className={styles.inputSection}>
      <div className={styles.inputWrapper}>
        <div className={styles.tokenInputWrapper}>
          <input
            type="text"
            className={styles.input}
            placeholder="Введите значение..."
          />
        </div>

        <button className={styles.connectButton}>
          Подключить
        </button>
      </div>
    </div>
  )
}
