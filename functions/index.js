const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.initializeApp().firestore();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

function getTotalPriceAndCountCart(collectionSnapshot) {
  let totalPrice = 0;
  let itemCount = 0;

  collectionSnapshot.forEach((itemSnapshot) => {
    const itemData = itemSnapshot.data();
    if (itemData.price) {
      // If not specified, the quantity is 1
      const quantity = itemData.quantity ? itemData.quantity : 1;
      itemCount += quantity;
      totalPrice += itemData.price * quantity;
    }
  });

  return { totalPrice, itemCount };
}

exports.calculateCarts = functions.firestore
  .document('carts/{cartId}/items/{itemId}')
  .onWrite(async (change, context) => {
    const updatedAt = Date.now();
    try {
      const cartRef = db.collection('carts').doc(context.params.cartId);
      const cartItemsSnap = await cartRef.collection('items').get();

      const { totalPrice, itemCount } = getTotalPriceAndCountCart(
        cartItemsSnap.docs,
      );

      await cartRef.update({ totalPrice, itemCount, updatedAt });

      console.log('Cart total successfully recalculated: ', totalPrice);
    } catch (error) {
      console.warn('update error', error);
    }
  });
