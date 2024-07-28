import * as React from 'react';
import {  DatabaseContextType, ICounter } from '@/@types/counter';
import { database } from '@/database/databse';
import { useEffect } from 'react';

const isEqualCounter = (a: ICounter, b: ICounter) => {
    const keys1: (keyof ICounter)[] = Object.keys(a) as (keyof ICounter)[];
    const keys2: (keyof ICounter)[] = Object.keys(b) as (keyof ICounter)[];

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (a[key] !== b[key]) return false;
    }
    return true
}

export const DatabaseContext = React.createContext<DatabaseContextType | null>(null);

const DatabaseContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [counters, setCounters] = React.useState<ICounter[]>([]);//als dit update, update de database



    useEffect(() => {//opnieuw opgestart, haal data op van de database
        database.getCounters().then(array => { setCounters(array) }).catch(error => {
            console.error("Error fetching counters on boot:", error);
        });
    }, []);

    useEffect(() => {// de lokale data is veranderd, save het in de database. Check eerste welke counter is veranderd en update die
        database.getCounters().then((rowsDB: ICounter[]) => {
            if(rowsDB.length===counters.length +1){//DELETING HAS NOT BEEN IMPLEMENTED AND WILL CAUSE AN ERROR WHEN UPDATING DATABASE
                saveCounterInDB(counters[counters.length-1])
            }
            for (let i = 0; i < counters.length; i++) {//check for duplicate work
                if (!isEqualCounter(rowsDB[i], counters[i])) {
                    saveCounterInDB(counters[i])
                }
            }
        })

    }, [counters])



    const insertOrReplaceCounter = (counter: ICounter) => {//deze gaat local context updaten maar niet in DB steken
        setCounters(counters.map((i) => {
            if (counter.startOfDay === i.startOfDay) {
                return counter; // Replace with the updated counter
            }
            return i; // No change for other counters
        }));
    };

    const saveCounterInDB = (counter: ICounter) => {
        return database.insertCounter(counter.startOfDay, counter.calories, counter.protein, counter.carbs, counter.fats)
    }


    return (
        <DatabaseContext.Provider value={{ counters, setCounters,insertOrReplaceCounter }}>
            {children}
        </DatabaseContext.Provider>
    );
};

export {  DatabaseContextProvider };
