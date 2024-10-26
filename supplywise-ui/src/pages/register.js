import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../../api_url';

export default function Register() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        document.getElementById('register-error').classList.add('visually-hidden');
        try {
          if (password !== confirmPassword) {
            const registerError = document.getElementById('register-error');
            registerError.innerText = 'Passwords do not match';
            registerError.classList.remove('visually-hidden');
            return;
          }
    
          fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "name": fullname,
              "email": email,
              "password": password,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(response.statusText || 'HTTP error, status = ' + response.status);
              }
              return response.text().then((text) => text ? JSON.parse(text) : {});
            })
            .then((data) => {
              sessionStorage.setItem('sessionToken', data.token);
              router.push('/management');
            })
            .catch((error) => {
              const registerError = document.getElementById('register-error');
              console.error(error);
              if (error.message.includes('400')) {
                registerError.innerText = 'Invalid user';
              } else if (error.message.includes('409')) {
                registerError.innerText = 'User already registered';
              } else {
                registerError.innerText = 'An error occurred while registering the user';
              }
              registerError.classList.remove('visually-hidden');
            });
    
        } catch (error) {
          const registerError = document.getElementById('register-error');
          console.error(error);
          if (error.message.includes('400')) {
            registerError.innerText = 'Invalid user';
          } else if (error.message.includes('409')) {
            registerError.innerText = 'User already registered';
          } else {
            registerError.innerText = 'An error occurred while registering the user';
          }
          registerError.classList.remove('visually-hidden');
        }
      };    

    return (
        <main>
            <Head>
                <title>Supplywise | Register</title>
                <meta name="description" content="Register in SupplyWise" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/Logo_Icon.png" />
            </Head>
            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow-lg" style={{ width: '400px' }}>
                    <h2 className="text-center mb-4">Register</h2>
                    <form>
                        <div className="form-group mb-3">
                            <input
                                type="fullname"
                                className="form-control"
                                id="fullname"
                                placeholder="Full Name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div id="register-error" className='visually-hidden text-danger'>
                          &nbsp;
                          <span>Invalid credentials</span>
                        </div>
                        <button type="button" onClick={handleRegister} className="btn text-white border-0 sw-bgcolor w-100">Register</button>
                    </form>
                    <div className="mt-3 text-center">
                        <span className="sw-color forgot-password" onClick={() => window.location.href = '/login'}>
                            Already have an account? Sign In
                        </span>
                    </div>
                </div>
            </div>
        </main>
    );
}
