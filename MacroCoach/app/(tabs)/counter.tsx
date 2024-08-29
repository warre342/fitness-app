import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { NativeBaseProvider, Box, Button, Divider, ScrollView, Text, VStack, HStack, Center, Input } from "native-base";
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
  const { counters, setCounters, insertOrReplaceCounter, foodItems, setFoodItems } = databaseContext as DatabaseContextType;

  const foodItemChangesContext = useContext(FoodItemChangesContext);
  const { setAddCount } = foodItemChangesContext as FoodItemChangesContextType;

  useFocusEffect(
    React.useCallback(() => {
      setAddCount(0); // Reset badge count when this screen is focused
    }, [])
  );

  const [inputFood, setInputFood] = useState({//food that is typed in input
    key: foodItems.length > 0 ? foodItems[foodItems.length - 1].key + 1 : 1,
    name: '',
    protein: 0,
    calories: 0,
    carbs: 0,
    fats: 0,
    prefered_size: 50
  });

  const makeInsertFoodItem = ()=>{}
  const addProduct = () => {
    // Add the new food item to foodData array
    setFoodItems([...foodItems, inputFood]);
    console.log(foodItems)
    // Reset the food state
    setInputFood({
      key: inputFood.key + 1,  // increment the id for the next item
      name: '',
      protein: 0,
      calories: 0,
      carbs: 0,
      fats: 0,
      prefered_size: 50
    });
  };


  const handleName = (text: string) => {
    setInputFood((prevFood) => ({ ...prevFood, name: text }));
  };

  const handleProtein = (text: string) => {
    setInputFood((prevFood) => ({ ...prevFood, protein: parseInt(text, 10) || 0 }));
  };

  const handleCalories = (text: string) => {
    setInputFood((prevFood) => ({ ...prevFood, calories: parseInt(text, 10) || 0 }));
  };
  const handleCarbs = (text: string) => {
    setInputFood((prevFood) => ({ ...prevFood, carbs: parseInt(text, 10) || 0 }));
  };
  const handleFats = (text: string) => {
    setInputFood((prevFood) => ({ ...prevFood, fats: parseInt(text, 10) || 0 }));
  };


  const [collapsed, setcollapsed] = useState<Boolean>(false)
  const lastCounter = counters.length > 0 ? counters[counters.length - 1] : { calories: 0, protein: 0, carbs: 0, fats: 0 };

  return (
    <ScrollView flex={1} h="100%" >
      <Box p={4}>
        <Box>
          {/* HEADER */}
          <Text fontSize="xl" fontWeight="bold" marginTop={5} textAlign="center">
            Main Page
          </Text>
        </Box>
        <Box
          alignItems="center"
          shadow={2}
          justifyContent="center"

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
              <Button onPress={() => {
                if (counters.length < 2) {
                  insertOrReplaceCounter({ startOfDay: "15/7/2024", calories: 0, protein: 0, carbs: 0, fats: 0 });
                }
                else { setCounters(counters.slice(0, counters.length - 1)) }
              }}>
                <Text>Clear counter</Text>
              </Button>
            </HStack>
          </VStack>
        </Box>
        <Box mb={4} alignItems="center" shadow={2}
          bg={custom_bg_theme} p="4" rounded="xl">
          <TouchableOpacity onPress={() => { setcollapsed(!collapsed) }}>
            <VStack space={4} alignItems="center">
              <HStack space={2}>
                <Text fontWeight="bold" >Insert Item</Text>
              </HStack>
              {collapsed && (<>
                <HStack><Divider maxWidth={300} bg={'light.400'} /></HStack>

                <HStack alignItems="center" space={2}>
                  <Text flex={1} >Name: </Text>
                  <Input flex={2} textAlign={"center"} variant="underlined" placeholder="..." value={inputFood.name} onChangeText={handleName} />
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Text flex={1} >Calories: </Text>
                  <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.calories === 0 ? '' : inputFood.calories.toString()} onChangeText={handleCalories} keyboardType="numeric" />
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Text flex={1} >Protein: </Text>
                  <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.protein === 0 ? '' : inputFood.protein.toString()} onChangeText={handleProtein} keyboardType="numeric" />
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Text flex={1} >Carbs: </Text>
                  <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.carbs === 0 ? '' : inputFood.carbs.toString()} onChangeText={handleCarbs} keyboardType="numeric" />
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Text flex={1} >Fats: </Text>
                  <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.fats === 0 ? '' : inputFood.fats.toString()} onChangeText={handleFats} keyboardType="numeric" />
                </HStack>
                <HStack alignItems="center" space={2}>
                  <Button size="xs" onPress={makeInsertFoodItem}>
                    <Text>Add</Text>
                  </Button>
                </HStack></>)}
            </VStack>

          </TouchableOpacity>
        </Box>
      </Box>





    </ScrollView >
  );
};

export default HomeScreen;
