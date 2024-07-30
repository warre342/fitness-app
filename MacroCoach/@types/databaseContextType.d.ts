export type DatabaseContextType= {
    counters: ICounter[];
    setCounters: (counters: ICounter[])=> void;
    insertOrReplaceCounter: (counter: ICounter) => void;
    
    foodItems: FoodItem[];
    setFoodItems: (foodItems: FoodItem[]) => void;
};

