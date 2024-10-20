export default function RestaurantCard({ name, image, setRestaurantSelected }) {

    const handleClickOnCard = () => {
        if (name !== "Add Restaurant") {
            setRestaurantSelected(name);
        } else {
            setRestaurantSelected(null);
        }
    }

    return (
        <div className="col-4 pe-5 pb-4 pt-3">
            <div className="card" style={{ cursor: 'pointer' }} onClick={() => handleClickOnCard()} >
                <img src={image} className="card-img-top" style={{ height: '25vh' }} alt={name} />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                    {/* <p className="card-text">{subtitle}</p> */}
                </div>
            </div>
        </div>
    );
}