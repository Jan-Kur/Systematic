import { Link } from "expo-router";
import { useState } from "react";
import { Image, Platform, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from '../../contexts/AuthContext';


export default function SignIn() {
   const {signUpWithEmail, signInWithGitHub, signInWithGoogle} = useSession()

   const colorScheme = useColorScheme();
   const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   
   return (
      <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center pl-4 pr-4 pt-2 pb-2">
         <View className="flex-row gap-2 w-full h-fit">
            <TouchableOpacity
               onPress={async () => {
                  await signInWithGoogle()
               }}
               className="flex-1 bg-transparent shadow-darkMain dark:shadow-lightMain rounded-xl border-2 border-neutral-200 dark:border-neutral-900 p-2 justify-center items-center">
               <Image
                  source={require('../../images/googleLogo.png')}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
               />
            </TouchableOpacity>
            <TouchableOpacity 
               onPress={async () => {
                  await signInWithGitHub()
               }}
               className="flex-1 bg-transparent shadow-darkMain dark:shadow-lightMain rounded-xl border-2 border-neutral-200 dark:border-neutral-900 p-2 justify-center items-center">
               {colorScheme === 'dark' ? <Image
                  source={require('../../images/githubLogoLight.png')}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
               /> : <Image
                  source={require('../../images/githubLogoDark.png')}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
               />}
            </TouchableOpacity>
         </View>
         
         <View className="flex-row gap-2 items-center">
            <View className="flex-1 h-[2] rounded-full bg-lightGray"/>
            <Text className="text-base color-lightGray font-medium">or</Text>
            <View className="flex-1 h-[2] rounded-full bg-lightGray"/>
         </View>
         <View className="flex-col gap-1 w-full">
            <Text className="text-base font-semibold color-darkMain dark:color-lightMain">Email</Text>
            <TextInput
               className="bg-transparent rounded-xl text-lg font-medium color-darkMain dark:color-lightMain border-neutral-200 dark:border-neutral-800 border-2 p-2 w-full"
               value={email}
               onChangeText={setEmail}
               placeholder="Enter your email"
               keyboardType="email-address"
               autoCapitalize="none"
               autoCorrect={false}
            />
         </View>
         <View className="flex-col gap-1 w-full">
            <Text className="text-base font-semibold color-darkMain dark:color-lightMain">Password</Text>
            <View className="relative">
               <TextInput
                  className="bg-transparent rounded-xl border-2 text-lg font-medium color-darkMain dark:color-lightMain border-neutral-200 dark:border-neutral-800 p-2 pr-10 w-full"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  passwordRules="minlength: 8;"
                  autoComplete="password"
               />
               <TouchableOpacity 
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onPress={() => setShowPassword(!showPassword)}
               >
                  <Text className="text-lg">{showPassword ? '👀' : '🙈'}</Text>
               </TouchableOpacity>
            </View>
         </View>
         <TouchableOpacity 
            className="w-full bg-primary rounded-xl p-2"
            onPress={async () => {
               await signUpWithEmail(email, password)
            }}
         >
            <Text className="text-xl color-darkMain dark:color-lightMain font-semibold text-center">Sign up</Text>
         </TouchableOpacity>
         <View className="flex-row gap-1">
            <Text className="text-base color-lightGray font-medium">Already have an account?</Text>
            <Link href="/sign-in">
               <Text className="text-base color-primary font-medium">Sign in</Text>
            </Link>
         </View>
      </ContainerComponent>
   );
}