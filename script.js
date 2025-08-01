// Hide both sections initially
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("registrationForm").style.display = "none";
  document.getElementById("tshirt").style.display = "none";
});

function showForm(type) {
  const participantDiv = document.getElementById("registrationForm");
  const orderDiv = document.getElementById("tshirt");

  if (type === "tshirt") {
    participantDiv.style.display = "none";
    orderDiv.style.display = "block";
  } else if (type === "tour") {
    orderDiv.style.display = "none";
    participantDiv.style.display = "block";
  }
}

  window.onload = async function () {
  // Get the last part of the path
  const currentPage = window.location.pathname.split('/').pop();

  // Use only 'hostmanage' as the match string
  if (currentPage === 'hostmanage') {
    const { value: password } = await Swal.fire({
      title: 'Admin Access Required',
      input: 'password',
      inputLabel: 'Enter the password',
      inputPlaceholder: 'Password',
      inputAttributes: {
        maxlength: 20,
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      backdrop: 'rgba(0, 0, 0, 1)',
      background: '#111',
      color: '#fff',
      allowOutsideClick: false,
      showCancelButton: false,
      confirmButtonText: 'Enter'
    });

    if (password !== 'brhl500') {
      await Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Incorrect password. Redirecting...',
        backdrop: 'rgba(0, 0, 0, 1)',
        background: '#111',
        color: '#fff',
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 2000
      });
      location.href = 'index.html';
    }
  }
};



  function showSampleNotice() {
    Swal.fire({
      title: '📢 Sample Not Ready Yet',
      text: 'Will be published soon.\nStay tuned - BRHL Team',
      icon: 'info',
      confirmButtonText: 'Thank You',
      backdrop: 'rgba(0, 0, 0, 0.9)',
      background: '#111',
      color: '#fff'
    });
  }




async function downloadReceip() {
  const phone = document.getElementById("phoneInput").value.trim();
  const text = document.getElementById("msg");

  if (!phone) {
    Swal.fire({
      icon: 'warning',
      title: 'Missing Number',
      text: '⚠️ Please enter your phone number.',
      timer: 3000,
      showConfirmButton: false
    });
    return;
  }

  try {
    text.textContent = "Please Wait....";

    const response = await fetch(`https://script.google.com/macros/s/AKfycbzm9ChlRGiaogO78ABUAe2NgYcdg9AZ_7787xAKBN3VLt11JAv6xxCCEhidClW0d0BDAw/exec?phone=${phone}`);
    const data = await response.json();

    if (data.error) {
      Swal.fire({
        icon: 'error',
        title: 'No Record Found',
        text: '❌ No record found for this phone number.',
        timer: 3000,
        showConfirmButton: false
      });
      text.textContent = "";
      return;
    }

    if (!data.verification) {
      await Swal.fire({
        icon: 'info',
        title: 'Pending Verification',
        text: 'Please wait for admin confirmation before proceeding.',
        confirmButtonText: 'OK'
      });
      text.textContent = "";
      return;
    }

    // Create a container div for receipt (hidden or offscreen)
    let container = document.getElementById("receipt-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "receipt-container";
      container.style.position = "fixed";
      container.style.left = "-9999px"; // Offscreen
      container.style.top = "0";
      container.style.width = "600px";
      container.style.padding = "30px";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.background = "#fff";
      container.style.border = "2px dashed #555";
      document.body.appendChild(container);
    }

    container.innerHTML = `
      <img src="gallery/brhlLogo.jpeg" alt="Logo" style="display: block; margin: 0 auto 15px auto; max-width: 50%; height: auto;" />
      <h1 style="text-align: center; color: #2c3e50;">🎫 BRHL Tour Receipt</h1>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name of Participant:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.name}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Contact No.:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.phone}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Boarding Point:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.boarding}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>T-Shirt Size:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.tshirt}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Payment Method:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.payment}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Reference:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.reference}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Comments:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.comments || "N/A"}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Registration Time:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(data.timestamp).toLocaleString()}</td></tr>
      </table>
      <br>
      <strong>🕕 Your train seat number will be available 6 hours before departure. Download your receipt to view it.</strong>
      <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">This is a system-generated receipt from BRHL</div>
    `;

    // Use html2canvas to render to canvas
    const canvas = await html2canvas(container, { scale: 2 });

    // Convert canvas to image data URL
    const imgData = canvas.toDataURL("image/png");

    // Create a download link for image
    const a = document.createElement("a");
    a.href = imgData;
    a.download = `BRHL_Receipt_${data.phone}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    text.textContent = "";

    Swal.fire({
      icon: 'success',
      title: 'Welcome to BRHL Tour!',
      text: 'Your BRHL Tour Receipt image has been downloaded.Safe travels!',
      confirmButtonText: 'Thank You 💙'
    })

  } catch (err) {
    console.error("Error generating receipt image:", err);
    alert("⚠️ Something went wrong. Try again later.");
    text.textContent = "";
  }
}


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

function participant() {
  document.getElementById("participant").style.display = "block";
  document.getElementById("order").style.display = "none";
}

function order() {
  document.getElementById("order").style.display = "block";
  document.getElementById("participant").style.display = "none";
}



