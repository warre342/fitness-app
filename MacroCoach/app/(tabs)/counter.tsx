import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Button, Divider } from "native-base";
import { useRoute, RouteProp } from '@react-navigation/native';
import { DatabaseContext } from '@/context/databaseContext';
import { DatabaseContextType } from '@/@types/counter';
import { FoodItem } from '@/@types/foodItem';

const HomeScreen = () => {


  const route = useRoute<any>();
  //console.log("route", route.params);
  const [foodArray, setFoodArray] = useState<FoodItem[]>([{ key: 0, name: "", calories: 0, protein: 0, carbs: 0, fats: 0 }]);
  //console.log("foodarray", foodArray);


  const databaseContext = useContext(DatabaseContext);//database
  const { counters, setCounters, insertOrReplaceCounter } = databaseContext as DatabaseContextType;

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

  console.log(counters, "local counters")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Counter</Text>
      <Text style={styles.counter}>calorie count: {counters.at(counters.length - 1)?.calories}</Text>
      <Text style={styles.counter}>protein count: {counters.at(counters.length - 1)?.protein}g</Text>
      <Text style={styles.counter}>carbohydrate count: {counters.at(counters.length - 1)?.carbs}g</Text>
      <Text style={styles.counter}>fat count: {counters.at(counters.length - 1)?.fats}g</Text>
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
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#0a7ea4',//dark blue
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomeScreen;
