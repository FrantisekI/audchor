import { Stack } from "expo-router"
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabaseSync("AudChor-DB");



const StackLayout = () => {
  useDrizzleStudio(db);

  return (
    
    <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
    </Stack>
  );
}

export default StackLayout;