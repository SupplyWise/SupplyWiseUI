import Sidebar from "./sidebar";
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api_url';
import Cookies from 'js-cookie';

export default function DashboardLayout({ children }) {

    const [companyDetails, setCompanyDetails] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (Cookies.get('access_token') === undefined) {
                window.location.href = 'https://eu-west-1cqv0ahnls.auth.eu-west-1.amazoncognito.com/login?client_id=3p7arovt4ql7qasmbjg52u1qas&redirect_uri=http://localhost:3000/login&response_type=code&scope=email+openid+phone';
            }

            // Test to check if the backend is correctly handling Cognito tokens
            let token = Cookies.get('access_token');
            fetch(`${API_URL}/users/test-franchise_owner`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.error(error);
                });


            if (sessionStorage.getItem('company') === null) {
                const token = Cookies.get('access_token');
                fetch(`${API_URL}/company/details`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Include the access token
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            // Handle specific HTTP errors
                            if (response.status === 403) {
                                throw new Error("User is not eligible to view company details.");
                            } else if (response.status === 404) {
                                throw new Error("Company not found.");
                            } else {
                                throw new Error("An error occurred while fetching company details.");
                            }
                        }
                        console.log(response);
                        return response.json(); // Parse response JSON if successful
                    })
                    .then((data) => {
                        const company = data; // Convert string response to JSON if needed
                        setCompanyDetails(company); // Set the company details
                        sessionStorage.setItem('company', JSON.stringify(company)); // Cache company details in sessionStorage
                    })
                    .catch((error) => {
                        console.error("Error fetching company details:", error.message);
                    });
            } else {
                setCompanyDetails(JSON.parse(sessionStorage.getItem('company'))); // Use cached company details
            }                
        }
    }, []);

    const [companyToCreate, setCompanyToCreate] = useState('');
    const [restaurantToCreate, setRestaurantToCreate] = useState('');

    const handleCompanyCreation = async (e) => {
        e.preventDefault();
    
        const token = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token'); // Assuming you store the refresh token in cookies
    
        try {
            // Step 1: Create the company
            const companyResponse = await fetch(`${API_URL}/company/create?name=${companyToCreate}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!companyResponse.ok) {
                throw new Error('Failed to create company');
            }
    
            const company = await companyResponse.json(); // Assuming the API returns company data
    
            if (!company) {
                throw new Error('Company creation failed: No company data returned');
            }

            setCompanyDetails(company);
            sessionStorage.setItem('company', JSON.stringify(company));
    
            console.log(`Company created: ${JSON.stringify(company)}`);
    
            // Step 2: Refresh the tokens
            // TODO : Change to general API URL when in production
            const tokenResponse = await fetch(`https://zo9bnne4ec.execute-api.eu-west-1.amazonaws.com/dev/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
    
            if (!tokenResponse.ok) {
                throw new Error('Failed to refresh tokens');
            }
    
            const tokenData = await tokenResponse.json();

            const { access_token, refresh_token, expires_in, username } = JSON.parse(tokenData.body);

            // Store tokens in cookies
            Cookies.set('access_token', access_token, { expires: expires_in / 86400 });
            Cookies.set('refresh_token', refresh_token, { expires: 7 });
            Cookies.set('username', username, { expires: expires_in / 86400 });
    
            console.log('Tokens refreshed successfully');
    
            // Step 3: Create the restaurant
            const restaurantResponse = await fetch(`${API_URL}/restaurants/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`, // Use refreshed access token
                },
                body: JSON.stringify({ name: restaurantToCreate, company: company }),
            });
    
            if (!restaurantResponse.ok) {
                throw new Error('Failed to create restaurant');
            }
    
            const restaurantMessage = await restaurantResponse.text();
            console.log(`Restaurant created: ${restaurantMessage}`);
    
            // Reload
            window.location.reload();
    
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
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
                    <Sidebar />
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
