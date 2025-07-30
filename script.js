let participants = JSON.parse(localStorage.getItem('participants')) || [];

function addParticipant() {
  const name = document.getElementById('name').value.trim();
  const boarding = document.getElementById('boarding').value;
  const received = parseFloat(document.getElementById('received').value) || 0;
  const due = parseFloat(document.getElementById('due').value) || 0;
  const payment = document.getElementById('payment').value;
  const size = document.getElementById('size').value;

  if (!name || !boarding || !received || !payment || !size) {
    Swal.fire('Error', 'Please fill all fields', 'error');
    return;
  }

  // Create participant object
  const participant = { name, boarding, received, due, payment, size };

  // Save to localStorage
  let participants = JSON.parse(localStorage.getItem('participants')) || [];
  participants.push(participant);
  localStorage.setItem('participants', JSON.stringify(participants));

  // Add to table
  const tableBody = document.querySelector("#participantTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${participant.name}</td>
    <td>${participant.boarding}</td>
    <td>${participant.received}</td>
    <td>${participant.due}</td>
    <td>${participant.payment}</td>
    <td>${participant.size}</td>
  `;
  tableBody.appendChild(row);

  // ✅ Now update summary AFTER adding
  renderSummary();

  // Show success message
  Swal.fire('Success', 'Participant added successfully!', 'success');

  // Reset form
  document.getElementById('name').value = '';
  document.getElementById('received').value = '';
  document.getElementById('due').value = '';
  document.getElementById('payment').value = '';
  document.getElementById('size').value = '';
  document.getElementById('boarding').value = '';
}



document.getElementById("boarding").addEventListener("change", function () {
  const receivedInput = document.getElementById("received");
  const selected = this.value;

  if (selected === "Dhaka") {
    receivedInput.value = 3749;
  } else if (selected === "Chattogram") {
    receivedInput.value = 2899;
  } else {
    receivedInput.value = "";
  }
});

function renderSummary() {
  let participants = JSON.parse(localStorage.getItem('participants')) || [];

  const summary = {
    total: participants.length,
    received: 0,
    due: 0,
    sizes: {},
    payments: {}
  };

  participants.forEach(p => {
    summary.received += p.received;
    summary.due += p.due;
    summary.sizes[p.size] = (summary.sizes[p.size] || 0) + 1;
    summary.payments[p.payment] = (summary.payments[p.payment] || 0) + p.received;
  });

  let html = `
    <h3>Summary</h3>
    <p><strong>Total Participants:</strong> ${summary.total}</p>
    <p><strong>Total Money Received:</strong> ৳${summary.received}</p>
    <p><strong>Total Due:</strong> ৳${summary.due}</p>
    <h4>T-Shirt Sizes:</h4>
    <ul>${Object.entries(summary.sizes).map(([s, c]) => `<li>${s}: ${c}</li>`).join('')}</ul>
    <h4>Payments:</h4>
    <ul>${Object.entries(summary.payments).map(([m, c]) => `<li>${m}: ৳${c}</li>`).join('')}</ul>
    <button id="clearBtn" class="clear-btn">Clear Data</button>
    <button id="saveImageBtn" class="save-image-btn">Save Data</button>`;

  document.getElementById('summary').innerHTML = html;
}


// Initial rendering on load
renderSummary();
renderTable();

function renderTable() {
  const tbody = document.querySelector('#participantTable tbody');
  tbody.innerHTML = ''; // Clear previous rows

  participants.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Name">${p.name}</td>
      <td data-label="Boarding">${p.boarding}</td>
      <td data-label="Received">৳${p.received}</td>
      <td data-label="Due">৳${p.due}</td>
      <td data-label="Payment">${p.payment}</td>
      <td data-label="Size">${p.size}</td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById('clearBtn').addEventListener('click', () => {
  Swal.fire({
    title: 'Are you sure?',
    text: "This will remove all participants and clear the summary!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Yes, clear all!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear participants array and localStorage
      participants = [];
      localStorage.removeItem('participants');

      // Clear table
      renderTable();

      // Clear summary
      document.getElementById('summary').innerHTML = '';

      Swal.fire('Cleared!', 'All data has been removed.', 'success');
    }
  });
});

document.getElementById('saveImageBtn').addEventListener('click', () => {
  const captureElement = document.getElementById('captureArea');
  const titleElement = document.getElementById('imageTitle'); // This is your hidden h2

  // Show the title before taking the screenshot
  titleElement.style.display = 'block';

  html2canvas(captureElement).then(canvas => {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'BRHL_500K_Celebration.png';
    link.click();

    // Hide the title again after the capture
    titleElement.style.display = 'none';

    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'Image saved to gallery!',
      text: 'This image was automatically generated by the Electronic Tour Management System.',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true
    });

  }).catch(err => {
    titleElement.style.display = 'none'; // Hide it even if error
    Swal.fire('Error', 'Failed to generate image. Please try again.', 'error');
    console.error(err);
  });
});

function showSampleNotice() {
  Swal.fire({
    icon: 'info',
    title: 'Sample Not Ready Yet',
    html: `<p>Stay Tuned</p><p><strong>BRHL Team</strong></p>`,
    confirmButtonText: 'OK',
    timer: 8000,
    timerProgressBar: true,
  });
}

function copyToClipboard(btn, number) {
  const localNumber = number.replace(/^(\+88)/, ''); // removes +88 if present
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(localNumber)
      .then(() => {
        btn.textContent = '✅ Copied!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '📋Copy';
          btn.disabled = false;
        }, 1500);
      });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = localNumber;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      btn.textContent = '✅ Copied!';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '📋Copy';
        btn.disabled = false;
      }, 1500);
    } finally {
      document.body.removeChild(textarea);
    }
  }
}


function showForm(type) {
  const tshirt = document.getElementById('tshirtForm');
  const tour = document.getElementById('tourForm');

  if (type === 'tshirt') {
    tshirt.style.display = 'block';
    tour.style.display = 'none';
  } else if (type === 'tour') {
    tshirt.style.display = 'none';
    tour.style.display = 'block';
  }
}


async function downloadReceipt() {
  const phone = document.getElementById("phoneInput").value.trim();
 if (!phone) {
  Swal.fire({
    icon: 'warning',
    title: 'Missing Number',
    text: '⚠️ Please enter your phone number.',
    timer: 3000, // 3 seconds
    showConfirmButton: false
  });
  return;
}

  try {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbxlR8Ts2kNxHdpkUbB40k2USX9JrvMBgqm3RBJ9bNPKYb4QsZ7mUYU3hxr1JPkz9Q-IoQ/exec?phone=${phone}`);
    const data = await response.json();

    if (data.error) {
      alert("❌ No record found for this phone number.");
      return;
    }

  Swal.fire({
  icon: 'success',
  title: 'Download Successful',
  text: 'Your BRHL Tour Receipt has been downloaded.',
  timer: 2000,
  showConfirmButton: false
}).then(() => {
  // After the first Swal closes, show the welcome message
  Swal.fire({
    icon: 'info',
    title: 'Welcome to BRHL!',
    text: 'We are thrilled to have you on this journey. Safe travels!',
    confirmButtonText: 'Thank You 💙'
  });
});


    const content = `
      <html>
      <head>
        <title>BRHL Tour Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            max-width: 600px;
            margin: auto;
            border: 2px dashed #555;
          }
          h1 {
            text-align: center;
            color: #2c3e50;
          }
          h3 {
            text-align: center;
            color: #444;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 30px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <h1>🎫 BRHL Tour Receipt</h1>
        <h3>Bangladesh Railway Helpline</h3>
        <table>
          <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${data.phone}</td></tr>
          <tr><td><strong>Boarding:</strong></td><td>${data.boarding}</td></tr>
          <tr><td><strong>T-Shirt Size:</strong></td><td>${data.tshirt}</td></tr>
          <tr><td><strong>Payment:</strong></td><td>${data.payment}</td></tr>
          <tr><td><strong>Reference:</strong></td><td>${data.reference}</td></tr>
          <tr><td><strong>Comments:</strong></td><td>${data.comments || "N/A"}</td></tr>
          <tr><td><strong>Timestamp:</strong></td><td>${new Date(data.timestamp).toLocaleString()}</td></tr>
        </table><br><br>
        <strong>🕕 Your train seat number will be available 6 hours before departure. Download your receipt to view it.</strong>
        <div class="footer">This is a system-generated receipt from BRHL</div>
      </body>
      </html>
    `;

    // Create a Blob and trigger download
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `BRHL_Receipt_${data.phone}.html`;
    a.click();

    URL.revokeObjectURL(url); // Clean up

  } catch (err) {
    console.error("Error generating receipt:", err);
    alert("⚠️ Something went wrong. Try again later.");
  }
}
