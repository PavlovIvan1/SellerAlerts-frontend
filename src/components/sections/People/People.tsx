import { useMemo } from 'react'
import people from '../../../data/people.json'
import styles from './People.module.css'

interface Props {
  selectedId: string
  onSelect: (id: string) => void
}

export function People({ selectedId, onSelect }: Props) {
  const items = useMemo(() => people, [])

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


