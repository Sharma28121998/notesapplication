import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'grey';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'medium',
  children,
  className,
  ...props
}: ButtonProps) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button; 