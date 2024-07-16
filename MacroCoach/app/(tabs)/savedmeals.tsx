import React, { useState } from "react";

import { NativeBaseProvider, Box, Button, Flex, ScrollView, Divider, Text, Input, HStack, VStack, Wrap, Spacer, Pressable } from "native-base";
import useFoodData from "@/hooks/useFoodData";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { ParamListBase } from "@react-navigation/native";
import useCounter from "@/hooks/useCurrentCounter";



export default function App() {
    //config
    const config = {
        dependencies: {
            'linear-gradient': LinearGradient
        }
    };

    //hooks
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
    //const { counter, setCounter } = useCounter();
    const { foodData, setFoodData } = useFoodData();
    const [inputFood, setInputFood] = useState({
        key: foodData.length > 0 ? foodData[foodData.length - 1].key + 1 : 1,
        name: '',
        protein: 0,
        calories: 0
    });

    //functions

    /* //why arent hooks shared?????
        //code can be used for passing counter object when adding multiple food items at once
    const chooseFood = (food: any) => {
        console.log(counter)
        setCounter(counter.map((item, index) => {
            if (index === counter.length - 1) {
                return {
                    ...item,
                    calories: item.calories + food.calories,
                    protein: item.protein + food.protein,
                    carbs: item.carbs + 0,
                    fats: item.fats + 0
                };
            }
            else { return item; }

        })
        );
        console.log(counter)
        navigation.navigate('counter');
    };*/
    const chooseFood = (food: any) => {
        navigation.navigate('counter', { food });

    }


    const addProduct = () => {
        // Add the new food item to foodData array
        setFoodData([...foodData, inputFood]);

        // Reset the food state
        setInputFood({
            key: inputFood.key + 1,  // increment the id for the next item
            name: '',
            protein: 0,
            calories: 0
        });
    };

    const handleName = (text: string) => {
        setInputFood((prevFood) => ({ ...prevFood, name: text }));
    };

    const handleProtein = (text: string) => {
        setInputFood((prevFood) => ({ ...prevFood, protein: parseInt(text, 10) || 0 }));
    };

    const handleCallories = (text: string) => {
        setInputFood((prevFood) => ({ ...prevFood, calories: parseInt(text, 10) || 0 }));
    };

    const removeLastProduct = () => {
        setFoodData(foodData.slice(0, -1));
    };

    return (
        <NativeBaseProvider config={config}>
            <ScrollView flex={1} h="100%">
                <Box p={4}>
                    <Text fontSize="xl" fontWeight="bold" mb={4} marginTop={"5%"} textAlign="center" >
                        Food Items
                    </Text>
                    <Box p={2} mb={4} alignItems="center">
                        <VStack space={2}>
                            <Text textAlign="center" fontSize="md" fontWeight="bold">Name/Protein/Calories</Text>
                            <Divider />
                            <Flex direction="row" flexWrap="wrap" justifyContent="center" >
                                {foodData.map((food) => {
                                    return (
                                        <Pressable onPress={() => chooseFood(food)} key={food.key}>

                                            <Box key={food.key}
                                                p="0"
                                                bg={{
                                                    linearGradient: {
                                                        colors: ['blue.500', 'pink.600'],
                                                        start: [0, 5, 1],
                                                        end: [0.5, 3, 1]
                                                    }
                                                }}

                                                rounded="md"

                                                _text={{
                                                    fontSize: 'md',
                                                    fontWeight: 'medium',
                                                    color: 'warmGray.50',
                                                    letterSpacing: 'lg',
                                                }} mx={2} my={2} shadow={2}>

                                                <Flex direction="row" h="58" p="4">
                                                    {food.name}
                                                    <Divider bg="gray.500" thickness="2" mx="2" orientation="vertical" />

                                                    {food.protein}
                                                    <Divider bg="success.500" thickness="2" mx="2" orientation="vertical" />

                                                    {food.calories}
                                                </Flex>
                                            </Box>
                                        </Pressable>
                                    )
                                })}</Flex>
                        </VStack>
                    </Box>
                    <Box p={2} mb={4} alignItems="center" rounded="lg"
                        bg={{
                            linearGradient: {
                                colors: ['blue.600', 'violet.800'],
                                start: [0, 0],
                                end: [1, 0]
                            }
                        }}>
                        <VStack space={4} alignItems="center">
                            <HStack space={2}>
                                <Text fontWeight="bold" >Add product</Text>
                            </HStack>
                            <Divider bg={{
                                linearGradient: {
                                    colors: ['violet.900', 'blue.500'],
                                    start: [0, 0],
                                    end: [1, 0]
                                }
                            }} />
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >Name: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.name} onChangeText={handleName} />
                            </HStack>
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >Protein: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.protein.toString()} onChangeText={handleProtein} keyboardType="numeric" />
                            </HStack>
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >Calories: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.calories.toString()} onChangeText={handleCallories} keyboardType="numeric" />
                            </HStack>
                            <Button bgColor="warmGray.100" size="xs" onPress={addProduct}>
                                <Text>Add</Text>
                            </Button>
                        </VStack>
                    </Box>

                    <Box p={2} mb={4} rounded="lg" bg={{
                        linearGradient: {
                            colors: ['violet.800', 'blue.600'],
                            start: [0, 0],
                            end: [1, 0]
                        }
                    }}>
                        <VStack space={4} alignItems="center">
                            <Button bgColor="warmGray.100" onPress={removeLastProduct} size="xs">
                                <Text>Remove Last</Text>
                            </Button>
                        </VStack>
                    </Box>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
}