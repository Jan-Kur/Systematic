import { createUserWithEmailAndPassword, getAdditionalUserInfo, getAuth, GithubAuthProvider, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithEmailAndPassword, signOut } from '@react-native-firebase/auth';
import { doc, getFirestore, serverTimestamp, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { createContext, useContext, useEffect, useState } from 'react';

const db = getFirestore();

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
   const [isGitHubLoading, setIsGitHubLoading] = useState(false);

   const GITHUB_CLIENT_ID = "Ov23liuCod7FJ3075bq3";

   const discovery = {
      authorizationEndpoint: 'https://github.com/login/oauth/authorize',
      tokenEndpoint: 'https://github.com/login/oauth/access_token',
   };

   const [request, response, promptAsync] = useAuthRequest(
      {
         clientId: GITHUB_CLIENT_ID,
         scopes: ['user:email'],
         redirectUri: makeRedirectUri({
            scheme: 'com.xjaku.systematic',
            path: 'auth',
         }),
      },
      discovery,
   );

   useEffect(() => {
      if (response?.type === 'success') {
         handleGitHubCallback(response.params.code);
      }
   }, [response]);

   useEffect(() => {
         const subscriber = onAuthStateChanged(getAuth(), async (authenticatedUser) => {
            setUser(authenticatedUser);
            setIsLoading(false);
         });

      return subscriber; 
   }, []);

   const handleGitHubCallback = async (code) => {

      if (isGitHubLoading) return;
      setIsGitHubLoading(true);

      try {
         const response = await fetch('https://systematic-jvtxt9gx6-jan-kurs-projects.vercel.app/api/exchange-github-token', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               code,
               clientId: GITHUB_CLIENT_ID,
            }),
         });
         const data = await response.json();

         if (!data.access_token) {
            throw new Error('No access token received from GitHub');
         }

         const githubCredential = GithubAuthProvider.credential(data.access_token);

         const userCredential = await signInWithCredential(getAuth(), githubCredential);
         const isNewUser = getAdditionalUserInfo(userCredential).isNewUser;

         if (isNewUser) {
               await setDoc(doc(db, 'users', userCredential.user.uid), {
                  email: userCredential.user.email || null,
                  createdAt: serverTimestamp(),
               });
            }

      } catch (error) {
         console.error('GitHub OAuth callback error:', error);
         alert('GitHub authentication failed: ' + error.message);
      } finally {
         setIsGitHubLoading(false);
      }
   };

   const value = {
      user,
      isLoading,
      isGitHubLoading,
      signInWithEmail: async (email, password) => {
         try {
            await signInWithEmailAndPassword(getAuth(), email, password);
         } catch (error) {
            console.error('Email sign-in error:', error);
            alert('Sign-in failed: ' + error.message);
         }
      },
      signUpWithEmail: async (email, password) => {
         try {
            const userCredential = await createUserWithEmailAndPassword(getAuth(),email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
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
            GoogleSignin.configure({webClientId: '1083515011208-94i0igbd3csa0v87fpr5ircunc4mohg3.apps.googleusercontent.com'})
            const signInResult = await GoogleSignin.signIn();

            let idToken = signInResult.data?.idToken;
            if (!idToken) {
               idToken = signInResult.idToken;
            }
            if (!idToken) {
               throw new Error('No ID token found');
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);

            const userCredential = await signInWithCredential(getAuth(), googleCredential);
            const isNewUser = getAdditionalUserInfo(userCredential).isNewUser;

            if (isNewUser) {
                  await setDoc(doc(db, 'users', userCredential.user.uid), {
                     email: userCredential.user.email || null,
                     createdAt: serverTimestamp(),
                  });
               }

         } catch (error) {
            console.error('Google sign-in error:', error);
            alert('Google Sign-in failed: ' + error.message);
         }
      },
      signInWithGitHub: async () => {
            try {
               if (!request) {
                  throw new Error('GitHub OAuth request not ready');
               }

               if (isGitHubLoading) {
                  console.log('GitHub sign-in already in progress...');
                  return;
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
                  GoogleSignin.configure({webClientId: '1083515011208-94i0igbd3csa0v87fpr5ircunc4mohg3.apps.googleusercontent.com'})
                  await GoogleSignin.signOut();

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
