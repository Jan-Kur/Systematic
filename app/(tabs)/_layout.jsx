import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from 'react-native';

export default function TabLayout() {

    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarInactiveTintColor: "#751FCC",
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colorScheme === "dark" ? "#08060A" : "F6F5FF",
                    borderTopWidth: 0
                }
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