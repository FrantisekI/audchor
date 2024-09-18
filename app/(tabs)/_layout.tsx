import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { initDatabase, addMultipleSongs } from '@/utils/db';

export default function Layout() {
    const [initialized, setInitialized] = useState(false);
    useEffect(() => {

        async function initialize() {
            try {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Media library permission not granted');
                    return;
                }

                const media = await MediaLibrary.getAssetsAsync({
                    mediaType: 'audio',
                });

                await initDatabase().then(() => {
                    setInitialized(true);

                    if (initialized) {
                        addMultipleSongs(media.assets).then(() => {
                            console.log('x Songs added');
                        });
                    }
                });

            } catch (error) {
                console.error('Error during initialization:', error);
            }
        }

        initialize();
    }, []);

    return <Stack />;
}