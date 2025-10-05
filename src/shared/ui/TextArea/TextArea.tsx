'use client'

import React, { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import styles from '@/src/shared/ui/TextArea/TextArea.module.scss'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { RegistrationInputs } from '@/src/entities/auth/model/schemas/registrationSchema'

type Props<T extends FieldValues = RegistrationInputs> = {
  name?: Path<T>
  id?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  label?: string | ReactNode
  error?: string
  disabled?: boolean
  className?: string
  register?: UseFormRegister<T>
  rows?: number
  maxLength?: number
  withCounter?: boolean
}

export const TextArea = <T extends FieldValues = RegistrationInputs>({
  name,
  value,
  onChange,
  placeholder = '',
  label,
  error,
  id,
  disabled = false,
  className = '',
  register,
  rows = 3,
  maxLength,
  withCounter = false,
}: Props<T>) => {
  const errorRef = useRef<HTMLDivElement>(null)
  const errorTextRef = useRef<HTMLSpanElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    if (!errorRef.current || !errorTextRef.current || !error) return

    const checkOverflow = () => {
      const containerWidth = errorRef.current?.clientWidth || 0
      const textWidth = errorTextRef.current?.scrollWidth || 0

      const overflowing = textWidth > containerWidth
      setIsOverflowing(overflowing)

      if (overflowing && errorTextRef.current) {
        const scrollAmount = textWidth - containerWidth
        errorTextRef.current.style.setProperty('--scroll-amount', `-${scrollAmount}px`)

        const duration = scrollAmount / 100 + 4
        errorTextRef.current.style.setProperty('--animation-duration', `${duration}s`)
      }
    }

    checkOverflow()

    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [error])

  return (
    <div className={`${styles.textAreaContainer} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.textAreaWrapper}>
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`${styles.textArea} ${error ? styles.errorInput : ''}`}
          id={id}
          {...(register && name ? register(name, { onChange }) : { name, onChange })}
        />
      </div>
      {withCounter && maxLength && (
        <div className={styles.counter}>
          {value?.length || 0}/{maxLength}
        </div>
      )}
      {error && (
        <div ref={errorRef} className={styles.errorText}>
          <span ref={errorTextRef} className={`${styles.errorTextContent} ${isOverflowing ? styles.animated : ''}`}>
            {error}
          </span>
        </div>
      )}
    </div>
  )
}
