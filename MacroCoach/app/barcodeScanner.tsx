import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
//import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { Box, Center, Divider, HStack, Icon, ScrollView, VStack, Text, Button, Modal, FormControl, Input } from 'native-base';
import { DatabaseContextType } from '@/@types/databaseContextType';
import { DatabaseContext } from '@/context/databaseContext';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { ParamListBase } from '@react-navigation/native';
//barcode Scanner is depricated, using expo camera https://github.com/expo/fyi/blob/main/barcode-scanner-to-expo-camera.md

interface ProductData {
    product?: {
        nutrient_levels?: any; // Replace with specific type if known
        nutriments?: any;
        nutrient_levels_tags?: any;
        product_name: string;
        serving_size: string;
        product_quantity: string;
    };
    status?: string;
    status_verbose?: string;
}



export default function App() {
    //camera
    const [hasPermission, setHasPermission] = useState<Boolean>();
    const [scanned, setScanned] = useState<Boolean>(false);
    const [barcodeText, setBarcodeText] = useState<String>('Not yet scanned')
    const [JSONdata, setJSONData] = useState<ProductData>()
    const [obtainedData, setObtainedData] = useState<Boolean>(false);//not used currently


    const constApiLink = "https://nl.openfoodfacts.org/api/v0/product/"// [barcode].json is expected at the end

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }

    const addProduct = () => {



    }
    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();

    }, []);

    useEffect(() => {
        console.log("filtered jsondata", JSONdata, "\n")

    }, [JSONdata])


    // What happens when we scan the bar code
    const handleBarCodeScanned = ({ type, data }: any) => {
        setBarcodeText(data);
        setScanned(true);
        (async (url: string) => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'MacroCoach - Android - Version 1.0 - www.github.com/warre342/fitness-app'
                    }
                });

                //console.log("Unfiltered JSON data: ", response.data);
                // Filter data and update state
                const filteredData: ProductData = {
                    product: {
                        nutrient_levels: response.data.product?.nutrient_levels,
                        nutriments: response.data.product?.nutriments,
                        nutrient_levels_tags: response.data.product?.nutrient_levels_tags,
                        product_name: response.data.product?.product_name,
                        serving_size: response.data.product?.serving_size,
                        product_quantity: response.data.product?.product_quantity,

                    },
                    status: response.data.status,
                    status_verbose: response.data.status_verbose
                };
                // Update the state with the filtered data
                setJSONData(filteredData);
                setObtainedData(true)

            }
            catch (error) {
                console.error('Error:', error);
                throw error;
            }
        })(constApiLink + barcodeText + ".json")//get the json object from the link and save it

        //console.log("filtered jsondata", JSONdata, "\n")
        console.log('Type: ' + type + '\nData: ' + data + ".")
    }

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <ScrollView flex={1} h="100%">
                <Box style={styles.container}>
                    <Text>Requesting for camera permission</Text></Box>
            </ScrollView>)
    }
    if (hasPermission === false) {
        return (
            <ScrollView flex={1} h="100%">
                <Box style={styles.container}>
                    <Text style={{ margin: 10 }}>No access to camera</Text>
                    <Button onPress={() => askForCameraPermission()}>Allow Camera</Button >
                </Box>
            </ScrollView>
        )
    }

    //modal
    const [showModal, setShowModal] = useState(false);
    const databaseContext = useContext(DatabaseContext);//database
    const { foodItems, setFoodItems } = databaseContext as DatabaseContextType;
    const [itemName, setItemName] = useState('');
    const [servingSize, setServingSize] = useState('');//this is the chosen size not the size from the scrape
    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

    const addFoodItem = () => {
        let prot = JSONdata?.product?.nutriments?.["proteins_100g"]
        let carbs = JSONdata?.product?.nutriments?.["carbohydrates_100g"]
        let fats = JSONdata?.product?.nutriments?.["fat_100g"]
        let cals = JSONdata?.product?.nutriments?.["energy-kcal_100g"]

        if ((prot !== undefined) && (carbs !== undefined) && (fats !== undefined) && (cals !== undefined)) {
            const food = {
                key: foodItems.length > 0 ? foodItems[foodItems.length - 1].key + 1 : 1,
                name: itemName,
                protein: prot ,
                calories: cals,
                carbs:carbs,
                fats: fats ,
                prefered_size: servingSize
            }
            setFoodItems([...foodItems, food]) 
        }
        navigation.navigate("savedmeals")


    }
    // Return the View
    return (
        <ScrollView flex={1} h="100%">
            <Box style={styles.container}>
                <View style={styles.barcodebox}>
                    <CameraView
                        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ height: 400, width: 400 }} />
                </View>
                <Text style={styles.maintext}>Barcode: {barcodeText}</Text>
                {scanned && (<Button onPress={() => setScanned(false)} color='tomato'>Scan again</Button>)}

                {JSONdata !== undefined && obtainedData && (
                    <Box w="100%" p={4}>
                        <Box w="100%" p={6} paddingTop={3} bg="warmGray.50"  >
                            <Text fontWeight="bold" fontSize={"lg"} textAlign={"center"}>Product found: {JSONdata?.product?.product_name ?? "/"}</Text>
                            <Divider />
                            <Text textAlign="center" paddingTop={3} paddingBottom={2} fontWeight="bold" fontSize={"md"}>
                                Nutrient Levels
                            </Text>
                            <VStack space={3} divider={<Divider />} w="100%" >
                                <HStack justifyContent="space-between">
                                    <Text>sugars</Text>
                                    <Text>{JSONdata?.product?.nutrient_levels?.sugars ?? 'No data available'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>fat</Text>
                                    <Text>{JSONdata?.product?.nutrient_levels?.fat ?? 'No data available'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>saturated fat</Text>
                                    <Text>{JSONdata?.product?.nutrient_levels?.['saturated-fat'] ?? 'No data available'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>salt</Text>

                                    <Text>{JSONdata?.product?.nutrient_levels?.salt ?? 'No data available'}</Text>
                                </HStack>


                            </VStack>
                        </Box>
                        <Box w="100%" p={6} paddingTop={3} bg="warmGray.50">
                            <Text textAlign="center" paddingBottom={3} fontWeight="bold" fontSize={"md"}>
                                Nutrient Stats
                            </Text>
                            <VStack space={3} divider={<Divider />} w="100%">
                                <HStack justifyContent="space-between" >
                                    <Text fontWeight={"bold"}>Type   </Text>
                                    <Text fontWeight={"bold"}>Per/100</Text>
                                    <Text fontWeight={"bold"}>Per/serving</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Kcal   </Text>
                                    <Text>{JSONdata?.product?.nutriments?.["energy-kcal_100g"] ?? "/"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["energy-kcal_serving"] ?? "/"}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Protein</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["proteins_100g"] ?? "/"}{"g"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["proteins_serving"] ?? "/"}{"g"}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Carbs</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["carbohydrates_100g"] ?? "/"}{"g"}</Text>

                                    <Text>{JSONdata?.product?.nutriments?.["carbohydrates_serving"] ?? "/"}{"g"}</Text>
                                </HStack>

                                <HStack justifyContent="space-between">
                                    <Text>Fat    </Text>
                                    <Text>{JSONdata?.product?.nutriments?.["fat_100g"] ?? "/"}{"g"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["fat_serving"] ?? "/"}{"g"}</Text>
                                </HStack>

                                <HStack justifyContent="space-between">
                                    <Text>Sugar  </Text>
                                    <Text>{JSONdata?.product?.nutriments?.["sugars_100g"] ?? "/"}{"g"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["sugars_serving"] ?? "/"}{"g"}</Text>
                                </HStack>
                                <Text textAlign="center">total size: {JSONdata?.product?.product_quantity ?? "/"} </Text>
                                <Text textAlign="center">Serving size: {JSONdata?.product?.serving_size ?? "/"} </Text>
                            </VStack>
                        </Box>
                        <Button shadow={2} onPress={() => setShowModal(true)}>
                            Add Item
                        </Button>
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                            <Modal.Content maxWidth="400px">
                                <Modal.CloseButton />
                                <Modal.Header>Add item</Modal.Header>
                                <Modal.Body>
                                    <FormControl>
                                        <FormControl.Label>Name</FormControl.Label>
                                        <Input

                                            value={itemName} // Synchronize the input field with the state variable
                                            onChangeText={text => setItemName(text)} // Update the state variable when the user types
                                        />
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label >Prefered serving size</FormControl.Label>
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
                                            addFoodItem();
                                        }}>
                                            Save
                                        </Button>
                                    </Button.Group>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>

                    </Box>

                )
                }

                <Text style={styles.leftAlign} italic>Food values may not be 100% accurate</Text>



            </Box>
        </ScrollView>
    );
}
//<Text style={styles.maintext}>{JSON.stringify(JSONdata)}</Text>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    leftAlign: {
        //paddingLeft: "2%",
        //alignSelf: 'flex-start',
        fontSize: 10
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato'
    }
});