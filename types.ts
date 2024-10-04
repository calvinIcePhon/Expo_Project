import { Timestamp } from "firebase/firestore";

// export type SellerStackParamList = {
//   Products:undefined;
//   Followers:undefined;
//   Transactions_Status:undefined;
//   HomeSeller:undefined;
//   AddProductPage:undefined;
//   EditProductPage:undefined;
//   SellerProductDetails:undefined;
// }

export const CategoryType = [
  { label: "Textbooks", value: "Cat1" },
  { label: "Electronics", value: "Cat2" },
  { label: "Gadgets", value: "Cat3" },
  { label: "Mobile Phones", value: "Cat4" },
  { label: "Gadgets' Accessories", value: "Cat5" },
  { label: "Computers", value: "Cat6" },
  { label: "Desktops", value: "Cat7" },
  { label: "Laptops", value: "Cat8" },
  { label: "Tablets", value: "Cat9" },
  { label: "Clothings", value: "Cat10" },
  { label: "Books", value: "Cat11" },
  { label: "Magazines", value: "Cat12" },
  { label: "Sports", value: "Cat13" },
  { label: "Sports Tool", value: "Cat14" },
  { label: "Sport Shoes", value: "Cat15" },
  { label: "Home Appilances", value: "Cat16" },
  { label: "Furniture", value: "Cat17" },
  { label: "Stationery", value: "Cat18" },
  { label: "Pen", value: "Cat19" },
  { label: "Calculator", value: "Cat20" },
  { label: "Decoration", value: "Cat21" },
  { label: "Services", value: "Cat22" },
  { label: "Foods & Drinks", value: "Cat23" },
  { label: "Figures", value: "Cat24" }
];


export type RootStackParamList = {
  Market: undefined;
  Notification: undefined;
  ProfilePage: undefined;
  Community: undefined;
  ProductDetailsPage: {itemId:string};
  Home:undefined;
  BecomeSeller:undefined;
  CreatingProfile:undefined;
  SellerControlPage:{sellerInfo:sellerType};
  ProductList: undefined;
  Followers: undefined;
  Transaction: undefined;
  EditProductPage: undefined;
  SellerProductDetail: undefined;
  AddProductPage: {productTotalNum:number, sellerInfo?:sellerType};
};



export type AuthStackParamList = {
  SignUpCom: undefined;
  Login: undefined;
};

export type productCommentsIdType = {
  userId:string;
  comments:string;
}

export type itemType = {
  productId: string;
  productName: string;
  productDescription: string;
  productQuantity:number;
  productAvailableQuantity:number;
  productSellQuantity:number;
  productCommentsId:productCommentsIdType[];
  productLikesId:string[];
  productImages:string[];
  productPriceRanges:number;
  productCategoryId:string[];
  sellerId:string | undefined;
  productLocation:{
    lat:number | undefined;
    long:number | undefined;
  }
};

export type notificationType = {
  content:string;
  sellerId:string;
  status:false;
  type:string;
}

export type userType = {
  userId:string;
  userFirstName:string;
  userLastName:string;
  userPhoneNumber?:string;
  userJoinDate:Timestamp;
  userEmail:string|null;
  userNotificationTokenId?:string;
  userFriendsId?:string[];
  userContactFlag:boolean;
  userContacts?:string[];
  userSellerFlag:boolean;
  userAddress:{
    streetName: string,
    stateName: string,
    postcode: string,
  };
  userAddressLong?:number |undefined;
  userAddressLat?:number  | undefined;
  userFollowedSellers:string[];
  userNotificationList?:notificationType[];
  userProfileCreated:boolean,
  userDocKey:string,
}

export type productCategoryType = {
  productCategoryId:string;
  categoryLabel:string;
  categoryDescriptions:string;
}

export type sellerType = {
  sellerId:string;
  sellerJoinDate:Timestamp;
  sellerStoreName:string;
  sellerStoreDescription?:string;
  sellerFollowersId:string[];
  sellerStoreAddress:{
    streetName: string,
    stateName: string,
    postcode: string,
  };
  sellerAddressLong:number | undefined;
  sellerAddressLat:number | undefined;
  sellerRating?:number[];
  sellerNotificationTokenId:string;
  sellerLikesId:string[];
}

export type productorderType = {
  productId:string;
  quantityPurchase:number;
}

export type paymentType = {
  paymentId:string;
  paymentMadeDate:Timestamp;
  amount:number;
  paymentMethod:string;
}

export type deliveryType_Type = {
  deliveryTypeId:string;
  deliveryTypeLabel:string;
  deliveryTypeDescriptions:string;
}

export type orderType = {
  orderId:string;
  userId:string;
  sellerId:string;
  orderStatus:string;
  orderTotalPrice:number;
  orderCheckoutAddress:string;
  orderReceivedAddress:string;
  orderArrivalDate:Timestamp;
  orderReceivedDate:Timestamp;
  product: productorderType[];
  payment: paymentType;
  deliveryType: deliveryType_Type;
}
//other config types ====================================================================================================

export  interface Persistence {
  /**
   * Type of Persistence.
   * - 'SESSION' is used for temporary persistence such as `sessionStorage`.
   * - 'LOCAL' is used for long term persistence such as `localStorage` or `IndexedDB`.
   * - 'NONE' is used for in-memory, or no persistence.
   */
  readonly type: "SESSION" | "LOCAL" | "NONE";
}

export interface ReactNativeAsyncStorage {
  /**
   * Persist an item in storage.
   *
   * @param key - storage key.
   * @param value - storage value.
   */
  setItem(key: string, value: string): Promise<void>;
  /**
   * Retrieve an item from storage.
   *
   * @param key - storage key.
   */
  getItem(key: string): Promise<string | null>;
  /**
   * Remove an item from storage.
   *
   * @param key - storage key.
   */
  removeItem(key: string): Promise<void>;
}


export const enum PersistenceType {
  SESSION = 'SESSION',
  LOCAL = 'LOCAL',
  NONE = 'NONE'
}

export type PersistedBlob = Record<string, unknown>;

export interface Instantiator<T> {
  (blob: PersistedBlob): T;
}

export type PersistenceValue = PersistedBlob | string;

export const STORAGE_AVAILABLE_KEY = '__sak';

export interface StorageEventListener {
  (value: PersistenceValue | null): void;
}

export interface PersistenceInternal extends Persistence {
  type: PersistenceType;
  _isAvailable(): Promise<boolean>;
  _set(key: string, value: PersistenceValue): Promise<void>;
  _get<T extends PersistenceValue>(key: string): Promise<T | null>;
  _remove(key: string): Promise<void>;
  _addListener(key: string, listener: StorageEventListener): void;
  _removeListener(key: string, listener: StorageEventListener): void;
  // Should this persistence allow migration up the chosen hierarchy?
  _shouldAllowMigration?: boolean;
}