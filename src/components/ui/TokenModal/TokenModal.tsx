import { useState } from 'react'
import styles from './TokenModal.module.css'

interface TokenModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Permission {
  name: string
  hasAccess: boolean
}

export function TokenModal({ isOpen, onClose }: TokenModalProps) {
  const [token, setToken] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
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
    if (!token.trim()) return
    
    setIsAnalyzing(true)
    
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTokenSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Анализ токена доступа</h2>
          <button className={styles.closeButton} onClick={onClose}>
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
              <button 
                className={styles.analyzeButton}
                onClick={handleTokenSubmit}
                disabled={!token.trim() || isAnalyzing}
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

          {isAnalyzing && (
            <div className={styles.analyzing}>
              <div className={styles.spinner}></div>
              <span>Загрузка ...</span>
            </div>
          )}

          <div className={styles.permissionsSection}>
            <h3 className={styles.permissionsTitle}>Права доступа:</h3>
            <div className={styles.permissionsList}>
              {permissions.map((permission, index) => (
                <div key={index} className={styles.permissionItem}>
                  <div className={`${styles.permissionDot} ${permission.hasAccess ? styles.hasAccess : styles.noAccess}`}>
                    {permission.hasAccess ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`${styles.permissionName} ${permission.hasAccess ? styles.hasAccessText : styles.noAccessText}`}>
                    {permission.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
