jest.mock('antd/lib/_util/responsiveObserver', () => ({
  __esModule: true,
  default: { dispatch: () => {}, subscribe: () => 0, unsubscribe: () => {} }
}));
jest.mock('antd/lib/grid/hooks/useBreakpoint', () => () => ({}));

import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import SessionList from '../pages/sessions-list/session-list';
import { fetchSessionsByUserId } from '../services/sessions-service';
import { useNavigate, MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../components/sidebar/sidebar', () => () => <div>Sidebar Component</div>);

jest.mock('../services/sessions-service', () => ({
  fetchSessionsByUserId: jest.fn()
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('SessionList', () => {
  const navigate = jest.fn();
  const mockSessions = [
    {
      idSession: 1,
      sessionNumber: 100,
      sessionDate: '2025-06-15',
      idPatient: { idUser: { name: 'Patient A' } },
      idPsychologist: { idUser: { name: 'Dr. Alpha' } }
    },
    {
      idSession: 2,
      sessionNumber: 200,
      sessionDate: '2025-07-01',
      idPatient: { idUser: { name: 'Patient B' } },
      idPsychologist: { idUser: { name: 'Dr. Beta' } }
    }
  ];

  beforeEach(() => {
    fetchSessionsByUserId.mockResolvedValue(mockSessions);
    useNavigate.mockReturnValue(navigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with fetched data in descending sessionNumber order', async () => {
    render(
      <MemoryRouter initialEntries={['/sessions/123']}>
        <Routes>
          <Route path="/sessions/:idUser" element={<SessionList />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(fetchSessionsByUserId).toHaveBeenCalledWith('123'));

    expect(screen.getByText(/nº da consulta/i)).toBeInTheDocument();
    expect(screen.getByText(/data da consulta/i)).toBeInTheDocument();

    screen.getAllByRole('row').filter(r => {
      return within(r).queryByText('100') == null;
    });
    const firstNumberCell = screen.getAllByText('200')[0];
    expect(firstNumberCell).toBeInTheDocument();
    expect(screen.getByText('01/07/2025')).toBeInTheDocument();
    expect(screen.getByText('Dr. Beta')).toBeInTheDocument();
  });

  it('filters by psychologist name', async () => {
    render(
      <MemoryRouter initialEntries={['/sessions/123']}>
        <Routes>
          <Route path="/sessions/:idUser" element={<SessionList />} />
        </Routes>
      </MemoryRouter>
    );
    await screen.findByText('Dr. Alpha');

    const input = screen.getByPlaceholderText(/buscar por psicólogo/i);
    fireEvent.change(input, { target: { value: 'alpha' } });
    expect(screen.getByText('Dr. Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Dr. Beta')).toBeNull();
  });

  it('navigates to edit page on edit button click', async () => {
    render(
      <MemoryRouter initialEntries={['/sessions/123']}>
        <Routes>
          <Route path="/sessions/:idUser" element={<SessionList />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => expect(fetchSessionsByUserId).toHaveBeenCalled());

    const cell = screen.getByText('100');
    const row = cell.closest('tr');
    expect(row).not.toBeNull();
    const btn = within(row).getByRole('button', { name: /edit/i });
    fireEvent.click(btn);
    expect(navigate).toHaveBeenCalledWith('/session-edit/1');
  });
});
