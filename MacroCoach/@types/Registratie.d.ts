export interface Registratie {
  id: number; //auto generated
  counterStartTime : string; // foreign key
  foodKey: number; // foreign key
  timestamp: string; //time the product got added 
  used_size: number; //used for calculations
}
