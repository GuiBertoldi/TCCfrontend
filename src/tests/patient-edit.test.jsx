import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PatientEdit from '../pages/patient-edit/patient-edit';
import { fetchPatientById, updatePatient } from '../services/patient-service';

jest.mock('antd/lib/grid/hooks/useBreakpoint', () => () => ({}));
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('../services/patient-service', () => ({
  fetchPatientById: jest.fn(),
  updatePatient: jest.fn(),
}));

const mockPatientData = {
  idPatient: 42,
  name: 'John Doe',
  email: 'john@example.com',
  cpf: '12345678900',
  phone: '11987654321',
  emergencyContact: '11911222333',
  cep: '01001000',
  city: 'São Paulo',
  neighborhood: 'Centro',
  street: 'Rua A',
  number: '100',
  fatherName: 'Carlos Silva',
  fatherEducation: 'Ensino Médio',
  fatherAge: 50,
  fatherWorkplace: 'Empresa X',
  fatherProfession: 'Engenheiro',
  motherName: 'Maria Silva',
  motherEducation: 'Superior',
  motherAge: 48,
  motherWorkplace: 'Empresa Y',
  motherProfession: 'Professora',
  idUser: {},
};

describe('PatientEdit', () => {
  beforeEach(() => {
    fetchPatientById.mockClear();
    updatePatient.mockClear();
  });

  function renderWithRouter() {
    return render(
      <MemoryRouter initialEntries={['/patient-edit/1']}>
        <Routes>
          <Route path="/patient-edit/:idUser" element={<PatientEdit />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it('popula o formulário com os dados retornados pelo serviço', async () => {
    fetchPatientById.mockResolvedValueOnce(mockPatientData);

    renderWithRouter();

    expect(fetchPatientById).toHaveBeenCalledWith('1');

    await waitFor(() =>
      expect(screen.getByLabelText('Nome')).toHaveValue('John Doe')
    );

    expect(screen.getByLabelText('E-mail')).toHaveValue('john@example.com');
    expect(screen.getByLabelText('CPF')).toHaveValue('123.456.789-00');
    expect(screen.getByLabelText('CEP')).toHaveValue('01001-000');
    expect(screen.getByLabelText('Número da Casa')).toHaveValue('100');
  });

  it('abre e fecha o modal "Dados dos Pais"', async () => {
    fetchPatientById.mockResolvedValueOnce(mockPatientData);
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    );

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Dados dos Pais/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome do Pai')).toHaveValue('Carlos Silva');

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).toBeNull()
    );
  });

  it('submete alterações chamando updatePatient com payload correto e navega', async () => {
    fetchPatientById.mockResolvedValueOnce(mockPatientData);
    updatePatient.mockResolvedValueOnce({});
    renderWithRouter();

    await waitFor(() =>
      expect(screen.getByLabelText('Nome')).toHaveValue('John Doe')
    );

    fireEvent.change(screen.getByLabelText('Nome'), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText('CPF'), {
      target: { value: '987.654.321-00' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Dados dos Pais/i }));
    await waitFor(() =>
      expect(screen.getByLabelText('Nome do Pai')).toBeInTheDocument()
    );
    fireEvent.change(screen.getByLabelText('Nome do Pai'), {
      target: { value: 'Novo Pai' },
    });
    const saveButtons = screen.getAllByRole('button', { name: /^Salvar$/i });
    fireEvent.click(saveButtons[1]);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).toBeNull()
    );

    fireEvent.click(screen.getByRole('button', { name: /^Salvar$/i }));

    await waitFor(() => {
      expect(updatePatient).toHaveBeenCalledWith(
        mockPatientData.idPatient,
        expect.objectContaining({
          name: 'Jane Doe',
          cpf: '98765432100',
          fatherName: 'Novo Pai',
          motherAge: 48,
          type: 'PACIENTE',
        })
      );
    });
  });
});
