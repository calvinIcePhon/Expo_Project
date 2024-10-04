import React, {
    ReactNode,
    useContext,
    useEffect,
    useState,
    useRef,
  } from "react";
  import { auth, db } from "../Pages/API/firebaseConfig";
  import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import {
    collection,
    addDoc,
    getDoc,
    Timestamp,
    setDoc,
    doc,
    query,
    where,
    onSnapshot,
    getDocs,
  } from "firebase/firestore";
  import { userType } from "../types";
  import Constants from "expo-constants";
  import { DevicePushTokenRegistration } from "expo-notifications/build/DevicePushTokenAutoRegistration.fx";
  import * as Device from "expo-device";
  import * as Notifications from "expo-notifications";
  import * as Location from "expo-location";
  import { Alert, Platform } from "react-native";
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  export interface authType {
    currentUserId: string;
    currentUserEmail: string;
    currentUserName: string;
    isLog: boolean;
    loading: boolean;
    signUpUser: (email: string, password: string) => void;
    signInUser: (email: string, password: string) => void;
    signOutUser: () => void;
  }
  
  export const AuthContext = React.createContext<authType | null>(null);
  
  export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUserId, setCurrentUserId] = useState("");
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [isLog, setIsLog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<Location.LocationObject>();
    const [expoPushToken, setExpoPushToken] = useState("");
    const [firstTimeFlag, setFirstTimeFlag] = useState(true);
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
    const currentDate = new Date();
    const options = { day: "numeric", month: "long", year: "numeric" };
  
   
  
    async function registerForPushNotificationsAsync() {
      let token;
  
      if (Platform.OS === "web") {
        return (token = "");
      }
  
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
  
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: "37e10b85-d8ca-4286-a160-c466c6858cdf",
          })
        ).data;
        console.log(token);
      } else {
        alert("Must use physical device for Push Notifications");
      }
  
      return token;
    }
  
    // Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
    async function sendPushNotification(expoPushToken: string) {
      const message = {
        to: expoPushToken,
        sound: "default",
        title: "Original Title",
        body: "And here is the body!",
        data: { someData: "goes here" },
      };
  
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
    }
  
    const signUpUser = async (email: string, password: string) => {
      var messageRef = "";
      let status = false;
      try {
        const user = await createUserWithEmailAndPassword(auth, email, password);
        setIsLog(true);
        messageRef = "SignUp successfully";
        const userRef: userType = {
          userId: user.user.uid,
          userFirstName: "",
          userLastName: "",
          userJoinDate: Timestamp.fromDate(new Date()),
          userEmail: user.user.email,
          userNotificationTokenId: expoPushToken,
          userContactFlag: false,
          userSellerFlag: false,
          userAddress: {
            streetName: "",
            stateName: "",
            postcode: "",
          },
          userAddressLong: location?.coords.longitude,
          userAddressLat: location?.coords.latitude,
          userFollowedSellers: [],
          userContacts: [],
          userFriendsId: [],
          userNotificationList: [],
          userPhoneNumber: "",
          userProfileCreated: false,
          userDocKey: "",
        };
        const docRef = await addDoc(collection(db, "user"), userRef);
        console.log("id of doc " + docRef);
      } catch (err: any) {
        messageRef =
          "User creation failed! Error: " +
          err.message +
          ". Please try to sign up again.";
      } finally {
        alert(messageRef);
        console.log("user created");
        messageRef = "";
      }
    };
  
    const signInUser = async (email: string, password: string) => {
      var messageRef = "";
  
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setIsLog(true);
        messageRef = "User login successfully";
      } catch (err: any) {
        messageRef =
          "User login failed! Error: " +
          err.message +
          ". Please try to log in  again.";
      } finally {
        alert(messageRef);
        messageRef = "";
      }
    };
  
    const signOutUser = async () => {
      var messageRef = "";
      try {
        await signOut(auth);
        setIsLog(false);
      } catch (err: any) {
        messageRef = "User logout failed! Error: ";
        alert(messageRef + ". " + err.message + " Please try to log out again.");
        messageRef = "";
      }
    };
  
    const value: authType = {
      currentUserEmail,
      currentUserId,
      currentUserName,
      isLog,
      signUpUser,
      signInUser,
      signOutUser,
      loading,
    };
  
    useEffect(() => {
      const getLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log(
            "Please enable the GPS for this device for better user exprience."
          );
          return;
        }
        let location = await Location.getCurrentPositionAsync();
        setLocation(location);
        console.log("location: " + location.coords.latitude);
      };
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        console.log("checking user exist from auth context");
        console.log(firebaseUser?.uid + "from auth context");
  
        getLocationPermission();
        registerForPushNotificationsAsync().then((token) =>
          setExpoPushToken(token || "")
        );
        if (firebaseUser) {
          // User is signed in
          setCurrentUserId(firebaseUser.uid || "");
          setCurrentUserName(firebaseUser.displayName || "");
          setCurrentUserEmail(firebaseUser.email || "");
          setIsLog(true);
        } else {
          // User is signed out
          setCurrentUserId("");
          setCurrentUserName("");
          setCurrentUserEmail("");
          
        }
  
        setLoading(false);
      });
  
      return () => unsubscribe(); // Cleanup the subscription when component unmounts
    }, []);
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined)
      throw new Error("useAuthContext must be used within a AuthProvider");
    return context;
  };
  
  export { useAuthContext };
  export default AuthProvider;
  