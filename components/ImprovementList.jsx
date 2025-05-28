import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useState } from "react";
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function ImprovementList() {
    const [improvements, setImprovements] = useState([])

    function addImprovement() {
        setImprovements(prev => ([
        ...prev,
        {
            id: Math.random().toString(36).slice(2, 11),
            content: "",
            editing: true
        }
      ]))
    }

    function updateImprovementContent(id, newContent) {
        setImprovements(prev => 
            prev.map(item => 
                item.id === id ? { ...item, content: newContent, editing: false } : item
            )
        )
    }

    function renderItem({item}) {
        if (item.editing) {
            return (
                <EditableItem id={item.id} onSubmit={updateImprovementContent}/>
            )
        } else {
            return (
                <UneditableItem content={item.content}/>
            )
        }
    }

    function EditableItem({ id, onSubmit }) {
        const [value, setValue] = useState("");

        function handleSubmitEditing() {
            if (value.trim()) {
                onSubmit(id, value.trim());
                Keyboard.dismiss();
            }
        }

        return (
            <View className="bg-white dark:bg-darkMain rounded-lg px-4 py-3 mb-2 shadow-sm border border-gray-300 w-full">
                <TextInput
                    value={value}
                    onChangeText={setValue}
                    onSubmitEditing={handleSubmitEditing}
                    placeholder="Enter improvement..."
                    placeholderTextColor="#A0A0A0"
                    autoFocus
                    className="text-base text-darkMain dark:text-lightMain"
                    returnKeyType="done"
                />
            </View>
        );
    }

    function UneditableItem({ content }) {
        return (
            <View className="bg-darkGray dark:bg-gray-800 rounded-lg px-4 py-3 mb-2 flex-row items-center justify-between shadow-sm w-full">
                <Text className="text-lightMain text-base flex-1">{content}</Text>
                <BouncyCheckbox
                    size={24}
                    fillColor="#6A1FCC"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: '#6A1FCC' }}
                    innerIconStyle={{ borderWidth: 2 }}
                />
            </View>
        );
    }

    return (
        <View className="flex-col items-center px-4 pt-2 w-full bg-white dark:bg-black">
            <FlatList
                data={improvements}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                className="w-full"
                scrollEnabled={true}
                contentContainerStyle={{
                    paddingBottom: 16,
                }}
                ListEmptyComponent={
                    <Text className="text-gray-400 text-center py-4">
                        No improvements yet.
                    </Text>
                }
            />

            <TouchableOpacity
                onPress={addImprovement}
                className="bg-darkGray px-4 py-1 mt-2 rounded-lg shadow-md"
            >
                <FontAwesome6 name="plus" size={24} color="#6A1FCC" />
            </TouchableOpacity>
        </View>       
    )
}