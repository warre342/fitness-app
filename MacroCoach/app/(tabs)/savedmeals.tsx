import { FoodCard } from '../../components/FoodCard';
import React, { useContext, useEffect, useState } from "react";

import { NativeBaseProvider, Box, Button, Flex, ScrollView, Divider, Text, Input, HStack, VStack, Image, Wrap, Spacer, Pressable } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { ParamListBase } from "@react-navigation/native";
import { DatabaseContext } from "@/context/databaseContext";
import { DatabaseContextType } from "@/@types/databaseContextType";
import { FoodItemChangesContext } from "@/context/foodItemChangesContext";
import { FoodItemChangesContextType } from "@/@types/foodItemChangesContextType";
import { FoodItem } from '@/@types/foodItem';
import { custom_bg_theme } from '@/constants/Colors';
import { ICounter } from '@/@types/counter';



/*
ADDING ITEMS: 
momenteel: 
    er wordt op card geklikt 
    object van die card wordt geroute naar counter.tsx
    als de routing naar counter.tsx wordt aangepast wordt het object toegevoegd aan foodArray[]
    als foodarray wordt aangepast dan wordt het foodarray opgeteld bij laatste counter en wordt foodArray leeg


wat ik wil: 
    er wordt op card gelikt
    object van die card wordt opgeteld bij de laatste counter
    addCount +=1
    als er geklikt wordt op counter.tsx => addCount =0
*/

