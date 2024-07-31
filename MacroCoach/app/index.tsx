import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Redirect, Stack, useFocusEffect, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import React from 'react';

export default function HomeScreen() {
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            navigation.setOptions({
                headerShown: false, // Disable header
            });
        }, [])
    );
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false, // Disable header
        });
    }, [navigation]);


    return (<Redirect href="counter"></Redirect>)

}

