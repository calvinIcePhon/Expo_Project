import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Pressable,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import ProductCard from "../Components/ProductCard";
import { db } from "./API/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { itemType, RootStackParamList } from "../types";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { useAuthContext } from "../Context/AuthContext";
import { useUserContext } from "../Context/UserContext";
import { Badge, SearchBar } from "@rneui/base";
import { MaterialIcons } from "@expo/vector-icons";

type MarketProps = NativeStackScreenProps<RootStackParamList, "Market">;

const Market: React.FC<MarketProps> = (props) => {
  // const profilecreated = userContext.userProfileCreated;
  const [dataProp, setDataProp] = useState<itemType[]>([]);
  const profilecreated = useUserContext().userProfileCreated;
  const [orderCount, setOrderCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      console.log("runining");
      console.log("useEffect run");
      try {
        // const docSnapshot = await getDocs(collection(db,"test"));

        // docSnapshot.forEach((doc =>{
        //   console.log(doc.id)
        // }))

        const q = query(collection(db, "product"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const items: itemType[] = [];
          snapshot.forEach((doc) => {
            const item: itemType = {
              productId: doc.data().productId,
              productName: doc.data().productName,
              productQuantity: doc.data().productQuantity,
              productAvailableQuantity: doc.data().productAvailableQuantity,
              productSellQuantity: doc.data().productSellQuantity,
              productCommentsId: doc.data().productCommentsId,
              productLikesId: doc.data().productLikesId,
              productPriceRanges: doc.data().productPriceRanges,
              productCategoryId: doc.data().productCategoryId,
              productDescription: doc.data().productDescription,
              productImages: doc.data().productImages,
              sellerId: doc.data().sellerId,
              productLocation: {
                lat: 0,
                long: 0,
              },
            };
            items.push(item);
          });
          setDataProp(items); // Update state once data is fetched
        });
        return () => {
          // Unsubscribe from the snapshot listener when the component unmounts
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (!profilecreated) {
      Alert.alert(
        "Profile Information Incomplete",
        "Let's complete your profile information for a better user experience.",
        [
          { text: "Ask me later", onPress: () => {} },
          { text: "Cancel", onPress: () => {} },
          {
            text: "Let's do it",
            onPress: () => {
              props.navigation.navigate("CreatingProfile");
            },
          },
        ]
      );
    }
     fetchData();
  }, []); // Empty dependency array to run once on mount

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.actionBarContainer}>
        <SearchBar containerStyle={styles.searchBar}></SearchBar>
        <TouchableOpacity>
          <MaterialIcons name="shopping-cart" size={24} color="black" />
          <Badge
            value={orderCount}
            status="error"
            containerStyle={{ position: "absolute", top: -4, right: -4 }}
          />
          <Text>Order</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={{ paddingTop: 5 }}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        data={dataProp}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              console.log("press");
              props.navigation.navigate("ProductDetailsPage", {
                itemId: item.productId,
              });
            }}
          >
            <ProductCard
              productId={item.productId}
              productName={item.productName}
              productQuantity={item.productQuantity}
              productAvailableQuantity={item.productAvailableQuantity}
              productSellQuantity={item.productSellQuantity}
              productCommentsId={item.productCommentsId}
              productLikesId={item.productLikesId}
              productPriceRanges={item.productPriceRanges}
              productCategoryId={item.productCategoryId}
              productDescription={item.productDescription}
              productImages={item.productImages}
              sellerId={item.sellerId}
              productLocation={{
                lat: 0,
                long: 0,
              }}
            />
          </Pressable>
        )}
        keyExtractor={(item) => item.productId}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  actionBarContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between", // Aligns items at opposite ends of the container
    alignItems: "center", // Vertically centers items
    paddingHorizontal: 10, // Add padding for better spacing
    marginHorizontal: 3,
  },
  searchBar: {
    flex: 1, // Fill remaining space
  },
});

export default Market;
