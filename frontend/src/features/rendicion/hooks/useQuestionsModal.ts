import { useState } from 'react'
import type { RendicionAxis } from '../types/rendicion'

export function useQuestionsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAxis, setSelectedAxis] = useState<RendicionAxis | null>(null)

  const openModal = (axis: RendicionAxis) => {
    setSelectedAxis(axis)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedAxis(null)
  }

  return {
    isOpen,
    selectedAxis,
    openModal,
    closeModal
  }
}