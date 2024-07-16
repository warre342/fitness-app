import { useState } from 'react';

const useFoodData = () => {
  const [foodData, setFoodData] = useState([
    { key: 1, name: 'milk', calories: 1000, protein : 35 },
    { key: 2, name: 'bread', calories: 200, protein : 5 },
    { key: 3, name: 'egg', calories: 150, protein : 10 },
    // Add more form data objects as needed
  ]);

  return { foodData, setFoodData };
};

export default useFoodData;