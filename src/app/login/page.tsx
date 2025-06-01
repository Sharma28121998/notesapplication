'use client';

import styles from './login.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InfoNote from '../components/InfoNote';

interface UserState {
  username: string;
  email: string;
  password: string;
  isAuthenticated: boolean;
}

const Login = () => {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      setError('Email not found. Please sign up to create an account.');
      return;
    }

    const user = JSON.parse(userData) as UserState;

    // Check if email exists
    if (email !== user.email) {
      setError('Email not found. Please sign up to create an account.');
      return;
    }

    // Check if password matches
    if (password !== user.password) {
      setError('Invalid password');
      return;
    }

    // If both email and password match
    setError('');
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Login</h1>
        
        <InfoNote message="Please use the same credentials you used during signup to log in." />
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
            />
          </div>

          {error && (
            <div className={styles.errorContainer}>
              <p className={styles.error}>{error}</p>
              {error.includes('Email not found') && (
                <Link href="/signup" className={styles.signupLink}>
                  Go to Sign Up
                </Link>
              )}
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>

        <p className={styles.signupLink}>
          Don't have an account?{' '}
          <Link href="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 