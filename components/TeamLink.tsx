'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import TeamModal from './TeamModal'

interface Props {
  tla: string
  name: string
  children: React.ReactNode
  className?: string
}

export default function TeamLink({ tla, name, children, className }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`text-left hover:opacity-70 transition-opacity cursor-pointer ${className ?? ''}`}
      >
        {children}
      </button>
      {open && createPortal(
        <TeamModal tla={tla} name={name} onClose={() => setOpen(false)} />,
        document.body
      )}
    </>
  )
}
