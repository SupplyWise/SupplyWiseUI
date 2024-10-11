function DashboardCard({ title, description }) {

    //TODO allow users to add an image to the cards?

    return (
        <div className="card" style={{ width: '18rem', margin: '20px', textAlign: 'center', border: '1px solid orange', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-body" style={{ padding: '20px' }}>
                <h5 className="card-title" style={{ fontSize: '20px', marginBottom: '10px' }}>{title}</h5>
                <p className="card-text" style={{ color: '#555' }}>{description}</p>
            </div>
        </div>
    );
}

export default DashboardCard;