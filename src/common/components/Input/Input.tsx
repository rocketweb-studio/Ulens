'use client';

import React from 'react';
import styles from '@/src/common/components/Input/Input.module.scss';

type Props = {
    type?: string;
    name: string;
    value?: string;
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}

export const Input = ({
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
                      }: Props) => {

    if (type === 'checkbox') {
        return (
            <div className={`${styles.inputContainer} ${className}`}>
                <label className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        id={name}
                        name={name}
                        checked={checked}
                        onChange={onChange}
                        disabled={disabled}
                        className={styles.checkboxInput}
                    />
                    <span className={styles.checkboxCustom} />
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
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`${styles.input} ${error ? styles.errorInput : ''}`}
            />
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};
