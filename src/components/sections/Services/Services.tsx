import rawServices from '@/data/servicesByPerson.json'
import { useRouter } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import styles from './Services.module.css'


export interface ServiceCard {
  id: string
  title: string
  titleDescription: string
  description: string
  video: string
  photo: string
  advantages: string[]
  advantageOffer: string
  howItWorks: string[]
  type: 'service' | 'autotables' | 'autogems'
  isLocked?: boolean
  autoRenewal?: boolean
  paidUntil?: string
  guide?: string[]
}

interface Props {
  personId: string
}

const servicesByPerson = rawServices as Record<string, ServiceCard[]>


export function Services({ personId }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [expandedCard] = useState<string | null>(null)

  const serviceCards = servicesByPerson[personId] || []

  const router = useRouter()

  const handleClick = (id: string, pId: string) => {
    router.navigate({
      to: '/service/$id',
      params: { id },
      search: { pId }
    })
  }



  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  if (!personId || serviceCards.length === 0) {
    return (
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.servicesBlock}>
            <div className={styles.header}>
              <h2 className={styles.title}>Сервисы</h2>
            </div>
            <div className={styles.emptyState}>
              <h2 className={styles.emptyTitle}>Нет доступных сервисов</h2>
              <p className={styles.emptyDescription}>
                Добавьте компанию через токен доступа
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.servicesBlock}>
          <div className={styles.header}>
            <h2 className={styles.title}>Сервисы</h2>
          </div>
          
          <div className={styles.sliderContainer}>
          <div 
            ref={sliderRef}
            className={styles.slider}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            {serviceCards.map((card: ServiceCard) => (
              <div key={card.id} className={styles.serviceCardWrapper}>
                <div className={`${styles.serviceCard} ${expandedCard === card.id ? styles.expanded : ''}`}>
                  {card.isLocked && (
                    <div className={styles.lockIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H18M6 10V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    
                    {card.type === 'service' && (
                      <>
                        <div className={styles.imagePlaceholder}>
                          <div className={styles.placeholderIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                              <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2"/>
                              <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {card.type === 'autotables' && (
                      <>
                        <div className={styles.imagePlaceholder}>
                          <div className={styles.placeholderIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {card.type === 'autogems' && (
                      <div className={styles.textInfo}>
                        <div className={styles.inlineInfo}>
                          <div className={styles.renewalStatus}>
                            <span className={styles.label}>Автопродление:</span>
                            <span className={`${styles.value} ${card.autoRenewal ? styles.enabled : styles.disabled}`}>
                              {card.autoRenewal ? 'вкл' : 'выкл'}
                            </span>
                          </div>
                          <div className={styles.paymentInfo}>
                            <span className={styles.label}>Оплачено до:</span>
                            <span className={styles.value}>{card.paidUntil}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
                
                {card.type === 'service' && (
                  <button className={styles.detailsButton} disabled={card.isLocked}
                  onClick={() => handleClick(card.id, personId)}
                  >
                    Подробнее
                  </button>
                )}
                
                {card.type === 'autotables' && (
                  <button className={styles.detailsButton}                   onClick={() => handleClick(card.id, personId)}>
                    Подробнее
                  </button>
                )}
                
                {card.type === 'autogems' && (
                  <button className={styles.tableButton}                   onClick={() => handleClick(card.id, personId)}>
                    Ссылка на таблицу
                  </button>
                )}
                
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}