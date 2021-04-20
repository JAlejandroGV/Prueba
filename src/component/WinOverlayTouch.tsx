import * as React from 'react'
import {
  Animated,
  Easing,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native'
import { Color } from '../style/Color'

// Inspired by https://github.com/warlyware/react-native-cookbook/blob/master/chapter-6/notification-animation/Notification/index.js

interface Props {
  show: boolean
  onClose: () => void
}

export function WinOverlayTouch({ show, onClose }: Props) {
  const { height: screenHeight } = useWindowDimensions()

  const animatedBottomRef = React.useRef(new Animated.Value(screenHeight))
  // Examples: https://reactnative.dev/docs/panresponder
  // https://stackoverflow.com/questions/59784486/how-to-setoffset-for-panresponder-when-using-hooks
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // console.log('_value', animatedBottomRef.current._value)
        animatedBottomRef.current.setOffset(animatedBottomRef.current._value)
      },

      onPanResponderMove: (
        event: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // const translationY = gestureState.y0 - gestureState.moveY
        // animatedBottomRef.current.setValue(translationY / screenHeight)
        console.log(
          'screenHeight',
          screenHeight,
          'gestureState.y0',
          gestureState.y0,
          'gestureState.dy',
          gestureState.dy,
          'gestureState.moveY',
          gestureState.moveY,
          'animatedBottomRef.current',
          animatedBottomRef.current,
        )
        // animatedBottomRef.current.setValue(-gestureState.dy)
        animatedBottomRef.current.setValue(-gestureState.dy)
      },

      // onPanResponderMove: Animated.event(
      //   [null, { dy: animatedBottomRef.current }],
      //   { useNativeDriver: false },
      // ),

      onPanResponderRelease: () => {
        animatedBottomRef.current.flattenOffset()
      },
    }),
  ).current

  React.useEffect(() => {
    if (show) {
      Animated.timing(animatedBottomRef.current, {
        toValue: 0,
        duration: 1000,
        easing: Easing.cubic,
        useNativeDriver: false, // 'top' is not supported by native animated module
      }).start()
    } else {
      // hide
      Animated.timing(animatedBottomRef.current, {
        toValue: screenHeight,
        duration: 800,
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start()
    }
  }, [show, screenHeight])

  const bottom = animatedBottomRef.current
  // const bottom = animatedBottomRef.current.interpolate({
  //   inputRange: [0, screenHeight],
  //   outputRange: [0, screenHeight],
  //   extrapolate: 'clamp',
  // })
  console.log('bottom', bottom)

  return (
    <Animated.View style={[styles.main, { height: screenHeight, bottom }]}>
      <Text style={styles.title}>Congratulations! You won!</Text>
      <Text style={styles.text}>With X moves and X seconds.</Text>
      <Text style={styles.text}>Woooooo!</Text>
      <Pressable style={styles.button} onPress={() => onClose()}>
        <Text style={styles.buttonText}>Play again!</Text>
      </Pressable>
      <View {...panResponder.panHandlers} style={styles.moveUp}>
        <Text>Move up</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Color.black,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
  },
  text: {
    color: Color.gray,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  // TODO change button color when pressed
  button: {
    backgroundColor: Color.teal,
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: Color.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  moveUp: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.red,
    borderRadius: 50,
  },
})