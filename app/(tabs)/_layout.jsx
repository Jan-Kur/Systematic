import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Redirect, Tabs } from "expo-router";
import { useColorScheme } from 'react-native';
import { useSession } from '../../contexts/AuthContext';

export default function TabLayout() {
   const { user, isLoading } = useSession();
   const colorScheme = useColorScheme();

   if (isLoading) {
     return (
       <View style={{ 
         flex: 1, 
         justifyContent: 'center', 
         alignItems: 'center',
         backgroundColor: Colors.light.main
       }}>
         <ActivityIndicator size="large" color={Colors.light.primary} />
       </View>
     );
   }

   if (!user) {
      return <Redirect href="/(auth)/sign-in" />;
   }

   return (
      <Tabs
         screenOptions={{
            tabBarInactiveTintColor: "#6A1FCC",
            tabBarActiveTintColor: "#AC40FF",
            headerShown: false,
            tabBarStyle: {
               backgroundColor: colorScheme === "dark" ? "#08060A" : "F6F5FF",
               borderTopWidth: 0,
            },
         }}>
         <Tabs.Screen
            name="journal"
            options={{
               title: "Journal",
               tabBarIcon: ({color}) => <FontAwesome6 name="edit" size={28} color={color} />
            }}
         />
         <Tabs.Screen
            name="index"
            options={{
               title: "Timeline",
               tabBarIcon: ({color}) => <MaterialIcons name="timeline" size={28} color={color} />
            }}
         />
         <Tabs.Screen
            name="statistics"
            options={{
               title: "Statistics",
               tabBarIcon: ({color}) => <Ionicons name="stats-chart" size={28} color={color} />
            }}
         />
      </Tabs>
   );
}