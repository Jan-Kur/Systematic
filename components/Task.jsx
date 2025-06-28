import Color from "color";
import { TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function Task(name, color, emoji, duration) {

   const darkerColor = Color(color).darken(0.3).hex()
   
   const height = duration <= 15 ? 45 : duration >= 300 ? 200 : 45 + (duration - 15) * (155 / 285);

   return (
      <TouchableOpacity className={`w-full h-[${height}] justify-between p-1 items-center bg-${darkerColor}`}>
         <View className="w-2/5 justify-between items-center">
            <View className={`w-fit h-fit p-1 ${bg-color}`}>
               <Text className="text-2xl">{emoji}</Text>
            </View>

            <Text className="text-lightMain font-semibold text-xl">{name}</Text>
         </View>

         <BouncyCheckbox
            size={24}
            fillColor={color}
            unfillColor="#FFFFFF"
            iconStyle={{ borderColor: color }}
            innerIconStyle={{ borderWidth: 2 }}
            style={{ marginRight: 12}}
         />
      </TouchableOpacity>
   )
}