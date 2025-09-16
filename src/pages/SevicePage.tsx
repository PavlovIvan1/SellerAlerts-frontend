import { Header } from '@/components/ui/Header/Header'
import { Input } from '@/components/ui/Input/Input'
import { serviceRoute } from '@/routes/service/$id'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import rawServices from '../data/servicesByPerson.json'
import styles from './ServicePage.module.css'

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
  guide?: string[]
  type: 'service' | 'autotables' | 'autogems'
  isLocked?: boolean
  autoRenewal?: boolean
  paidUntil?: string
}

const servicesByPerson = rawServices as Record<string, ServiceCard[]>

export function ServicePage() {
  const { id } = serviceRoute.useParams()
  const { pId } = serviceRoute.useSearch()
  const navigate = useNavigate()
  const [isGuideMode, setIsGuideMode] = useState(false)

  if (!pId) {
    return <h2>Не указан пользователь (pId)</h2>
  }

  const personServices = servicesByPerson[pId] ?? []
  const service = personServices.find((s) => s.id === id)

  if (!service) {
    return <h2>Сервис {id} не найден для {pId}</h2>
  }

  return (
    <div className={styles.profilePage}>
      {/* --- Header + Back --- */}
      <div className={styles.headerBlock}>
        <Header />
        <div className={styles.serviceHeaderSection}>
          <button
            className={styles.backButton}
            onClick={() => navigate({ to: '/' })}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <h1 className={styles.serviceTitle}>
            {isGuideMode ? `Инструкция ${service.title}` : service.title}
          </h1>
        </div>
      </div>

      {/* --- Основной контент или инструкция --- */}
      <div className={styles.profileContent}>
        {!isGuideMode ? (
          <div className={styles.userSection}>
            <h2 className={styles.sectionTitle}>{service.titleDescription}</h2>

            <div className={styles.contentSection}>
              <p>{service.description}</p>

              {service.video && (
                <video src={service.video} controls className={styles.serviceVideo}></video>
              )}

              <img
                src={service.photo}
                alt={service.title}
                className={styles.serviceImage}
              />

              {/* --- Как это работает --- */}
              <div className={styles.howItWorksBlock}>
                <h3 className={styles.sectionTitle}>Как это работает?</h3>
                <div className={styles.howItWorks}>
                  {service.howItWorks.map((step, index) => (
                    <div key={index} className={styles.howStep}>
                      <div className={styles.stepNumber}>{index + 1}</div>
                      <div className={styles.stepText}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Преимущества --- */}
              <div className={styles.featuresBlock}>
                <h3 className={styles.sectionTitle}>Преимущества</h3>
                <div className={styles.advantages}>
                  {service.advantages.map((item, index) => (
                    <div key={index} className={styles.advantageItem}>
                      <span className={styles.advantageDot} />
                      <span className={styles.advantageText}>{item}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.advantageOffer}>{service.advantageOffer}</p>
              </div>

              <button
                className={styles.connectButton}
                onClick={() => setIsGuideMode(true)}
              >
                Подключить
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.guideSection}>
            <h2 className={styles.sectionTitle}>Шаги подключения</h2>
            <div className={styles.howItWorks}>
              {service.guide?.map((step, index) => (
                <div key={index} className={styles.howStep}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <div className={styles.stepText}>{step}</div>
                </div>
              ))}
            </div>

            {service.type === 'autotables' && (
              <Input />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
