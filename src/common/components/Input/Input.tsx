'use client';

import React, {ReactNode, useState} from 'react';
import styles from '@/src/common/components/Input/Input.module.scss';
import {FieldValues, Path, UseFormRegister} from "react-hook-form";
import {RegistrationInputs} from "@/src/feature/auth/lib/schemas";
import Image from "next/image";
import eyeOnSvg from "@/public/eye-outline.svg";
import eyeOffSvg from "@/public/eye-off-outline.svg";

type Props<T extends FieldValues = RegistrationInputs> = {
    type?: string
    name?: Path<T>
    id?: string
    value?: string
    checked?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    label?: string | ReactNode
    error?: string
    disabled?: boolean
    className?: string
    register?: UseFormRegister<T>
    showPasswordToggle?: boolean
}

export const Input = <T extends FieldValues = RegistrationInputs>({
                                                                      type = 'text',
                                                                      name,
                                                                      value,
                                                                      checked,
                                                                      onChange,
                                                                      placeholder = '',
                                                                      label,
                                                                      error,
                                                                      id,
                                                                      disabled = false,
                                                                      className = '',
                                                                      register,
                                                                      showPasswordToggle = false
                                                                  }: Props<T>) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle && type === 'password' && showPassword ? 'text' : type;

    if (type === 'checkbox') {
        return (
            <div className={`${styles.inputContainer} ${className}`}>
                <label className={styles.checkboxContainer} htmlFor={id}>
                    <input
                        type="checkbox"
                        disabled={disabled}
                        className={styles.checkboxInput}
                        id={id}
                        {...(register && name ? register(name) : {name, onChange, checked})}
                    />
                    <span className={styles.checkboxCustom}/>
                    {label && (
                        <span className={styles.checkboxLabel}>
                            {label}
                        </span>
                    )}
                </label>
                {error && <span className={styles.errorText}>{error}</span>}
            </div>
        );
    }

    return (
        <div className={`${styles.inputContainer} ${className}`}>
            {label && (
                <label htmlFor={id} className={styles.label}>
                    {label}
                </label>
            )}
            <div className={styles.inputWrapper}>
                <input
                    type={inputType}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`${styles.input} ${error ? styles.errorInput : ''} ${showPasswordToggle && type === 'password' ? styles.passwordInput : ''}`}
                    id={id}
                    {...(register && name ? register(name) : {name, onChange})}
                />
                {showPasswordToggle && type === "password" && (
                    <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={disabled}
                    >
                        <Image
                            src={showPassword ? eyeOnSvg : eyeOffSvg}
                            alt={showPassword ? "Hide" : "Show"}
                            width={24}
                            height={24}
                        />
                    </button>
                )}
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};
