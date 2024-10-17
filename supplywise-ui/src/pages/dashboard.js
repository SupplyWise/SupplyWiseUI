import Head from "next/head";
import Card from "@/components/dashboardCard";
import Sidebar from "@/components/dashboardNav";

export default function Dashboard() {
  return (
    <main>
      <Head>
        <title>Supplywise | Dashboard</title>
        <meta name="description" content="Your solution for inventory management" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Logo_Icon.png" />
      </Head>

      <div className="container-fluid" style={{padding: '0px'}}>
        <div className="row">
          <Sidebar />
          <div className="col-10">
            <div style={{ padding: '20px', marginTop: '80px' }}>
              <div className="content">
                <h1 className="title" style={{ fontSize: "36px", marginBottom: '10px', textAlign: 'center' }}>
                  Welcome to your Supplywise dashboard!
                </h1>
                <h2 className="description" style={{ color: "rgba(100, 100, 100, 1)", fontSize: '18px', textAlign: 'center' }}>
                  What do you wish to do?
                </h2>
              </div>

              {/* Cards Section */}
              <div className="cards-container flex flex-wrap justify:space-around mt-40" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '40px' }}>
                <Card 
                  title="Manage Inventory" 
                  description="Keep track of your stock levels and updates." 
                />
                <Card 
                  title="Orders" 
                  description="Manage and track your incoming and outgoing orders." 
                />
                <Card 
                  title="Analytics" 
                  description="View insightful data on your inventory trends." 
                />
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </main>
  );
}
