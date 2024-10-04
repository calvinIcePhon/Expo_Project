import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "./API/firebaseConfig";
import { itemType, RootStackParamList, sellerType } from "../types";

type ProductDetailsPageProps = NativeStackScreenProps<
  RootStackParamList,
  "ProductDetailsPage"
>;

const ProductDetailsPage: React.FC<ProductDetailsPageProps> = (props) => {
  const { itemId } = props.route.params;
  const [item, setItem] = useState<itemType>();
  const [sellerInfo, setSellerInfo] = useState<sellerType>();

  const getItemInfo = async () => {
    const q = query(collection(db, "product"), where("productId", "==", itemId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const itemData: itemType = {
          productId: doc.data().productId,
          productName: doc.data().productName,
          productQuantity: doc.data().productQuantity,
          productAvailableQuantity: doc.data().productAvailableQuantity,
          productSellQuantity: doc.data().productSellQuantity,
          productCommentsId: doc.data().productCommentsId,
          productLikesId: doc.data().productLikesId,
          productPriceRanges: doc.data().productPriceRanges,
          productCategoryId: doc.data().productCategoryId,
          sellerId: doc.data().sellerId,
          productLocation: {
            lat: 0,
            long: 0
          },
          productDescription: "",
          productImages: []
        };
        setItem(itemData);
        getSellerInfo(doc.data().sellerId); // Fetch seller data after setting the item data
      }
    });
  };

  const getSellerInfo = async (sellerId: string) => {
    const q = query(collection(db, "seller"), where("sellerId", "==", sellerId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        const sellerData: sellerType = {
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

        setSellerInfo(sellerData);
      }
    });
  };

  useEffect(() => {
    getItemInfo(); // Invoke the functions with parentheses
  }, []);

  // Render item info view
  const renderItemInfoView = () => {
    return (
      <ScrollView>
        <Text>Item Information</Text>
        <Text>Product Name: {item?.productName}</Text>
        <Text>Product Quantity: {item?.productQuantity}</Text>
        {/* Add more item fields as needed */}
      </ScrollView>
    );
  };

  // Render seller info view
  const renderSellerInfoView = () => {
    return (
      <ScrollView>
        <Text>Seller Information</Text>
        <Text>Seller Store Name: {sellerInfo?.sellerStoreName}</Text>
        <Text>Seller Store Description: {sellerInfo?.sellerStoreDescription}</Text>
        {/* Add more seller fields as needed */}
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderItemInfoView()}</View>
      <View style={{ flex: 1 }}>{renderSellerInfoView()}</View>
    </View>
  );
};

export default ProductDetailsPage;
