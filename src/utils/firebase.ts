import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAlX1ASvDrf5BBtaB72AUYqSoW34YvP_y4',
  authDomain: 'mrwan-dd795.firebaseapp.com',
  databaseURL: 'https://mrwan-dd795-default-rtdb.firebaseio.com',
  projectId: 'mrwan-dd795',
  storageBucket: 'mrwan-dd795.firebasestorage.app',
  messagingSenderId: '12538399995',
  appId: '1:12538399995:web:4a7e6b40f611891fecb45e',
  measurementId: 'G-KBTHXXDYBL',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const rtdb = getDatabase(app);
