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
import AppointmentList from '../pages/appointment-list/appointment-list';
import '@testing-library/jest-dom';
import { fetchAppointments } from '../services/appointment-service';
import { fetchPsychologists } from '../services/psychologist-service';
import { fetchPatients } from '../services/patient-service';

jest.mock('../components/sidebar/sidebar', () => () => <div>Sidebar Component</div>);
jest.mock('../services/appointment-service', () => ({
  fetchAppointments: jest.fn(),
  createAppointment: jest.fn(),
  updateAppointment: jest.fn(),
  deleteAppointment: jest.fn(),
}));
jest.mock('../services/psychologist-service', () => ({
  fetchPsychologists: jest.fn(),
}));
jest.mock('../services/patient-service', () => ({
  fetchPatients: jest.fn(),
}));

const mockPys = [{ idPsychologist: 1, idUser: { name: 'Dr. Test' } }];
const mockPats = [{ idPatient: 1, idUser: { name: 'Pat Test', cpf: '123' } }];
const mockAppts = [
  {
    idAppointment: 42,
    patient:      { idPatient: 1, idUser: { name: 'Pat Test', cpf: '123' } },
    psychologist: { idPsychologist: 1, idUser: { name: 'Dr. Test' } },
    date:   '2025-06-10',
    time:   '10:00:00',
    status: 'SCHEDULED',
    notes:  ''
  }
];

describe('AppointmentList', () => {
  beforeEach(() => {
    fetchPsychologists.mockResolvedValue(mockPys);
    fetchPatients.mockResolvedValue(mockPats);
    fetchAppointments.mockResolvedValue(mockAppts);
  });

  it('renders table with fetched data', async () => {
    render(<AppointmentList />);
    await waitFor(() => expect(fetchAppointments).toHaveBeenCalled());

    expect(await screen.findByText('Pat Test')).toBeInTheDocument();
    expect(await screen.findByText('123')).toBeInTheDocument();
    expect(await screen.findByText('Dr. Test')).toBeInTheDocument();
    expect(await screen.findByText('10:00')).toBeInTheDocument();
  });

  it('opens "Novo" modal when clicking Novo button', async () => {
    render(<AppointmentList />);
    await waitFor(() => expect(fetchAppointments).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'Novo' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Novo Agendamento')).toBeInTheDocument();
  });
});
