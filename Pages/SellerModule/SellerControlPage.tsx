import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/themed";
import {
  Ionicons,
  FontAwesome5,
  Entypo,
  FontAwesome,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAuthContext } from "../../Context/AuthContext";
import { useUserContext } from "../../Context/UserContext";
import { itemType, RootStackParamList, sellerType } from "../../types";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import {
  Timestamp,
  collection,
  doc,
  getCountFromServer,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../API/firebaseConfig";

import { Badge, SearchBar } from "@rneui/base";
import AddProductPage from "./AddProductPage";
import EditProductPage from "./EditProductPage";
import SellerProductDetails from "./SellerProductDetailPage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getDownloadURL, ref } from "firebase/storage";

type SellerControlPageProps = NativeStackScreenProps<
  RootStackParamList,
  "SellerControlPage"
>;

const SellerControlPage: React.FC<SellerControlPageProps> = (props) => {
  //data rendering do it here
  const userContext = useUserContext();
  const [index, setIndex] = useState(0);
  const [item, setItem] = useState<itemType[]>([]);
  const sellerInfo = props.route.params.sellerInfo;
  const [productTotalNum, setProductTotalNum] = useState(0);


 

  const getProductTotalNum = async () => {
    const sellerProductQuery = query(collection(db, "product"));
    const docSnapshot = await getDocs(sellerProductQuery);
    setProductTotalNum(docSnapshot.size);
    console.log("product total count: " + docSnapshot.size);
  };

  const getSellerProducts = (sellerId: string) => {
    const sellerProductQuery = query(
      collection(db, "product"),
      where("sellerId", "==", sellerId)
    );

    return onSnapshot(sellerProductQuery, (querySnapshot) => {
      const items: itemType[] = [];
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          const product: itemType = {
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
              lat: doc.data().productLocation.lat,
              long: doc.data().productLocation.long,
            },
          };
          items.push(product);
          console.log(product.productImages[0])
          
        }
      });
      setItem(items);
    });
  };

  useEffect(() => {
    getProductTotalNum();
    getSellerProducts(sellerInfo.sellerId);
    console.log("render...");
  }, []);

  return (
    <View id="container" style={styles.container}>
      <View id="sellerInfoContainer" style={styles.sellerInfoContainer}>
        <View id="profileIcon">
          <Avatar
            size={64}
            rounded
            title="P"
            containerStyle={{ backgroundColor: "coral" }}
          ></Avatar>
        </View>
        <View id="infoSection">
          <Text>{sellerInfo.sellerStoreName}</Text>
          <Text>{sellerInfo.sellerStoreDescription}</Text>
        </View>
      </View>
      <View id="communityInfoContainer" style={styles.communityInfoContainer}>
        <View style={styles.iconBlock}>
          <Ionicons
            onPress={() => {}}
            name="bookmarks"
            size={24}
            color="black"
          />
          <Text style={styles.iconText}>Saved</Text>
        </View>
        <View style={styles.iconBlock}>
          <FontAwesome5 name="clipboard-list" size={24} color="black" />
          <Text style={styles.iconText}>Purchase History</Text>
        </View>
      </View>
      <View id="tabViewContainer">
        <View style={styles.tabButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              index === 0 ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setIndex(0)}
          >
            <Text
              style={[
                styles.tabButtonText,
                index === 0 ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Product
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              index === 1 ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setIndex(1)}
          >
            <Text
              style={[
                styles.tabButtonText,
                index === 1 ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              index === 2 ? styles.activeTab : styles.inactiveTab,
            ]}
            onPress={() => setIndex(2)}
          >
            <Text
              style={[
                styles.tabButtonText,
                index === 2 ? styles.activeTabText : styles.inactiveTabText,
              ]}
            >
              Transaction
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContent}>
          {index === 0 && (
            <View id="ProductListContainer" style={styles.ProductListContainer}>
              <View style={styles.ActionBarContainer}>
                <SearchBar containerStyle={styles.searchBar}></SearchBar>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate("AddProductPage", {
                      productTotalNum: productTotalNum,
                      sellerInfo: sellerInfo,
                    });
                  }}
                >
                  <FontAwesome name="plus" size={24} color="black" />
                  <Text>Order</Text>
                </TouchableOpacity>
              </View>
              {item.length > 0 ? ( // Check if there are items in the array
                <FlatList
                  style={{ paddingTop: 5 }}
                  numColumns={1}
                  data={item}
                  keyExtractor={(item) => item.productId}
                  renderItem={({ item }) => (
                    <View id="itemContainer" style={styles.itemContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          // navigation.navigate("Market")
                        }}
                        style={{ position: "absolute", top: 0, right: 0 }}
                      >
                        <MaterialIcons name="delete" size={24} color="black" />
                      </TouchableOpacity>

                      <Image
                        style={styles.itemImage}
                        source={{uri:item.productImages[0]}}
                      ></Image>

                      <View id="itemInfo" style={styles.itemInfo}>
                        <Text style={styles.itemText}>{item.productName}</Text>
                        <Text style={styles.itemText}>
                          {item.productDescription}
                        </Text>
                      </View>
                      <View id="itemAction" style={styles.itemAction}>
                        <View style={styles.itemActionChild}>
                          <Text style={styles.itemText}>
                            Total Stock In Quantity:
                          </Text>
                        </View>
                        <View style={styles.itemActionChild}>
                          <Text style={styles.itemText}>
                            AvailableQuantity:
                          </Text>
                        </View>
                        <View style={styles.itemActionChild}>
                          <Text style={styles.itemText}>Sold Quantity: </Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
              ) : (
                <Text>No products available</Text>
              )}
            </View>
          )}
          {index === 1 && <Text>Follower page</Text>}
          {index === 2 && <Text>transcation product page</Text>}
        </View>
      </View>
    </View>
  );
};

export default SellerControlPage;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("window").width,
    minHeight: Dimensions.get("window").height,
  },
  sellerInfoContainer: {
    display: "flex",
    flexDirection: "row",
    minHeight: Dimensions.get("window").height * 0.15,
    backgroundColor: "#FFC47E",
    alignItems: "center",
    justifyContent: "space-around",
  },
  communityInfoContainer: {
    display: "flex",
    flexDirection: "row",
    width: Dimensions.get("screen").width,
    maxHeight: Dimensions.get("screen").height * 0.3,
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 5,
  },
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
  // tabview style
  tabButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    elevation: 2, // Add elevation for shadow
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  inactiveTab: {},
  activeTabText: {
    color: "#007AFF",
  },
  inactiveTabText: {
    color: "#555555",
  },
  tabContent: {
    marginTop: 10,
  },
  //productlist style
  ActionBarContainer: {
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
  ProductListContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  itemContainer: {
    display: "flex",
    flexDirection: "row",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.13,
    backgroundColor: "red",
    padding: "1%",
    paddingTop: 24,
  },
  itemImage: {
    width: "20%",
    height: "90%",
  },
  itemInfo: {
    width: "40%",
    height: "90%",
  },
  itemAction: {
    width: "40%",
    height: "90%",
  },
  itemText: {
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 13,
  },
  itemActionChild: {
    display: "flex",
  },
  //follower style

  //transaction style
});
