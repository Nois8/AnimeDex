'use client'

import { useState, useTransition } from 'react'
import { Settings, X } from 'lucide-react'
import { updateProfileAction } from '@/controllers/profile.controller'

interface EditProfileModalProps {
  initialUsername: string
  initialBio: string
}

export function EditProfileModal({ initialUsername, initialBio }: EditProfileModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio || '')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleOpen = () => {
    setUsername(initialUsername)
    setBio(initialBio || '')
    setError('')
    setIsOpen(true)
  }

  const handleClose = () => {
    if (!isPending) {
      setIsOpen(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('bio', bio)

      const result = await updateProfileAction(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          backgroundColor: '#444',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500,
          cursor: 'pointer',
          fontFamily: 'inherit',
          flexShrink: 0,
        }}
      >
        <Settings style={{ width: '14px', height: '14px' }} />
        Edit Profile
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={handleClose}
        >
          {/* Modal Content */}
          <div
            style={{
              backgroundColor: '#1E1E1E',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '480px',
              padding: '32px',
              position: 'relative',
              border: '1px solid #333',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>Edit Profile</h2>
              <button
                onClick={handleClose}
                disabled={isPending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#EF4444', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#CCC', marginBottom: '8px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isPending}
                  style={{
                    width: '100%',
                    backgroundColor: '#101010',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFED70'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#CCC', marginBottom: '8px' }}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={isPending}
                  style={{
                    width: '100%',
                    backgroundColor: '#101010',
                    border: '1px solid #333',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '15px',
                    outline: 'none',
                    minHeight: '120px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFED70'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isPending}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#CCC',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '14px',
                    padding: '0 20px',
                    height: '42px',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    backgroundColor: '#FFED70',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 600,
                    fontSize: '14px',
                    padding: '0 24px',
                    height: '42px',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    opacity: isPending ? 0.7 : 1,
                    fontFamily: 'inherit'
                  }}
                >
                  {isPending ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
