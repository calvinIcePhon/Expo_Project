import React from "react";
import { View, Text } from "react-native";
import { useUserContext } from "../Context/UserContext";

function Notification() {
  useUserContext();
  return (
   
      <View>
        <Text>Notification</Text>
      </View>
    
  );
}

export default Notification;