export default function App() {
    //config
    const config = {
        dependencies: {
            'linear-gradient': LinearGradient
        }
    };

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const databaseContext = useContext(DatabaseContext);//database
    const { counters, setCounters, insertOrReplaceCounter, foodItems, setFoodItems } = databaseContext as DatabaseContextType;
    const [lastCounter, setLastCounter] = useState<ICounter[]>([])//holds a list of the states of the last counter
    const [lastCounterChangeBool, setLastCounterChangeBool] = useState<Boolean>(false)

    useEffect(() => {
        setLastCounter([...lastCounter, counters[counters.length - 1]])
    }, [counters])

    const undoCounter = () => {
        console.log("holds a list of the states of the last counter: ",lastCounter)
        setCounters(counters.map((counter, index) => {
            if(index==counter.length-1){
                return lastCounter[lastCounter.length-2]//vervang huidige counter door de vorige 
            }
            else{return counter}
        }))
        setLastCounter(lastCounter.slice(0, lastCounter.length-1))//verwijder de oude counter 
        setAddCount(addCount -1)
        if(lastCounter.length>3){
            setLastCounter(lastCounter.slice(1, lastCounter.length))
        }
    }

    const [inputFood, setInputFood] = useState({//food that is typed in input
        key: foodItems.length > 0 ? foodItems[foodItems.length - 1].key + 1 : 1,
        name: '',
        protein: 0,
        calories: 0,
        carbs: 0,
        fats: 0,
        prefered_size: 50
    });


    const foodItemChangesContext = useContext(FoodItemChangesContext);//database
    const { addCount, setAddCount } = foodItemChangesContext as FoodItemChangesContextType;

    const chooseFood = (food: FoodItem, size: number) => {
        setCounters(counters.map((counter, index) => { //voeg food toe aan laatse counter
            if (index === counters.length - 1) {
                return {
                    ...counter,
                    calories: counter.calories + (food.calories / 100) * (size),
                    protein: counter.protein + (food.protein / 100) * (size),
                    carbs: counter.carbs + (food.carbs / 100) * (size),
                    fats: counter.fats + (food.fats / 100) * (size)
                };
            } else {
                return counter;
            }
        }));

        setAddCount(addCount + 1)
    }

    const deleteFood = (key: number) => {
        setFoodItems(foodItems.filter(food => food.key !== key))
    }


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
    const handlePrefered_size = (text: string) => {
        setInputFood((prevFood) => ({ ...prevFood, prefered_size: parseInt(text, 10) || 100 }));
    };

    const redirectScanner = () => {
        navigation.navigate("barcodeScanner")
    }

    return (
        <ScrollView flex={1} h="100%">
            <Box p={4}>
                {
                    //HEADER
                }
                <Text fontSize="xl" fontWeight="bold" mb={4} marginTop={"5%"} textAlign="center" >
                    Food Items
                </Text>

                <Box p={2} mb={4} alignItems="center" width={"100%"}>
                    <VStack space={2}>
                        <Text textAlign="center" fontSize="sm" fontWeight="bold">Per 100 grams:</Text>
                        <Text textAlign="center" fontSize="sm" fontWeight="bold">Name/Calories/Protein/Carbohydrates/Fats</Text>
                        <Box><Divider /></Box>
                        {
                            //CARDS
                        }
                        <Flex direction="row" flexWrap="wrap" justifyContent="center" >
                            {foodItems.map((food) => {
                                return (
                                    <FoodCard key={food.key} chooseFood={chooseFood} food={food} deleteFood={deleteFood} />
                                )
                            })}

                        </Flex>
                        <HStack justifyContent="center" width="100%" mt={1}>
                            <Button onPress={undoCounter}>
                                <Text>Undo</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </Box>

                {
                    //INPUT FIELD for adding a card
                }
                <Box mb={4} alignItems="center" shadow={2}
                    bg={custom_bg_theme} p="4" rounded="xl">
                    <VStack space={4} alignItems="center">
                        <HStack space={2}>
                            <Text fontWeight="bold" >Add product</Text>
                        </HStack>
                        <HStack><Divider maxWidth={300} bg={'light.400'} /></HStack>

                        <HStack alignItems="center" space={2}>
                            <Text flex={1} >Name: </Text>
                            <Input flex={2} textAlign={"center"} variant="underlined" placeholder="..." value={inputFood.name} onChangeText={handleName} />
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Text flex={1} >Calories/100g: </Text>
                            <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.calories === 0 ? '' : inputFood.calories.toString()} onChangeText={handleCalories} keyboardType="numeric" />
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Text flex={1} >Protein/100g: </Text>
                            <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.protein === 0 ? '' : inputFood.protein.toString()} onChangeText={handleProtein} keyboardType="numeric" />
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Text flex={1} >Carbs/100g: </Text>
                            <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.carbs === 0 ? '' : inputFood.carbs.toString()} onChangeText={handleCarbs} keyboardType="numeric" />
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Text flex={1} >Fats/100g: </Text>
                            <Input flex={2} textAlign={"center"} variant="underlined" placeholder="0g" value={inputFood.fats === 0 ? '' : inputFood.fats.toString()} onChangeText={handleFats} keyboardType="numeric" />
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Text flex={1} >Prefered Serving size: </Text>
                            <Input flex={2} textAlign={"center"} variant="underlined" placeholder="50g" value={inputFood.prefered_size === 50 ? '' : inputFood.prefered_size.toString()} onChangeText={handlePrefered_size} />
                        </HStack>
                        <HStack alignItems="center" space={2}>
                            <Button size="xs" onPress={addProduct}>
                                <Text>Add</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
                {
                    //scan product

                }
                <Box p={2} mb={4} alignItems="center" rounded="lg" shadow={2}
                    bg={custom_bg_theme}>
                    <VStack space={4} alignItems="center">
                        <HStack space={2}>
                            <Text fontWeight="bold" >Scan product</Text>
                        </HStack>
                        <HStack>
                            <Divider maxWidth={300} bg={'light.300'} /></HStack>
                        <HStack>
                            <Image borderColor={'black'} borderWidth={2} rounded="lg" size="md" source={require('../../images/barcode.png')} alt="image barcodecanner"></Image>
                        </HStack>
                        <HStack>
                            <Button size="xs" onPress={redirectScanner}>
                                <Text>Scan</Text>
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </ScrollView >
    );
}