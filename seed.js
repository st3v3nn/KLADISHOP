// Firestore seed script
// Run this once to initialize collections: node seed.js
// Make sure your Firebase credentials are set up via environment or Google Cloud CLI

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './constants.tsx';

// Initialize Firebase Admin SDK (requires GOOGLE_APPLICATION_CREDENTIALS env var)
const app = initializeApp();
const db = getFirestore(app);

async function seed() {
  try {
    console.log('🌱 Seeding Firestore...');

    // Add products
    const productsRef = db.collection('products');
    for (const product of INITIAL_PRODUCTS) {
      await productsRef.doc(product.id).set(product);
    }
    console.log(`✅ Added ${INITIAL_PRODUCTS.length} products`);

    // Add orders
    const ordersRef = db.collection('orders');
    for (const order of INITIAL_ORDERS) {
      await ordersRef.doc(order.id).set(order);
    }
    console.log(`✅ Added ${INITIAL_ORDERS.length} orders`);

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
