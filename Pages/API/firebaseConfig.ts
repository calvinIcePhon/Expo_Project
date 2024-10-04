// Import the functions you need from the SDKs you need
import  React from 'react'
import  { initializeApp, } from "firebase/app";
import  {getAuth, initializeAuth, } from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence } from './getReactNativePersistence';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGlvMktru6aPICwqFkQhZAJ7nmGR5HORU",
  authDomain: "fyp-test-2ded7.firebaseapp.com",
  projectId: "fyp-test-2ded7",
  storageBucket: "fyp-test-2ded7.appspot.com",
  messagingSenderId: "627888183614",
  appId: "1:627888183614:web:be83781241537d3f8b346f",
  measurementId: "G-L3YRL49CXV"
};


// Initialize Firebase
 const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app,{persistence:getReactNativePersistence(ReactNativeAsyncStorage)});
export const db = getFirestore(app);
export const storage = getStorage(app);

//const analytics = getAnalytics(app);


