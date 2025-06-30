jest.mock('antd/lib/_util/responsiveObserver', () => ({
  __esModule: true,
  default: {
    dispatch:    () => {},
    subscribe:   () => 0,
    unsubscribe: () => {},
  }
}));
jest.mock('antd/lib/grid/hooks/useBreakpoint', () => () => ({}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ idPsychologist: '123' })
}));

import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import AvailabilityList from '../pages/availability-list/availability-list';
import '@testing-library/jest-dom';
import {
  fetchAvailabilitiesByPsychologistId
} from '../services/availability-service';

jest.mock('../components/sidebar/sidebar', () => () => <div>Sidebar Component</div>);
jest.mock('../services/availability-service', () => ({
  fetchAvailabilitiesByPsychologistId: jest.fn(),
  createAvailability:                  jest.fn(),
  updateAvailability:                  jest.fn(),
  deleteAvailability:                  jest.fn(),
}));

const mockList = [
  { id: 1, dayOfWeek: 'MONDAY',  startTime: '08:00:00', endTime: '09:00:00' },
  { id: 2, dayOfWeek: 'TUESDAY', startTime: '10:00:00', endTime: '11:00:00' }
];

describe('AvailabilityList', () => {
  beforeEach(() => {
    fetchAvailabilitiesByPsychologistId.mockResolvedValue(mockList);
  });

  it('renders table with fetched availabilities', async () => {
    render(<AvailabilityList />);
    await waitFor(() =>
      expect(fetchAvailabilitiesByPsychologistId).toHaveBeenCalledWith(123)
    );
    expect(await screen.findByText('08:00 - 09:00')).toBeInTheDocument();
    expect(await screen.findByText('10:00 - 11:00')).toBeInTheDocument();
  });

  it('opens "Nova Disponibilidade" modal when clicking the button', async () => {
    render(<AvailabilityList />);
    await waitFor(() =>
      expect(fetchAvailabilitiesByPsychologistId).toHaveBeenCalled()
    );
    const openButton = screen.getByRole('button', { name: /nova disponibilidade/i });
    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    expect(within(dialog).getByText('Nova Disponibilidade')).toBeInTheDocument();
  });
});
