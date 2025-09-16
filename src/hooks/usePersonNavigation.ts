import { useEffect, useState } from 'react'
import type { Person } from './usePeople'

export function usePersonNavigation(
  people: Person[],
  personId: string,
  setPersonId: (id: string) => void,
  setDisplayPersonId: (id: string) => void,
  isModalOpen: boolean,
  isProfileOpen: boolean,
) {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const getCurrentIndex = () => people.findIndex(p => p.id === personId)

  const goToNext = () => {
    if (isTransitioning || people.length === 0) return
    const currentIndex = getCurrentIndex()
    if (currentIndex < people.length - 1) {
      setIsTransitioning(true)
      setSlideDirection('left')
      setTimeout(() => {
        setPersonId(people[currentIndex + 1].id)
        setDisplayPersonId(people[currentIndex + 1].id)
        setSlideDirection(null)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const goToPrevious = () => {
    if (isTransitioning || people.length === 0) return
    const currentIndex = getCurrentIndex()
    if (currentIndex > 0) {
      setIsTransitioning(true)
      setSlideDirection('right')
      setTimeout(() => {
        setPersonId(people[currentIndex - 1].id)
        setDisplayPersonId(people[currentIndex - 1].id)
        setSlideDirection(null)
        setIsTransitioning(false)
      }, 300)
    }
  }

  const selectPerson = (newId: string) => {
    if (isTransitioning || people.length === 0) return
    setPersonId(newId)
    setDisplayPersonId(newId)
  }

  // управление клавиатурой
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isModalOpen || isProfileOpen) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [personId, isTransitioning, isModalOpen, isProfileOpen])

  return {
    slideDirection,
    isTransitioning,
    goToNext,
    goToPrevious,
    selectPerson,
  }
}
