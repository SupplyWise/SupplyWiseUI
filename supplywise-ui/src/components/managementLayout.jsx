import Sidebar from "./sidebar";
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

export default function DashboardLayout({ children }) {

    const [franchiseDetails, setFranchiseDetails] = useState({});

    useEffect(() => {
        // chamada à API
        /*
        const fetchData = async () => {
            const response = await fetch('...');
            const data = await response.json();
            setFranchiseDetails(data);
        }
        fetchData();
        */
        setFranchiseDetails({ name: "Burger King", foundation: "July 23, 1954" });

    }, []);

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
                            <div className="row mt-5">
                                <h1>{franchiseDetails?.name}</h1>
                                <h5 className="text-muted">Founded in {franchiseDetails?.foundation}</h5>
                            </div>
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