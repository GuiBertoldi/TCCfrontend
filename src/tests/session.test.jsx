if (typeof window.matchMedia !== 'function') {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  });
}

jest.mock('../axiosConfig.jsx', () => ({ get: jest.fn(), post: jest.fn() }));
jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }));

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SessionForm from '../pages/sessions/session';
import * as patientService from '../services/patient-service';
import * as sessionsService from '../services/sessions-service';
import { jwtDecode } from 'jwt-decode';
import { message } from 'antd';

describe('SessionForm', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('fake-token');
    jwtDecode.mockReturnValue({ sub: '123' });

    jest
      .spyOn(patientService, 'fetchPatientsByUserId')
      .mockResolvedValue([{ idUser: 5, name: 'João', cpf: '11122233344' }]);
    jest
      .spyOn(patientService, 'fetchUserById')
      .mockResolvedValue({ idUser: 123, name: 'Dr. Teste' });
    jest.spyOn(sessionsService, 'createSession').mockResolvedValue({});
    jest.spyOn(message, 'success').mockImplementation(() => {});
    jest.spyOn(message, 'error').mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  it('renderiza campos e botões principais', async () => {
    render(
      <MemoryRouter>
        <SessionForm />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(patientService.fetchPatientsByUserId).toHaveBeenCalled();
      expect(patientService.fetchUserById).toHaveBeenCalled();
    });

    expect(screen.getByLabelText('Paciente')).toBeInTheDocument();
    expect(screen.getByLabelText('Psicólogo')).toBeInTheDocument();
    expect(screen.getByLabelText('Data da Sessão')).toBeInTheDocument();
    expect(screen.getByLabelText('Motivo')).toBeInTheDocument();
    expect(screen.getByLabelText('Descrição da Sessão')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Tratamentos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acompanhamentos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Sessão/i })).toBeInTheDocument();
  });

  it('valida campos obrigatórios ao submeter vazio', async () => {
    render(
      <MemoryRouter>
        <SessionForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /Criar Sessão/i }));

    expect(await screen.findByText('Selecione o paciente!')).toBeInTheDocument();
    expect(screen.getByText('Informe o motivo!')).toBeInTheDocument();
  });

  it('submete com payload correto', async () => {
    render(
      <MemoryRouter>
        <SessionForm />
      </MemoryRouter>
    );
    await waitFor(() => expect(patientService.fetchPatientsByUserId).toHaveBeenCalled());

    fireEvent.mouseDown(screen.getByLabelText('Paciente'));
    await waitFor(() =>
      expect(screen.getByText(/João - CPF: 11122233344/i)).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText(/João - CPF: 11122233344/i));

    fireEvent.change(screen.getByLabelText('Motivo'), {
      target: { value: 'Teste' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Criar Sessão/i }));

    await waitFor(() => {
      const call = sessionsService.createSession.mock.calls[0][0];
      expect(call.patientId).toBe(5);
      expect(call.idUser).toBe(123);
      expect(call.reason).toBe('Teste');
      expect(call.description).toBeUndefined();
      expect(call.sessionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(message.success).toHaveBeenCalledWith('Sessão criada com sucesso!');
    });
  });
});
