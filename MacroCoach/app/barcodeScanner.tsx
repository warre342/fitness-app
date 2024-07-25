import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
//import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { Box, Center, Divider, HStack, Icon, ScrollView, VStack, Text } from 'native-base';
//barcode Scanner is depricated, using expo camera https://github.com/expo/fyi/blob/main/barcode-scanner-to-expo-camera.md

interface ProductData {
    product?: {
        nutrient_levels?: any; // Replace with specific type if known
        nutriments?: any;
        nutrient_levels_tags?: any;
    };
    status?: string;
    status_verbose?: string;
}



export default function App() {
    const [hasPermission, setHasPermission] = useState<Boolean>();
    const [scanned, setScanned] = useState<Boolean>(false);
    const [barcodeText, setBarcodeText] = useState<String>('Not yet scanned')
    const [JSONdata, setJSONData] = useState<ProductData>()
    const [obtainedData, setObtainedData] = useState<Boolean>(false);


    const constApiLink = "https://nl.openfoodfacts.org/api/v0/product/"// [barcode].json is expected at the end

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
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
        setScanned(true);
        setBarcodeText(data);
        (async (url: string) => {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'MacroCoach - Android - Version 1.0 - www.github.com/warre342/fitness-app'
                    }
                });

                //console.log("Unfiltered JSON data: ", response.data);
                setObtainedData(true)
                // Filter data and update state
                const filteredData: ProductData = {
                    product: {
                        nutrient_levels: response.data.product?.nutrient_levels,
                        nutriments: response.data.product?.nutriments,
                        nutrient_levels_tags: response.data.product?.nutrient_levels_tags,
                    },
                    status: response.data.status,
                    status_verbose: response.data.status_verbose
                };
                // Update the state with the filtered data
                setJSONData(filteredData);
            }
            catch (error) {
                console.error('Error:', error);
                throw error;
            }
        })(constApiLink + barcodeText + ".json")//get the json object from the link and save it

        //console.log("filtered jsondata", JSONdata, "\n")
        //console.log('Type: ' + type + '\nData: ' + data + ".")
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
                    <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
                </Box>
            </ScrollView>
        )
    }


    const nutriments = JSONdata?.product?.nutriments || {};

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

                {JSONdata !== undefined && obtainedData && (
                    <Box w="100%" p={4}>
                        <Box w="100%" p={6} paddingTop={3} bg="warmGray.50"  >
                            <Text textAlign="center" paddingBottom={3} fontWeight="bold" fontSize={"md"}>
                                Nutrient Levels
                            </Text>
                            <VStack space={3} divider={<Divider />} w="100%" >
                                <HStack justifyContent="space-between">
                                    <Text>fat</Text>
                                    <Text>{JSONdata?.product?.nutrient_levels?.fat ?? 'No data available'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>salt</Text>

                                    <Text>{JSONdata?.product?.nutrient_levels?.salt ?? 'No data available'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>saturated fat</Text>
                                    <Text>{JSONdata?.product?.nutrient_levels?.['saturated-fat'] ?? 'No data available'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>sugars</Text>
                                    <Text>{JSONdata?.product?.nutrient_levels?.sugars ?? 'No data available'}</Text>
                                </HStack>
                            </VStack>
                        </Box>
                        <Box w="100%" p={6} paddingTop={3} bg="warmGray.50">
                            <Text textAlign="center" paddingBottom={3} fontWeight="bold" fontSize={"md"}>
                                Nutrient Stats
                            </Text>
                            <VStack space={3} divider={<Divider />} w="100%">
                                <HStack justifyContent="space-between" >
                                    <Text fontWeight={"bold"}>Type</Text>
                                    <Text fontWeight={"bold"}>Per/100g</Text>
                                    <Text fontWeight={"bold"}>Per/serving</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Carbs</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["carbohydrates_100g"] + "g" ?? "/"}</Text>

                                    <Text>{JSONdata?.product?.nutriments?.["carbohydrates_serving"] + "g" ?? '/'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Kcal</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["energy-kcal_100g"] ?? "/"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["energy-kcal_serving"] ?? "/"}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Fat</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["fat_100g"] + "g" ?? "/"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["fat_serving"] + "g" ?? "/"}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Protein</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["proteins_100g"] + "g" ?? "/"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["proteins_serving"] + "g" ?? "/"}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text>Sugar</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["sugars_100g"] + "g" ?? "/"}</Text>
                                    <Text>{JSONdata?.product?.nutriments?.["sugars_serving"] + "g" ?? "/"}</Text>
                                </HStack>

                            </VStack>
                        </Box>
                    </Box>

                )}




                <Text style={styles.maintext}>{JSON.stringify(JSONdata)}</Text>


                {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}
            </Box>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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