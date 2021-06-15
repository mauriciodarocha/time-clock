import React from 'react';
import { act, render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

type Callback = () => void

const fillOutSignInForm = (employeeId: string, employeePassword: string) => {
  const employeeIdField = document.querySelector('.employee-id-fld input') as HTMLInputElement
  const employeePwdField = document.querySelector('.employee-pwd-fld input') as HTMLInputElement
  employeeIdField.value = employeeId
  employeePwdField.value = employeePassword

  const form = document.querySelector('.time-home-form') as HTMLButtonElement;
  form.dispatchEvent(new Event("submit"));
  return {
    then: (fun: Callback) => { 
      fun()
    }
  }
}

test('App rendering', () => {
  render(<App />);
})

test('Links (No Auth)', () => {
  render(<App />);
  const links = document.querySelectorAll('.links .link')
  expect(links.length).toEqual(2)
});

test('Click on Clock menu (No Auth)', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  act(() => {
    const link = document.querySelector('.links .clock-lnk') as HTMLAnchorElement;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  })
  
  const text = screen.getByText(/Please sign in to continue/)
  expect(text).toBeInTheDocument()
})

test('Go to Admin (No Auth)', () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        assign: () => {}
    }
  });
  const url = "/time-clock/admin";
  window.location.pathname = url
  expect(window.location.pathname).toEqual(url)
})

test('Go to Admin (No Form & No Auth)', () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        assign: () => {}
    }
  });
  const url = "/time-clock/admin";
  window.location.pathname = url

  setTimeout(() => {
    const btn = document.querySelector('.no-auth .btn-go-home') as HTMLButtonElement
    expect(btn.nodeName).toEqual('BUTTON')
  }, 0);
})

test('Click on Logo', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  act(() => {
    const link = document.querySelector('.logo-lnk') as HTMLAnchorElement
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  })
  
  const form = document.querySelector('.time-home-form') as HTMLFormElement
  expect(form.nodeName).toBe('FORM');
})

test('Click on Admin menu (Authenticated)', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  act(() => {
    const homeLnk = document.querySelector('.links .home-lnk') as HTMLAnchorElement;
    homeLnk.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    setTimeout(() => {
      fillOutSignInForm("0.1", "admin")
    }, 0);
  })

  setTimeout(() => {
    const form = document.querySelector('.time-admin-form') as HTMLFormElement
    expect(form.nodeName).toBe('FORM');
  }, 0);
})

test('Click on Clock menu (Authenticated)', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  act(() => {
    const homeLnk = document.querySelector('.links .home-lnk') as HTMLAnchorElement;
    homeLnk.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    setTimeout(() => {
      fillOutSignInForm("mary@company", "mary123")
    }, 0);

    const link = document.querySelector('.links .clock-lnk') as HTMLAnchorElement;
    link.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  })
  setTimeout(() => {
    const form = document.querySelector('.time-clock-form') as HTMLFormElement
    expect(form.nodeName).toBe('FORM');
  }, 0);
})

