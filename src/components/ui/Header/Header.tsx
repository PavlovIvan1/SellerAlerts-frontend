// import { CircleUserRound } from 'lucide-react'
// import accountData from '../../../data/account.json'
// import styles from './Header.module.css'

// interface HeaderProps {
// 	onProfileClick: () => void
// 	isProfileActive?: boolean
// }

// export function Header({ onProfileClick, isProfileActive }: HeaderProps) {
// 	return (
// 		<header className={styles.header}>
// 			<div className={styles.container}>
// 				<div className={styles.logo}>
// 					<div className={styles.appTitle}>
// 						seller<span className={styles.colon}>:</span>alert
// 					</div>
// 					<div className={styles.greeting}>Привет, {accountData.user.firstName}!</div>
// 				</div>
				
// 				<div className={styles.userSection}>
// 					<button 
// 						className={`${styles.profileButton} ${isProfileActive ? styles.profileButtonActive : ''}`} 
// 						onClick={onProfileClick}
// 					>
// 						<CircleUserRound size={24} strokeWidth={1.5} />
// 					</button>
// 				</div>
// 			</div>
// 		</header>
// 	)
// }


import { useRouterState } from '@tanstack/react-router'
import { CircleUserRound } from 'lucide-react'
import accountData from '../../../data/account.json'
import styles from './Header.module.css'

export function Header() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const isProfileActive = currentPath.startsWith('/profile')

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.appTitle}>
            seller<span className={styles.colon}>:</span>alert
          </div>
          <div className={styles.greeting}>
            Привет, {accountData.user.firstName}!
          </div>
        </div>

        <div className={styles.userSection}>
          <a
            href="/profile"
            className={`${styles.profileButton} ${
              isProfileActive ? styles.profileButtonActive : ''
            }`}
          >
            <CircleUserRound size={24} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </header>
  )
}
