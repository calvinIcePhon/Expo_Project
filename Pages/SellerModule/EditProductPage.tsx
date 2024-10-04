import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  ScrollView,
  Modal,
  ImageSourcePropType,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/themed";
import {
  Ionicons,
  FontAwesome5,
  Entypo,
  FontAwesome,
  Foundation,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList, CategoryType, itemType } from "../../types";
import { ImageSlider } from "react-native-image-slider-banner";
import { MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../API/firebaseConfig";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

type AddProductPageProps = NativeStackScreenProps<
  RootStackParamList,
  "EditProductPage"
>;

type DataType = {
  img: string | undefined;
};
type item = {
  label: string;
  value: string;
};
const data = CategoryType;
const AddProductPage: React.FC<AddProductPageProps> = (props) => {
  const [defaultImage, setDefaultImage] = useState(
    require("../../assets/images/noFound.jpeg")
  );

  const [images, setImages] = useState<DataType[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const { productTotalNum  } = props.route.params;
  const { sellerInfo } = props.route.params;

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQuantity, setProductQuantity] = useState(0);
  const [productAvailableQuantity, setProductAvailableQuantity] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
 

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const getBlobFromUri = async (uri: string): Promise<Blob> => {
    const blob = await new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response as Blob);
      };
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
    return blob;
  };

  const addProduct = async (images: DataType[]) => {
    
    // Create a custom document ID in the desired format (DD_MM_YYYY)
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();
    const customProductId = `product${(productTotalNum+1).toString()}_${day}_${month}_${year}_${sellerInfo.sellerId}`;
    const productImagesRef = ref(storage, `ProductImages/${customProductId}/`);
  
    try {
     
  
      // Upload images sequentially and update itemRef.productImages
      // await Promise.all(
      //   images.map(async (image, index) => {
      //     const blob = await getBlobFromUri(image.img);
      //     const imageName = `image${index + 1}.jpg`;
      //     const imageRef = ref(productImagesRef, imageName);
      //     const downloadURL = await uploadBytes(imageRef, blob);
      //     imageUrl.push(downloadURL.ref.fullPath);
      //   })
      // );
  
      // setProductImages(imageUrl);

      const imageUrl = await Promise.all(
        images.map(async (image, index) => {
          const blob: Blob = await getBlobFromUri(image.img);
          const imageName = `image${index + 1}.jpg`;
          const imageRef = ref(productImagesRef, imageName);
          const uploadResult = await uploadBytes(imageRef, blob);
          return await getDownloadURL(
            ref(storage, uploadResult.metadata.fullPath)
          );
        })
      );
      
  
      const itemRef: itemType = {
        productId: customProductId,
        productName: productName,
        productQuantity: productQuantity,
        productAvailableQuantity: productAvailableQuantity,
        productSellQuantity: 0,
        productCommentsId: [],
        productLikesId: [],
        productPriceRanges: productPrice,
        productCategoryId: selected,
        sellerId: sellerInfo.sellerId,
        productLocation: {
          lat: sellerInfo.sellerAddressLat,
          long: sellerInfo.sellerAddressLong,
        },
        productDescription: productDescription,
        productImages: imageUrl,
        
      };
  
      // Add the document with the custom ID
      await setDoc(doc(collection(db, "product"), customProductId), itemRef);
  
      Alert.alert("Product Added successfully");
    } catch (error:any) {
      Alert.alert(error.message);
    }
  };

  const takeImageViaGallery = async () => {
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map((asset) => ({
          img: asset.uri,
        }));
        setImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    } catch (error) {
      console.error("Error selecting images from gallery:", error);
    }
    toggleModal(); // Corrected: Call toggleModal to close the modal
  };

  // Inside takeImageViaCamera function
  const takeImageViaCamera = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImages((prevImages) => [
          ...prevImages,
          { img: result.assets[0].uri },
        ]);
      }
    } catch (error) {
      console.error("Error taking image via camera:", error);
    }
    toggleModal(); // Corrected: Call toggleModal to close the modal
  };

  const validateAvailableQuantity = (num: number) => {
    if (productAvailableQuantity <= 0) {
      Alert.alert("Please enter the stock number properly");
      return;
    } else {
      setProductAvailableQuantity(num);
    }
  };
  const validateStockQuantity = (num: number) => {};
  const addStockQuantity = () => {
    setProductQuantity(productQuantity + 1);
  };

  const minusStockQuantity = () => {
    if (productQuantity - 1 <= 0) {
      return;
    } else {
      setProductQuantity(productQuantity - 1);
    }
  };

  const addStockAvailableQuantity = () => {
    setProductAvailableQuantity(productAvailableQuantity + 1);
  };

  const minusStockAvailableQuantity = () => {
    if (productAvailableQuantity - 1 <= 0) {
      return;
    } else {
      setProductAvailableQuantity(productAvailableQuantity - 1);
    }
  };

  const renderItem = (item: item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  return (
    <ScrollView id="container" style={styles.container}>
      <View id="productImageContainer" style={styles.productImageContainer}>
        {images.length > 0 ? (
          <View>
            <ImageSlider
              data={images}
              headerLeftComponent={
                <Icon
                  name="arrow-back"
                  color="#fff"
                  size={34}
                  onPress={() => Alert.alert("alert")}
                />
              }
              headerCenterComponent={
                <Text
                  style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}
                >
                  Header
                </Text>
              }
              headerStyle={{ padding: 10, backgroundColor: "rgba(0,0,0, 0.6)" }}
              onItemChanged={(item) => console.log("item move")}
              caroselImageStyle={{ resizeMode: "cover" }}
            />
            <View style={styles.addImageButtonContainer}>
              <TouchableOpacity onPress={toggleModal}>
                <AntDesign name="pluscircleo" size={30} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View id="imageDisplay" style={styles.imageDisplayContainer}>
            <TouchableOpacity onPress={toggleModal}>
              <AntDesign name="pluscircleo" size={50} color="black" />
            </TouchableOpacity>

            <Text style={styles.imageDisplayContainerText}>
              Please Include At Least 1 Image of the Item
            </Text>
          </View>
        )}
      </View>

      <View id="productInfoContainer" style={styles.productInfoContainer}>
        <View id="productName" style={styles.productInfoChildComponent}>
          <Text style={styles.productInfoChildTextContainer}>
            Product Name:
          </Text>
          <TextInput
            style={styles.productInfoChildTextInput}
            onChangeText={(text) => {
              setProductName(text);
            }}
          ></TextInput>
        </View>
        <View id="productDesc" style={styles.productInfoChildComponent}>
          <Text style={styles.productInfoChildTextContainer}>
            Product Description:
          </Text>
          <TextInput
            style={styles.productInfoChildTextInputLong}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => {
              setProductDescription(text);
            }}
          ></TextInput>
        </View>
        <View
          id="productStockContainer"
          style={styles.productInfoChildComponent}
        >
          <View
            id="productStockQuantity"
            style={styles.productInfoQuantityComponent}
          >
            <Text style={styles.productInfoChildTextContainer}>
              Total Number of Stock In:
            </Text>
            <View
              id="numericInputContainer"
              style={styles.numericInputContainer}
            >
              <TouchableOpacity
                style={styles.productQuantityNumericInput}
                onPress={addStockQuantity}
              >
                <Entypo name="plus" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                style={styles.stockQuantityNumberInputAndProductPrice}
                keyboardType="numeric"
                value={productQuantity.toString()} // Set the value of the input to stockQuantity
                onChangeText={(text) => {
                  const num = parseInt(text); // Parse the input text to an integer
                  if (!isNaN(num)) {
                    // Check if the input is a valid number
                    setProductQuantity(num); // Update the stockQuantity state
                  }
                }}
              ></TextInput>
              <TouchableOpacity
                style={styles.productQuantityNumericInput}
                onPress={minusStockQuantity}
              >
                <Entypo name="minus" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View
            id="productStockAvailableQuantity"
            style={styles.productInfoQuantityComponent}
          >
            <Text style={styles.productInfoChildTextContainer}>
              Total Number of Stock to be Sold:
            </Text>
            <View
              id="numericInputContainer"
              style={styles.numericInputContainer}
            >
              <TouchableOpacity
                style={styles.productQuantityNumericInput}
                onPress={addStockAvailableQuantity}
              >
                <Entypo name="plus" size={24} color="black" />
              </TouchableOpacity>
              <TextInput
                style={styles.stockQuantityNumberInputAndProductPrice}
                keyboardType="numeric"
                value={productAvailableQuantity.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  if (!isNaN(num)) {
                    setProductAvailableQuantity(num);
                  }
                }}
              ></TextInput>
              <TouchableOpacity
                style={styles.productQuantityNumericInput}
                onPress={minusStockAvailableQuantity}
              >
                <Entypo name="minus" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View id="productPrice" style={styles.productInfoChildComponent}>
          <Text style={styles.productInfoChildTextContainer}>
            Product Price:
          </Text>
          <View
            id="productPriceTextInputContainer"
            style={styles.productPriceTextInputContainer}
          >
            <Text style={{ marginRight: "5%" }}>RM:</Text>
            <TextInput
              onChangeText={(text) => {
                const price = parseFloat(text); // Convert input text to a floating-point number
                if (!isNaN(price)) {
                  // Check if the input is a valid number
                  setProductPrice(price); // Update the productPrice state
                }
              }}
              keyboardType="numeric"
              style={[
                styles.stockQuantityNumberInputAndProductPrice,
                { width: "40%" },
              ]}
            ></TextInput>
          </View>
        </View>
        <View id="productCategory">
          <View style={{ padding: 16, width: Dimensions.get("window").width }}>
            <MultiSelect
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              value={selected}
              search
              searchPlaceholder="Search..."
              onChange={(item) => {
                setSelected(item);
              }}
              renderLeftIcon={() => (
                <AntDesign
                  style={styles.icon}
                  color="black"
                  name="Safety"
                  size={20}
                />
              )}
              renderItem={renderItem}
              renderSelectedItem={(item, unSelect) => (
                <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                  <View style={styles.selectedStyle}>
                    <Text style={styles.textSelectedStyle}>{item.label}</Text>
                    <AntDesign color="black" name="delete" size={17} />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
        <View id="SubmitNewProduct">
          <Button
            onPress={async () => {
              await addProduct(images);
              props.navigation.goBack();
            }}
            title="Add Product"
            icon={<Feather name="upload" />}
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
      {/* Modal View */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Close modal when back button or outside of modal is pressed
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            {/* Add your modal content here */}
            <View id="byCamera" style={styles.modalViewChild}>
              <TouchableOpacity onPress={takeImageViaCamera}>
                <Entypo name="camera" size={50} color="black" />
                <Text style={styles.modalViewChildText}>Camera</Text>
              </TouchableOpacity>
            </View>
            <View id="fromGallery" style={styles.modalViewChild}>
              <TouchableOpacity onPress={takeImageViaGallery}>
                <MaterialCommunityIcons
                  name="image-album"
                  size={50}
                  color="black"
                />
                <Text style={styles.modalViewChildText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addImageButtonContainer: {
    position: "absolute",
    bottom: 10, // Adjust this value as needed to position the icon properly
    right: 10, // Adjust this value as needed to position the icon properly
  },
  productImageContainer: {
    borderWidth: 2,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    marginBottom: 20,
  },
  productInfoContainer: {
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("screen").width,
    alignItems: "center",
  },
  productInfoChildComponent: {
    display: "flex",
    flexDirection: "column",
    width: Dimensions.get("screen").width * 0.8,
    alignItems: "flex-start",
    marginBottom: "5%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  productInfoChildTextContainer: {
    marginBottom: 5,
  },
  productInfoChildTextInput: {
    width: "100%",
    textAlign: "justify",
    padding: 10,
    borderWidth: 3,
    backgroundColor: "transparent",
  },
  productInfoChildTextInputLong: {
    width: "100%",
    padding: 10, // Add padding to all sides
    textAlignVertical: "top", // Align text to the top vertically
    borderWidth: 3,
  },
  productInfoQuantityComponent: {
    display: "flex",
    flexDirection: "column",
  },
  numericInputContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%", // Ensure the container takes the full width
    marginTop: 5, // Add margin for spacing
  },
  stockQuantityNumberInputAndProductPrice: {
    width: "10%",
    textAlign: "center",
    backgroundColor: "#F2F2F2",
  },
  productQuantityNumericInput: {
    padding: 10,
    backgroundColor: "transparent",
  },
  productPriceTextInputContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageDisplayContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F2F2F2",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  imageDisplayContainerText: {
    marginTop: 20,
  },
  //picker style
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedStyle: {
    width: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  // Styles for modal view
  centeredView: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent gray background
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    height: Dimensions.get("screen").height * 0.3,
    width: Dimensions.get("screen").width * 0.7,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalViewChild: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modalViewChildText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default AddProductPage;
