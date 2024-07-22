import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function home() {
  return (
    <View>
      <Link href="/home/settings">Settings</Link>
    </View>
  )
}