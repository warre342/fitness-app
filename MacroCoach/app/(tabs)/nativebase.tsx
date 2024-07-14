//hier nativebase code testen
import React from "react";

import { NativeBaseProvider, Box, Button, ScrollView, Text } from "native-base";

export default function App() {
  return (
    <NativeBaseProvider>
      <ScrollView flex={1} h="100%">
        <Box p={4}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Scrollable Content
          </Text>
          <Box p={2} bgColor="gray.100" mb={4}>
            <Text>This is a scrollable view in NativeBase.</Text>
            {/* Add more content here */}
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