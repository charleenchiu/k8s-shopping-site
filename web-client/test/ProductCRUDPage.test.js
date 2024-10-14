import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductCRUDPage from '../src/components/ProductCRUDPage/ProductCRUDPage.js';

it('顯示產品管理標題', () => {
  render(<ProductCRUDPage />);

  const titleElement = screen.getByText(/產品管理/i);
  expect(titleElement).toBeInTheDocument();
});
