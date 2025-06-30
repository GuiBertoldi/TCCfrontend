jest.mock('antd/lib/_util/responsiveObserver', () => ({
  __esModule: true,
  default: { dispatch: () => {}, subscribe: () => 0, unsubscribe: () => {} }
}));
jest.mock('antd/lib/grid/hooks/useBreakpoint', () => () => ({}));

import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import PsychologistList from '../pages/psychologist-list/psychologist-list';
import { fetchPsychologists } from '../services/psychologist-service';
import { useNavigate } from 'react-router-dom';

jest.mock('../components/sidebar/sidebar', () => () => <div>Sidebar Component</div>);

jest.mock('../services/psychologist-service', () => ({
  fetchPsychologists: jest.fn()
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('PsychologistList', () => {
  const navigate = jest.fn();
  const mockData = [
    { idPsychologist: 10, idUser: { name: 'Dr. Alpha' }, crp: 'CRP-1234' },
    { idPsychologist: 20, idUser: { name: 'Dr. Beta'  }, crp: 'CRP-5678' }
  ];

  beforeEach(() => {
    fetchPsychologists.mockResolvedValue(mockData);
    useNavigate.mockReturnValue(navigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders table with fetched psychologists', async () => {
    render(<PsychologistList />);
    await waitFor(() => expect(fetchPsychologists).toHaveBeenCalled());
    expect(await screen.findByText('Dr. Alpha')).toBeInTheDocument();
    expect(screen.getByText('CRP-1234')).toBeInTheDocument();
    expect(screen.getByText('Dr. Beta')).toBeInTheDocument();
    expect(screen.getByText('CRP-5678')).toBeInTheDocument();
  });

  test('filters by name and CRP', async () => {
    render(<PsychologistList />);
    await screen.findByText('Dr. Alpha');

    const input = screen.getByPlaceholderText(/buscar por nome ou CRP/i);

    fireEvent.change(input, { target: { value: 'alpha' } });
    expect(screen.getByText('Dr. Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Dr. Beta')).toBeNull();

    fireEvent.change(input, { target: { value: '5678' } });
    expect(screen.getByText('Dr. Beta')).toBeInTheDocument();
    expect(screen.queryByText('Dr. Alpha')).toBeNull();

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('Dr. Alpha')).toBeInTheDocument();
    expect(screen.getByText('Dr. Beta')).toBeInTheDocument();
  });

  test('navigates to availabilities on button click', async () => {
    render(<PsychologistList />);
    const alphaRow = await screen.findByText('Dr. Alpha');
    const row = alphaRow.closest('tr');
    const btn = within(row).getByRole('button', { name: /ver disponibilidades/i });
    fireEvent.click(btn);
    expect(navigate).toHaveBeenCalledWith('/psychologists/10/availabilities');
  });
});