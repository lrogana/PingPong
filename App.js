import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {StyleSheet, Text, View } from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';


const FPS = 60;
const DELTA = 10/ FPS;
const SPEED = 1;
const normalizeVector = (vector)=> {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  return ({
    x: vector.x / magnitude,
    y: vector.y /magnitude,
  });
};
export default function App() {
  const targetPositionX = useSharedValue(0);
  const targetPositionY = useSharedValue(0);
  const direction = useSharedValue(normalizeVector({x: 1, y: 1}));
  // console.log(direction);

  useEffect(()=>{
    const interval = setInterval(update, DELTA)

    return ()=> clearInterval(interval);
    //console.warn("Component mounted")
  }, []);

  const update =()=> {
    // console.log("Updating physics")

    targetPositionX.value = withTiming(
      targetPositionX.value + direction.value.x * SPEED, {
      duration: DELTA,
      // easing: Easing.linear,
      easing: Easing.linear,
    
    });
    targetPositionY.value = withTiming(
      targetPositionY.value + direction.value.y * SPEED, {
      duration: DELTA,
       easing: Easing.linear,
    });

  };
  const ballAnimtedStyles = useAnimatedStyle(()=> {
    return{
      top: targetPositionY.value,
      left: targetPositionX.value,
    }
  });
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ball, ballAnimtedStyles]}></Animated.View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ball: {
    backgroundColor: "black",
    width: 25, 
    aspectRatio: 1,
    borderRadius: 25,
    position: "absolute",
    // left:50,

  }
});
