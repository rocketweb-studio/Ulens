import React, { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";
import Link from "next/link";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "text"
  | "text-white"
  | "in-text";
export type ButtonSize = "small" | "medium" | "large" | "inherit";
export type TagType = "button" | "link";

type Props = {
  tagType?: TagType;
  path?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  underlineText?: boolean;
  withoutPadding?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  tagType = "button",
  path = "/",
  variant = "primary",
  size = "medium",
  fullWidth = false,
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  underlineText = false,
  className = "",
  withoutPadding = false,
  ...props
}: Props) => {
  const buttonClasses = [
    styles.button,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    fullWidth && styles.fullWidth,
    isLoading && styles.loading,
    underlineText && styles.underline,
    withoutPadding && styles.withoutPadding,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      {isLoading && <span className={styles.loader}>Loading...</span>}
    </>
  );

  if (tagType === "link") {
    return (
      <Link
        href={path}
        className={buttonClasses}
        aria-disabled={disabled || isLoading}
      >
        {content}
      </Link>
    );
  }

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
