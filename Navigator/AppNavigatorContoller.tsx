import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Market from "../Pages/Market";
import ProfilePage from "../Pages/ProfilePage";
import CommunityPage from "../Pages/Community";
import Notification from "../Pages/Notification";
import ProductDetailsPage from "../Pages/ProductDetailsPage";
import BecomeSeller from "../Pages/SellerModule/BecomeSeller";
import CreatingUserProfile from "../Pages/CreatingUserProfile";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import AuthProvider, { authType, useAuthContext } from "../Context/AuthContext";
import UserProvider, { useUserContext } from "../Context/UserContext";
import { AuthStackParamList, RootStackParamList, userType } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInPages from "../Pages/Login";
import SignUpPages from "../Pages/SignUpCom";
import AddProductPage from "../Pages/SellerModule/AddProductPage";
import EditProductPage from "../Pages/SellerModule/EditProductPage";
import SellerProductDetails from "../Pages/SellerModule/SellerProductDetailPage";
import SellerControlPage from "../Pages/SellerModule/SellerControlPage";
const TabStack = createBottomTabNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const TabStackScreen = () => {
  return (
    <TabStack.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "rgb(233, 223, 235)" }, 
      }}
      initialRouteName="Market"
    >
      <TabStack.Screen
        name="Market"
        component={Market}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="shopping-basket" size={24} color="black" />
          ),
        }}
      />
      <TabStack.Screen
        name="Community"
        component={CommunityPage}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="user-friends" size={24} color="black" />
          ),
        }}
      />
      <TabStack.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarIcon: () => (
            <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
          ),
        }}
      />
      <TabStack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{
          tabBarIcon: () => (
            <FontAwesome5 name="user-alt" size={24} color="black" />
          ),
        }}
      />
    </TabStack.Navigator>
  );
};
const AppStack = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Home"}>
          <Stack.Screen
            name="Home"
            component={TabStackScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetailsPage"
            component={ProductDetailsPage}
          ></Stack.Screen>
          <Stack.Screen name="BecomeSeller" component={BecomeSeller} />
          <Stack.Screen
            name="CreatingProfile"
            component={CreatingUserProfile}
          />

          <Stack.Screen
            name="SellerControlPage"
            component={SellerControlPage}
          />
          <Stack.Screen name="AddProductPage" component={AddProductPage} />
          <Stack.Screen name="EditProductPage" component={EditProductPage} />
          <Stack.Screen
            name="SellerProductDetail"
            component={SellerProductDetails}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AuthNavigatorController = ()=> {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName="Login">
          <AuthStack.Screen
            name="Login"
            component={SignInPages}
            options={{ headerShown: false }}
          />
          <AuthStack.Screen
            name="SignUpCom"
            component={SignUpPages}
            options={{ headerShown: false }}
          />
        </AuthStack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </AuthProvider>
  );
};
const AppContent = () => {
  const Authcontext = useAuthContext();

  if (Authcontext!.loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </SafeAreaView>
    );
  }
  return Authcontext?.isLog ? <AppStack /> : <AuthNavigatorController />;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
export default App;
