import React from 'react';
import { render, screen } from '@testing-library/react';
import LoginPage from '../src/LoginPage.js';

it('顯示登入頁面標題', () => {
  render(<LoginPage />);

  const titleElement = screen.getByText(/登入/i);
  expect(titleElement).toBeInTheDocument();
});

it('顯示使用者名和密碼輸入框', () => {
  render(<LoginPage />);

  const usernameInput = screen.getByPlaceholderText(/使用者名/i);
  const passwordInput = screen.getByPlaceholderText(/密碼/i);
  
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});
