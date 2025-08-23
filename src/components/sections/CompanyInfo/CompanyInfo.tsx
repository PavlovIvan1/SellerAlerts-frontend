import { useMemo } from 'react'
import styles from './CompanyInfo.module.css'

interface CompanyData {
  id: string
  name: string
  status: string
  inn?: string
  ogrn?: string
  address?: string
  registrationDate?: string
  director?: string
  phone?: string
  email?: string
  activities?: string[]
  bankDetails?: {
    bank: string
    account: string
    bik: string
  }
}

interface Props {
  personId: string
}

// Моковые данные для демонстрации
const companyData: Record<string, CompanyData> = {
  ivanov: {
    id: 'ivanov',
    name: 'ИП Иванов Иван Иванович',
    status: 'Активно до 21.08.2025',
    inn: '123456789012',
    ogrn: '321123456789012',
    address: 'г. Москва, ул. Тверская, д. 1, кв. 10',
    registrationDate: '15.03.2020',
    phone: '+7 (495) 123-45-67',
    email: 'ivanov@example.com',
    activities: ['Розничная торговля', 'Услуги по ремонту техники', 'Консультационные услуги'],
    bankDetails: {
      bank: 'ПАО Сбербанк',
      account: '40802810123456789012',
      bik: '044525225'
    }
  },
  petrova: {
    id: 'petrova',
    name: 'ООО "Петрова и Ко"',
    status: 'Активно до 15.12.2025',
    inn: '987654321098',
    ogrn: '1029876543210987',
    address: 'г. Санкт-Петербург, Невский пр., д. 50, оф. 15',
    registrationDate: '10.07.2018',
    director: 'Петрова Анна Сергеевна',
    phone: '+7 (812) 987-65-43',
    email: 'info@petrova-co.ru',
    activities: ['Оптовая торговля', 'Логистические услуги', 'Импорт товаров'],
    bankDetails: {
      bank: 'ПАО ВТБ',
      account: '40702810987654321098',
      bik: '044525745'
    }
  },
  sidorov: {
    id: 'sidorov',
    name: 'ИП Сидоров Алексей Петрович',
    status: 'Неактивно',
    inn: '111222333444',
    ogrn: '321111222333444',
    address: 'г. Екатеринбург, ул. Ленина, д. 25, кв. 5',
    registrationDate: '20.11.2019',
    phone: '+7 (343) 555-44-33',
    email: 'sidorov@mail.ru',
    activities: ['Производство мебели', 'Строительные услуги'],
    bankDetails: {
      bank: 'ПАО Россельхозбанк',
      account: '40802810111222333444',
      bik: '044525111'
    }
  }
}

export function CompanyInfo({ personId }: Props) {
  const company = useMemo(() => companyData[personId], [personId])

  if (!company) {
    return null
  }

  const isActive = company.status.includes('Активно')

  return (
    <section className={styles.companySection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>{company.name}</h2>
          <div className={`${styles.status} ${isActive ? styles.active : styles.inactive}`}>
            {company.status}
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.mainInfo}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Основная информация</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>ИНН:</span>
                  <span className={styles.value}>{company.inn}</span>
                </div>
                {company.ogrn && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>ОГРН:</span>
                    <span className={styles.value}>{company.ogrn}</span>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span className={styles.label}>Дата регистрации:</span>
                  <span className={styles.value}>{company.registrationDate}</span>
                </div>
                {company.director && (
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Директор:</span>
                    <span className={styles.value}>{company.director}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Контактная информация</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Адрес:</span>
                  <span className={styles.value}>{company.address}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Телефон:</span>
                  <span className={styles.value}>{company.phone}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email:</span>
                  <span className={styles.value}>{company.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.sideInfo}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Виды деятельности</h3>
              <div className={styles.activitiesList}>
                {company.activities.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <span className={styles.activityDot}>•</span>
                    <span className={styles.activityText}>{activity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Банковские реквизиты</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Банк:</span>
                  <span className={styles.value}>{company.bankDetails.bank}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Счет:</span>
                  <span className={styles.value}>{company.bankDetails.account}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>БИК:</span>
                  <span className={styles.value}>{company.bankDetails.bik}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
