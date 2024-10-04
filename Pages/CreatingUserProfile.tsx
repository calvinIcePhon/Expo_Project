import React, { useEffect, useRef, useState } from "react";
import AuthProvider, { useAuthContext } from "../Context/AuthContext";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { DevicePushTokenRegistration } from "expo-notifications/build/DevicePushTokenAutoRegistration.fx";
import { Avatar } from "@rneui/themed";
import MapView, { Marker, MapPressEvent, Animated } from "react-native-maps";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./API/firebaseConfig";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList, AuthStackParamList } from "../types";
import { useUserContext } from "../Context/UserContext";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

interface Address {
  house_number: string;
  road: string;
  neighbourhood: string;
  suburb: string;
  county: string;
  city: string;
  state: string;
  "ISO3166-2-lvl4": string;
  postcode: string;
  country: string;
  country_code: string;
}

interface PlaceData {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: Address;
  boundingbox: [string, string, string, string];
}

type CreateProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "CreatingProfile"
>;

const CreatingUserProfile: React.FC<CreateProfileProps> = (props) => {
  let geoURL = "https://geocode.maps.co/reverse?";
  let geoApi = "65f11ea014507808963644mqt8e000c";
  const UserContext = useUserContext();
  const AuthContext = useAuthContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [streetName, setStreetName] = useState("");
  const [stateName, setStateName] = useState("");
  const [postCode, setPostCode] = useState("");

  //const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [initialRegion, setInitialRegion] = useState({
    latitude: 4,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const onRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    fetchData(region);
  };

  const isAllFieldsFilled = () => {
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      phoneNum.trim() !== "" &&
      streetName.trim() !== "" &&
      stateName.trim() !== "" &&
      postCode.trim() !== ""
    );
  };

  const fetchData = async (region: Region) => {
    try {
      const response = await fetch(
        geoURL +
          "lat=" +
          region.latitude +
          "&lon=" +
          region.longitude +
          "&api_key" +
          geoApi
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        const json = await response.json();
        console.log("json collected" + json.display_name); // Log the display_name from the fetched data
        setStreetName(json.address.road);
        setStateName(json.address.state);
        setPostCode(json.address.postcode);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    // Fetch current location

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("current location:" + location.coords.latitude);
      const updatedRegion: Region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(updatedRegion);
      setInitialRegion(updatedRegion);
      fetchData(updatedRegion);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.statusbar}>
      <ScrollView style={styles.scrollViewContent}>
        <View id="container" style={styles.container}>
          <View id="logoContainer" style={styles.logoContainer}>
            <Image
              source={require("../assets/images/noFound.jpeg")}
              style={{ width: 100, height: 100 }}
            />
            <Text>UTAR Second-Hand E-Commerce</Text>
          </View>
          <View id="profileInfoContainer" style={styles.profileInfoContainer}>
            <View id="profilePic" style={styles.profilePicContainer}>
              <Avatar
                size={64}
                rounded
                title="P"
                containerStyle={{ backgroundColor: "coral" }}
              ></Avatar>
            </View>
            <View id="profileInfo" style={styles.profileInfoContainer}>
              <View id="profileNameFirst" style={styles.profileChild}>
                <Text style={styles.TextProfileInfoContainer}>First Name</Text>
                <TextInput
                  value={firstName}
                  style={styles.TextInputChild}
                  onChangeText={(text) => {
                    setFirstName(text);
                  }}
                ></TextInput>
              </View>
              <View id="profileNameLast" style={styles.profileChild}>
                <Text style={styles.TextProfileInfoContainer}>Last Name</Text>
                <TextInput
                  value={lastName}
                  style={styles.TextInputChild}
                  onChangeText={(text) => {
                    setLastName(text);
                  }}
                ></TextInput>
              </View>
              <View id="profilePhonNum" style={styles.profileChild}>
                <Text style={styles.TextProfileInfoContainer}>
                  Phone Number (+60)
                </Text>
                <View style={styles.TextInputContainer}>
                  <TextInput
                    maxLength={10}
                    value={phoneNum}
                    keyboardType="phone-pad"
                    style={styles.TextInputChild}
                    onChangeText={(text) => {
                      setPhoneNum(text);
                    }}
                  ></TextInput>
                </View>
              </View>
            </View>
          </View>
          <View id="addressInfo" style={styles.addressInfoContainer}>
            <View id="profileNameFirst" style={styles.profileChild}>
              <Text style={styles.TextProfileInfoContainer}>Street Name</Text>
              <TextInput
                value={streetName}
                style={styles.TextInputChild}
                onChangeText={(text) => {
                  setStreetName(text);
                }}
              ></TextInput>
            </View>
            <View id="profileNameFirst" style={styles.profileChild}>
              <Text style={styles.TextProfileInfoContainer}>State Name</Text>
              <TextInput
                value={stateName}
                style={styles.TextInputChild}
                onChangeText={(text) => {
                  setStateName(text);
                }}
              ></TextInput>
            </View>
            <View id="profileNameFirst" style={styles.profileChild}>
              <Text style={styles.TextProfileInfoContainer}>PostCode</Text>
              <TextInput
                value={postCode}
                style={styles.TextInputChild}
                onChangeText={(text) => {
                  setPostCode(text);
                }}
              ></TextInput>
            </View>
          </View>
          <View id="mapContainer" style={styles.mapContainer}>
            <MapView style={styles.map} region={region} initialRegion={region}>
              <Marker
                coordinate={{
                  latitude: region.latitude,
                  longitude: region.longitude,
                }}
              />
            </MapView>
          </View>
          <View id="buttonContainer" style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                if (isAllFieldsFilled()) {
                  console.log(UserContext.userDocKey + "dockey");
                  const docRef = doc(db, "user", UserContext.userDocKey);
                  updateDoc(docRef, {
                    userFirstName: firstName,
                    userLastName: lastName,
                    userPhoneNumber: phoneNum,
                    userAddress: {
                      streetName: streetName,
                      stateName: stateName,
                      postcode: postCode,
                    },
                    userAddressLong: region.longitude,
                    userAddressLat: region.latitude,
                    userProfileCreated: true,
                    userDocKey: UserContext.userDocKey,
                  }).then(() => {
                    Alert.alert("Profile created successfully!");
                    props.navigation.navigate("Market");
                  });
                } else {
                  Alert.alert("Please fill in all fields.");
                }
              }}
              id="button"
              style={[styles.button, !isAllFieldsFilled() && { opacity: 0.5 }]}
              disabled={!isAllFieldsFilled()}
            >
              <Text style={{ textAlign: "center" }}>Create Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatingUserProfile;

