import { useMemo } from 'react'
import styles from './People.module.css'

interface Person {
  id: string
  name: string
  status: string
  balance: string
  autoRenewal: boolean
}

interface Props {
  selectedId: string
  onSelect: (id: string) => void
  people: Person[]
}

export function People({ selectedId, onSelect, people }: Props) {
  const items = useMemo(() => people, [people])

  if (items.length === 0) {
    return (
      <section className={styles.peopleSection}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>Нет подключенных аккаунтов</h3>
            <p className={styles.emptyDescription}>
              Добавьте людей через токены доступа
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.peopleSection}>
      <div className={styles.container}>
        <ul className={styles.list}>
          {items.map((p) => (
            <li key={p.id} className={`${styles.item} ${selectedId === p.id ? styles.active : ''}`}>
              <button className={styles.button} onClick={() => onSelect(p.id)}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.status}>{p.status}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}


