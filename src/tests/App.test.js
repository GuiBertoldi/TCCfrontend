import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import '@testing-library/jest-dom';

jest.mock('../pages/login/login', () => () => <div>Login Page</div>);
jest.mock('../components/sidebar/sidebar', () => () => <div>Sidebar Component</div>);
jest.mock('../pages/patient-register/patient-register', () => () => <div>Patient Register Page</div>);
jest.mock('../pages/patient-edit/patient-edit', () => () => <div>Patient Edit Page</div>);
jest.mock('../pages/patient-list/patient-list', () => () => <div>Patient List Page</div>);
jest.mock('../pages/sessions/session', () => () => <div>Session Form Page</div>);
jest.mock('../pages/sessions-edit/session-edit', () => () => <div>Session Edit Page</div>);
jest.mock('../pages/sessions-list/session-list', () => () => <div>Session List Page</div>);
jest.mock('../pages/appointment-list/appointment-list', () => () => <div>Appointment List Page</div>);
jest.mock('../pages/availability-list/availability-list', () => () => <div>Availability List Page</div>);
jest.mock('../pages/psychologist-list/psychologist-list', () => () => <div>Psychologist List Page</div>);

jest.mock('../components/protected-route', () => {
  const React = require('react');
  const PropTypes = require('prop-types');
  const MockProtectedRoute = ({ children }) => <>{children}</>;
  MockProtectedRoute.propTypes = {
    children: PropTypes.node
  };
  return MockProtectedRoute;
});

describe('App Routing', () => {
  test('renderiza Login em /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renderiza bem-vinda na raiz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Bem-vindo ao Sistema')).toBeInTheDocument();
    expect(
      screen.getByText('Esta é a página inicial. Use o menu acima para navegar.')
    ).toBeInTheDocument();
  });

  test('renderiza Sidebar em rota desconhecida', () => {
    render(
      <MemoryRouter initialEntries={['/rota-inexistente']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Sidebar Component')).toBeInTheDocument();
  });
});
