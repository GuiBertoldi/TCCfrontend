jest.mock('antd/lib/_util/responsiveObserver', () => ({
  __esModule: true,
  default: {
    dispatch:    () => {},
    subscribe:   () => 0,
    unsubscribe: () => {},
  }
}));
jest.mock('antd/lib/grid/hooks/useBreakpoint', () => () => ({}));

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PatientList from '../pages/patient-list/patient-list';
import '@testing-library/jest-dom';
import { fetchPatientsByUserId } from '../services/patient-service';
import { useNavigate } from 'react-router-dom';

jest.mock('../components/sidebar/sidebar', () => () => <div>Sidebar Component</div>);
jest.mock('../services/patient-service', () => ({
  fetchPatientsByUserId: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PatientList', () => {
  const navigate = jest.fn();
  const mockPatients = [
    { idUser: 1, name: 'Alice', cpf: '11122233344' },
    { idUser: 2, name: 'Bob',   cpf: '55566677788' },
  ];

  beforeEach(() => {
    fetchPatientsByUserId.mockResolvedValue(mockPatients);
    useNavigate.mockReturnValue(navigate);
  });

  it('renders table with fetched patients', async () => {
    render(<PatientList />);
    await waitFor(() => expect(fetchPatientsByUserId).toHaveBeenCalled());
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(await screen.findByText('11122233344')).toBeInTheDocument();
    expect(await screen.findByText('Bob')).toBeInTheDocument();
    expect(await screen.findByText('55566677788')).toBeInTheDocument();
  });

  it('filters patients by name and CPF', async () => {
    render(<PatientList />);
    await waitFor(() => expect(fetchPatientsByUserId).toHaveBeenCalled());
    const input = screen.getByPlaceholderText(/buscar por nome ou cpf/i);

    fireEvent.change(input, { target: { value: 'alice' } });
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '5556' } });
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('navigates to edit and sessions on icon clicks', async () => {
    render(<PatientList />);
    await waitFor(() => expect(fetchPatientsByUserId).toHaveBeenCalled());

    const editIcons = screen.getAllByRole('img', { name: /^edit/ });
    fireEvent.click(editIcons[0].closest('button'));
    expect(navigate).toHaveBeenCalledWith('/patient-edit/1');

    const listIcons = screen.getAllByRole('img', { name: /^unordered-list/ });
    fireEvent.click(listIcons[0].closest('button'));
    expect(navigate).toHaveBeenCalledWith('/sessions-list/1');
  });
});
