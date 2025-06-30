import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

export default function CustomCheckbox({ initialState = 0, onStateChange, borderColor }) {
  const [currentState, setCurrentState] = useState(initialState);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const nextState = (currentState + 1) % 3;
    setCurrentState(nextState);
    onStateChange?.(nextState);
  };

  const getContent = () => {
    switch (currentState) {
      case 0:
        return null;
      
      case 1:
        return (
         <Entypo name="check" size={22} color={borderColor} />
         
        );
      
      case 2:
        return (
         <FontAwesome6 name="question" size={22} color={borderColor} />
        );
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={handlePress}
        className="w-[28px] h-[28px] bg-transparent justify-center items-center rounded-lg border-2"
        style={{ borderColor: borderColor }}
        activeOpacity={0.7}
      >
        {getContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};