const styles = StyleSheet.create({
  mapContainer: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("screen").width * 0.8,
    height: Dimensions.get("screen").height * 0.4,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  statusbar: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "auto",
    width: Dimensions.get("screen").width,
    overflow: "scroll",
    paddingTop: 10,
    paddingBottom: 10,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: Dimensions.get("screen").height * 0.15,
  },
  profileInfoContainer: {
    display: "flex",
    flexDirection: "column",
    height: "auto",
    width: Dimensions.get("screen").width,
    backgroundColor: "blue",
    alignItems: "center",
    paddingBottom: 10,
  },
  profilePicContainer: {
    left: "-30%",
    height: "30%",
    display: "flex",
    justifyContent: "center",
    padding: 10,
  },
  profileChild: {
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("screen").width * 0.8,
    alignItems: "flex-start",
    marginBottom: "5%",
  },
  TextInputChild: {
    width: "100%",
    borderRadius: 25,
    textAlign: "center",
    padding: 2,
    borderWidth: 3,
  },
  TextInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  TextProfileInfoContainer: {
    marginBottom: 5,
  },
  addressInfoContainer: {
    width: Dimensions.get("screen").width,
    height: "auto",
    backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  buttonContainer: {
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.08,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  button: {
    width: "30%",
    height: "100%",
    borderRadius: 25,
    backgroundColor: "orange",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
