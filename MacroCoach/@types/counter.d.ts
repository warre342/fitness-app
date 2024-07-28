

export interface ICounter {
    startOfDay: string,
    calories: number,
    protein: number,
    carbs: number,
    fats: number
}
//   vb: { startOfDay:"15/7/2024" , calories: 0, protein : 0,carbs:0, fats:0 },
export type DatabaseContextType= {
    counters: ICounter[];
    setCounters: (counters: ICounter[])=> void;
    insertOrReplaceCounter: (counter: ICounter) => void;
};
