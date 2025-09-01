import React, {ButtonHTMLAttributes} from 'react';
import styles from './Button.module.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'text-white';
export type ButtonSize = 'small' | 'medium' | 'large';

type Props = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    underlineText?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
                           children,
                           variant = 'primary',
                           size = 'medium',
                           fullWidth = false,
                           isLoading = false,
                           disabled = false,
                           leftIcon,
                           rightIcon,
                           underlineText = false,
                           className = '',
                           ...props
                       }: Props) => {
    const buttonClasses = [
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        fullWidth && styles.fullWidth,
        isLoading && styles.loading,
        underlineText && styles.underline,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            className={buttonClasses}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            {...props}
        >
            {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
            {isLoading && <span className={styles.loader}>Loading...</span>}
        </button>
    );
};
