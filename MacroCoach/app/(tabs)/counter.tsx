import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Button, Divider } from "native-base";
import useCounter from '@/hooks/useCurrentCounter';
import { useRoute, RouteProp } from '@react-navigation/native';
import { CounterContext } from '@/context/counterContext';
import { CounterContextType } from '@/@types/counter';

const HomeScreen = () => {


  const { counter, setCounter } = useCounter();

  const route = useRoute<any>();
  const food = route.params ? route.params.food : { calories: 0, protein: 0 , carbs:0, fats:0};
  console.log(food)

  const counterContext = useContext(CounterContext);

  const { counters, saveCounter, updateCounter, saveCounterDB, getCountersDB } =counterContext as CounterContextType;


  useEffect(() => {

      setCounter(counter.map((item, index) => {
        if (index === counter.length - 1) {
          return {
            ...item,
            calories: item.calories + food.calories,
            protein: item.protein + food.protein,
            carbs: item.carbs + food.carbs,
            fats: item.fats + food.fats
          };
        } else {
          return item;
        }
      }));
    }, [route.params]);
  
  console.log(counter, "local counter")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Tracker</Text>
      <Text style={styles.counter}>daily calorie count: {counter.at(counter.length - 1)?.calories}</Text>
      <Text style={styles.counter}>daily protein count: {counter.at(counter.length - 1)?.protein}g</Text>
      <Text style={styles.counter}>daily carbohydrate count: {counter.at(counter.length - 1)?.carbs}g</Text>
      <Text style={styles.counter}>daily fat count: {counter.at(counter.length - 1)?.fats}g</Text>
      <Divider/>
      <Text style={styles.title}>Calorie Tracker</Text>
      <Text style={styles.counter}>daily calorie count: {counters.at(counters.length - 1)?.calories}</Text>
      <Text style={styles.counter}>daily protein count: {counters.at(counters.length - 1)?.protein}g</Text>
      <Text style={styles.counter}>daily carbohydrate count: {counters.at(counters.length - 1)?.carbs}g</Text>
      <Text style={styles.counter}>daily fat count: {counters.at(counters.length - 1)?.fats}g</Text>
      <Divider/>
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
