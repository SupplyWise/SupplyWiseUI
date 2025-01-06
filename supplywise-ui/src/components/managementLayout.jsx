import Sidebar from "./sidebar";
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api_url';
import Cookies from 'js-cookie';

export default function DashboardLayout({ children }) {

    const [companyDetails, setCompanyDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [customInventoryPeriodicity, setCustomInventoryPeriodicity] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {

            if (Cookies.get('access_token') === undefined) {
                sessionStorage.clear();
                window.location.href = 'https://eu-west-1cqv0ahnls.auth.eu-west-1.amazoncognito.com/login?client_id=3p7arovt4ql7qasmbjg52u1qas&redirect_uri=http://localhost:3000/login&response_type=code&scope=email+openid+phone';
            }

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
    const [scheduleInventory, setScheduleInventory] = useState(false);
    const [inventoryPeriodicity, setInventoryPeriodicity] = useState('CUSTOM');

    useEffect(() => {
        // Authentication and company fetching logic here (unchanged)
    }, []);

    const handleCompanyCreation = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Show the loader
    
        const token = Cookies.get('access_token');
        const refreshToken = Cookies.get('refresh_token');
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
    
            const company = await companyResponse.json();
            if (!company) {
                throw new Error('Company creation failed: No company data returned');
            }
    
            setCompanyDetails(company);
            sessionStorage.setItem('company', JSON.stringify(company));
    
            console.log(`Company created: ${JSON.stringify(company)}`);
    
            // Step 2: Refresh the tokens
            // TODO : Change to general API URL when in production
            const tokenResponse = await fetch(`${API_URL}/tokens/refresh`, {
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

            const { access_token, refresh_token, expires_in, username } = tokenData;

            // Store tokens in cookies
            Cookies.set('access_token', access_token, { expires: expires_in / 86400 });
            Cookies.set('refresh_token', refresh_token, { expires: 7 });
            Cookies.set('username', username, { expires: expires_in / 86400 });
    
            console.log('Tokens refreshed successfully');
    
            // Step 3: Create the restaurant with periodicity if applicable
            const restaurantData = {
                name: restaurantToCreate,
                company,
            };
    
            // Add periodicity and customPeriodicty if the schedule is set
            if (scheduleInventory) {
                restaurantData.periodicity = inventoryPeriodicity;
                if (inventoryPeriodicity === 'CUSTOM' && customInventoryPeriodicity) {
                    restaurantData.customInventoryPeriodicity = customInventoryPeriodicity;
                }
            }
    
            const restaurantResponse = await fetch(`${API_URL}/restaurants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`,
                },
                body: JSON.stringify(restaurantData),
            });
    
            if (!restaurantResponse.ok) {
                throw new Error('Failed to create restaurant');
            }
    
            const restaurantMessage = await restaurantResponse.text();
            console.log(`Restaurant created: ${restaurantMessage}`);
            window.location.reload();
        } catch (error) {
            console.error(`Error: ${error.message}`);
        } finally {
            setIsLoading(false); // Hide the loader
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
                            {companyDetails ? (
                                <>
                                    <div className="row mt-5">
                                        <h1>{companyDetails?.name}</h1>
                                        <h5>
                                            Created at{" "}
                                            <i className="text-muted">
                                                {companyDetails?.createdAt.split('.')[0].replace('T', ' ')}
                                            </i>
                                        </h5>
                                    </div>
                                    <div className="row mt-2">{children}</div>
                                </>
                            ) : (
                                <>
                                    <div className="row mt-5">
                                        <form onSubmit={handleCompanyCreation}>
                                            <h2>Create a Company</h2>
                                            <h5>Start by creating a company to manage your inventory</h5>
                                            <div className="form-group mt-3">
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
                                            <div className="form-check mt-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="scheduleInventory"
                                                    checked={scheduleInventory}
                                                    onChange={() => setScheduleInventory(!scheduleInventory)}
                                                />
                                                <label htmlFor="scheduleInventory" className="form-check-label">
                                                    Schedule Inventory Count
                                                </label>
                                            </div>
                                            {scheduleInventory && (
                                                <div className="form-group mt-3">
                                                    <div>
                                                        <label htmlFor="inventoryPeriodicity">Inventory Periodicity</label>
                                                        <select
                                                            id="inventoryPeriodicity"
                                                            className="form-control"
                                                            value={inventoryPeriodicity}
                                                            onChange={(e) => setInventoryPeriodicity(e.target.value)}
                                                        >
                                                            <option value="DAILY">Daily</option>
                                                            <option value="WEEKLY">Weekly</option>
                                                            <option value="MONTHLY">Monthly</option>
                                                            <option value="YEARLY">Yearly</option>
                                                            <option value="CUSTOM">Custom</option>
                                                        </select>
                                                    </div>

                                                    {inventoryPeriodicity === 'CUSTOM' && (
                                                        <div>
                                                            <label htmlFor="customInventoryPeriodicity">Custom Number of Days</label>
                                                            <input
                                                                type="number"
                                                                id="customInventoryPeriodicity"
                                                                className="form-control"
                                                                value={customInventoryPeriodicity}
                                                                onChange={(e) => setCustomInventoryPeriodicity(e.target.value)}
                                                                placeholder="Enter the number of days"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <button
                                                type="submit"
                                                className="btn sw-bgcolor mt-3"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Creating..." : "Create"}
                                            </button>
                                        </form>

                                        {isLoading && (
                                            <div className="mt-3 text-center">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p>Processing your request...</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
