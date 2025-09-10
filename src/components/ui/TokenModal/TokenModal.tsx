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
  const [showToken, setShowToken] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [foundTokenInfo, setFoundTokenInfo] = useState<TokenInfo | null>(null)
  const [validationError, setValidationError] = useState('')
  const [isClosing, setIsClosing] = useState(false)
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
    if (!token.trim()) {
      setValidationError('Введите токен')
      return
    }
    
    setIsAnalyzing(true)
    setValidationError('')
    
    
    const tokenInfo = tokensData.find(t => t.token === token.trim()) as TokenInfo | undefined
    
    setTimeout(() => {
      setIsAnalyzing(false)
      if (tokenInfo) {
        setFoundTokenInfo(tokenInfo)
      } else {
        setValidationError('Токен не найден')
        setFoundTokenInfo(null)
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
      handleClose()
    }
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setToken('')
      setShowToken(false)
      setFoundTokenInfo(null)
      setValidationError('')
      setIsClosing(false)
      onClose()
    }, 300) // Match animation duration
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTokenSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className={`${styles.overlay} ${isClosing ? styles.closing : ''}`} onClick={handleClose}>
      <div className={`${styles.modal} ${isClosing ? styles.closing : ''}`} onClick={(e) => e.stopPropagation()}>
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
            <div className={styles.inputWrapper}>
              <div className={styles.tokenInputWrapper}>
                <input
                  type={showToken ? "text" : "password"}
                  className={styles.input}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Вставьте ваш токен здесь..."
                  disabled={isAnalyzing}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowToken(!showToken)}
                  disabled={isAnalyzing}
                >
                  {showToken ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <button 
                className={foundTokenInfo ? styles.connectButton : styles.analyzeButton}
                onClick={foundTokenInfo ? handleAddPerson : handleTokenSubmit}
                disabled={!token.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <div className={styles.spinner}></div>
                ) : foundTokenInfo ? (
                  'Подключиться'
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
