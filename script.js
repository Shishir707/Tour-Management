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


  participants.push({ name, boarding, received, due, payment, size });
  localStorage.setItem('participants', JSON.stringify(participants));

  Swal.fire('Success', 'Participant added successfully!', 'success');

  // Clear inputs
  document.getElementById('name').value = '';
  document.getElementById('received').value = '';
  document.getElementById('due').value = '';
  document.getElementById('payment').value = '';
  document.getElementById('size').selectedIndex = 0;
  document.getElementById('boarding').selectedIndex = 0;

  renderSummary();
  renderTable(); // ⬅️ Add this to refresh table
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
  <button id="clearBtn" class="clear-btn">Clear All Data</button>
  <button id="saveImageBtn">Download Data</button>
`;
  document.getElementById('summary').innerHTML = html;
}

function renderTable() {
  const tbody = document.querySelector('#participantTable tbody');
  tbody.innerHTML = ''; // Clear previous rows

  participants.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.name}</td>
      <td>${p.boarding}</td>
      <td>৳${p.received}</td>
      <td>৳${p.due}</td>
      <td>${p.payment}</td>
      <td>${p.size}</td>
    `;
    tbody.appendChild(row);
  });
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
