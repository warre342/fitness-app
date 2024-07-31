import { Tabs, useFocusEffect } from 'expo-router'; // is een wrapper voor import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useEffect } from 'react';

import { TabBarIcon, TabBarMaterialCommunityIcons } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Badge, Box } from 'native-base';
import { FoodItemChangesContext } from '@/context/foodItemChangesContext';
import { FoodItemChangesContextType } from '@/@types/foodItemChangesContextType';
import { Route } from 'expo-router/build/Route';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
/*

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
*/
export default function TabLayout() {
  const colorScheme = useColorScheme();

  const foodItemChangesContext = useContext(FoodItemChangesContext);//database
  const { addCount, setAddCount } = foodItemChangesContext as FoodItemChangesContextType;


  const renderIconWithBadge = (iconName: any, badgeCount: number, color: any, focused: any) => (
    <Box position="relative" width={30} height={30} justifyContent="center" alignItems="center">
      <TabBarMaterialCommunityIcons name={iconName} size={28} color={color} />
      {badgeCount > 0 && (
        <Badge
          rounded="full"
          position="absolute"
          top={-3}
          right={-20}
          zIndex={1}
          variant="solid"
          minWidth={18} // Adjusted to fit text
          height={18} // Adjusted to fit text
          _text={{
            fontSize: 10, // Adjusted font size
            lineHeight: 12, // Ensure text fits within the badge
          }}
          paddingX={1} // Add padding to fit text
        >
          {badgeCount}
        </Badge>
      )}
    </Box>
  );

  return (
    <Tabs
      initialRouteName="counter"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="counter"
        options={{
          title: 'Counter',
          tabBarIcon: ({ color, focused }) =>
            renderIconWithBadge('counter', addCount, color, focused), // Example with badge count 2
        }}
      />
      <Tabs.Screen
        name="savedmeals"
        options={{
          title: 'meals',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons size={28} name={"food-variant"} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
