//nodig: saved meals opslagen, fotos opslagen door file path op te slagen als key
// force the state to clear with fast refresh in Expo
// @refresh reset
import React, {useEffect} from 'react';

import {database} from '../database/databse'

export default function useDatabase() {
  const [isDBLoadingComplete, setDBLoadingComplete] = React.useState(false);

  useEffect(() => {
    async function loadDataAsync() {
      try {
        await database.dropDatabaseTableCounterAsync()
        await database.setupTableCountersAsync()
        await database.setupCountersAsync()
        await database.dropDatabaseTableFoodItemsAsync()
        await database.setupTableFoodItemsAsync()
        await database.setupFoodItemsAsync()
      
        setDBLoadingComplete(true);
      } catch (e) {
        console.warn(e);
      }
    }

    loadDataAsync();
  }, []);

  return isDBLoadingComplete;
}