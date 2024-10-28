import Sidebar from "./sidebar";
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api_url';

export default function ProfileLayout({ children }) {

    const [sessionUser, setSessionUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem('loggedUser') === null) {
                const token = sessionStorage.getItem('sessionToken');
                fetch(`${API_URL}/users/email/${sessionStorage.getItem('email')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        sessionStorage.setItem('loggedUser', JSON.stringify(data));
                        setSessionUser(data);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                setSessionUser(JSON.parse(sessionStorage.getItem('loggedUser')));
            }
        }
    }, []);

    return (
        <main>
            <Head>
                <title>Supplywise | Profile</title>
                <meta name="description" content="Your personal profile information" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/Logo_Icon.png" />
            </Head>

            <div className="container-fluid" style={{ padding: '0px', height: '100vh', width: '100vw' }}>
                <div className="row" style={{ margin: 0 }}>
                    <Sidebar sessionUser={sessionUser} />
                    <div className="col-10" style={{ overflowY: 'auto', height: '100vh', padding: '20px' }}>
                        <h1 style={{ fontSize: '36px', textAlign: 'center', margin: '20px 0' }}>
                            My Profile
                        </h1>
                        <div className="container">
                            <div className="row mt-2">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
