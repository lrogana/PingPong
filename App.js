import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import {StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';


const FPS = 60;
const DELTA = 10/ FPS;
const SPEED =10;
const BALL_WIDTH = 25;
const normalizeVector = (vector)=> {
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  return ({
    x: vector.x / magnitude,
    y: vector.y /magnitude,
  });
};
export default function App() {
  const targetPositionX = useSharedValue(200);
  const targetPositionY = useSharedValue(200);
  const direction = useSharedValue(normalizeVector({x: Math.random(), y: Math.random()}));
  // console.log(direction);

  const {height, width} = useWindowDimensions ();

  useEffect(()=>{
    const interval = setInterval(update, DELTA)

    return ()=> clearInterval(interval);
    //console.warn("Component mounted")
  }, []);

  const update =()=> {
    // console.log("Updating physics")
    let nextPos = getNextPos(direction.value);
    

    if (nextPos.y < 0 || nextPos.y > height - BALL_WIDTH){
      
      const newDirection = {x: direction.value.x, y: -direction.value.y};
      direction.value = newDirection; 
      
      nextPos = getNextPos(newDirection);
    }
    if (nextPos.x < 0 || nextPos.x > width - BALL_WIDTH) {
      const newDirection = {x: -direction.value.x, y: direction.value.y};
      direction.value = newDirection;
      nextPos = getNextPos(newDirection);
    }
    targetPositionX.value = withTiming(
      nextPos.x, 
      {
      duration: DELTA,
      // easing: Easing.linear,
      easing: Easing.linear,
    
    });
    targetPositionY.value = withTiming(
      nextPos.y, {
      duration: DELTA,
       easing: Easing.linear,
    });

  };

  const getNextPos = (direction)=> {

    return {
      x: targetPositionX.value + direction.x * SPEED,
      y: targetPositionY.value + direction.y * SPEED,
    }
  }
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
    width: BALL_WIDTH, 
    aspectRatio: 1,
    borderRadius: 25,
    position: "absolute",
    // left:50,

  }
});
