function openGroup() {
    window.open("https://www.facebook.com/groups/brhelpline", "_blank");
}

// Dynamic member count
let display = document.getElementById("memberCount");

// Example: you can set your target dynamically
let target = 544700; // Total members
let count = 0;

function formatK(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num;
}

function animateCount() {
    let increment = Math.ceil(target / 200); // auto increment based on target
    count += increment;

    if (count > target) count = target;

    display.innerText = formatK(count) + "+";

    if (count < target) {
        requestAnimationFrame(animateCount);
    }
}

animateCount();


function showEventAlert() {
    Swal.fire({
        icon: 'info',
        title: 'No Event to Show',
        text: 'Stay with BRHL for upcoming events!',
        confirmButtonColor: '#4c18d1',
        confirmButtonText: 'OK'
    });
}



function showEventForm(type) {
  if (type === "event") {
    document.getElementById("eventForm").style.display = "block";
  } else {
    document.getElementById("eventForm").style.display = "none";
  }
}

function submitEventForm() {
  const name = document.getElementById("eventName").value.trim();
  const phone = document.getElementById("eventPhone").value.trim();
  const eventType = document.getElementById("eventType").value;
  const paymentMethod = document.getElementById("eventPaymentMethod").value;
  const ref = document.getElementById("eventRef").value.trim();
  const collector = document.getElementById("eventCollector").value.trim();
  const comment = document.getElementById("eventComment").value.trim();

  if (!name || !phone || !eventType || !paymentMethod || !ref || !collector) {
    Swal.fire("Error", "Please fill all required fields!", "error");
    return;
  }

  if (!/^\d{10,}$/.test(phone)) {
    Swal.fire("Invalid Phone", "Phone number should be at least 10 digits.", "warning");
    return;
  }

  document.getElementById("eventSubmitMsg").textContent = "Submitting...";

  // Push data to Firebase (reuse your database)
  push(ref(tourDb, "eventRegistrations/"), {
    name,
    phone,
    eventType,
    paymentMethod,
    reference: ref,
    collector,
    comment,
    timestamp: new Date().toISOString()
  })
  .then(() => {
    document.getElementById("eventSubmitMsg").textContent = "";
    Swal.fire({
      icon: 'success',
      title: '✅ Event Registration Successful!',
      html: '<p style="font-weight:bold; margin-top:10px;">Thank you for joining BRHL Event!</p>',
      showConfirmButton: false,
      timer: 3000
    });
    document.getElementById("eventForm").reset();
  })
  .catch(err => {
    console.error(err);
    Swal.fire("Failed", "Submission failed. Try again later.", "error");
  });
}
