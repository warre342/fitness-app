import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Button } from "native-base";
import useCounter from '@/hooks/useCurrentCounter';
import { useRoute, RouteProp } from '@react-navigation/native';

const HomeScreen = () => {


  const { counter, setCounter } = useCounter();

  const route = useRoute<any>();
  const { food } = route.params;
  console.log(food)

useEffect(() => {
    setCounter(counter.map((item, index) => {
      if (index === counter.length - 1) {
        return {
          ...item,
          calories: item.calories + food.calories,
          protein: item.protein + food.protein,
          carbs: item.carbs + 0,
          fats: item.fats + 0
        };
      } else {
        return item;
      }
    }));
  }, [food]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calorie Tracker</Text>
      <Text style={styles.counter}>daily calorie count: {counter.at(counter.length - 1)?.calories}</Text>
      <Text style={styles.counter}>daily protein count: {counter.at(counter.length - 1)?.protein}</Text>

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
