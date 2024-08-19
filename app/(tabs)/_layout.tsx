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
                // Initialize database
                await initDatabase().then(() => {
                    setInitialized(true)
                    });

                // Request permissions
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Media library permission not granted');
                    return;
                }

                // Get music files
                const media = await MediaLibrary.getAssetsAsync({
                    mediaType: 'audio',
                });

                // Process each music file
                if (initialized) {
                    // console.log(media.assets);
                    addMultipleSongs(media.assets).then(() => {
                    console.log('Songs added');});
                }
                //
                console.log('Initialization complete');
            } catch (error) {
                console.error('Error during initialization:', error);
            }
        }

        initialize();
    }, []);

    return <Stack />;
}