//hier nativebase code testen
import React, {useContext} from 'react';
import { StyleSheet } from 'react-native';
import { NativeBaseProvider, Box, Button, ScrollView, Text } from "native-base";

interface User {
id:number, 
name: string
}

export default function App() {

  return (
        <ScrollView style={styles.container}>
          <Text>Here is our list of users</Text>
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
});