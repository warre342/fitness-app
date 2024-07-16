//hier nativebase code testen
import React from "react";

import { NativeBaseProvider, Box, Button, ScrollView, Text } from "native-base";

export default function App() {
  const rows = [];
  for (let i = 1; i <= 100; i++) {
    rows.push(i);
  }


  return (
    <NativeBaseProvider>
      <ScrollView flex={1} h="100%">
        <Box p={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4} marginTop={"5%"}>
            Scrollable Content
          </Text>
          <Box p={2} bgColor="gray.100" mb={4} alignItems={"center"}>
            <Text>Scrollable view in NativeBase:</Text>
            {rows.map((row)=> {return <Text key={row}>Row {row}</Text>})}
            {/* You can add as many components as needed */}
          </Box>
          {/* Example of more content */}
          <Box p={2} bgColor="gray.200" mb={4}>
            <Text>More content...</Text>
          </Box>
          {/* Add more components as necessary */}
        </Box>
      </ScrollView>
    </NativeBaseProvider>
  );
}