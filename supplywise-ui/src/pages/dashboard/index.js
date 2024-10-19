import Card from "@/components/dashboardCard";
import DashboardLayout from "@/components/dashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
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
    </DashboardLayout>
  );
}
