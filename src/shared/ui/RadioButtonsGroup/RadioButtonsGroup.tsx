'use client'

import React, { ChangeEvent, ReactNode } from 'react'
import s from './RadioButtonsGroup.module.scss'
import { FieldValues, Path, UseFormRegister } from 'react-hook-form'

type RadioOption = {
  value: string
  label: string | ReactNode
  disabled?: boolean
}

type Props<T extends FieldValues> = {
  name: Path<T>
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  label?: string | ReactNode
  error?: string
  disabled?: boolean
  className?: string
  register?: UseFormRegister<T>
  required?: boolean
  direction?: 'horizontal' | 'vertical'
}

export const RadioButtonsGroup = <T extends FieldValues>({
  name,
  options,
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  register,
  required = false,
  direction = 'vertical',
}: Props<T>) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <div className={`${s.radioGroupContainer} ${className}`}>
      {label && <legend className={`${s.legend} ${required ? s.required : ''}`}>{label}</legend>}

      <div className={`${s.radioGroup} ${s[direction]}`}>
        {options.map((option) => {
          const inputProps =
            register && name ?
              register(name, {
                onChange: handleChange,
                required,
                disabled: disabled || option.disabled,
              })
            : {
                name,
                value: option.value,
                checked: value === option.value,
                onChange: handleChange,
                disabled: disabled || option.disabled,
                required,
              }

          return (
            <label key={option.value} className={`${s.radioLabel} ${disabled || option.disabled ? s.disabled : ''}`}>
              <input type='radio' className={s.radioInput} {...inputProps} />
              <span className={s.customRadio} />
              <span className={s.radioText}>{option.label}</span>
            </label>
          )
        })}
      </div>

      {error && <div className={s.errorText}>{error}</div>}
    </div>
  )
}
