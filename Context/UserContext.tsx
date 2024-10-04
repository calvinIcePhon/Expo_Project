import React, { useContext, useEffect, useState, createContext } from "react";
import { db } from "../Pages/API/firebaseConfig";
import { collection, where, query, onSnapshot, Timestamp } from "firebase/firestore";
import { useAuthContext } from "./AuthContext";
import { Alert } from "react-native";
import { userType } from "../types";

const defaultUserContext: userType = {
  userId: "",
  userFirstName: "",
  userLastName: "",
  userJoinDate: Timestamp.fromDate(new Date()),
  userEmail: "",
  userNotificationTokenId: "",
  userContactFlag: false,
  userSellerFlag: false,
  userAddress: {
    streetName: "",
    stateName: "",
    postcode: "",
  },
  userAddressLong: 0,
  userAddressLat: 0,
  userFollowedSellers: [],
  userFriendsId: undefined,
  userNotificationList: undefined,
  userPhoneNumber: "",
  userContacts: [],
  userProfileCreated: false,
  userDocKey: "",
};

const UserContext = createContext<userType | undefined>(undefined);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const AuthContext = useAuthContext();
  const [user, setUser] = useState<userType | undefined>(undefined);

  useEffect(() => {
    if (AuthContext) {
      const q = query(
        collection(db, "user"),
        where("userId", "==", AuthContext.currentUserId)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          setUser({
            userId: doc.data().userId,
            userFirstName: doc.data().userFirstName,
            userLastName: doc.data().userLastName,
            userPhoneNumber: doc.data().userPhoneNumber,
            userJoinDate: doc.data().userJoinDate,
            userEmail: doc.data().userEmail,
            userNotificationTokenId: doc.data().userNotificationTokenId,
            userFriendsId: doc.data().userFriendsId,
            userContactFlag: doc.data().userContactFlag,
            userContacts: doc.data().userContacts,
            userAddress: doc.data().userAddress,
            userAddressLat: doc.data().userAddressLat,
            userAddressLong: doc.data().userAddressLong,
            userFollowedSellers: doc.data().userFollowedSellers,
            userNotificationList: doc.data().userNotificationList,
            userSellerFlag: doc.data().userSellerFlag,
            userDocKey: doc.id,
            userProfileCreated: doc.data().userProfileCreated,
          });
        });
      });
    } else {
      Alert.alert("Something wrong");
    }
  }, [AuthContext]);

  if (!user) {
    return null; // Render nothing until user data is fetched
  }

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("useUserContext must be used within a AuthProvider");
  return context;
};

export { useUserContext };
export default UserProvider;
