import { getAuth, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signInWithProvider, signOut } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
   user: null,
   isLoading: true,
   signInWithEmail: async (email, password) => {},
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

   useEffect(() => {
      const subscriber = onAuthStateChanged((authenticatedUser) => {
         setUser(authenticatedUser);
         setIsLoading(false);
      });
      
      return subscriber; 
   }, []);

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
            const provider = new GithubAuthProvider();

            await signInWithProvider(provider);
         } catch (error) {
            console.error('GitHub sign-in error:', error);
            if (error.code !== '12501') {
               alert('GitHub Sign-in failed: ' + error.message);
            }
         }
   },
   signOut: async () => {
         try {
            const isGoogleUser = user?.providerData.some(
               (provider) => provider.providerId === 'google.com'
            );
            if (isGoogleUser && await GoogleSignin.isSignedIn()) {
               await GoogleSignin.signOut();
            }

            await signOut(getAuth());

            setUser(null);
         } catch (error) {
            console.error('Sign out error:', error);
         }
   },
};
   return (
      <AuthContext.Provider value={value}>
            {children}
      </AuthContext.Provider>
   );
}