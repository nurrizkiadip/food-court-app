import { collection, setDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default class RestaurantNetwork {
  static async getAllRestaurant() {
    const restaurantsRef = collection(db, 'restaurants');
    const restaurantsSnapshot = await getDocs(restaurantsRef);

    const restaurants = [];
    restaurantsSnapshot.forEach((itemSnapshot) => {
      restaurants.push({ docId: itemSnapshot.id, ...itemSnapshot.data() });
    });

    return restaurants;
  }

  static async getRestaurantById(id) {
    const restaurantsRef = collection(db, `restaurants`);
    const restaurantRef = doc(restaurantsRef, id);
    const restaurant = await getDoc(restaurantRef);

    return {
      docId: restaurant.id,
      ...restaurant.data(),
    };
  }

  static async getAllMealByRestaurantId(id) {
    const mealsRef = collection(db, `restaurants/${id}/meals`);
    const mealsSnapshot = await getDocs(mealsRef);

    const meals = [];
    mealsSnapshot.forEach((itemSnapshot) => {
      meals.push({ docId: itemSnapshot.id, ...itemSnapshot.data() });
    });

    return meals;
  }

  static async addMealToCard(data) {
    if (!auth.currentUser) {
      alert('Silakan login terlebih dulu');
      return;
    }

    const cardItemsRef = collection(db, `carts/${auth.currentUser.uid}/items`);
    const itemRef = doc(cardItemsRef, data.docId);

    const dataItem = { ...data };
    delete dataItem.docId;

    try {
      await setDoc(itemRef, dataItem);
      console.log('Successfully added to cart');
    } catch (error) {
      console.error(error);
    }
  }
}
