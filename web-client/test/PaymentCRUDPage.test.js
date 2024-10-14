import React from 'react';
import { render, screen } from '@testing-library/react';
import PaymentCRUDPage from '../src/components/PaymentCRUDPage/PaymentCRUDPage.js';

it('顯示付款管理標題', () => {
  render(<PaymentCRUDPage />);

  const titleElement = screen.getByText(/付款管理/i);
  expect(titleElement).toBeInTheDocument();
});
