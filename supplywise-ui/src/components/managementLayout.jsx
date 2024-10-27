import Sidebar from "./sidebar";
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api_url';

export default function DashboardLayout({ children }) {

    const [companyDetails, setCompanyDetails] = useState(null);
    const [sessionUser, setSessionUser] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem('loggedUser') === null) {
                var token = sessionStorage.getItem('sessionToken');
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
                        setCompanyDetails(data.company);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                setSessionUser(JSON.parse(sessionStorage.getItem('loggedUser')));
                setCompanyDetails(JSON.parse(sessionStorage.getItem('loggedUser')).company);
            }
        }
    }, []);

    const [companyToCreate, setCompanyToCreate] = useState('');
    const [restaurantToCreate, setRestaurantToCreate] = useState('');
    
    const handleCompanyCreation = (e) => {
        e.preventDefault();
    
        const token = sessionStorage.getItem('sessionToken');
        const email = sessionStorage.getItem('email');
    
        fetch(`${API_URL}/company/create?name=${companyToCreate}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create company');
                }
                return response.text();
            })
            .then((message) => {
                console.log(message);
    
                // Fetch user data to get company information
                return fetch(`${API_URL}/users/email/${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                return response.json();
            })
            .then((data) => {
                const company = data.company;
                console.log(company);
                if (company !== null) {
                    // Create restaurant only if the company exists
                    return fetch(`${API_URL}/restaurants/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ name: restaurantToCreate, company: company }),
                    });
                } else {
                    throw new Error('Company does not exist');
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create restaurant');
                }
                return response.text();
            })
            .then((message) => {
                console.log(message);
                sessionStorage.removeItem('loggedUser');
                // Optionally, reload or navigate after success
                window.location.reload();
            })
            .catch((error) => console.error(error));
    };


    return (
        <main>
            <Head>
                <title>Supplywise | Management</title>
                <meta name="description" content="Your solution for inventory management" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/Logo_Icon.png" />
            </Head>

            <div className="container-fluid" style={{ padding: '0px', height: '100vh', width: '100vw' }}>
                <div className="row" style={{ margin: 0 }}>
                    <Sidebar sessionUser={sessionUser} />
                    <div className="col-10" style={{ overflowY: 'auto', height: '100vh' }}>
                        <div className="container">
                            {
                                companyDetails !== null ?
                                    <>
                                        <div className="row mt-5">
                                            <h1>{companyDetails?.name}</h1>
                                            <h5>Created at <i className="text-muted">{companyDetails?.createdAt.split('.')[0].replace('T', ' ')}</i></h5>
                                        </div>
                                        <div className="row mt-2">
                                            {children}
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="row mt-5">
                                            <form onSubmit={handleCompanyCreation}>
                                                <h2>Create a Company</h2>
                                                <h5>Start by creating a company to manage your inventory</h5>
                                                <div className="form-group mt-3">
                                                    {/* <label htmlFor="companyToCreate">Company Name</label> */}
                                                    <input
                                                        type="text"
                                                        id="companyToCreate"
                                                        className="form-control"
                                                        placeholder="Company Name"
                                                        value={companyToCreate}
                                                        onChange={(e) => setCompanyToCreate(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <h5 className="mt-3">Then, name your first restaurant</h5>
                                                <div className="form-group mt-3">
                                                    {/* <label htmlFor="restaurantToCreate">Restaurant Name</label> */}
                                                    <input
                                                        type="text"
                                                        id="restaurantToCreate"
                                                        className="form-control"
                                                        placeholder="Restaurant Name"
                                                        value={restaurantToCreate}
                                                        onChange={(e) => setRestaurantToCreate(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <button type="submit" className="btn sw-bgcolor mt-3">Create</button>
                                            </form>
                                        </div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
