import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderCRUDPage from '../src/components/OrderCRUDPage/OrderCRUDPage.js';

it('顯示訂單管理標題', () => {
  render(<OrderCRUDPage />);

  const titleElement = screen.getByText(/訂單管理/i);
  expect(titleElement).toBeInTheDocument();
});
