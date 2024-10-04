import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/themed";
import { db } from "../API/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  Timestamp,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { itemType, RootStackParamList, sellerType } from "../../types";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useUserContext } from "../../Context/UserContext";

type BecomeSellerProps = NativeStackScreenProps<
  RootStackParamList,
  "BecomeSeller"
>;

const ScreenWidth = Dimensions.get("screen").width;
const ScreenHeight = Dimensions.get("screen").height;

const BecomeSeller: React.FC<BecomeSellerProps> = (props) => {
  const [useSameAsUser, setUseSameAsUser] = useState(false);
  const toggleSwitch = () =>
    setUseSameAsUser((previousState) => !previousState);
  const [sellerStoreName, setSellerStoreName] = useState("");
  const [sellerStoreDescription, setSellerStoreDescription] = useState("");
  const [streetName, setStreetName] = useState("");
  const [stateName, setStateName] = useState("");
  const [postcode, setPostcode] = useState("");
  const userContext = useUserContext();
  const sellerInfo: sellerType = {
    sellerId: "", // Fill this with the actual seller ID
    sellerJoinDate: Timestamp.fromDate(new Date()), // Fill this with the actual join date
    sellerStoreName,
    sellerStoreDescription,
    sellerFollowersId: [], // Fill this with the actual followers IDs if needed
    sellerStoreAddress: {
      streetName,
      stateName,
      postcode,
    },
    sellerAddressLong: 0, // Fill this with the actual longitude
    sellerAddressLat: 0, // Fill this with the actual latitude
    sellerRating: [], // Fill this with the actual ratings if needed
    sellerNotificationTokenId: "", // Fill this with the actual notification token ID
    sellerLikesId: [], // Fill this with the actual likes IDs if needed
  };

  const submitSellerApplication = async (sellerInfo: sellerType) => {
    if (
      sellerStoreName.trim() === "" ||
      sellerStoreDescription.trim() === "" ||
      stateName.trim() === "" ||
      streetName.trim() === "" ||
      postcode.trim() === ""
    ) {
      // If any required field is empty, show an alert
      Alert.alert("Please fill all the required fields.");
    } else {
      // Proceed with submitting the seller application
      // Call your API function or perform any necessary action here

      try {
        sellerInfo = {
          sellerId: userContext.userId,
          sellerJoinDate: Timestamp.fromDate(new Date()), // Fill this with the actual join date
          sellerStoreName: sellerStoreName,
          sellerStoreDescription: sellerStoreDescription,
          sellerFollowersId: [], // Fill this with the actual followers IDs if needed
          sellerStoreAddress: {
            streetName: streetName,
            stateName: stateName,
            postcode: postcode,
          },
          sellerAddressLong: userContext.userAddressLong, // Fill this with the actual longitude
          sellerAddressLat: userContext.userAddressLat, // Fill this with the actual latitude
          sellerRating: [], // Fill this with the actual ratings if needed
          sellerNotificationTokenId: userContext.userNotificationTokenId || "", // Fill this with the actual notification token ID
          sellerLikesId: [],
        };

        const userdocRef = await addDoc(collection(db, "seller"), sellerInfo);
        console.log(userContext.userDocKey + "dockey");
        const docRef = doc(db, "user", userContext.userDocKey);
        updateDoc(docRef, {
          userSellerFlag: true,
        }).then(() => {
          Alert.alert("Seller profile created successfully!");
          props.navigation.navigate("ProfilePage");
        });
        //props.navigation.navigate("ThankYouPage");
        // Show an alert indicating success
        Alert.alert("Application submitted successfully.");
      } catch (err: any) {
        Alert.alert(
          "Error occurred while submitting application:",
          err.message
        );
      }
    }
  };

  useEffect(() => {
    if (useSameAsUser) {
      const userAddress = userContext.userAddress;
      setStreetName(userAddress.streetName);
      setStateName(userAddress.stateName);
      setPostcode(userAddress.postcode);
    } else {
      setPostcode("");
      setStateName("");
      setStreetName("");
    }
  }, [useSameAsUser]);

  return (
    <View style={[styles.screenView]}>
      <View id="infoSection" style={[styles.infoSection, styles.shadow]}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={useSameAsUser ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={useSameAsUser}
          style={styles.toggleButton}
        />
        <View id="imageSection" style={{}}></View>
        <View
          id="sellerStoreName"
          style={[styles.sellerStoreInfo, styles.shadow]}
        >
          <Avatar
            size={20}
            rounded
            title="S"
            titleStyle={{ color: "black" }}
            containerStyle={{ backgroundColor: "white" }}
          />
          <TextInput
            style={{
              width: "80%",
              height: "25%",
              textAlignVertical: "bottom",
              borderBottomColor: "black",
              borderBottomWidth: 1,
            }}
            placeholder="Enter store name"
            value={sellerStoreName} // Bind value to state variable
            onChangeText={setSellerStoreName} //
          ></TextInput>
        </View>

        <View
          id="sellerStoreDescription"
          style={[
            styles.sellerStoreInfo,
            ,
            { paddingTop: 20, paddingBottom: 20 },
          ]}
        >
          <Avatar
            size={20}
            rounded
            title="A"
            titleStyle={{ color: "black" }}
            containerStyle={{ backgroundColor: "white" }}
          />
          <TextInput
            style={{
              width: "80%",
              height: "100%",
              textAlignVertical: "top", // Allow multiple lines
              borderBottomWidth: 1,
              borderBottomColor: "black",
            }}
            placeholder="Enter store description"
            multiline={true} // Allow multiple lines
            numberOfLines={2} // Set the number of lines to display
            value={sellerStoreDescription} // Bind value to state variable
            onChangeText={setSellerStoreDescription}
          ></TextInput>
        </View>
        <View id="storeAddress" style={styles.storeAddressContainer}>
          <TextInput
            style={styles.input}
            placeholder="Street Name"
            value={streetName}
            onChangeText={setStreetName}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            value={stateName}
            onChangeText={setStateName}
          />
          <TextInput
            style={styles.input}
            placeholder="Postcode"
            value={postcode}
            onChangeText={setPostcode}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => submitSellerApplication(sellerInfo)}
      >
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BecomeSeller;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  screenView: {
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    width: "auto",
    height: "100%",
    backgroundColor: "#FFF78A",
    alignItems: "center",
    justifyContent: "center",
  },
  imageSection: {},
  infoSection: {
    width: ScreenWidth * 0.8,
    height: ScreenHeight * 0.7,
    backgroundColor: "#FFAD84",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    justifyContent: "space-evenly",
    overflow: "scroll",
  },
  sellerStoreInfo: {
    width: "80%",
    height: "20%",
    backgroundColor: "#FFE382",
    borderRadius: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
  },
  storeAddressContainer: {
    width: "80%",
    backgroundColor: "#FFE382",
    borderRadius: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 20,
    padding: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  toggleButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
