'use client';

import React, {ChangeEvent, ReactNode, useEffect, useRef, useState} from 'react';
import styles from '@/src/shared/components/Input/Input.module.scss';
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
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
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
    const [showPassword, setShowPassword] = useState(false)
    const errorRef = useRef<HTMLDivElement>(null)
    const errorTextRef = useRef<HTMLSpanElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const inputType = showPasswordToggle && type === 'password' && showPassword ? 'text' : type

    useEffect(() => {
        if (!errorRef.current || !errorTextRef.current || !error) return;

        const checkOverflow = () => {
            const containerWidth = errorRef.current?.clientWidth || 0;
            const textWidth = errorTextRef.current?.scrollWidth || 0;

            const overflowing = textWidth > containerWidth;
            setIsOverflowing(overflowing);

            if (overflowing && errorTextRef.current) {
                const scrollAmount = textWidth - containerWidth;
                errorTextRef.current.style.setProperty('--scroll-amount', `-${scrollAmount}px`);

                const duration = (scrollAmount / 100) + 4; // 20px в секунду
                errorTextRef.current.style.setProperty('--animation-duration', `${duration}s`);
            }
        };

        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [error]);

    if (type === 'checkbox') {

        return (
            <div className={`${styles.inputContainer} ${className}`}>
                <label className={styles.checkboxContainer} htmlFor={id}>
                    <input
                        type="checkbox"
                        disabled={disabled}
                        className={styles.checkboxInput}
                        id={id}
                        {...(register && name ? register(name, {onChange}) : {name, onChange, checked})}
                    />
                    <span className={styles.checkboxCustom}/>
                    {label && (
                        <span className={styles.checkboxLabel}>
                            {label}
                        </span>
                    )}
                </label>
                {error && (
                    <div ref={errorRef} className={styles.errorText}>
                        {error}
                    </div>
                )}
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
                    {...(register && name ? register(name, {onChange}) : {name, onChange})}
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
            {error && (
                <div ref={errorRef} className={styles.errorText}>
                    <span
                        ref={errorTextRef}
                        className={`${styles.errorTextContent} ${isOverflowing ? styles.animated : ''}`}
                    >
                        {error}
                    </span>
                </div>
            )}
        </div>
    );
};
