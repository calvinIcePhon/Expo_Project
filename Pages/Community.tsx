import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SearchBar } from "react-native-elements"; // Import from react-native-elements for better native look
import * as Contacts from "expo-contacts";
import { useUserContext } from "../Context/UserContext";
import { auth, db } from "../Pages/API/firebaseConfig";
import { collection, addDoc, getDoc, Timestamp } from "firebase/firestore";

const CommunityPage = () => {
  
   
return(
  <View><Text>Hi in community</Text></View>
)
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchContainer: {
    width: "100%",
    flex: 1,
  },
  searchBarContainer: {
    backgroundColor: "transparent", // Set transparent background
    borderTopWidth: 0, // Remove border
    borderBottomWidth: 0, // Remove border
    paddingHorizontal: 0, // Set padding
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0", // Set background color
    borderRadius: 10, // Add border radius
  },
  searchInput: {
    fontSize: 16,
    paddingVertical: 10, // Adjust padding
  },
  contactName: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default CommunityPage;
