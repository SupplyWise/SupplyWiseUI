import DashboardLayout from "@/components/managementLayout";
import RestaurantCard from "@/components/restaurantCard";
import { useEffect, useState } from 'react';
import { API_URL } from '../../../api_url';

export default function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantToCreate, setRestaurantToCreate] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/restaurants/company/${JSON.parse(sessionStorage.getItem('loggedUser')).company.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRestaurants(data);
      })
      .catch((error) => {
        console.error(error);
      }
    );

  }, []);

  const handleRestaurantCreation = (e) => {
    e.preventDefault();

        fetch(`${API_URL}/restaurants/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}`,
            },
            body: JSON.stringify({ name: restaurantToCreate, company: JSON.parse(sessionStorage.getItem('loggedUser')).company }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create restaurant');
                }
                return response.text();
            })
            .then((message) => {
                console.log(message);
            })
            .catch((error) => console.error(error));
    window.location.reload();
};


  return (
    <DashboardLayout>
      <div className="row">
        <div className="col"></div>
        <div className="col-auto">
          <button type="button" className="btn sw-bgcolor" data-bs-toggle="modal" data-bs-target="#createRestaurantModal">Add Restaurant</button>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="createRestaurantModal" tabIndex="-1" aria-labelledby="createRestaurantModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title mr-2" id="createRestaurantModalLabel">Create Restaurant</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleRestaurantCreation}>
                <div className="mb-3">
                  <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
                  <input type="text" className="form-control" id="restaurantName" value={restaurantToCreate} onChange={(e) => setRestaurantToCreate(e.target.value)} required />
                </div>
                <button type="submit" className="btn sw-bgcolor">Create</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {restaurants?.map(restaurant => <RestaurantCard key={restaurant.id} id={restaurant.id} name={restaurant.name} creationDate={restaurant.createdAt} />)}
    </DashboardLayout>
  );
}
