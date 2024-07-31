import * as React from 'react';
import { DatabaseContextType } from '@/@types/databaseContextType';
import { ICounter } from '@/@types/counter';

import { database } from '@/database/databse';
import { useEffect } from 'react';
import { FoodItem } from '@/@types/foodItem';

const isEqualCounter = (a: ICounter, b: ICounter) => {
    const keys1: (keyof ICounter)[] = Object.keys(a) as (keyof ICounter)[];
    const keys2: (keyof ICounter)[] = Object.keys(b) as (keyof ICounter)[];

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (a[key] !== b[key]) return false;
    }
    return true
}
const isEqualFoodItem = (a: FoodItem, b: FoodItem) => {
    const keys1: (keyof FoodItem)[] = Object.keys(a) as (keyof FoodItem)[];
    const keys2: (keyof FoodItem)[] = Object.keys(b) as (keyof FoodItem)[];

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (a[key] !== b[key]) return false;
    }
    return true
}
const findDifferingKeys = (list1: FoodItem[], list2: FoodItem[]) => { //only 1 of the 2 lists will be missing keys
    if (list1.length == 0) { return list2 }
    else if (list2.length == 0) { return list1 }
    else {
        const keysList1 = new Set(list1.map((item: any) => item.key));
        const keysList2 = new Set(list2.map((item: any) => item.key));

        const differingKeys = [
            ...[...keysList1].filter(key => !keysList2.has(key)),
            ...[...keysList2].filter(key => !keysList1.has(key))
        ];

        return differingKeys;
    }
}


export const DatabaseContext = React.createContext<DatabaseContextType | null>(null);

//this file will have context for counters and foodItems and be responsible for updating them in the database
const DatabaseContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [counters, setCounters] = React.useState<ICounter[]>([]);//als dit update, update de database
    const [foodItems, setFoodItems] = React.useState<FoodItem[]>([]);//als dit update, update de database
    const [initialiseBoolCounters, setInialiseBoolCounters] = React.useState<Boolean>(false);
    const [initialiseBoolFoodItems, setInialiseBoolFoodItems] = React.useState<Boolean>(false);//de useEffect voor foodItems zal niet wachten op de ([]) 
    //effect hook en zal direct starten als hij geinitialiseerd wordt
    //hij zal dus proberen herstellen wanneer de lokale changes er ng niet zijn


    useEffect(() => {//opnieuw opgestart, haal data op van de database
        database.getCounters().then(array => { setCounters(array); setInialiseBoolCounters(true) }).catch(error => {
            console.error("Error fetching counters on boot:", error);
        });
        database.getFoodItems().then(array => {
            setFoodItems(array); setInialiseBoolFoodItems(true);
            console.log("de items in de database on load: ", array)
        }).catch(error => {
            console.error("Error fetching foodItems on boot:", error);
        });
    }, []);

    useEffect(() => {// de lokale data is veranderd, save het in de database. Check eerste welke counter is veranderd en update die
        if (initialiseBoolCounters == false) { return; }
        database.getCounters().then((rowsDB: ICounter[]) => {
            if (rowsDB.length === counters.length + 1) {//DELETING HAS NOT BEEN IMPLEMENTED AND WILL CAUSE AN ERROR WHEN UPDATING DATABASE
                database.insertCounter(counters[counters.length - 1])
            }
            for (let i = 0; i < counters.length; i++) {//check for duplicate work
                if (!isEqualCounter(rowsDB[i], counters[i])) {
                    database.insertCounter(counters[i])
                }
            }
        })

    }, [counters])



    useEffect(() => {// de lokale data is veranderd, save het in de database. Check eerste welke counter is veranderd en update die
        if (initialiseBoolFoodItems == false) { return; }// nog niet klaar met initializeing

        database.getFoodItems().then((rowsDB) => {
            console.log("de items in de database: ", rowsDB)

            const keys = findDifferingKeys(rowsDB, foodItems)
            if (foodItems.length > rowsDB.length) {//item toegevoegd
                console.log("item toegevoegd in database")
                for (let key of keys) {
                    for (let food of foodItems) {
                        if (food.key == key) { database.insertFoodItem(food) }
                    }
                }

            }
            else if (foodItems.length < rowsDB.length) {//item verwijderd maar ook als database ng maar juist opstart wts
                console.log("item verwijderd in database")
                console.log("keys die verschillen met verwijder: ", keys, "\n de 2 verschillende arrays: \n", foodItems, "\n nu db: ", rowsDB)
                for (let key of keys) {
                    for (let food of rowsDB) {
                        if (food.key == key) { database.deleteFoodItem(food.key) }
                    }
                }

            }

            else if (foodItems.length == rowsDB.length) {
                for (let i = 0; i < counters.length; i++) {//check for duplicate work
                    if (!isEqualFoodItem(rowsDB[i], foodItems[i])) {
                        database.insertFoodItem(foodItems[i])
                    }
                }
            }
        })
    }, [foodItems])

    const insertOrReplaceCounter = (counter: ICounter) => {//deze gaat local context updaten maar niet in DB steken
        setCounters(counters.map((i) => {
            if (counter.startOfDay === i.startOfDay) {
                return counter; // Replace with the updated counter
            }
            return i; // No change for other counters
        }));
    };




    return (
        <DatabaseContext.Provider value={{ counters, setCounters, foodItems, setFoodItems, insertOrReplaceCounter }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export { DatabaseContextProvider };
