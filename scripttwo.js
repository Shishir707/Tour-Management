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