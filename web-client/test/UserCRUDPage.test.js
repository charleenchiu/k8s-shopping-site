import React from 'react';
import { render, screen } from '@testing-library/react';
import UserCRUDPage from '../src/components/UserCRUDPage/UserCRUDPage.js';

it('顯示使用者管理標題', () => {
  render(<UserCRUDPage />);

  const titleElement = screen.getByText(/使用者管理/i);
  expect(titleElement).toBeInTheDocument();
});
