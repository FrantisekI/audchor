/*import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  uri: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ uri }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load the audio file
    const loadSound = async () => {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
    };

    loadSound();

    // Unload the sound when component unmounts
    return () => {
      if (sound) {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
    };
  }, [uri]);

  const playSound = async () => {
    if (sound) {
      console.log('Playing Sound');
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      console.log('Pausing Sound');
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (sound) {
      console.log('Stopping Sound');
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View>
      <Text>Audio Player</Text>
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={isPlaying ? pauseSound : playSound} />
      <Button title="Stop" onPress={stopSound} />
    </View>
  );
};

export default AudioPlayer;*/