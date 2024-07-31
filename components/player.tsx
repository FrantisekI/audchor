import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

interface AppProps {}

const AudioPlayer: React.FC<AppProps> = () => {
  const [sound, setSound] = useState<Audio.Sound | undefined>();
  const [isPlaying, setIsPlaying] = useState(false);

  async function playSound() {
    console.log('Loading Sound');
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('@/assets/test.mp3')
      );
      setSound(newSound);
      await newSound.playAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(true);
    console.log('Playing Sound');
  }

  async function stopSound() {
    console.log('Stopping Sound');
    if (sound) {
      await sound.stopAsync();
      await sound.setPositionAsync(0);
      setIsPlaying(false);
    }
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Button title={isPlaying ? "Stop Sound" : "Play Sound"} onPress={isPlaying ? stopSound : playSound} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ecf0f1',
  },
});

export default AudioPlayer;