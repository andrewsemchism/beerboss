import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import HowTo from '../HowTo';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUseNavigate,
}));

describe('HowTo Component', () => {
  test('renders HowTo component', () => {
    render(
      <BrowserRouter>
        <HowTo />
      </BrowserRouter>
    );

    const howToTitle = screen.getByText('How To Use Beer Boss');
    const allBeerTitle = screen.getByText('All Beer Prices');
    const bestValueTitle = screen.getByText('Best Value Analyzer');

    expect(howToTitle).toBeInTheDocument();
    expect(allBeerTitle).toBeInTheDocument();
    expect(bestValueTitle).toBeInTheDocument();
  });

  it('navigates to /all when the "All Beer Prices" card is clicked', async () => {
    render(
      <BrowserRouter>
        <HowTo />
      </BrowserRouter>
    );

    const allCard = screen.getByText('All Beer Prices');
    fireEvent.click(allCard);

    expect(mockedUseNavigate).toHaveBeenCalledWith('/all');
  });

  it('navigates to /value when the "Best Value Analyzer" card is clicked', () => {
    render(
      <BrowserRouter>
        <HowTo />
      </BrowserRouter>
    );

    const valueCard = screen.getByText('Best Value Analyzer');
    fireEvent.click(valueCard);

    expect(mockedUseNavigate).toHaveBeenCalledWith('/value');
  });
});
