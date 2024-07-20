// context/counterContext.tsx
import * as React from 'react';
import { CounterContextType, ICounter } from '@/@types/counter';
import { database } from '@/database/databse';
import { useEffect } from 'react';

const onSuccess = (result: any) => {
  console.log('Insert successful', result);
};



export const CounterContext = React.createContext<CounterContextType | null>(null);

const CounterContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [counters, setCounters] = React.useState<ICounter[]>([
        {
            startOfDay: "15/7/2024",
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0
        }
    ]);

    useEffect(() => {
        database.getCounters(setCounters)
    }, [] )

    const saveCounter = (counter: ICounter) => {
        setCounters([...counters, counter]);
    };

    const updateCounter = (counter: ICounter) => {
        setCounters(counters.map((i) => {
            if (counter.startOfDay === i.startOfDay) {
                return counter; // Replace with the updated counter
            }
            return i; // No change for other counters
        }));
    };

    const saveCounterDB = (counter: ICounter) =>{
        return database.insertCounter(counter.startOfDay, counter.calories, counter.protein, counter.carbs, counter.fats, onSuccess)
    }

    const getCountersDB = () =>{
        return database.getCounters(setCounters)

    }

    return (
        <CounterContext.Provider value={{ counters, saveCounter, updateCounter,saveCounterDB,getCountersDB }}>
            {children}
        </CounterContext.Provider>
    );
};

export { CounterContextProvider };
