import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Button, Divider } from "native-base";
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { DatabaseContext } from '@/context/databaseContext';
import { DatabaseContextType } from '@/@types/databaseContextType';
import { FoodItem } from '@/@types/foodItem';
import { FoodItemChangesContext } from '@/context/foodItemChangesContext';
import { FoodItemChangesContextType } from '@/@types/foodItemChangesContextType';

const HomeScreen = () => {


  const route = useRoute<any>();
  //console.log("route", route.params);
  const [foodArray, setFoodArray] = useState<FoodItem[]>([{ key: 0, name: "", calories: 0, protein: 0, carbs: 0, fats: 0 }]);
  //console.log("foodarray", foodArray);


  const databaseContext = useContext(DatabaseContext);//database
  const { counters, setCounters, insertOrReplaceCounter } = databaseContext as DatabaseContextType;


  const foodItemChangesContext = useContext(FoodItemChangesContext);//database
  const { addCount, setAddCount } = foodItemChangesContext as FoodItemChangesContextType;

  useEffect(() => {
    console.log("changed route.params", route.params)
    if (route.params !== undefined && route.params[0]) {
      setFoodArray(route.params)
    }
    console.log("foodarray na set", foodArray, "end")
  }, [route.params]);

  useEffect(() => {
    if (foodArray.length > 0 && foodArray[0].key !== 0) {
      setCounters(counters.map((counter, index) => {
        if (index === counters.length - 1) {
          const countObject = { calories: 0, protein: 0, carbs: 0, fats: 0 };
          foodArray.forEach((food: FoodItem) => {
            countObject.calories += food.calories;
            countObject.protein += food.protein;
            countObject.carbs += food.carbs;
            countObject.fats += food.fats;
          });
          return {
            ...counter,
            calories: counter.calories + countObject.calories,
            protein: counter.protein + countObject.protein,
            carbs: counter.carbs + countObject.carbs,
            fats: counter.fats + countObject.fats
          };
        } else {
          return counter;
        }
      }));
    }
  }, [foodArray]);

  useFocusEffect(
    React.useCallback(() => {
      setAddCount(0); // Reset badge count when this screen is focused
    }, [])
  );

  console.log(counters, "local counters")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Counter</Text>
      <Text style={styles.counter}>calorie count: {counters.at(counters.length - 1)?.calories.toFixed(2).replace(/\.00$/, '')}</Text>
      <Text style={styles.counter}>protein count: {counters.at(counters.length - 1)?.protein.toFixed(2).replace(/\.00$/, '')}g</Text>
      <Text style={styles.counter}>carbohydrate count: {counters.at(counters.length - 1)?.carbs.toFixed(2).replace(/\.00$/, '')}g</Text>
      <Text style={styles.counter}>fat count: {counters.at(counters.length - 1)?.fats.toFixed(2).replace(/\.00$/, '')}g</Text>
      <Button onPress={() => insertOrReplaceCounter({ startOfDay: "15/7/2024", calories: 0, protein: 0, carbs: 0, fats: 0 })}>Clear counter</Button>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '20%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  counter: {
    fontSize: 18,
    marginVertical: 20,
  },

});

export default HomeScreen;
