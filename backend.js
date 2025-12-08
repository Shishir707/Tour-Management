<script>
// ------------------------
// FIREBASE CONFIG FOR T-SHIRT PAGE
// ------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBbxXISUM_HJZ-iLuQ6uby9KBqFc7seBIg",
  authDomain: "brhl-665de.firebaseapp.com",
  databaseURL: "https://brhl-665de-default-rtdb.firebaseio.com",
  projectId: "brhl-665de",
  storageBucket: "brhl-665de.appspot.com",
  messagingSenderId: "907817820790",
  appId: "1:907817820790:web:14b70e8295fdcff64f7557",
  measurementId: "G-D3GJ6P2DE4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ------------------------
// SHOW/HIDE T-SHIRT FORM
// ------------------------
function showTshirtForm() {
  const form = document.getElementById("tshirtForm");
  if (form.style.display === "none" || form.style.display === "") {
    form.style.display = "block";
    form.scrollIntoView({ behavior: "smooth" });
  } else {
    form.style.display = "none";
  }
}

// ------------------------
// SUBMIT T-SHIRT FORM
// ------------------------
const tsSubmitBtn = document.getElementById("tsSubmitBtn");
if (tsSubmitBtn) {
  tsSubmitBtn.addEventListener("click", () => {
    const name = document.getElementById("tsName").value.trim();
    const phone = document.getElementById("tsPhone").value.trim();
    const station = document.getElementById("tsStation").value.trim();
    const size = document.getElementById("tsSize").value;
    const payment = document.getElementById("tsPayment").value;
    const trx = document.getElementById("tsRef").value.trim();
    const collector = document.getElementById("tsCollector").value;
    const comment = document.getElementById("tsComment").value.trim();
    const status = "Pending";

    // Validate required fields
    if (!name || !phone || !station || !size || !payment || !trx || !collector) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all required fields!',
        confirmButtonColor: "#d33"
      });
      return;
    }

    // Save to Firebase
    database.ref("tshirtOrders").push({
      status,
      name,
      phone,
      homeStation: station,
      tshirtSize: size,
      paymentMethod: payment,
      transactionID: trx,
      collector,
      comment,
      timestamp: new Date().toISOString()
    })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Order Confirmed!',
        text: 'Your T-shirt order has been saved.',
        confirmButtonColor: "#008000"
      });
      document.getElementById("tshirtForm").reset();
    })
    .catch(err => Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Something went wrong: ' + err,
      confirmButtonColor: "#d33"
    }));
  });
}
</script>
