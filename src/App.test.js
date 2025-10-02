import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders learn react link', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = screen.queryByText(/learn react/i);
  console.log('Link element:', linkElement); // Add this line to log the link element
  expect(linkElement).toBeInTheDocument();
});
