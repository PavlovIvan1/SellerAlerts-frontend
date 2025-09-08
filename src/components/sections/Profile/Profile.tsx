import accountData from '../../../data/account.json'
import styles from './Profile.module.css'

export function Profile() {
	return (
		<div className={styles.profilePage}>
			<div className={styles.profileContent}>
				<div className={styles.userSection}>
					<h2 className={styles.sectionTitle}>О пользователе</h2>
					
					<div className={styles.infoField}>
						<span className={styles.fieldLabel}>ФИО</span>
						<span className={styles.fieldValue}>{accountData.user.fullName}</span>
					</div>
					
					<div className={styles.infoField}>
						<span className={styles.fieldLabel}>Дата рождения</span>
						<span className={styles.fieldValue}>{accountData.user.dateOfBirth}</span>
					</div>
				</div>
			</div>
		</div>
	)
}