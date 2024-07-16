import { useState } from 'react';
//gaat values geven per dag
const useCounter = () => {
  const [counter, setCounter] = useState([
    { startOfDay:"15/7/2024" , calories: 0, protein : 0,carbs:0, fats:0 },

  ]);

  return { counter, setCounter };
};

export default useCounter;