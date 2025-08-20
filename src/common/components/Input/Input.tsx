'use client';

import React from 'react';
import styles from '@/src/common/components/Input/Input.module.scss';
import {FieldValues, Path, UseFormRegister} from "react-hook-form";
import {RegistrationInputs} from "@/src/feature/auth/lib/schemas";

type Props<T extends FieldValues = RegistrationInputs> = {
    type?: string;
    name?: Path<T>;
    value?: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    register?: UseFormRegister<T>;
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
                                                                      disabled = false,
                                                                      className = '',
                                                                      register
                                                                  }: Props<T>) => {

    if (type === 'checkbox') {
        return (
            <div className={`${styles.inputContainer} ${className}`}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        disabled={disabled}
                        className={styles.checkboxInput}
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
                <label htmlFor={name} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                className={`${styles.input} ${error ? styles.errorInput : ''}`}
                {...(register && name ? register(name) : {name, onChange})}
            />
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};
