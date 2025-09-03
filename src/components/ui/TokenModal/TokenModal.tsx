import { useState } from 'react'
import tokensData from '../../../data/tokens.json'
import styles from './TokenModal.module.css'

interface TokenModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPerson: (person: any) => void
}

interface Permission {
  name: string
  hasAccess: boolean
}

interface TokenInfo {
  token: string
  personId: string
  personName: string
  phone: string
  status: string
  balance: string
  autoRenewal: boolean
  permissions: {
    analytics: boolean
    reviews: boolean
    promotion: boolean
    content: boolean
    statistics: boolean
    editing: boolean
    reports: boolean
  }
}

export function TokenModal({ isOpen, onClose, onAddPerson }: TokenModalProps) {
  const [token, setToken] = useState('')
  const [phone, setPhone] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [foundTokenInfo, setFoundTokenInfo] = useState<TokenInfo | null>(null)
  const [showConnectionInfo, setShowConnectionInfo] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [permissions] = useState<Permission[]>([
    { name: 'Аналитика', hasAccess: true },
    { name: 'Отзывы и вопросы', hasAccess: true },
    { name: 'Продвижение', hasAccess: true },
    { name: 'Контент', hasAccess: true },
    { name: 'Статистика', hasAccess: true },
    { name: 'Доступ на редактирование', hasAccess: true },
    { name: 'Отчеты', hasAccess: false }
  ])

  const handleTokenSubmit = async () => {
    if (!token.trim() || !phone.trim()) {
      setValidationError('Введите токен и номер телефона')
      return
    }
    
    setIsAnalyzing(true)
    setValidationError('')
    
    // Search for token in the database
    const tokenInfo = tokensData.find(t => t.token === token.trim()) as TokenInfo | undefined
    
    setTimeout(() => {
      setIsAnalyzing(false)
      if (tokenInfo && tokenInfo.phone === phone.trim()) {
        setFoundTokenInfo(tokenInfo)
        setShowConnectionInfo(true)
      } else if (tokenInfo && tokenInfo.phone !== phone.trim()) {
        setValidationError('Неверный номер телефона для данного токена')
        setFoundTokenInfo(null)
        setShowConnectionInfo(false)
      } else {
        setValidationError('Токен не найден')
        setFoundTokenInfo(null)
        setShowConnectionInfo(false)
      }
    }, 1500)
  }

  const handleAddPerson = () => {
    if (foundTokenInfo) {
      const person = {
        id: foundTokenInfo.personId,
        name: foundTokenInfo.personName,
        status: foundTokenInfo.status,
        balance: foundTokenInfo.balance,
        autoRenewal: foundTokenInfo.autoRenewal
      }
      onAddPerson(person)
      setToken('')
      setPhone('')
      setFoundTokenInfo(null)
      setShowConnectionInfo(false)
      setValidationError('')
      onClose()
    }
  }

  const handleClose = () => {
    setToken('')
    setPhone('')
    setFoundTokenInfo(null)
    setShowConnectionInfo(false)
    setValidationError('')
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTokenSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Анализ токена доступа</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.inputSection}>
            <label className={styles.label}>Введите токен доступа:</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                className={styles.input}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Вставьте ваш токен здесь..."
                disabled={isAnalyzing}
              />
            </div>
          </div>

          <div className={styles.inputSection}>
            <label className={styles.label}>Номер телефона:</label>
            <div className={styles.inputWrapper}>
              <input
                type="tel"
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="+7 (XXX) XXX-XX-XX"
                disabled={isAnalyzing}
              />
              <button 
                className={styles.analyzeButton}
                onClick={handleTokenSubmit}
                disabled={!token.trim() || !phone.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <div className={styles.spinner}></div>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {validationError && (
            <div className={styles.errorMessage}>
              {validationError}
            </div>
          )}

          {isAnalyzing && (
            <div className={styles.analyzing}>
              <div className={styles.spinner}></div>
              <span>Загрузка ...</span>
            </div>
          )}

          {showConnectionInfo && foundTokenInfo && (
            <div className={styles.connectionInfo}>
              <h3 className={styles.connectionTitle}>Информация о подключении:</h3>
              <div className={styles.connectionDetails}>
                <div className={styles.connectionItem}>
                  <span className={styles.connectionLabel}>Имя:</span>
                  <span className={styles.connectionValue}>{foundTokenInfo.personName}</span>
                </div>
                <div className={styles.connectionItem}>
                  <span className={styles.connectionLabel}>Телефон:</span>
                  <span className={styles.connectionValue}>{foundTokenInfo.phone}</span>
                </div>
                <div className={styles.connectionItem}>
                  <span className={styles.connectionLabel}>Статус:</span>
                  <span className={styles.connectionValue}>{foundTokenInfo.status}</span>
                </div>
              </div>
              <div className={styles.connectionActions}>
                <button className={styles.connectButton} onClick={handleAddPerson}>
                  Подключиться
                </button>
                <button className={styles.cancelButton} onClick={() => {
                  setShowConnectionInfo(false)
                  setFoundTokenInfo(null)
                  setToken('')
                  setPhone('')
                  setValidationError('')
                }}>
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className={styles.permissionsSection}>
            <h3 className={styles.permissionsTitle}>Права доступа:</h3>
            <div className={styles.permissionsList}>
              {permissions.map((permission, index) => {
                let hasAccess = false
                if (foundTokenInfo) {
                  switch (permission.name) {
                    case 'Аналитика':
                      hasAccess = foundTokenInfo.permissions.analytics
                      break
                    case 'Отзывы и вопросы':
                      hasAccess = foundTokenInfo.permissions.reviews
                      break
                    case 'Продвижение':
                      hasAccess = foundTokenInfo.permissions.promotion
                      break
                    case 'Контент':
                      hasAccess = foundTokenInfo.permissions.content
                      break
                    case 'Статистика':
                      hasAccess = foundTokenInfo.permissions.statistics
                      break
                    case 'Доступ на редактирование':
                      hasAccess = foundTokenInfo.permissions.editing
                      break
                    case 'Отчеты':
                      hasAccess = false // Всегда красные
                      break
                    default:
                      hasAccess = false
                  }
                }
                
                return (
                  <div key={index} className={styles.permissionItem}>
                    <div className={`${styles.permissionDot} ${
                      foundTokenInfo ? 
                        (hasAccess ? styles.hasAccess : styles.noAccess) : 
                        styles.inactive
                    }`}>
                      {foundTokenInfo && hasAccess ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : foundTokenInfo ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <span>?</span>
                      )}
                    </div>
                    <span className={`${styles.permissionName} ${
                      foundTokenInfo ? 
                        (hasAccess ? styles.hasAccessText : styles.noAccessText) : 
                        styles.inactiveText
                    }`}>
                      {permission.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
