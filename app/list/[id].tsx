import { View, Text } from 'react-native'
import { Stack, useLocalSearchParams } from 'expo-router';

const DetailsPage = () => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Stack.Screen options={{ headerTitle: `Details #${id}` }}/>

            <Text>Details Page {id}</Text>
        </View>
    )
}

export default DetailsPage;