import React, { useEffect, useRef, useState } from "react";
import AuthProvider, { useAuthContext } from "../Context/AuthContext";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Text,
  Alert,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/themed";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  FontAwesome,
  Zocial,
  Entypo,
} from "@expo/vector-icons";

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { AuthStackParamList } from "../types";
import MapView, { Marker } from "react-native-maps";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import { DevicePushTokenRegistration } from "expo-notifications/build/DevicePushTokenAutoRegistration.fx";

type SignUpProps = NativeStackScreenProps<AuthStackParamList, "SignUpCom">;

const SignUpCom: React.FC<SignUpProps> = (props) => {
  const authcontext = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);

  const signUp = () => {
    if (email && password && confirmPassword) {
      if (password == confirmPassword) {
        authcontext?.signUpUser(email, password);
      } else {
        Alert.alert("Password not match");
      }
    } else {
      Alert.alert("Please fill in the all the flied");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View id="logoContainer" style={styles.logoContainer}>
          <View id="Logo" style={styles.logo}></View>

          <Text id="LogoTitle" style={styles.logoTitle}>
            UTAR Second-Hand E-Commerce
          </Text>
        </View>

        <View id="sighUpContainer" style={styles.signUpContainer}>
          <View id="infoInputSection" style={styles.infoInputSection}>
            <Text id="label">Email</Text>
            <View id="inputSection" style={styles.inputSection}>
              <TouchableOpacity>
                <Zocial name="email" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                style={styles.textinput}
                onChangeText={(text) => {
                  setEmail(text);
                }}
              ></TextInput>
            </View>
          </View>
          <View id="infoInputSection" style={styles.infoInputSection}>
            <Text id="label">Password</Text>
            <View id="inputSection" style={styles.inputSection}>
              <TouchableOpacity
                onPress={() => {
                  setPasswordVisible(!passwordVisible);
                }}
              >
                <FontAwesome5
                  name={passwordVisible ? "eye-slash" : "eye"}
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textinput}
                secureTextEntry={passwordVisible}
                onChangeText={(text) => {
                  setPassword(text);
                }}
              ></TextInput>
            </View>
          </View>
          <View id="infoInputSection" style={styles.infoInputSection}>
            <Text id="label">Confirm Password</Text>
            <View id="inputSection" style={styles.inputSection}>
              <TouchableOpacity
                onPress={() => {
                  setPasswordVisible(!passwordVisible);
                }}
              >
                <FontAwesome5
                  name={passwordVisible ? "eye-slash" : "eye"}
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
              <TextInput
                style={styles.textinput}
                secureTextEntry={passwordVisible}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                }}
              ></TextInput>
            </View>
          </View>
        </View>

        <Button
          onPress={() => {
            console.log("press")
            signUp();
          }}
          title="Sign Up"
          icon={<FontAwesome name="sign-in" color="black" />}
          iconRight
          iconContainerStyle={{ marginLeft: "30%" }}
          titleStyle={{ fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "rgb(0,112,255)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            marginTop: 30,
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
        ></Button>
      </View>
    </ScrollView>
  );
};

export default SignUpCom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").height * 0.1,
  },
  logoTitle: {
    fontSize: 20,
    textAlignVertical: "center",
    textAlign: "center",
  },
  signUpContainer: {
    width: Dimensions.get("window").width * 0.8,
    height: "auto",
    borderRadius: 25,
    backgroundColor: "rgb(0,255,255)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  infoInputSection: {
    width: "90%",
    height: "auto",
    backgroundColor: "yellow",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
    margin: 5,
    borderRadius: 25,
  },
  inputSection: {
    width: "100%",
    height: "auto",
    borderRadius: 15,
    borderWidth: 2,
    marginTop: 3,
    display: "flex",
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
  },
  textinput: {
    height: "auto",
    textAlign: "center",
    marginLeft: 10,
    fontSize: 10,
    backgroundColor: "rgb(158,158,158)",
    flex: 1,
    borderRadius: 15,
  },
});
