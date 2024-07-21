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
        //await database.dropDatabaseTablesAsync()
        await database.setupDatabaseAsync()
        await database.setupCountersAsync()

        setDBLoadingComplete(true);
      } catch (e) {
        console.warn(e);
      }
    }

    loadDataAsync();
  }, []);

  return isDBLoadingComplete;
}