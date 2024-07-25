import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

import { ExternalLink } from '@/components/ExternalLink'


export default function home() {
  return (
    <View>
      <Link href="/home/settings">Settings</Link>
      


    </View>
  )
}