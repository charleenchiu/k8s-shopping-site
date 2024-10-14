// web-client/test/App.test.js
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/index.js';

it('渲染登入頁面', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <App />
    </MemoryRouter>
  );

  const linkElement = screen.getByText(/歡迎來到管理系統/i);
  expect(linkElement).toBeInTheDocument();
});