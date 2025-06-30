import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login/login';
import { login } from '../services/login-service';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../services/login-service', () => ({
  login: jest.fn(),
}));

describe('Login Component', () => {
  const navigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigate);
    login.mockReset();
    navigate.mockReset();

    Storage.prototype.removeItem = jest.fn();
  });

  it('renders email and password inputs and login button', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('removes token from localStorage on mount', () => {
    render(<Login />);
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });

  it('calls login and navigates on successful submit', async () => {
    login.mockResolvedValue();  // simula login bem-sucedido

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      });
    });
    expect(navigate).toHaveBeenCalledWith('/patients');
    expect(screen.queryByText(/login ou senha inválido/i)).not.toBeInTheDocument();
  });

  it('displays error message on failed login', async () => {
    login.mockRejectedValue(new Error('invalid'));

    render(<Login />);
    fireEvent.change(screen.getByPlaceholderText('E-mail'), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Senha'), {
      target: { value: 'badpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(login).toHaveBeenCalledWith({
      email: 'wrong@example.com',
      password: 'badpass'
    });

    expect(
      await screen.findByText('Login ou Senha inválido.')
    ).toBeInTheDocument();

    expect(navigate).not.toHaveBeenCalled();
  });
});
