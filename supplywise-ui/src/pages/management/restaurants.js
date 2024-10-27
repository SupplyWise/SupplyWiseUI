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

    /* setRestaurants([
      { id: 1, name: "Burger King Aveiro", img: "/no-photo.jpg" },
      { id: 2, name: "Burger King Porto", img: "/no-photo.jpg" },
      { id: 3, name: "Burger King Lisboa", img: "/no-photo.jpg" },
      { id: 4, name: "Burger King Viseu", img: "/no-photo.jpg" },
      { id: 5, name: "Burger King Coimbra", img: "/no-photo.jpg" },
      { id: 6, name: "Burger King Braga", img: "/no-photo.jpg" },
      { id: 7, name: "Burger King Faro", img: "/no-photo.jpg" },
    ]); */

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
    sessionStorage.removeItem('loggedUser');
    window.location.reload();
};


  return (
    <DashboardLayout>
      {restaurants?.map(restaurant => <RestaurantCard key={restaurant.id} name={restaurant.name} creationDate={restaurant.createdAt} />)}
    </DashboardLayout>
  );
}
