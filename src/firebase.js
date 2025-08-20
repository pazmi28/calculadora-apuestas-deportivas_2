// Importa las funciones que necesitas del SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Pega aquí el objeto firebaseConfig que copiaste antes
const firebaseConfig = {
  apiKey: "TAIzaSyCDWioUqPNxHcJzEnhOz8g5UsEb7jOV2tc",
  authDomain: "gestor-apuestas-app.firebaseapp.com",
  projectId: "gestor-apuestas-app",
  storageBucket: "gestor-apuestas-app.firebasestorage.app",
  messagingSenderId: "39722402049",
  appId: "1:39722402049:web:a40ac4954f313a41ac5b00"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la base de datos para que puedas usarla en otros archivos
export const db = getFirestore(app);