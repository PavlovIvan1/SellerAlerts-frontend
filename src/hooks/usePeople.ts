import { useEffect, useState } from 'react'

export interface Person {
  id: string
  name: string
  status: string
  balance: string
  autoRenewal: boolean
}

export function usePeople() {
  const [people, setPeople] = useState<Person[]>(() => {
    try {
      const saved = localStorage.getItem('seller-alert-people')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [personId, setPersonId] = useState(() => {
    try {
      return localStorage.getItem('seller-alert-selected-person') || ''
    } catch {
      return ''
    }
  })

  const [displayPersonId, setDisplayPersonId] = useState('')

  // сохраняем людей
  useEffect(() => {
    localStorage.setItem('seller-alert-people', JSON.stringify(people))
  }, [people])

  // сохраняем выбранного
  useEffect(() => {
    if (personId) {
      localStorage.setItem('seller-alert-selected-person', personId)
    } else {
      localStorage.removeItem('seller-alert-selected-person')
    }
  }, [personId])

  // устанавливаем displayPersonId
  useEffect(() => {
    if (people.length > 0) {
      if (personId && people.find(p => p.id === personId)) {
        setDisplayPersonId(personId)
      } else if (!personId) {
        const firstId = people[0].id
        setPersonId(firstId)
        setDisplayPersonId(firstId)
      }
    }
  }, [people, personId])

  const addPerson = (person: Person) => {
    if (!people.find(p => p.id === person.id)) {
      setPeople(prev => [...prev, person])
      if (!personId) {
        setPersonId(person.id)
        setDisplayPersonId(person.id)
      }
    }
  }

  return {
    people,
    personId,
    displayPersonId,
    setPersonId,
    setDisplayPersonId,
    addPerson,
  }
}
