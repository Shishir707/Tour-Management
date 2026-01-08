function openGroup() {
  window.open("https://www.facebook.com/groups/brhelpline", "_blank");
}

// Dynamic member count
let display = document.getElementById("memberCount");
if (display) {
  let target = 559100;
  let count = 0;

  function formatK(num) {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  }

  function animateCount() {
    let increment = Math.ceil(target / 200);
    count += increment;
    if (count > target) count = target;
    display.innerText = formatK(count) + "+";
    if (count < target) requestAnimationFrame(animateCount);
  }

  animateCount();
}

function showEventAlert() {
  Swal.fire({
    icon: 'info',
    title: 'No Event to Show',
    text: 'Stay with BRHL for upcoming events!',
    confirmButtonColor: '#4c18d1',
    confirmButtonText: 'OK'
  });
}

function showEventForm() {
  const form = document.getElementById("eventForm"); // ✅ select the form
  form.style.display = "block";
  form.scrollIntoView({ behavior: "smooth" });
}




// ------------------------
// FIREBASE CONFIG
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Submit Event Form
const submitBtn = document.getElementById("submitEventBtn");
submitBtn.addEventListener("click", () => {
  const name = document.getElementById("eventName").value.trim();
  const phone = document.getElementById("eventPhone").value.trim();
  const boarding = document.getElementById("eventType").value;
  const payment = document.getElementById("eventPaymentMethod").value;
  const trx = document.getElementById("eventRef").value.trim();
  const collector = document.getElementById("eventCollector").value;
  const comment = document.getElementById("eventComment").value.trim();
  const tshirt = document.getElementById("evSize").value;
  const status = "Pending";

  if (!name || !phone || !boarding || !payment || !trx || !collector) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please fill all required fields!',
      confirmButtonColor: "#d33"
    });
    return;
  }

  database.ref("eventRegistrations").push({
    status, name, phone, boardingPoint: boarding,
    paymentMethod: payment, transactionID: trx, tshirtSize: tshirt,
    collector, comment, timestamp: new Date().toISOString()
  })
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Registration Confirmed!',
        text: 'Your registration has been saved.',
        confirmButtonColor: "#008000"
      });
      document.getElementById("eventForm").reset();
    })
    .catch(err => Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'Something went wrong: ' + err,
      confirmButtonColor: "#d33"
    }));
});

