import { useEffect, useRef, useState } from 'react'
import peopleData from '../../../data/people.json'
import styles from './Tabs.module.css'

interface Person {
  id: string
  name: string
  status: string
}

interface TabsProps {
  selectedId: string
  onSelect: (id: string) => void
}

export function Tabs({ selectedId, onSelect }: TabsProps) {
  const people: Person[] = peopleData
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showNavigationHint, setShowNavigationHint] = useState(false)

  // Автоматическая прокрутка к активной вкладке
  useEffect(() => {
    const activeTab = tabsRef.current?.querySelector(`[data-id="${selectedId}"]`) as HTMLElement
    if (activeTab && tabsRef.current) {
      const containerWidth = tabsRef.current.offsetWidth
      const tabLeft = activeTab.offsetLeft
      const tabWidth = activeTab.offsetWidth
      const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2)
      
      tabsRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      })
    }
  }, [selectedId])

  // Показываем подсказку о навигации при первом посещении
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('navigation-hint-seen')
    if (!hasSeenHint) {
      setShowNavigationHint(true)
      setTimeout(() => setShowNavigationHint(false), 3000)
      localStorage.setItem('navigation-hint-seen', 'true')
    }
  }, [])

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsWrapper}>
        {/* Подсказка о свайпах */}
        {showNavigationHint && (
          <div className={styles.navigationHint}>
            <span>Свайпните влево или вправо для навигации</span>
          </div>
        )}

        <div 
          ref={tabsRef}
          className={styles.tabs}
        >
          {people.map((person) => (
            <button
              key={person.id}
              data-id={person.id}
              className={`${styles.tab} ${selectedId === person.id ? styles.active : ''}`}
              onClick={() => onSelect(person.id)}
            >
              <div className={styles.tabContent}>
                <span className={styles.personName}>{person.name}</span>
                <span className={styles.personStatus}>{person.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
