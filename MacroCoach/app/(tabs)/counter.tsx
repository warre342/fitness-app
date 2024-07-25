import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Button, Divider } from "native-base";
import { useRoute, RouteProp } from '@react-navigation/native';
import { CounterContext } from '@/context/counterContext';
import { CounterContextType } from '@/@types/counter';
import { FoodItem } from '@/@types/foodItem';

const HomeScreen = () => {



  const route = useRoute<any>();
  const foodArray = route.params ? route.params.food : [{ key: 0, name: "",calories: 0, protein: 0 , carbs:0, fats:0}];
  console.log(foodArray)

  const counterContext = useContext(CounterContext);

  const { counters, setCounters,insertOrReplaceCounter } =counterContext as CounterContextType;

  useEffect(() => {

    setCounters(counters.map((counter, index) => {
      if (index === counters.length - 1) {

        const countObject= { calories: 0, protein: 0, carbs: 0, fats: 0 };//total count van alle geselecteerde food items berekenen
        foodArray.forEach((food: FoodItem) => {
          countObject.calories+=food.calories
          countObject.calories+=food.protein
          countObject.calories+=food.carbs
          countObject.calories+=food.fats
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
          
    }, [route.params]);
  
  console.log(counters, "local counters")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Tracker</Text>
      <Text style={styles.counter}>daily calorie count: {counters.at(counters.length - 1)?.calories}</Text>
      <Text style={styles.counter}>daily protein count: {counters.at(counters.length - 1)?.protein}g</Text>
      <Text style={styles.counter}>daily carbohydrate count: {counters.at(counters.length - 1)?.carbs}g</Text>
      <Text style={styles.counter}>daily fat count: {counters.at(counters.length - 1)?.fats}g</Text>

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
