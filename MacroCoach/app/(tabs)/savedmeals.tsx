import React, { useContext, useEffect, useState } from "react";

import { NativeBaseProvider, Box, Button, Flex, ScrollView, Divider, Text, Input, HStack, VStack, Wrap, Spacer, Pressable } from "native-base";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { ParamListBase } from "@react-navigation/native";
import { DatabaseContext } from "@/context/databaseContext";
import { DatabaseContextType } from "@/@types/databaseContextType";

interface FoodItem {
    key: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}


export default function App() {
    //config
    const config = {
        dependencies: {
            'linear-gradient': LinearGradient
        }
    };

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const databaseContext = useContext(DatabaseContext);//database
    const { foodItems, setFoodItems } = databaseContext as DatabaseContextType;
    const [count, setCount] = useState(0);

    useEffect(() => {//default values inserten
        foodItems.forEach(x=> {if(x.key==2 ||x.key==3 ||x.key==4){setCount(count+1)} })
        if(count!=3){
            setFoodItems([...foodItems,
            { key: 2, name: 'milk', calories: 470, protein: 34, carbs: 96, fats: 32 },
            //{ key: 2, name: 'bread', calories: 200, protein : 5 , carbs:0, fats:0 },
            { key: 3, name: 'egg', calories: 74, protein: 6.3, carbs: 0.7, fats: 5.2 },
            { key: 4, name: 'de poes van robin', calories: 10755.6, protein: 0, carbs: 0, fats: 0 }])
        }
    }, [])

    const [inputFood, setInputFood] = useState({//food that is typed in input
        key: foodItems.length > 0 ? foodItems[foodItems.length - 1].key + 1 : 1,
        name: '',
        protein: 0,
        calories: 0,
        carbs: 0,
        fats: 0
    });

    const [multipleFoodSelectBool, setMultipleFoodSelectBool] = useState(false);
    const [multipleFoodSelect, setMultipleFoodSelect] = useState<FoodItem[]>([]);
    const chooseFood = (food: any) => {
        if (!multipleFoodSelectBool) {
            navigation.navigate('counter', [food]);
        }
        else if (multipleFoodSelectBool) {
            setMultipleFoodSelect([...multipleFoodSelect, food])
        }
    }

    const addProduct = () => {
        // Add the new food item to foodData array
        setFoodItems([...foodItems, inputFood]);

        // Reset the food state
        setInputFood({
            key: inputFood.key + 1,  // increment the id for the next item
            name: '',
            protein: 0,
            calories: 0,
            carbs: 0,
            fats: 0
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

    const removeLastProduct = () => {
        setFoodItems(foodItems.slice(0, -1));
    };

    const chooseMultipleFoods = () => {
        console.log("chooseMultipleFoods function called")
        console.log("multipleFoodSelectBool", multipleFoodSelectBool)
        if (!multipleFoodSelectBool) {//wil beginnen met selecten 
            setMultipleFoodSelectBool(true)
            console.log(multipleFoodSelectBool)
        }
        else if (multipleFoodSelectBool) {//wil eindigen met selecten
            setMultipleFoodSelectBool(false)
            console.log(multipleFoodSelectBool)
            navigation.navigate('counter', multipleFoodSelect)
            setMultipleFoodSelect([])
        }
    }
    const redirectScanner = () => {
        navigation.navigate("barcodeScanner")
    }

    return (
        <NativeBaseProvider config={config}>
            <ScrollView flex={1} h="100%">
                <Box p={4}>
                    {
                        //HEADER
                    }
                    <Text fontSize="xl" fontWeight="bold" mb={4} marginTop={"5%"} textAlign="center" >
                        Food Items
                    </Text>

                    <Box p={2} mb={4} alignItems="center">
                        <VStack space={2}>
                            <Text textAlign="center" fontSize="sm" fontWeight="bold">Name/Calories/Protein/Carbohydrates/Fats</Text>
                            <Box><Divider /></Box>
                            {
                                //CARDS
                            }
                            <Flex direction="row" flexWrap="wrap" justifyContent="center" >
                                {foodItems.map((food) => {
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
                                                shadow={5}
                                                _text={{
                                                    fontSize: 'md',
                                                    fontWeight: 'medium',
                                                    color: 'warmGray.50',
                                                    letterSpacing: 'lg',
                                                }} mx={2} my={2} >

                                                <Flex direction="row" h="58" p="4">
                                                    {food.name}
                                                    <Divider bg="success.500" thickness="2" mx="2" orientation="vertical" />

                                                    {food.calories}
                                                    <Divider bg="success.500" thickness="2" mx="2" orientation="vertical" />

                                                    {food.protein}g
                                                    <Divider bg="success.500" thickness="2" mx="2" orientation="vertical" />
                                                    {food.carbs}g
                                                    <Divider bg="success.500" thickness="2" mx="2" orientation="vertical" />
                                                    {food.fats}g

                                                </Flex>
                                            </Box>
                                        </Pressable>
                                    )
                                })}</Flex>
                        </VStack>
                    </Box>
                    <Button>clear cards</Button>



                    {
                        //INPUT FIELD for adding a card
                    }
                    <Box p={2} mb={4} alignItems="center" rounded="lg" shadow={2}
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
                            <HStack><Divider maxWidth={300} bg={{
                                linearGradient: {
                                    colors: ['violet.900', 'blue.500'],
                                    start: [0, 0],
                                    end: [1, 0]
                                }
                            }} /></HStack>
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >Name: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.name} onChangeText={handleName} />
                            </HStack>
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >calories: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.calories === 0 ? '' : inputFood.calories.toString()} onChangeText={handleCalories} keyboardType="numeric" />
                            </HStack>
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >Protein: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.protein === 0 ? '' : inputFood.protein.toString()} onChangeText={handleProtein} keyboardType="numeric" />
                            </HStack>
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >carbs: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.carbs === 0 ? '' : inputFood.carbs.toString()} onChangeText={handleCarbs} keyboardType="numeric" />
                            </HStack>
                            <HStack alignItems="center" space={2}>
                                <Text flex={1} >fats: </Text>
                                <Input flex={2} variant="underlined" value={inputFood.fats === 0 ? '' : inputFood.fats.toString()} onChangeText={handleFats} keyboardType="numeric" />
                            </HStack>
                            <HStack alignItems="center" space={2}>
                                <Button bgColor="warmGray.100" size="xs" onPress={addProduct}>
                                    <Text>Add</Text>
                                </Button>
                                <Button bgColor="warmGray.100" size="xs" onPress={redirectScanner}>
                                    <Text>SCANN</Text>
                                </Button>
                            </HStack>


                        </VStack>
                    </Box>
                    {
                        //BUTTON FOR MULTIPLE MEAL SELECTION
                    }
                    <Box p={2} mb={4} rounded="lg" shadow={2} bg={{
                        linearGradient: {
                            colors: ['violet.800', 'blue.600'],
                            start: [0, 0],
                            end: [1, 0]
                        }
                    }}>
                        <VStack space={4} alignItems="center">
                            <Button bgColor={multipleFoodSelectBool ? "warmGray.500" : "warmGray.100"} onPress={chooseMultipleFoods} size="xs" >
                                <Text>Multiple meals</Text>
                            </Button>
                        </VStack>
                    </Box>
                    {
                        //BUTTON FOR DELETING LAST FOOD CARD
                    }
                    <Box p={2} mb={4} rounded="lg" shadow={2} bg={{
                        linearGradient: {
                            colors: ['violet.800', 'blue.600'],
                            start: [0, 0],
                            end: [1, 0]
                        }
                    }}
                    >
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