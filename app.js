import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCHEWExCVcYm5ZTQlRToVPD6mzFkuuOHsY",
  authDomain: "participate-322ac.firebaseapp.com",
  databaseURL: "https://participate-322ac-default-rtdb.firebaseio.com",
  projectId: "participate-322ac",
  storageBucket: "participate-322ac.firebasestorage.app",
  messagingSenderId: "1086204135947",
  appId: "1:1086204135947:web:9d2a1bdc26d9efc2ced50e",
  measurementId: "G-CBSQZBPHVH"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
getAnalytics(app);

const boardingEl = document.getElementById("boarding");
const totalAmountEl = document.getElementById("totalAmount");
const dueAmountEl = document.getElementById("dueAmount");
const finalAmountEl = document.getElementById("finalAmount");

boardingEl.addEventListener("change", () => {
  const value = boardingEl.value;
  if (value === "Dhaka") totalAmountEl.value = "3749";
  else if (value === "Chattogram") totalAmountEl.value = "2899";
  else totalAmountEl.value = "";
  calculatePaidAmount();
});

dueAmountEl.addEventListener("input", calculatePaidAmount);

function calculatePaidAmount() {
  const total = parseInt(totalAmountEl.value) || 0;
  const due = parseInt(dueAmountEl.value) || 0;
  const paid = total - due;
  finalAmountEl.value = paid >= 0 ? paid : 0;
}

window.submitForm = function () {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const boarding = boardingEl.value;
  const dueAmount = dueAmountEl.value.trim();
  const finalAmount = finalAmountEl.value.trim();
  const tshirtSize = document.getElementById("tshirtSize").value;
  const paymentMethod = document.getElementById("paymentMethod").value;
  const refCode = document.getElementById("ref").value.trim();
  const collector = document.getElementById("collector").value.trim();
  const comment = document.getElementById("comment").value.trim();
  const timestamp = new Date().toISOString();

  if (!name || !phone || !boarding || !paymentMethod || !refCode || !tshirtSize ||!collector) {
    Swal.fire("Error", "Please fill all required fields!", "error");
    return;
  }

  if (!/^\d{10,}$/.test(phone)) {
    Swal.fire("Invalid Phone", "Phone number should be at least 10 digits.", "warning");
    return;
  }
  document.getElementById("submitMsg").textContent = "Submitting...";

  const data = {
    name,
    phone,
    boarding,
    dueAmount,
    paidAmount: finalAmount,
    tshirtSize,
    paymentMethod,
    reference: refCode,
    collector,
    comment,
    timestamp
  };

  push(ref(db, "registrations/"), data)
  .then(() => {
    document.getElementById("submitMsg").textContent = "";
    Swal.fire({
      icon: 'success',
      title: '✅ Registration Successful!',
      html: '<p style="font-weight:bold; margin-top:10px;">Welcome to BRHL Tour</p>',
      showConfirmButton: false,
      timer: 3000
    });
  })
  .catch((error) => {
    document.getElementById("submitMsg").textContent = "";
    // ONLY show failure here
    console.error(error);
    Swal.fire("Failed", "Submission failed. Try again later.", "error");
  });

};
