import Sidebar from "./dashboardNav";
import Head from 'next/head';

export default function DashboardLayout({ children }) {
    return (
        <main>
            <Head>
                <title>Supplywise | Dashboard</title>
                <meta name="description" content="Your solution for inventory management" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/Logo_Icon.png" />
            </Head>

            <div className="container-fluid" style={{ padding: '0px', height: '100vh', width: '100vw' }}>
                <div className="row" style={{ margin: 0 }}>
                    <Sidebar />
                    <div className="col-10">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
