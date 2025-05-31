import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRef, useState } from "react";
import { Animated, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
                <UneditableItem content={item.content} id={item.id}/>
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
            <View className="bg-white dark:bg-darkMain rounded-xl px-2 py-3 mb-2 shadow-sm border-2 border-primary w-full h-fit flex justify-center items-center">

                <TextInput
                    value={value}
                    onChangeText={setValue}
                    onSubmitEditing={handleSubmitEditing}
                    placeholder="Enter improvement..."
                    placeholderTextColor="#A0A0A0"
                    autoFocus
                    className="text-base font-medium text-darkMain dark:text-lightMain w-full"
                    returnKeyType="done"
                />
            </View>
        );
    }

    function UneditableItem({ content, id }) {
        
        const fadeAnim = useRef(new Animated.Value(1)).current;
        
        function handleDelete() {
            Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            }).start(() => {
            setImprovements(prev => prev.filter(item => item.id !== id));
            });
        }
    
        return (
            <Animated.View
            style={{ opacity: fadeAnim }}
            className="dark:bg-darkGray bg-violet-200 rounded-xl px-4 py-3 mb-3 flex-row items-center shadow-sm w-full min-h-[60] h-fit"
            >
                <BouncyCheckbox
                    size={24}
                    fillColor="#6A1FCC"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: '#6A1FCC' }}
                    innerIconStyle={{ borderWidth: 2 }}
                    onPress={checked => {
                        if (checked) {
                            handleDelete()
                        } 
                    }}
                />
                <View className="h-fit ml-[-325] flex-1">
                    <Text numberOfLines={0} className="text-lg font-medium text-darkMain dark:text-lightMain">{content}</Text>
                </View>
            </Animated.View>
            
        );
    }

    return (
        <View className="flex-col items-center pt-2 w-full bg-transparent">
            <FlatList
                data={improvements}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                className="w-full"
                scrollEnabled={true}
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