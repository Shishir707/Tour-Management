import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyB5_LrlzM-okCEOcdUVHUK7brFfCZaADk0",
  authDomain: "t-shirt-3bee7.firebaseapp.com",
  databaseURL: "https://t-shirt-3bee7-default-rtdb.firebaseio.com",
  projectId: "t-shirt-3bee7",
  storageBucket: "t-shirt-3bee7.firebasestorage.app",
  messagingSenderId: "537345037025",
  appId: "1:537345037025:web:293547ec53830e16559da0",
  measurementId: "G-PD5P7EL7N9"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
getAnalytics(app);

window.submitExtraTshirtForm = async function () {
  const name = document.getElementById("name2").value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }

  // For demo, just pushing name only
  try {
    await push(ref(db, "extraTshirtOrders"), { name, timestamp: new Date().toISOString() });
    alert("Data saved!");
    document.getElementById("extraTshirtForm").reset();
  } catch (e) {
    alert("Failed to save data.");
    console.error(e);
  }
};
