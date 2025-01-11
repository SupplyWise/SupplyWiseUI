import DashboardLayout from "@/components/managementLayout";
import RestaurantCard from "@/components/restaurantCard";
import { useEffect, useState } from 'react';
import { API_URL } from '../../../api_url';
import Cookies from "js-cookie";

export default function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);
  const [restaurantToCreate, setRestaurantToCreate] = useState('');

  useEffect(() => {

    const fetchRestaurants = async () => {
      if (JSON.parse(sessionStorage.getItem('company'))) {
        fetch(`${API_URL}/restaurants/company`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('access_token')}`,
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
      }
    };
    fetchRestaurants();
  }, []);

  const handleRestaurantCreation = async (e) => {
    e.preventDefault();

    const company = JSON.parse(sessionStorage.getItem('company'));

    try {
      const response = await fetch(`${API_URL}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('access_token')}`,
        },
        body: JSON.stringify({ name: restaurantToCreate, company }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create restaurant: ${response.statusText}`);
      }

        fetch(`${API_URL}/restaurants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('access_token')}`,
            },
            body: JSON.stringify({ name: restaurantToCreate, company: JSON.parse(sessionStorage.getItem('company')) }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to create restaurant');
                }
                return response.text();
            })
            .then((message) => {
                console.log(message);
                window.location.reload();
            })
          .catch((error) => console.error(error));

      // Clear the input field and close the modal
      setRestaurantToCreate('');
      document.querySelector('#createRestaurantModal .btn-close').click();
      console.log("Restaurant created successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error creating restaurant:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="row">
        <div className="col"></div>
        <div className="col-auto">
          <button type="button" className="btn sw-button" data-bs-toggle="modal" data-bs-target="#createRestaurantModal">Add Restaurant</button>
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
                <button type="submit" className="btn sw-button">Create</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {restaurants?.map(restaurant => <RestaurantCard key={restaurant.id} id={restaurant.id} name={restaurant.name} creationDate={restaurant.createdAt} />)}
    </DashboardLayout>
  );
}

