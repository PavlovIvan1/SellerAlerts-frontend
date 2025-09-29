// import { Profile } from '@components/sections/Profile/Profile'
// import { SellerCards } from '@components/sections/SellerCards/SellerCards'
// import { Services } from '@components/sections/Services/Services'
// import { Header } from '@components/ui/Header/Header'
// import { Tabs } from '@components/ui/Tabs/Tabs'
// import { usePeople } from '@hooks/usePeople'
// import { usePersonNavigation } from '@hooks/usePersonNavigation'
// import '@styles/global.css'
// import { useRef, useState } from 'react'

// export function Home() {
// 	const appRef = useRef<HTMLDivElement>(null)

// 	// локальные UI стейты
// 	const [isDragging, setIsDragging] = useState(false)
// 	const [startX, setStartX] = useState(0)
// 	const [startY, setStartY] = useState(0)
// 	const [isModalOpen, setIsModalOpen] = useState(false)
// 	const [isProfileOpen, setIsProfileOpen] = useState(false)

// 	// люди и выбранный person
// 	const { people, personId, displayPersonId, setPersonId, setDisplayPersonId, addPerson } = usePeople()

// 	// навигация по людям
// 	const { slideDirection, goToNext, goToPrevious, selectPerson } =
// 		usePersonNavigation(people, personId, setPersonId, setDisplayPersonId, isModalOpen, isProfileOpen)

// 	// свайпы (пока оставляем в App)
// 	const handleStart = (x: number, y: number) => {
// 		if (isModalOpen || isProfileOpen) return
// 		setIsDragging(true)
// 		setStartX(x)
// 		setStartY(y)
// 	}

// 	const handleMove = (x: number, y: number) => {
// 		if (!isDragging || isModalOpen || isProfileOpen) return

// 		const dx = x - startX
// 		const dy = y - startY

// 		if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 80) {
// 			if (dx > 0) {
// 				goToPrevious()
// 			} else {
// 				goToNext()
// 			}
// 			setIsDragging(false)
// 		}
// 	}


// 	const stopDrag = () => setIsDragging(false)

// 	return (
// 		<div
// 			className="AppProvider"
// 			ref={appRef}
// 			onMouseDown={e => handleStart(e.clientX, e.clientY)}
// 			onMouseMove={e => handleMove(e.clientX, e.clientY)}
// 			onMouseUp={stopDrag}
// 			onMouseLeave={stopDrag}
// 			onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
// 			onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
// 			onTouchEnd={stopDrag}
// 			style={{ cursor: isDragging ? 'grabbing' : 'default' }}
// 		>
// 			<div className="headerTabsBlock">
// 				<Header onProfileClick={() => setIsProfileOpen(true)} isProfileActive={isProfileOpen} />

// 				{isProfileOpen ? (
// 					<div className="profileHeaderSection">
// 						<button className="profileBackButton" onClick={() => setIsProfileOpen(false)}>
// 							<svg
// 								width="20"
// 								height="20"
// 								viewBox="0 0 24 24"
// 								fill="none"
// 								stroke="currentColor"
// 								strokeWidth="2"
// 							>
// 								<polyline points="15,18 9,12 15,6"></polyline>
// 							</svg>
// 						</button>
// 						<h1 className="profileTitle">Профиль</h1>
// 					</div>
// 				) : (
// 					<Tabs
// 						selectedId={personId}
// 						onSelect={selectPerson}
// 						onModalStateChange={setIsModalOpen}
// 						people={people}
// 						onAddPerson={addPerson}
// 					/>
// 				)}
// 			</div>

// 			{isProfileOpen ? (
// 				<Profile />
// 			) : (
// 				people.length > 0 && (
// 					<>
// 						<div className={`seller-cards-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
// 							<SellerCards personId={displayPersonId} />
// 						</div>
// 						<div className={`services-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
// 							<Services personId={displayPersonId} />
// 						</div>
// 					</>
// 				)
// 			)}
// 		</div>
// 	)
// }


import { getSuppliers } from '@api/services/supplierService'
import { SellerCards } from '@components/sections/SellerCards/SellerCards'
import { Services } from '@components/sections/Services/Services'
import { Header } from '@components/ui/Header/Header'
import { Tabs } from '@components/ui/Tabs/Tabs'
import { usePeople } from '@hooks/usePeople'
import { usePersonNavigation } from '@hooks/usePersonNavigation'
import '@styles/global.css'
import { useRef, useState } from 'react'

import { useEffect } from 'react'
import { loginWithTelegram } from '../api/services'

export function Home() {
  const appRef = useRef<HTMLDivElement>(null)

  // локальные UI стейты
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // люди и выбранный person
  const { people, personId, displayPersonId, setPersonId, setDisplayPersonId, addPerson } = usePeople()

  // навигация по людям
  const { slideDirection, goToNext, goToPrevious, selectPerson } =
    usePersonNavigation(people, personId, setPersonId, setDisplayPersonId, isModalOpen, false)

  // свайпы (пока оставляем в App)
  const handleStart = (x: number, y: number) => {
    if (isModalOpen) return
    setIsDragging(true)
    setStartX(x)
    setStartY(y)
  }

  const handleMove = (x: number, y: number) => {
    if (!isDragging || isModalOpen) return

    const dx = x - startX
    const dy = y - startY

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 80) {
      if (dx > 0) {
        goToPrevious()
      } else {
        goToNext()
      }
      setIsDragging(false)
    }
  }

  const stopDrag = () => setIsDragging(false)

  // Функция для обновления списка поставщиков
  const handleSuppliersUpdate = async () => {
    try {
      const response = await getSuppliers();
      // Здесь можно обновить локальное состояние или вызвать API для синхронизации
      console.log('Suppliers updated:', response.data);
    } catch (error) {
      console.error('Failed to update suppliers:', error);
    }
  }

    useEffect(() => {
      console.log('test app.tsx')
      const fetchAuth = async () => {
        const isAuthChecked = localStorage.getItem('isAuthChecked');
  
        if (!isAuthChecked) {
          try {
            const response = await loginWithTelegram(window.Telegram.WebApp.initData);
            if (response.data.user_id) {
              localStorage.setItem('isAuthChecked', 'true');
            } else {
              console.error("Backend hasn't responded with user_id");
            }
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              console.error("Invalid init_data");
            } else {
              console.error("Ошибка авторизации:", error);
            }
          }
        }
      };
  
      fetchAuth();
    }, []);

  return (
    <div
      className="AppProvider"
      ref={appRef}
      onMouseDown={e => handleStart(e.clientX, e.clientY)}
      onMouseMove={e => handleMove(e.clientX, e.clientY)}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchStart={e => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={e => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={stopDrag}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      <div className="headerTabsBlock">
        <Header />
        <Tabs
          selectedId={personId}
          onSelect={selectPerson}
          onModalStateChange={setIsModalOpen}
          people={people}
          onAddPerson={addPerson}
          onSuppliersUpdate={handleSuppliersUpdate}
        />
      </div>

      {people.length > 0 && (
        <>
          <div className={`seller-cards-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
            <SellerCards personId={displayPersonId} />
          </div>
          <div className={`services-container ${slideDirection ? `slide-${slideDirection}` : ''}`}>
            <Services personId={displayPersonId} />
          </div>
        </>
      )}
    </div>
  )
}
