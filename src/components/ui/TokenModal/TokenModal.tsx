import { addToken, getTokenScopes } from '@api/services/tokenService'
import { useEffect, useState } from 'react'
import { decodeWbToken, type DecodedToken } from '../../../utils/decodeToken'
import styles from './TokenModal.module.css'

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPerson: (person: any) => void;
  onSuppliersUpdate?: () => void;
}

interface Permission {
  name: string;
  hasAccess: boolean;
}

interface TokenInfo {
  token: string;
  personId: string;
  personName: string;
  phone: string;
  status: string;
  balance: string;
  autoRenewal: boolean;
  permissions: {
    analytics: boolean;
    reviews: boolean;
    promotion: boolean;
    content: boolean;
    statistics: boolean;
    editing: boolean;
    reports: boolean;
  };
}

export function TokenModal({ isOpen, onClose, onAddPerson, onSuppliersUpdate }: TokenModalProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [foundTokenInfo, setFoundTokenInfo] = useState<TokenInfo | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [validationError, setValidationError] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [allowedScopes, setAllowedScopes] = useState<number[]>([]);
  const [permissions] = useState<Permission[]>([
    { name: 'Аналитика', hasAccess: true },
    { name: 'Отзывы и вопросы', hasAccess: true },
    { name: 'Продвижение', hasAccess: true },
    { name: 'Контент', hasAccess: true },
    { name: 'Статистика', hasAccess: true },
    { name: 'Доступ на редактирование', hasAccess: true },
    { name: 'Отчеты', hasAccess: false }
  ]);

  // Загружаем допустимые скоупы при открытии модала
  useEffect(() => {
    if (isOpen) {
      loadAllowedScopes();
    }
  }, [isOpen]);

  const loadAllowedScopes = async () => {
    try {
      const response = await getTokenScopes();
      const requiredScopes = response.data.data
        .filter(scope => scope.type === 'REQUIRED')
        .map(scope => {
          // Маппинг названий скоупов на номера битов
          const scopeMap: { [key: string]: number } = {
            'content': 1,
            'contentanalytics': 2,
            'discountsandprices': 3,
            'marketplace': 4,
            'statistics': 5,
            'advert': 6,
            'questionsandfeedback': 7,
            'recommendations': 8,
            'buyerchat': 9,
            'supplies': 10,
            'returns': 11,
            'documents': 12,
            'read-only': 30,
          };
          return scopeMap[scope.value] || 0;
        })
        .filter(num => num > 0);
      setAllowedScopes(requiredScopes);
    } catch (error) {
      console.error('Failed to load token scopes:', error);
      setValidationError('Не удалось загрузить требования к токену');
    }
  };

  const handleTokenChange = (value: string) => {
    setToken(value);
    setValidationError('');
    setFoundTokenInfo(null);
    setDecodedToken(null);

    // Автоматически декодируем токен при вводе
    if (value.trim() && allowedScopes.length > 0) {
      try {
        const decoded = decodeWbToken(value.trim(), allowedScopes);
        setDecodedToken(decoded);

        if (decoded.expired) {
          setValidationError('Токен просрочен');
        } else if (!decoded.isValidForOurUse) {
          setValidationError('Токен не содержит необходимых прав доступа');
        } else {
          // Токен валиден, показываем информацию
          setFoundTokenInfo({
            token: value.trim(),
            personId: decoded.supplierId || 'unknown',
            personName: `Поставщик ${decoded.supplierId || 'неизвестен'}`,
            phone: '',
            status: `Действителен до ${decoded.expiredAt.toLocaleDateString()}`,
            balance: '-',
            autoRenewal: true,
            permissions: {
              analytics: decoded.scopes.includes(2), // contentanalytics
              reviews: decoded.scopes.includes(7), // questionsandfeedback
              promotion: decoded.scopes.includes(6), // advert
              content: decoded.scopes.includes(1), // content
              statistics: decoded.scopes.includes(5), // statistics
              editing: !decoded.readOnly,
              reports: false, // всегда false
            },
          });
        }
      } catch (error) {
        setValidationError('Неверный формат токена');
        setDecodedToken(null);
      }
    }
  };

  const handleTokenSubmit = async () => {
    if (!token.trim()) {
      setValidationError('Введите токен');
      return;
    }

    if (!decodedToken?.isValidForOurUse) {
      setValidationError('Токен не прошел валидацию');
      return;
    }

    setIsConfirming(true);
    setValidationError('');

    try {
      const response = await addToken(token.trim());
      if (response.status === 201 && response.data?.token_id) {
        // Успешно добавили токен, обновляем список поставщиков
        if (onSuppliersUpdate) {
          onSuppliersUpdate();
        }
        
        // Добавляем человека в локальный список
        if (foundTokenInfo) {
          const person = {
            id: foundTokenInfo.personId,
            name: foundTokenInfo.personName,
            status: foundTokenInfo.status,
            balance: foundTokenInfo.balance,
            autoRenewal: foundTokenInfo.autoRenewal
          };
          onAddPerson(person);
        }
        
        handleClose();
      } else {
        setValidationError('Не удалось подтвердить токен');
      }
    } catch (e: any) {
      if (e?.response?.status === 400) {
        setValidationError('Токен неактивен или удален');
      } else {
        setValidationError(e?.response?.data?.message || 'Ошибка при добавлении токена');
      }
    } finally {
      setIsConfirming(false);
    }
  };


  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setToken('');
      setShowToken(false);
      setFoundTokenInfo(null);
      setDecodedToken(null);
      setValidationError('');
      setIsClosing(false);
      onClose();
    }, 300); // Match animation duration
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && decodedToken?.isValidForOurUse) {
      handleTokenSubmit();
    }
  };

  if (!isOpen) return null;

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
                  onChange={(e) => handleTokenChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Вставьте ваш токен здесь..."
                  disabled={isConfirming}
                />
                <button
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowToken(!showToken)}
                  disabled={isConfirming}
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
                onClick={foundTokenInfo ? handleTokenSubmit : handleTokenSubmit}
                disabled={!token.trim() || isConfirming || !decodedToken?.isValidForOurUse}
              >
                {isConfirming ? (
                  <div className={styles.spinner}></div>
                ) : foundTokenInfo ? (
                  'Подтвердить'
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

          {decodedToken && !validationError && (
            <div className={styles.tokenInfo}>
              <h4>Информация о токене:</h4>
              <p><strong>Поставщик ID:</strong> {decodedToken.supplierId || 'Неизвестен'}</p>
              <p><strong>Действителен до:</strong> {decodedToken.expiredAt.toLocaleString()}</p>
              <p><strong>Права доступа:</strong> {decodedToken.scopesNamed.join(', ')}</p>
              {decodedToken.readOnly && <p><strong>Режим:</strong> Только чтение</p>}
            </div>
          )}

          <div className={styles.permissionsSection}>
            <h3 className={styles.permissionsTitle}>Права доступа:</h3>
            <div className={styles.permissionsList}>
              {permissions.map((permission, index) => {
                let hasAccess = false;
                if (foundTokenInfo) {
                  switch (permission.name) {
                    case 'Аналитика':
                      hasAccess = foundTokenInfo.permissions.analytics;
                      break;
                    case 'Отзывы и вопросы':
                      hasAccess = foundTokenInfo.permissions.reviews;
                      break;
                    case 'Продвижение':
                      hasAccess = foundTokenInfo.permissions.promotion;
                      break;
                    case 'Контент':
                      hasAccess = foundTokenInfo.permissions.content;
                      break;
                    case 'Статистика':
                      hasAccess = foundTokenInfo.permissions.statistics;
                      break;
                    case 'Доступ на редактирование':
                      hasAccess = foundTokenInfo.permissions.editing;
                      break;
                    case 'Отчеты':
                      hasAccess = false; // Всегда красные
                      break;
                    default:
                      hasAccess = false;
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}