import React from "react";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { storage } from "../Pages/API/firebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { itemType, sellerType } from "../types";
import { calculateDistance } from "../Utilities/calculateDistance";
// import defaultPhoto from "../assets/ProductPhotos/noFound.jpeg";

type dataProp = itemType;

const ProductView = (data: dataProp) => {
  //console.log(imageUrl)
  // console.log('haha')
  // console.log(imageUrl)

  //const distance = calculateDistance(userLat, userLon, sellerLat, sellerLon);

  return (
    <View key={data.productId} style={styles.product_container}>
      <Image
        source={{ uri: data.productImages[0] }}
        style={styles.product_photo}
      ></Image>

      <View style={styles.product_detail_container}>
        <View style={styles.product_text_description}>
          <Text ellipsizeMode="tail" numberOfLines={2}>
            {data.productName}
          </Text>
        </View>
        <View style={styles.product_detail_container_bottom_text}>
          <Text>{data.productPriceRanges}</Text>
          <Text>{} km</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductView;

const styles = StyleSheet.create({
  product_container: {
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("screen").width * 0.45,
    height: 250,
    backgroundColor: "#F2F2F2",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 1.41,

    elevation: 2,
  },
  product_photo: {
    width: "100%",
    height: "60%",
  },
  product_detail_container: {
    width: "100%",
    height: "40%",
    display: "flex",
    flexDirection: "column",
  },
  product_detail_container_bottom_text: {
    padding: "5%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  product_text_name: {},
  product_text_description: {},
  product_text_price: {},
});

// code snippet for the product photo render options in source for image
// uri:
// data.photos === null || data.photos === undefined
//   ? defaultPhotoSource
//   : data.photos[0],
