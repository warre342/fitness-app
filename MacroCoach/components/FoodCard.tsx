import { Box, Button, Divider, Flex, HStack, Pressable, Spacer, Text, VStack } from "native-base";
import React, { useState } from "react";

//choosefood is a function and food is type 
export function FoodCard({ chooseFood, deleteFood, food }: any) {

  const [expanded, setExpanded] = useState(false)

  return <>
    <Box key={food.key} p="0" bg={{
      linearGradient: {
        colors: ['blue.500', 'pink.600'],
        start: [0, 5, 1],
        end: [0.5, 3, 1]
      }
    }} rounded="md" shadow={5} _text={{
      fontSize: 'md',
      fontWeight: 'medium',
      color: 'warmGray.50',
      letterSpacing: 'lg'
    }} mx={2} my={2}>

      <Pressable
        onPress={() => {
          //chooseFood(food)
          setExpanded(!expanded)
        }} key={food.key}>

        <Flex direction="row" h="58" p="4" alignSelf={"flex-end"}>
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
      </Pressable >

      {expanded && (
        <>
          <VStack>
            <HStack>
              <Divider width={"90%"} mx={"5%"} />
            </HStack>
            <HStack width={"90%"} mx={"5%"} marginTop={3} mb={3} space={3}>

              <Button onPress={() => {
                setExpanded(!expanded)
                chooseFood(food, food.prefered_size)
              }}>
                {"Size: " + (food.prefered_size ?? "/") + "g"}
              </Button>

              <Button onPress={() => { console.log("not implemented yet") }}>Custom size</Button>

              <Spacer />
              <Button alignSelf={"flex-end"} onPress={() => { deleteFood(food.key) }}>Delete</Button>
            </HStack>

          </VStack>
        </>
      )
      }
    </Box>

  </>
}
