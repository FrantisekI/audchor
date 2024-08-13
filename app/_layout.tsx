import { Stack } from "expo-router"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";




const StackLayout = () => {

  return (
    
    <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  );
}

export default StackLayout;