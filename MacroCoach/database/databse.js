//https://www.jsparling.com/using-hooks-and-context-with-sqlite-for-expo-in-react-native/
//ik wil een database om counter en meals permanent op te slagen
//je moet hiervoor sqlite gebruiken. Blijkbaar kan je die dan niet in alle componentnen gebruiken, waarom? 
//omdat die changes dan lokaal zijn.
// Hoe kan een hele database lokaal zijn idfk
//oplossing: context gebruiken voor een database, handige guide gevonden online, probleem is in kkr js in ni ts


import React from 'react'

import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('db.db')

const getCounters = (setCounterFunc) => {
  db.transaction(
    tx => {
      tx.executeSql(
        'select * from counters',
        [],
        (_, { rows: { _array } }) => {
          setCounterFunc(_array)
        }
      );
    },
    (t, error) => { console.log("db error load counters"); console.log(error) },
    (_t, _success) => { console.log("loaded counters")}
  );
}
const insertCounter = (startOfDay, calories, protein, carbs, fats, successFunc) => {
  db.transaction(
    tx => {
      tx.executeSql(
        'INSERT INTO counters (startOfDay, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?, ?)',
        [startOfDay, calories, protein, carbs, fats],
        (_, result) => successFunc(result)
      );
    },
    (t, error) => {
      console.log("db error insertCounter");
      console.log(error);
    },
    (_t, _success) => {
      console.log("inserted counter");
    }
  );
};


const dropDatabaseTablesAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'drop table counters',
        [],
        (_, result) => { resolve(result) },
        (_, error) => { console.log("error dropping counters table"); reject(error)
        }
      )
    })
  })
}


const setupDatabaseAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS counters (
          startOfDay TEXT PRIMARY KEY NOT NULL,
          calories REAL NOT NULL,
          protein REAL NOT NULL,
          carbs REAL NOT NULL,
          fats REAL NOT NULL
        );`,
        [],
        (_, result) => resolve(result),
        (_, error) => {
          console.log("db error creating tables");
          reject(error);
        }
      );
    });
  });
};

const setupUsersAsync = async () => {
  return new Promise((resolve, _reject) => {
    db.transaction( tx => {
        tx.executeSql('INSERT INTO counters (startOfDay, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?)'
        , ["15/7/2024" , 0, 0,0, 0] );
      },
      (t, error) => { console.log("db error insertUser"); console.log(error); resolve() },
      (t, success) => { resolve(success)}
    )
  })
}

export const database = {
  getCounters,
  insertCounter,
  setupDatabaseAsync,
  setupUsersAsync,
  dropDatabaseTablesAsync,
}

//   vb: { startOfDay:"15/7/2024" , calories: 0, protein : 0,carbs:0, fats:0 },

