import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Button } from "native-base";

const HomeScreen = () => {


    const [calo, setCalo] = useState(0);

    const addCalories = () => {
        setCalo(calo + 5);
    };

    const resetCalories = () => {
        setCalo(0);
    }

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Calorie Tracker</Text>
        <Text style={styles.counter}>daily calorie count: {calo}</Text>
        <TouchableOpacity onPress={addCalories} style={styles.button}>
            <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
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
