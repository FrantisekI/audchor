import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { initDatabase, addMultipleSongs } from '@/utils/db';

export default function Layout() {
    useEffect(() => {
        async function initialize() {
            try {
                // Initialize database
                await initDatabase();

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
                addMultipleSongs(media.assets);

                console.log('Initialization complete');
            } catch (error) {
                console.error('Error during initialization:', error);
            }
        }

        initialize();
    }, []);

    return <Stack />;
}