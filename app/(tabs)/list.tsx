import { View, Text } from 'react-native';
import { Link } from 'expo-router';

const ListPage = () => {
    return (
        <View>
            <Link href='/list/1'>One</Link>
            <Link href='/list/2'>Two</Link>
            <Link href='/list/3'>Three</Link>
        </View>
    )
}

export default ListPage;