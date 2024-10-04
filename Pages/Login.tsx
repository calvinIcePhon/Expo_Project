import React, { useState } from "react";
import { useAuthContext } from "../Context/AuthContext";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation,  } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import { AuthStackParamList } from "../types";

type LoginProps = NativeStackScreenProps<AuthStackParamList, "Login">;

const Login:React.FC<LoginProps> =(props) => {
  const navigation = useNavigation();
  const context = useAuthContext();
  let email="";
  let password = "";
  return (
   
    <View
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "rgb(224,255,255)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <View style={styles.title_container}>
          <Image
            source={require("../assets/images/noFound.jpeg")}
            style={{ width: 100, height: 100 }}
          />
          <Text>UTAR Second-Hand E-Commerce</Text>
        </View>
        <View style={styles.info_container}>
          <View style={styles.infoChild_container}>
            <Text style={{ paddingTop: 5, paddingBottom: 5 }}>Email</Text>
            <View style={styles.infoChild_input_container}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                style={{ marginLeft: 5 }}
              />
              <TextInput placeholder="Email" style={{ width: 200, marginLeft:10, }}
                onChangeText={(text) => {
                  email = text;
                }}></TextInput>
            </View>
          </View>
          <View style={styles.infoChild_container}>
            <Text style={{ paddingTop: 5, paddingBottom: 5, }}>Password</Text>
            <View style={styles.infoChild_input_container}>
              <Ionicons
                name="eye-off-outline"
                size={20}
                style={{ marginLeft: 5, }}
              />
              <TextInput
                textAlign="center"
                placeholder="Password"
                secureTextEntry={true}
                style={{ width: 200, marginLeft:10, }}
                onChangeText={(text) => {
                  password = text;
                }}
              ></TextInput>
            </View>
          </View>
        </View>
        <View style={styles.login_container}>
          <TouchableOpacity
            onPress={() =>
              context?.signInUser(email, password)
            }
          >
            <Text>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.options_container}>
          <Text>Other Login Options</Text>
        </View>
        <View style={styles.signUp_container}>
          <Text>Don't have account? </Text>
          <TouchableOpacity
            onPress={()=> props.navigation.push("SignUpCom")}
          >
            <Text  style={{textDecorationLine:"underline", color:"blue"}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("screen").height * 0.6,
    minWidth: 200,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgb(0,255,255)",
    padding: 10,
  },
  title_container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "",
  },
  info_container: {},
  infoChild_container: {
    display: "flex",
    flexDirection: "column",
    flexShrink: 1,
    alignItems: "flex-start",
    marginBottom: 20,
    width: "100%",
  },
  infoChild_input_container: {
    display: "flex",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 20,
    padding:5,
  },
  login_container: {
    width:100,
    height:50,
    backgroundColor: "red",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
  },
  options_container: {},
  signUp_container: {
    display:"flex",
    flexDirection:"row",

  },
});
