import { useState } from 'react';

const useFoodData = () => {
  const [foodData, setFoodData] = useState([
    { key: 1, name: 'milk', calories: 470, protein : 34, carbs:96, fats:32 },
    //{ key: 2, name: 'bread', calories: 200, protein : 5 , carbs:0, fats:0 },
    { key: 2, name: 'egg', calories: 74, protein : 	6.3 , carbs:	0.7, fats:5.2 },
    { key: 3, name: 'de poes van robin', calories: 10755.6, protein : 0 , carbs:	0, fats:0 },


    // Add more form data objects as needed
  ]);

  return { foodData, setFoodData };
};

export default useFoodData;