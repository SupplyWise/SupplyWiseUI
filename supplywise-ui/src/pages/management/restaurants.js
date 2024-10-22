import DashboardLayout from "@/components/managementLayout";
import RestaurantCard from "@/components/restaurantCard";
import { useEffect, useState } from 'react';

export default function Restaurants({ setRestaurantSelected }) {

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // chamada à API
    /*
    const fetchData = async () => {
        const response = await fetch('...');
        const data = await response.json();
        setRestaurants(data);
    }
    fetchData();
    */
    setRestaurants([
      { id: 1, name: "Burger King Aveiro", img: "/no-photo.jpg" },
      { id: 2, name: "Burger King Porto", img: "/no-photo.jpg" },
      { id: 3, name: "Burger King Lisboa", img: "/no-photo.jpg" },
      { id: 4, name: "Burger King Viseu", img: "/no-photo.jpg" },
      { id: 5, name: "Burger King Coimbra", img: "/no-photo.jpg" },
      { id: 6, name: "Burger King Braga", img: "/no-photo.jpg" },
      { id: 7, name: "Burger King Faro", img: "/no-photo.jpg" },
    ]);

  }, []);

  return (
    <DashboardLayout>
      {restaurants?.map(restaurant => <RestaurantCard key={restaurant.id} name={restaurant.name} image={restaurant.img} />)}
      <RestaurantCard name="Add Restaurant" image="/plus-photo.jpg"/>
    </DashboardLayout>
  );
}
