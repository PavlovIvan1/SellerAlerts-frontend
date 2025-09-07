import { CircleUserRound } from 'lucide-react'
import styles from './Header.module.css'


interface HeaderProps {
	currentPersonName?: string
	onProfileClick: () => void
	isProfileActive?: boolean
}

export function Header({ currentPersonName, onProfileClick, isProfileActive }: HeaderProps) {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.logo}>
					<div className={styles.appTitle}>
						seller<span className={styles.colon}>:</span>alert
					</div>
					{currentPersonName && (
						<div className={styles.greeting}>Привет, {currentPersonName}!</div>
					)}
				</div>
				
				<div className={styles.userSection}>
					<button 
						className={`${styles.profileButton} ${isProfileActive ? styles.profileButtonActive : ''}`} 
						onClick={onProfileClick}
					>
						<CircleUserRound size={22} strokeWidth={1.5} />
					</button>
				</div>
			</div>
		</header>
	)
}
