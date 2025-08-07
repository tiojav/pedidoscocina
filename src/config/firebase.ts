import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAdB6EI6mM4fTtbZLkBgorSz2AVPXeRv5w",
    authDomain: "pedidoscocina-tiojav.firebaseapp.com",
    projectId: "pedidoscocina-tiojav",
    storageBucket: "pedidoscocina-tiojav.firebasestorage.app",
    messagingSenderId: "244885141146",
    appId: "1:244885141146:web:108177469a7221f6fb1123",
    measurementId: "G-PF6670RB76"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 