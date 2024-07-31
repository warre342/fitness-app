import { custom_bg_theme } from "@/constants/Colors";
import { Box, Button, Divider, Flex, FormControl, HStack, Input, Modal, Pressable, Spacer, Text, VStack } from "native-base";
import React, { useState } from "react";

//choosefood is a function and food is type 
export function FoodCard({ chooseFood, deleteFood, food }: any) {

  const [expanded, setExpanded] = useState(false) //ontouch
  const [showModal, setShowModal] = useState(false); //on custom size 

  const [servingSize, setServingSize] = useState('');//this is the chosen size not the size from the scrape


  return <>
    <Box key={food.key} rounded="lg" bg={custom_bg_theme} shadow={5}
      _text={{
        fontSize: 'md',
        fontWeight: 'medium',
        color: 'warmGray.50',
        letterSpacing: 'lg'
      }} mx={2} my={2} p={1}>

      <Pressable
        onPress={() => {
          //chooseFood(food)
          setExpanded(!expanded)
        }}>

        <Flex direction="row" h="58" p="4" alignSelf={"flex-end"}>
          {food.name}
          <Divider bg="primary.600" thickness="2" mx="2" orientation="vertical" />

          {food.calories.toFixed(2).replace(/\.00$/, '')}
          <Divider bg="primary.600" thickness="2" mx="2" orientation="vertical" />

          {food.protein.toFixed(2).replace(/\.00$/, '')}g
          <Divider bg="primary.600" thickness="2" mx="2" orientation="vertical" />
          {food.carbs.toFixed(2).replace(/\.00$/, '')}g
          <Divider bg="primary.600" thickness="2" mx="2" orientation="vertical" />
          {food.fats.toFixed(2).replace(/\.00$/, '')}g

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

              <Button onPress={() => {
                setShowModal(true)
              }}>Custom size</Button>

              <Spacer />
              <Button alignSelf={"flex-end"} onPress={() => { deleteFood(food.key) }}>Delete</Button>
            </HStack>

          </VStack>

          <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Count item</Modal.Header>
              <Modal.Body>
                <FormControl>
                  <FormControl.Label >Serving size</FormControl.Label>
                  <Input
                    placeholder="e.g. 100g"
                    keyboardType="numeric"
                    value={servingSize} // Synchronize the input field with the state variable
                    onChangeText={text => setServingSize(text)} // Update the state variable when the user types
                  />
                </FormControl>
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                    setShowModal(false);
                  }}>
                    Cancel
                  </Button>
                  <Button onPress={() => {
                    setShowModal(false);
                    chooseFood(food, servingSize)
                  }}>
                    Save
                  </Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>
        </>
      )
      }
    </Box>

  </>
}



