import { BottomTabBarProps, BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { useReducer, useRef,useEffect } from 'react';
import { StatusBar, View,Text ,StyleSheet, Pressable, LayoutChangeEvent} from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import {  useSafeAreaInsets } from 'react-native-safe-area-context';
import  Svg ,{Path} from 'react-native-svg';
import Lottie from "lottie-react-native"

const Tab = createBottomTabNavigator();
const AnimatedSvg = Animated.createAnimatedComponent(Svg)

export default function App(){

  return(<>
   <StatusBar barStyle="light-content" />
   <NavigationContainer>

  <Tab.Navigator tabBar={(props)=> <AnimatedTabler {...props} />}>
  <Tab.Screen name="Home"
  options={{
    tabBarIcon:({ref})=><Lottie ref={ref} loop={false} source={require("./LotiAnimation/Frame 2.json") } style={styles.icon} />
  }}
  component={PlaceholderScreen} />
  <Tab.Screen name="Settings" component={PlaceholderScreen} />
  <Tab.Screen name="profile" component={PlaceholderScreen} />
  <Tab.Screen name="games" component={PlaceholderScreen} />
  
</Tab.Navigator>
   </NavigationContainer>
  
  </>)
}



const PlaceholderScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#604AE6' }} />
  )
}



const AnimatedTabler =({state:{index:activeIndex,routes},navigation,descriptors}:BottomTabBarProps)=>{
  const {bottom}= useSafeAreaInsets()
  console.log(bottom)
 const reducer = (state:any,action:{x:number,index:number})=>{

  return [...state,{x:action.x,index:action.index}]

}
  const [layout, dispatch] = useReducer(reducer,[])
 console.log(layout)
const handleLayout =(event:LayoutChangeEvent,index:number)=>{
  dispatch({x:event.nativeEvent.layout.x,index})
 
}

//// animation 

const xOffset = useDerivedValue(()=>{
  if(layout.length !== routes.length) return 0;



  return[...layout].find(({index})=> index === activeIndex)!.x - 25
},[activeIndex,layout])


const animatedSyles = useAnimatedStyle(()=>{
return{
  transform:[{translateX:withTiming(xOffset.value,{duration:250})}],
}
})

  return(
    <View style={[styles.tabBar,{paddingBottom:bottom}]}>
 <AnimatedSvg width="110"
      height="60"
      fill="none"
      viewBox="0 0 110 60" style={[styles.activeBackground,animatedSyles]}>
    <Path
      fill="#604AE6"
      d="M20 0H0c11.046 0 20 8.954 20 20v5c0 19.33 15.67 35 35 35s35-15.67 35-35v-5c0-11.046 8.954-20 20-20H20z"
    />
  </AnimatedSvg> 

  <View style={styles.tabBarContainer}>
    {routes.map((route,index)=>{
      const active = index == activeIndex
      const {options} = descriptors[route.key]
      return(
  <TabBarComponent key={route.key} active={active} options={options} onLayout={(e)=>handleLayout(e,index)} onPress={()=>{navigation.navigate(route.name)}}/>
      )
    })

    }

  </View>
    </View>

  )
}




type TabBarComponentProps={
  active?: boolean  
  options:BottomTabNavigationOptions
 onLayout:(e:LayoutChangeEvent)=>void
  onPress:()=> void
}

const TabBarComponent=({active,options,onLayout,onPress}:TabBarComponentProps)=>{
// handle lotties

const ref = useRef(null)

useEffect(() => {
if(active && ref?.current){
  ref.current.play()
}

}, [active])


  // animation 
const animatedComponentCircileStyles = useAnimatedStyle(()=>{
  return{
    transform:[
      {
        scale:withTiming(active?1: 0,{duration:250})
      }
    ]
  }
})

const animatedIconContainerStyles = useAnimatedStyle(()=>{
  return{
    opacity:withTiming(active?1:0.5,{duration:250})
  }
})

  return(
    <Pressable onPress={onPress} onLayout={onLayout} style={styles.component}>
<Animated.View style={[styles.componentCircle,animatedComponentCircileStyles]}/>
<Animated.View style={[styles.iconContainer,animatedIconContainerStyles]}>
{options.tabBarIcon ? options.tabBarIcon({ref}):<Text>?</Text>}
</Animated.View>



    </Pressable>
  )
}






const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
  },
  activeBackground: {
    position: 'absolute',
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  component: {
    height: 60,
    width: 60,
    marginTop: -5,
  },
  componentCircle: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 47,
    width: 47,
  }
})
