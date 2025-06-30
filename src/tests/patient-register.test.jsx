jest.mock('antd/lib/grid/hooks/useBreakpoint', () => () => ({}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(q => ({
    matches: false,
    media: q,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import PatientRegister from '../pages/patient-register/patient-register';
import { createPatient } from '../services/patient-service';

jest.mock('../services/patient-service', () => ({
  createPatient: jest.fn(),
}));

describe('PatientRegister', () => {
  beforeEach(() => {
    createPatient.mockClear();
  });

  it('renderiza todos os campos e os botões', () => {
    render(<PatientRegister />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('CPF')).toBeInTheDocument();
    expect(screen.getByLabelText('Telefone')).toBeInTheDocument();
    expect(screen.getByLabelText('Contato de Emergência')).toBeInTheDocument();
    expect(screen.getByLabelText('CEP')).toBeInTheDocument();
    expect(screen.getByLabelText('Cidade')).toBeInTheDocument();
    expect(screen.getByLabelText('Bairro')).toBeInTheDocument();
    expect(screen.getByLabelText('Rua')).toBeInTheDocument();
    expect(screen.getByLabelText('Número da Casa')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Dados dos Pais/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('mostra erros de validação se submeter sem preencher', async () => {
    render(<PatientRegister />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    expect(await screen.findByText('Informe o nome')).toBeInTheDocument();
    expect(screen.getByText('Informe um e-mail válido')).toBeInTheDocument();
    expect(screen.getByText('Informe o CPF')).toBeInTheDocument();
  });

  it('abre e fecha o modal "Dados dos Pais"', () => {
    render(<PatientRegister />, { wrapper: MemoryRouter });

    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Dados dos Pais/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome do Pai')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Cancelar/i }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('chama createPatient com payload completo e limpa máscara', async () => {
    createPatient.mockResolvedValueOnce({});
    render(<PatientRegister />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'joao@ex.com' } });
    fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '123.456.789-00' } });
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(11) 91234-5678' } });
    fireEvent.change(screen.getByLabelText('Contato de Emergência'), { target: { value: '(11) 98765-4321' } });
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '01001-000' } });
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'São Paulo' } });
    fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } });
    fireEvent.change(screen.getByLabelText('Rua'), { target: { value: 'Rua A' } });
    fireEvent.change(screen.getByLabelText('Número da Casa'), { target: { value: '123' } });

    fireEvent.click(screen.getByRole('button', { name: /Dados dos Pais/i }));
    fireEvent.change(screen.getByLabelText('Nome do Pai'), { target: { value: 'Carlos Silva' } });
    fireEvent.change(screen.getByLabelText('Educação do Pai'), { target: { value: 'Ensino Médio' } });
    fireEvent.change(screen.getByLabelText('Idade do Pai'), { target: { value: '50' } });
    fireEvent.change(screen.getByLabelText('Local de Trabalho do Pai'), { target: { value: 'Empresa X' } });
    fireEvent.change(screen.getByLabelText('Profissão do Pai'), { target: { value: 'Engenheiro' } });
    fireEvent.change(screen.getByLabelText('Nome da Mãe'), { target: { value: 'Maria Silva' } });
    fireEvent.change(screen.getByLabelText('Educação da Mãe'), { target: { value: 'Superior' } });
    fireEvent.change(screen.getByLabelText('Idade da Mãe'), { target: { value: '48' } });
    fireEvent.change(screen.getByLabelText('Local de Trabalho da Mãe'), { target: { value: 'Empresa Y' } });
    fireEvent.change(screen.getByLabelText('Profissão da Mãe'), { target: { value: 'Professora' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar$/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(createPatient).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@ex.com',
        cpf: '12345678900',
        phone: '(11) 91234-5678',
        emergencyContact: '(11) 98765-4321',
        cep: '01001000',
        city: 'São Paulo',
        neighborhood: 'Centro',
        street: 'Rua A',
        number: '123',
        fatherName: 'Carlos Silva',
        fatherEducation: 'Ensino Médio',
        fatherAge: '50',
        fatherWorkplace: 'Empresa X',
        fatherProfession: 'Engenheiro',
        motherName: 'Maria Silva',
        motherEducation: 'Superior',
        motherAge: '48',
        motherWorkplace: 'Empresa Y',
        motherProfession: 'Professora',
        type: 'PACIENTE',
      });
    });
  });
});
