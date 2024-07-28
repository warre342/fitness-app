//https://www.jsparling.com/using-hooks-and-context-with-sqlite-for-expo-in-react-native/
//ik wil een database om counter en meals permanent op te slagen
//je moet hiervoor sqlite gebruiken. Blijkbaar kan je die dan niet in alle componentnen gebruiken, waarom? 
//omdat die changes dan lokaal zijn.
// Hoe kan een hele database lokaal zijn idfk
//oplossing: context gebruiken voor een database, handige guide gevonden online, probleem is in kkr js in ni ts


import React from 'react'

import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite/legacy';
import { Asset } from 'expo-asset';

console.log("\nstart of log database")


const db = SQLite.openDatabase('db.db')


if (db && typeof db.transaction === 'function') {
  console.log('Database instance is valid.');
} else {
  console.log('Database instance is invalid:', db);
}

//haal alle counters op en return ze
const getCounters = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM counters;',
          [],
          (_, { rows: { _array } }) => {
            resolve(_array); // Resolve the promise with the array of rows
          },
          (_, error) => {
            console.log("DB error load counters");
            console.log(error);
            reject(error); // Reject the promise with the error
          }
        );
      },
      (t, error) => {
        console.log("Transaction error during load counters");
        console.log(error);
        reject(error); // Reject the promise with the error
      },
      (_t, _success) => {
        console.log("Transaction successful during load counters");
        // Note: Success callback isn't necessary if you're handling success in the query's callback
      }
    );
  });
};

//haal alle foodItems op en return ze
const getFoodItems = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'SELECT * FROM foodItems;',
          [],
          (_, { rows: { _array } }) => {
            resolve(_array); // Resolve the promise with the array of rows
          },
          (_, error) => {
            console.log("DB error load foodItems");
            console.log(error);
            reject(error); // Reject the promise with the error
          }
        );
      },
      (t, error) => {
        console.log("Transaction error during load foodItems");
        console.log(error);
        reject(error); // Reject the promise with the error
      },
      (_t, _success) => {
        console.log("Transaction successful during load foodItems");
        // Note: Success callback isn't necessary if you're handling success in the query's callback
      }
    );
  });
};



//steek een row in de table counters
const insertCounter = (startOfDay, calories, protein, carbs, fats) => {
  console.log("Starting counter insertion");

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO counters (startOfDay, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?);',
          [startOfDay, calories, protein, carbs, fats],
          (_, result) => {
            console.log("Counter inserted successfully");
            resolve(result);
          },
          (_, error) => {
            console.log("DB error inserting counter");
            reject(error);
          }
        );
      },
      (t, error) => {
        console.log("Transaction error during counter insertion");
        reject(error);
      },
      (_t, _success) => {
        console.log("Transaction successful during counter insertion");
      }
    );
  });
};

//steek een row in de table foodItems
const insertFoodItem = (key, name, calories, protein, carbs, fats) => {
  console.log("Starting counter insertion");

  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO foodItems (key, name, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?, ?);',
          [key, name, calories, protein, carbs, fats],
          (_, result) => {
            console.log("foodItem inserted successfully");
            resolve(result);
          },
          (_, error) => {
            console.log("DB error inserting foodItem");
            reject(error);
          }
        );
      },
      (t, error) => {
        console.log("Transaction error during foodItem insertion");
        reject(error);
      },
      (_t, _success) => {
        console.log("Transaction successful during foodItem insertion");
      }
    );
  });
};



//drop alle tables
const dropDatabaseTableCounterAsync = async () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'drop table counters;',
        [],
        (_, result) => { resolve(result) },
        (_, error) => {
          console.log("error dropping counters table"); reject(error)
        }
      )
    })
  })
}

//maak de table counters aan als die nog niet bestaat
const setupDatabaseAsyncCounters = async () => {
  console.log("Starting table creation");
  try {
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS counters (startOfDay TEXT PRIMARY KEY NOT NULL, calories REAL NOT NULL, protein REAL NOT NULL, carbs REAL NOT NULL, fats REAL NOT NULL);',
          [],
          (_, result) => {
            console.log("Database table counter created successfully");
            resolve(result);
          },
          (_, error) => {
            console.log("DB error creating table counter");
            reject(error);
          }
        );
      });
    });
    console.log("Data insertion finished successfully");
  } catch (error) {
    console.log("Error during data insertion:", error);
  }
};


