import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/themed";
import {
  Ionicons,
  FontAwesome5,
  Entypo,
  FontAwesome,
  Foundation,
} from "@expo/vector-icons";
import { useAuthContext } from "../Context/AuthContext";
import { useUserContext } from "../Context/UserContext";
import { itemType, RootStackParamList, sellerType } from "../types";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./API/firebaseConfig";

type ProfilePageProps = NativeStackScreenProps<
  RootStackParamList,
  "ProfilePage"
>;

const ProfilePage: React.FC<ProfilePageProps> = (props) => {
  const authcontext = useAuthContext();
  const userContext = useUserContext();
  const [isSeller, setIsSeller] = useState(false);
  const ScreenWidth = Dimensions.get("screen").width;
  const ScreenHeight = Dimensions.get("screen").height;
  const [sellerInfo, setSellerInfo] = useState<sellerType>();

  const getSellerInfo = async () => {
    const sellerquery = query(
      collection(db, "seller"),
      where("sellerId", "==", userContext.userId)
    );
    const querySnapshot = await getDocs(sellerquery);
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const seller: sellerType = {
          sellerId: doc.data().sellerId,
          sellerJoinDate: doc.data().sellerJoinDate,
          sellerStoreName: doc.data().sellerStoreName || "",
          sellerStoreDescription: doc.data().sellerStoreDescription,
          sellerFollowersId: doc.data().sellerFollowersId,
          sellerStoreAddress: {
            streetName: doc.data().sellerStoreAddress.streetName,
            stateName: doc.data().sellerStoreAddress.stateName,
            postcode: doc.data().sellerStoreAddress.postcode,
          },
          sellerAddressLong: doc.data().sellerAddressLong,
          sellerAddressLat: doc.data().sellerAddressLat,
          sellerNotificationTokenId: doc.data().sellerNotificationTokenId,
          sellerLikesId: doc.data().sellerLikesId,
        };
        setSellerInfo(seller);
      }
    });
  };

  useEffect(() => {
    if (userContext.userSellerFlag) {
      setIsSeller(true);
      getSellerInfo();
    }
  }, [userContext]);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "scroll",
        width: ScreenWidth,
        minHeight: ScreenHeight,
        backgroundColor: "#FFF78A",
      }}
    >
      <View
        id="userinfo"
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: ScreenHeight * 0.15,
          backgroundColor: "#FFC47E",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <View id="profileIcon">
          <Avatar
            size={64}
            rounded
            title="P"
            containerStyle={{ backgroundColor: "coral" }}
          ></Avatar>
        </View>
        <View id="infoSection">
          <Text>
            {userContext.userFirstName + " " + userContext.userLastName}
          </Text>
          <Text>{userContext.userEmail}</Text>
        </View>
      </View>
      {isSeller && sellerInfo && (
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("SellerControlPage", {
              sellerInfo: sellerInfo,
            });
          }}
        >
          <View
            id="sellerInfo"
            style={{
              display: "flex",
              flexDirection: "row",
              minHeight: ScreenHeight * 0.15,
              backgroundColor: "#6DB9EF",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <View id="profileIcon">
              <Avatar
                size={64}
                rounded
                title="S"
                containerStyle={{ backgroundColor: "coral" }}
              ></Avatar>
            </View>
            <View id="infoSection">
              <Text>{sellerInfo.sellerStoreName}</Text>
              <Text>{sellerInfo.sellerStoreDescription}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <View id="dashboard" style={styles.dashboard}>
        <TouchableOpacity style={styles.iconBlock}>
          <Ionicons
            onPress={() => {}}
            name="bookmarks"
            size={24}
            color="black"
          />
          <Text style={styles.iconText}>Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBlock}>
          <FontAwesome5 name="clipboard-list" size={24} color="black" />
          <Text style={styles.iconText}>Purchase History</Text>
        </TouchableOpacity>
        {isSeller && sellerInfo &&(
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("SellerControlPage", {
                sellerInfo: sellerInfo,
              });
            }}
            style={styles.iconBlock}
          >
            <Foundation name="torso-business" size={24} color="black" />
            <Text style={styles.iconText}>Seller Panel</Text>
          </TouchableOpacity>
        ) }: (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("BecomeSeller");
            }}
            style={styles.iconBlock}
          >
            <Foundation name="torso-business" size={24} color="black" />
            <Text style={styles.iconText}>Become Seller</Text>
          </TouchableOpacity>
        )

        <TouchableOpacity style={styles.iconBlock}>
          <FontAwesome name="bar-chart" size={24} color="black" />
          <Text style={styles.iconText}>Sales Summary</Text>
        </TouchableOpacity>
      </View>
      <View id="settingoptions">
        <View>
          <Text>Address</Text>
        </View>
        <View>
          <Text>Settings</Text>
        </View>
      </View>
      <View id="logout">
        <Button
          onPress={() => {
            authcontext?.signOutUser();
          }}
          title="Logout"
          icon={<Entypo name="log-out"></Entypo>}
          iconRight
          iconContainerStyle={{ marginLeft: "10%" }}
          titleStyle={{ fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "rgba(199, 43, 98, 1)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 10,
          }}
        ></Button>
      </View>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  iconBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "20%",
    textAlign: "center",
    height: "auto",
  },
  iconText: {
    textAlign: "center",
    fontSize: 10,
  },
  dashboard: {
    display: "flex",
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    maxHeight: Dimensions.get("screen").height * 0.3,
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 5,
  },
});
