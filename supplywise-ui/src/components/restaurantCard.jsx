export default function RestaurantCard({ id, name, creationDate }) {

    const handleClickOnCard = () => {
        if (name !== "Add Restaurant") {
            sessionStorage.setItem('selectedRestaurant', JSON.stringify({id: id, name: name}));
            window.location.href = '/management/restaurants/inventory';
        // } else {
        }
    }

    return (
        <div className="col-4 pe-5 pb-4 pt-3">
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => handleClickOnCard()} >
                <div className="card-header">
                    <h5 className="card-title">{name}</h5>
                </div>
                <div className="card-body">
                    <p className="card-text">Created at <i className="text-muted">{creationDate.split('.')[0].replace('T', ' ')}</i></p>
                </div>
            </div>
        </div>
    );
}