//maak de table foodItems aan als die nog niet bestaat
const setupDatabaseAsyncFoodItems = async () => {
  console.log("Starting table creation");
  try {
    await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS foodItems (key INTEGER PRIMARY KEY NOT NULL, name TEXT NOT NULL,calories REAL NOT NULL,  protein REAL NOT NULL, carbs REAL NOT NULL, fats REAL NOT NULL);',
          [],
          (_, result) => {
            console.log("Database table foodItems created successfully");
            resolve(result);
          },
          (_, error) => {
            console.log("DB error creating table foodItems");
            reject(error);
          }
        );
      });
    });
    console.log("Data insertion finished successfully");
  } catch (error) {
    console.log("Error during data insertion:", error);
  }
};


//steek een default waarde in de counters tabel, als de waarde er al in staat steek er niets in
const setupCountersAsync = async () => {
  console.log("Starting counter setup");

  try {
    const exists = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM counters WHERE startOfDay = ?',
          ["15/7/2024"],
          (_, { rows: { _array } }) => {
            if (_array.length > 0 && _array[0].count > 0) {
              console.log("Counter entry already exists");
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (_, error) => {
            console.log("DB error checking for existing counter entry");
            console.log(error);
            reject(error);
          }
        );
      });
    });

    if (!exists) {
      await new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'INSERT INTO counters (startOfDay, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?);',
              ["15/7/2024", 0, 0, 0, 0],
              (_, result) => {
                console.log("Counter setup successful");
                resolve(result);
              },
              (_, error) => {
                console.log("DB error inserting counter");
                console.log(error);
                reject(error);
              }
            );
          },
          (t, error) => {
            console.log("Transaction error during counter setup");
            console.log(error);
            reject(error);
          },
          (t, success) => {
            console.log("Transaction successful during counter setup");
            resolve(success);
          }
        );
      });
    } else {
      console.log("Counter setup skipped as entry already exists");
    }
  } catch (error) {
    console.log("Error during counter setup:", error);
  }
};

const setupFoodItemsAsync = async () => {
  console.log("Starting foodItems setup");

  try {
    const exists = await new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT COUNT(*) as count FROM foodItems WHERE key = ?',
          [1],
          (_, { rows: { _array } }) => {
            if (_array.length > 0 && _array[0].count > 0) {
              console.log("foodItem entry already exists");
              resolve(true);
            } else {
              resolve(false);
            }
          },
          (_, error) => {
            console.log("DB error checking for existing foodItems entry");
            console.log(error);
            reject(error);
          }
        );
      });
    });

    if (!exists) {
      await new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'INSERT OR REPLACE INTO foodItems (key, name, calories, protein, carbs, fats) VALUES (?, ?, ?, ?, ?, ?);',
              [1, "De poes van robin", 10750, 0, 0, 0],
              (_, result) => {
                console.log("foodItems setup successful");
                resolve(result);
              },
              (_, error) => {
                console.log("DB error inserting foodItems");
                console.log(error);
                reject(error);
              }
            );
          },
          (t, error) => {
            console.log("Transaction error during foodItems setup");
            console.log(error);
            reject(error);
          },
          (t, success) => {
            console.log("Transaction successful during foodItems setup");
            resolve(success);
          }
        );
      });
    } else {
      console.log("foodItems setup skipped as entry already exists");
    }
  } catch (error) {
    console.log("Error during foodItems setup:", error);
  }
};

export const database = {
  getCounters,
  insertCounter,
  setupDatabaseAsyncCounters,
  setupCountersAsync,
  dropDatabaseTableCounterAsync,//currently only for counters

  getFoodItems,
  insertFoodItem,
  setupDatabaseAsyncFoodItems,
  setupFoodItemsAsync
}

//   vb: { startOfDay:"15/7/2024" , calories: 0, protein : 0,carbs:0, fats:0 },

