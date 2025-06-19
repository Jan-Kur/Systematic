import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signOut } from '@react-native-firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import React, { createContext, useContext, useEffect, useState } from 'react';

const db = getFirestore()

const AuthContext = createContext({
   user: null,
   isLoading: true,
   signInWithEmail: async (email, password) => {},
   signUpWithEmail: async (email, password) => {},
   signInWithGoogle: async () => {},
   signInWithGitHub: async () => {},
   signOut: async () => {},
});

export function useSession() {
   const value = useContext(AuthContext);
   if (process.env.NODE_ENV !== 'production') {
      if (!value) {
         throw new Error('useSession must be wrapped in a <SessionProvider />');
      }
   }
   return value;
}

export function SessionProvider({ children }) {
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   const discovery = {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
   };

   const [request, response, promptAsync] = useAuthRequest(
      {
         clientId: process.env.GITHUB_CLIENT_ID,
         scopes: ['user:email'],
         redirectUri: makeRedirectUri({
            scheme: 'com.xjaku.systematic',
            path: 'auth',
         }),
      },
      discovery
   );

   useEffect(() => {
      if (response?.type === 'success') {
         handleGitHubCallback(response.params.code);
      }
   }, [response]);

   useEffect(() => {
      signOut(getAuth())//FOR DEBUGGING
      const subscriber = onAuthStateChanged(getAuth(), authenticatedUser => {
         setUser(authenticatedUser);
         setIsLoading(false);
      });
      
      return subscriber; 
   }, []);

   const handleGitHubCallback = async (code) => {
      try {
         const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               client_id: process.env.GITHUB_CLIENT_ID,
               client_secret: process.env.GITHUB_CLIENT_SECRET,
               code: code,
            }),
         });

         const tokenData = await tokenResponse.json();
         
         if (tokenData.error) {
            throw new Error(tokenData.error_description || 'Failed to get access token');
         }

         const githubCredential = GithubAuthProvider.credential(tokenData.access_token);
         
         await signInWithCredential(getAuth(), githubCredential);
         
      } catch (error) {
         console.error('GitHub OAuth callback error:', error);
         alert('GitHub authentication failed: ' + error.message);//add crashlitics here
      }
   };

   const value = {
      user,
      isLoading,
      signInWithEmail: async (email, password) => {
         try {
            await signInWithEmailAndPassword(getAuth(), email, password);
         } catch (error) {
            console.error('Email sign-in error:', error);//add crashlitics here
            alert('Sign-in failed: ' + error.message);
         }
      },
      signUpWithEmail: async (email, password) => {
         try {
            const userCredential = await createUserWithEmailAndPassword(getAuth(),email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
               uid: user.uid,
               email: user.email,
               createdAt: serverTimestamp()
            })
         } catch (error) {
            console.error('Email sign-up error:', error);
            throw error;
         }
      },
      signInWithGoogle: async () => {
         try {
            await GoogleSignin.hasPlayServices();
            const signInResult = await GoogleSignin.signIn();

            let idToken = signInResult.data?.idToken;
            if (!idToken) {
               idToken = signInResult.idToken;
            }
            if (!idToken) {
               throw new Error('No ID token found');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);

            await signInWithCredential(getAuth(), googleCredential);
         } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Google Sign-in failed: ' + error.message);//add crashlitics here
         }
      },
      signInWithGitHub: async () => {
            try {
               if (!request) {
                  throw new Error('GitHub OAuth request not ready');
               }

               await promptAsync();
            } catch (error) {
               console.error('GitHub sign-in error:', error);
               alert('GitHub Sign-in failed: ' + error.message);
            }  
      },
      signOut: async () => {
         try {
            const isGoogleUser = user?.providerData?.some(
               (provider) => provider.providerId === 'google.com'
            );
            
            if (isGoogleUser) {
               try {
                  if (await GoogleSignin.isSignedIn()) {
                     await GoogleSignin.signOut();
                  }
               } catch (googleError) {
                  console.warn('Google sign-out warning:', googleError);
               }
            }

            await signOut(getAuth());
            setUser(null);
         } catch (error) {
            console.error('Sign out error:', error);
            setUser(null);
         }
      },
   };
   return (
      <AuthContext.Provider value={value}>
            {children}
      </AuthContext.Provider>
   );
}