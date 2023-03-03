import { writeBatch, collection, doc } from 'firebase/firestore';

const PRICES = [
  "10000",
  "15000",
  "20000",
  "25000",
  "30000",
  "35000",
  "40000",
  "45000",
  "50000",
  "55000",
  "60000",
  "65000",
  "70000",
  "75000",
  "80000",
  "85000",
  "90000",
  "95000",
  "100000",
  "105000",
  "110000",
  "115000",
  "120000",
  "125000",
];

export async function createItems(db) {

  console.log('createItems()');

  const restaurantFetch = await fetch('/DATA.json');
  const restaurantJson = await restaurantFetch.json();

  // Get a new write batch
  const batch = writeBatch(db);
  // const batch = db.batch();

  for (const restaurantJsonKey in restaurantJson) {
    const restaurant = {
      id: restaurantJson[restaurantJsonKey].id,
      name: restaurantJson[restaurantJsonKey].name,
      description: restaurantJson[restaurantJsonKey].description,
      city: restaurantJson[restaurantJsonKey].city,
      rating: restaurantJson[restaurantJsonKey].rating,
      imageUrl: restaurantJson[restaurantJsonKey].imageUrl,
    };

    const restaurantsRef = collection(db, 'restaurants').doc();
    const hasil = batch.set(restaurantsRef, restaurant);
    console.log('hasil')
    console.log(hasil)
  }

  // Commit the batch
  await batch.commit();

  let i = 0;
  (await collection(db, 'restaurants').get()).forEach((item) => {
    console.log(item.id)
    console.log(i)
    restaurantJson[i].idDoc = item.id;

    i++;
  });

  /*=========== MEAL ==========*/
  // const batch2 = db.batch();
  const batch2 = writeBatch(db);
  for (const restaurantJsonKey in restaurantJson) {
    for (const mealsKey in restaurantJson[restaurantJsonKey].meals) {
      const meal = {
        id: restaurantJson[restaurantJsonKey].meals[mealsKey].id,
        name: restaurantJson[restaurantJsonKey].meals[mealsKey].name,
        description:
        restaurantJson[restaurantJsonKey].meals[mealsKey].description,
        imageUrl: restaurantJson[restaurantJsonKey].meals[mealsKey].imageUrl,
        price: _randomElement(PRICES),
      };

      const mealsDoc = collection(db, `restaurants`).doc(`${restaurantJson[restaurantJsonKey].idDoc}`).collection('meals').doc();
      batch2.set(mealsDoc, meal);
    }
  }

  await batch2.commit();
}

function _randomElement(arr) {
  const ind = Math.floor(Math.random() * arr.length);
  return arr[ind];
}