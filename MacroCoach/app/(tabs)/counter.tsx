import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Button, Divider, ScrollView, Text, VStack, HStack, Center } from "native-base";
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { DatabaseContext } from '@/context/databaseContext';
import { DatabaseContextType } from '@/@types/databaseContextType';
import { FoodItem } from '@/@types/foodItem';
import { FoodItemChangesContext } from '@/context/foodItemChangesContext';
import { FoodItemChangesContextType } from '@/@types/foodItemChangesContextType';
import { custom_bg_theme } from '@/constants/Colors';
import { LinearGradient } from 'react-native-svg';

const HomeScreen = () => {
  const databaseContext = useContext(DatabaseContext);
  const { counters, insertOrReplaceCounter } = databaseContext as DatabaseContextType;

  const foodItemChangesContext = useContext(FoodItemChangesContext);
  const { setAddCount } = foodItemChangesContext as FoodItemChangesContextType;

  useFocusEffect(
    React.useCallback(() => {
      setAddCount(0); // Reset badge count when this screen is focused
      setNum(num+20)
    }, [])
  );

  const lastCounter = counters.length > 0 ? counters[counters.length - 1] : { calories: 0, protein: 0, carbs: 0, fats: 0 };
  const [num, setNum] = useState(30)
  return (
    <ScrollView flex={1} h="100%">
      <Box p={4}>
        {/* HEADER */}
        <Text fontSize="xl" fontWeight="bold" marginTop={5} textAlign="center">
          Main Page
        </Text>
      </Box>
      <Box
        alignItems="center"
        shadow={2}
        justifyContent="center"
        width="90%"
        maxWidth="90%"
        mx="auto"
        my={6}
        py={4}
        px={4}
        rounded="lg"
        bg={custom_bg_theme}
      >
        <VStack space={4} >
          <Text fontSize="lg" fontWeight="bold" textAlign="center">
            Counter
          </Text>
          <Box><HStack>
            <Divider alignSelf="center" bg={'light.400'} />
          </HStack></Box>
          <HStack justifyContent="space-between">
            <Text>Calorie count: </Text>
            <Text>{lastCounter.calories.toFixed(2).replace(/\.00$/, '')}</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Protein count: </Text>
            <Text>{lastCounter.protein.toFixed(2).replace(/\.00$/, '')}g</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Carbohydrate count: </Text>
            <Text>{lastCounter.carbs.toFixed(2).replace(/\.00$/, '')}g</Text>
          </HStack>
          <HStack justifyContent="space-between">
            <Text>Fat count: </Text>
            <Text>{lastCounter.fats.toFixed(2).replace(/\.00$/, '')}g</Text>
          </HStack>
          <HStack alignSelf={"center"}>
            <Button onPress={() => insertOrReplaceCounter({ startOfDay: "15/7/2024", calories: 0, protein: 0, carbs: 0, fats: 0 })}>
              <Text>Clear counter</Text>

            </Button>
          </HStack>

        </VStack>
      </Box>
    </ScrollView>
  );
};

export default HomeScreen;
