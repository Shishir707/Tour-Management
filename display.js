import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCHEWExCVcYm5ZTQlRToVPD6mzFkuuOHsY",
  authDomain: "participate-322ac.firebaseapp.com",
  databaseURL: "https://participate-322ac-default-rtdb.firebaseio.com",
  projectId: "participate-322ac",
  storageBucket: "participate-322ac.appspot.com",
  messagingSenderId: "1086204135947",
  appId: "1:1086204135947:web:9d2a1bdc26d9efc2ced50e",
  measurementId: "G-CBSQZBPHVH"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const table = document.getElementById("participantTable");
const body = document.getElementById("participantBody");
const loadingMessage = document.getElementById("loadingMessage");
const noDataMessage = document.getElementById("noDataMessage");

// Fetch data
function fetchParticipants() {
  const regRef = ref(db, "registrations");
  onValue(regRef, (snapshot) => {
    const data = snapshot.val();
    body.innerHTML = "";

    if (data) {
      table.style.display = "table";
      loadingMessage.style.display = "none";
      noDataMessage.style.display = "none";

      Object.entries(data).forEach(([id, participant]) => {
        const row = document.createElement("tr");

        const status = participant.status || "Pending";

        row.innerHTML = `
          <td>${participant.name || ""}</td>
          <td>${participant.phone || ""}</td>
          <td>${participant.boarding || ""}</td>
          <td>${participant.tshirtSize || ""}</td>
          <td>${participant.paidAmount || "0"}</td>
          <td>${participant.dueAmount || "0"}</td>
          <td>${participant.paymentMethod || ""}</td>
          <td>${participant.reference || ""}</td>
          <td>${participant.collector || ""}</td>
          <td>${participant.comment || ""}</td>
          <td>${participant.timestamp ? new Date(participant.timestamp).toLocaleString() : ""}</td>
          <td><span style="color:${status === "Confirmed" ? "green" : "red"}">${status}</span></td>
          <td>
            ${
              status === "Confirmed"
                ? "✔"
                : `<button onclick="confirmParticipant('${id}')">Confirm</button>`
            }
          </td>
        `;

        body.appendChild(row);
      });
    } else {
      table.style.display = "none";
      loadingMessage.style.display = "none";
      noDataMessage.style.display = "block";
    }
  }, (error) => {
    loadingMessage.textContent = "Failed to load data.";
    console.error("Error loading data:", error);
  });
}

// Confirm button action
window.confirmParticipant = async function(id) {
  const confirmRef = ref(db, `registrations/${id}`);
  await update(confirmRef, { status: "Confirmed" });
  alert("Status updated to Confirmed!");
};
  
// Run on page load
fetchParticipants();


function submitBtn(){
    alert("Button Clicked");
}