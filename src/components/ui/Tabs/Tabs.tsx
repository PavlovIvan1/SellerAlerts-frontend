import { useEffect, useRef, useState } from 'react'
import { TokenModal } from '../TokenModal/TokenModal'
import styles from './Tabs.module.css'

interface Person {
  id: string
  name: string
  status: string
  balance: string
  autoRenewal: boolean
}

interface TabsProps {
  selectedId: string
  onSelect: (id: string) => void
  onModalStateChange: (isOpen: boolean) => void
  people: Person[]
  onAddPerson: (person: Person) => void
}

export function Tabs({ selectedId, onSelect, onModalStateChange, people, onAddPerson }: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showNavigationHint, setShowNavigationHint] = useState(false)
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)

  useEffect(() => {
    onModalStateChange(isTokenModalOpen)
  }, [isTokenModalOpen, onModalStateChange])

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

  useEffect(() => {
    const hasSeenHint = localStorage.getItem('navigation-hint-seen')
    if (!hasSeenHint) {
      setShowNavigationHint(true)
      setTimeout(() => setShowNavigationHint(false), 3000)
      localStorage.setItem('navigation-hint-seen', 'true')
    }
  }, [])

  return (
    <>
      <div className={styles.tabsContainer}>
        <div className={styles.tabsWrapper}>
          {showNavigationHint && (
            <div className={styles.navigationHint}>
              <span>Свайпните влево или вправо для навигации</span>
            </div>
          )}

          <button 
            className={styles.addTokenButton}
            onClick={() => setIsTokenModalOpen(true)}
            title="Добавить токен доступа"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div 
            ref={tabsRef}
            className={styles.tabs}
          >
            {people.length === 0 ? (
              <div className={styles.emptyTabs}>
                <span className={styles.emptyMessage}>Никого не подключено</span>
              </div>
            ) : (
              people.map((person, index) => {
                const isFirst = index === 0
                const isLast = index === people.length - 1
                const isOnly = people.length === 1
                
                let tabClassName = `${styles.tab} ${selectedId === person.id ? styles.active : ''}`
                if (isOnly) {
                  tabClassName += ` ${styles.onlyTab}`
                } else if (isFirst) {
                  tabClassName += ` ${styles.firstTab}`
                } else if (isLast) {
                  tabClassName += ` ${styles.lastTab}`
                } else {
                  tabClassName += ` ${styles.middleTab}`
                }
                
                return (
                  <button
                    key={person.id}
                    data-id={person.id}
                    className={tabClassName}
                    onClick={() => onSelect(person.id)}
                  >
                    <div className={styles.tabContent}>
                      <span className={styles.personName}>{person.name}</span>
                      <span className={styles.personStatus}>{person.status}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      <TokenModal 
        isOpen={isTokenModalOpen} 
        onClose={() => setIsTokenModalOpen(false)}
        onAddPerson={onAddPerson}
      />
    </>
  )
}
