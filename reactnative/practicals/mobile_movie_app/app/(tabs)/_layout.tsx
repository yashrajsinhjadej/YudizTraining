// import { View, Text, ImageBackground } from 'react-native'
import { Tabs } from "expo-router";
import { ImageBackground, Image, Text, View } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";


const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Move it here to apply to ALL tabs
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: false,
          tabBarIcon:({focused})=>(
            <>  
                  <ImageBackground source={images.ts}/>
              </>
          )
        }} 
      />
        <Tabs.Screen name='search' options={{ 
          title: 'Search',
          headerShown: true, }}/>
    </Tabs>
  )
}

export default _layout