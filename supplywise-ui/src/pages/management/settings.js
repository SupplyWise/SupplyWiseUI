import Card from "@/components/dashboardCard";
import DashboardLayout from "@/components/managementLayout";

export default function Settings() {
  return (
    <DashboardLayout>
      <div style={{ padding: '20px', marginTop: '80px' }}>
        <div className="content">
          <h1 className="title" style={{ fontSize: "36px", marginBottom: '10px', textAlign: 'center' }}>
            Welcome to settings!
          </h1>
        </div>

      </div>
    </DashboardLayout>
  );
}
