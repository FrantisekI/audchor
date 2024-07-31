import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import AudioPlayer from '@/components/player'

import { ExternalLink } from '@/components/ExternalLink'


export default function home() {
  return (
    <View>
      <Link href="/home/settings">Settings</Link>

      <Text>Home</Text>
      <AudioPlayer />
      <Text>home 2</Text>      


    </View>
  )
}