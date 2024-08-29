import * as React from 'react';
import { DatabaseContextType } from '@/@types/databaseContextType';
import { ICounter} from '@/@types/counter';

import { database } from '@/database/databse';
import { useEffect } from 'react';
import { FoodItem } from '@/@types/foodItem';
import { FoodItemChangesContextType } from '@/@types/foodItemChangesContextType';

export const FoodItemChangesContext = React.createContext<FoodItemChangesContextType | null>(null);

//this file will have context for counters and foodItems and be responsible for updating them in the database
const FoodItemChangesContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [addCount, setAddCount] = React.useState<number>(0);//als dit update, update de database


    return (
        <FoodItemChangesContext.Provider value={{ addCount, setAddCount}}>
            {children}
        </FoodItemChangesContext.Provider>
    );
};

export { FoodItemChangesContextProvider };
