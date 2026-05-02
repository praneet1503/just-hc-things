"use client";

import { useState } from 'react';

export default function PasswordField({ id, name, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        required
      />
      <button
        className="password-toggle"
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        {visible ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="password-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l18 18" />
            <path d="M10.58 10.58A2 2 0 0 0 12 16a2 2 0 0 0 1.42-.58" />
            <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5.5 0 9.5 7 9.5 7a19.4 19.4 0 0 1-3.4 4.18" />
            <path d="M6.61 6.61A19.87 19.87 0 0 0 2.5 12s4 7 9.5 7a10.67 10.67 0 0 0 3.13-.48" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" className="password-icon" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 12S6.5 5 12 5s9.5 7 9.5 7-4 7-9.5 7S2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}