
let awaitingDestination = false;

function openChat() {
  document.getElementById("chat-box").style.display = "block";
  document.getElementById("help-launcher").style.display = "none";

  const log = document.getElementById("chat-log");
  log.innerHTML += `
    <div style="margin-bottom: 10px;">
      <div style="background: #f0f8ff; padding: 8px 12px; border-radius: 10px;
      max-width: 80%; float: left; clear: both; animation: fadeIn 0.5s ease;">
        <strong>Bot:</strong> 👋 Welcome to Qantas Airlines! My name is Qantas BOT and I'm here to help with flights, bookings, or baggage.
      </div>
    </div>
  `;
  log.scrollTop = log.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("chat-input").value.trim();
  const log = document.getElementById("chat-log");

  if (!input) return;

  log.innerHTML += `
    <div style="margin-bottom: 10px;">
      <div style="background: #eee; padding: 8px 12px; border-radius: 10px;
      max-width: 80%; float: right; clear: both; animation: fadeIn 0.5s ease;">
        <strong>You:</strong> ${input}
      </div>
    </div>
  `;

  const typingBubble = document.createElement("div");
  typingBubble.id = "typing-bubble";
  typingBubble.innerHTML = `
    <div style="margin-bottom: 10px;">
      <div class="typing-indicator" style="background: #f0f8ff; padding: 8px 12px;
      border-radius: 10px; max-width: 80%; float: left; clear: both; font-style: italic;">
        <strong>Bot:</strong> <span class="typing-indicator"></span>
      </div>
    </div>
  `;
  log.appendChild(typingBubble);
  log.scrollTop = log.scrollHeight;

  const lower = input.toLowerCase();
  let response = "";

  const greetings = ["wsg", "hello", "hi", "hey", "yo", "sup"];
  const okWords = ["ok", "okay", "alright", "cool", "fine", "got it"];
  const isGreeting = greetings.some(g => lower.includes(g));
  const isOk = okWords.some(o => lower === o || lower.includes(` ${o}`));

  if (awaitingDestination) {
    const words = input.split(" ");
    const lastWord = words[words.length - 1];
    response = `🗺️ Got it — you're heading to <strong>${lastWord}</strong>. Check our <a href="/book.html">flight booking page</a> to see availability.`;
    awaitingDestination = false;
  } else if (isGreeting) {
    response = "👋 I'm here to help! Welcome to Qantas Airlines.";
  } else if (isOk) {
    const okReplies = [
      "👍 Got it! Let me know if you need anything else.",
      "👌 All set. Safe travels with Qantas!And stay Spooky 👻🎃",
      "✈️ Cool. I’m here if you need help with flights or baggage.",
      "✅ Okay! You’re good to go."
    ];
    response = okReplies[Math.floor(Math.random() * okReplies.length)];
  } else if (lower.includes("flight")) {
    response = "✈️ The next available flight is Q666 from SYD to LAX, departing at 2:30 PM. Status: Postponed ❌ (NOTE: Please see a staff for more information on this Postponed flight.) ";
  } else if (
    lower.includes("booking") ||
    lower.includes("reserve") ||
    lower.includes("ticket") ||
    lower.includes("book")
  ) {
    response = "🧾 Sure! To book a flight, visit our booking page or tell me your destination.";
    awaitingDestination = true;
  } else if (lower.includes("baggage") || lower.includes("luggage")) {
    response = "🧳 Economy passengers may check 1 bag up to 23kg. Additional fees apply for extra or overweight bags.";
  } else {
    response = "🙁 I'm sorry, I can only assist with flight details, bookings, or baggage inquiries at the moment.";
  }

  setTimeout(() => {
    typingBubble.innerHTML = `
      <div style="margin-bottom: 10px;">
        <div style="background: #f0f8ff; padding: 8px 12px; border-radius: 10px;
        max-width: 80%; float: left; clear: both; animation: fadeIn 0.5s ease;">
          <strong>Bot:</strong> ${response}
        </div>
      </div>
    `;
    log.scrollTop = log.scrollHeight;
  }, 2000);

  document.getElementById("chat-input").value = "";
}

function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');

  const creditSection = document.getElementById("credit");
  creditSection.style.display = tabId === "credit" ? "flex" : "none";
}

function applyFlightCredit() {
  const code = document.getElementById("flightCreditCode").value.trim();
  const feedback = document.getElementById("creditFeedback");
  const loader = document.getElementById("creditLoader");

  const validCredits = {
    "QANTAS50": { amount: 50, perks: ["10% Discount"] },
    "TESTING": { amount: 100, perks: ["20% Discount", "Free First-Class Upgrade"] },
    "FLYVIP": { amount: 150, perks: ["30% Discount", "First-Class", "Lounge Access"] },
    "OPEN25": { amount: 500, perks: ["25% Discount", "Free First-Class Upgrade" ] }
  };

  feedback.innerHTML = "";
  loader.style.display = "block";

  setTimeout(() => {
    loader.style.display = "none";

    if (!code || !validCredits[code]) {
      localStorage.removeItem("flightCredit");
      localStorage.removeItem("flightCreditUsed");
      feedback.innerHTML = `
        <div style="background:#fff3f3; border-left:6px solid #d6001c; padding:20px; border-radius:10px; color:#d6001c; font-weight:bold; box-shadow:0 0 10px rgba(214,0,28,0.3); animation: fadeIn 0.5s ease;">
          <div style="font-size:2rem;">❌</div>
          Invalid flight credit code<br>
          <div style="font-size:2.5rem;">😢</div>
        </div>
      `;
      return;
    }

    const credit = validCredits[code];
    localStorage.setItem("flightCredit", JSON.stringify({ code, ...credit }));
    localStorage.removeItem("flightCreditUsed");

    feedback.innerHTML = `
      <div style="background:#e6fff2; border-left:6px solid #28a745; padding:20px; border-radius:10px; color:#28a745; font-weight:bold; box-shadow:0 0 10px rgba(40,167,69,0.3); animation: fadeIn 0.5s ease;">
        <div style="font-size:2rem;">✅</div>
        Flight Credit Applied: <strong>$${credit.amount}</strong><br><br>
        Perks Unlocked:<br>
        ${credit.perks.map(p => `- ${p}`).join("<br>")}<br><br>
        <button onclick="useFlightCredit()" style="margin-top:10px; padding:10px 20px; background:#007bff; color:white; border:none; border-radius:6px; font-weight:bold;">Use Credit</button>
      </div>
    `;
  }, 2500);
}

function useFlightCredit() {
  localStorage.setItem("flightCreditUsed", "true");

  const feedback = document.getElementById("creditFeedback");
  feedback.innerHTML = `
    <div style="background:#fffbe6; border-left:6px solid #ffc107; padding:20px; border-radius:10px; color:#856404; font-weight:bold; box-shadow:0 0 10px rgba(255,193,7,0.3); animation: fadeIn 0.5s ease;">
      <div style="font-size:2rem;">🎟️</div>
      Flight credit marked as <strong>USED</strong>!<br>
      You’ll see it applied in your booking.
    </div>
  `;
}

function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");
  const banner = document.getElementById("cookie-banner");
  if (banner) {
    banner.style.opacity = "0";
    banner.style.transform = "translateY(100%)";
    setTimeout(() => banner.style.display = "none", 600);
  }
}

function rejectCookies() {
  localStorage.setItem("cookieConsent", "rejected");
  const banner = document.getElementById("cookie-banner");
  if (banner) {
    banner.style.opacity = "0";
    banner.style.transform = "translateY(100%)";
    setTimeout(() => banner.style.display = "none", 600);
  }
}

window.addEventListener("load", () => {
  const consent = localStorage.getItem("cookieConsent");
  const banner = document.getElementById("cookie-banner");
  if (banner && consent !== "accepted" && consent !== "rejected") {
    setTimeout(() => {
      banner.classList.add("show");
    }, 3200); // ⏱️ 1.5 second delay before fade-in
  }
});

window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loading-screen");
    if (loader) {
      loader.style.display = "none";
    }
  }, 2000);
});

let selectedFlight = {
  from: "Sydney (SYD)",
  to: "Los Angeles (LAX)",
  date: "2025-11-10",
  flightCode: "QF666",
  time: "2:30 PM",
  gate: "A1",
  aircraft: "Boeing 787 Dreamliner",
  status: "❌ Postponed" // Change to ✔ On Time, ❌ Cancelled, or ❌ Postponed
};

let slideIndex = 0;

function showSlide(index) {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
  });
  slides[index].classList.add("active");
  dots[index].classList.add("active");
  slideIndex = index;
}

setInterval(() => {
  slideIndex = (slideIndex + 1) % 3;
  showSlide(slideIndex);
}, 5000);

function loadLocalFlight() {
  const bookNowBtn = document.getElementById("bookNowBtn");
  bookNowBtn.innerHTML = `
    <div style="background:#fff; border:2px solid #007bff; padding:20px; border-radius:10px;">
      <h3>Flight ${selectedFlight.flightCode}</h3>
      <p><strong>From:</strong> ${selectedFlight.from}</p>
      <p><strong>To:</strong> ${selectedFlight.to}</p>
      <p><strong>Departure Time:</strong> ${selectedFlight.date}, ${selectedFlight.time}</p>
      <p><strong>Aircraft:</strong> ${selectedFlight.aircraft}</p>
      <p><strong>Gate:</strong> ${selectedFlight.gate}</p>
      <p><strong>Status:</strong> ${selectedFlight.status}</p>
      <button onclick="confirmBooking()" class="glow-btn">Book Now</button>
    </div>
  `;
}

function confirmBooking() {
  localStorage.setItem("selectedFlight", JSON.stringify(selectedFlight));
  localStorage.removeItem("bookingInfo");
  window.location.href = "checking.html";
}

function checkBookingStatus() {
  const ref = document.getElementById("bookingRef").value.trim();
  const name = document.getElementById("lastName").value.trim();
  const booking = JSON.parse(localStorage.getItem("bookingInfo"));
  const statusInfo = document.getElementById("statusInfo");

  statusInfo.innerHTML = "";

  if (!ref || !name) {
    statusInfo.innerHTML = `<div style="background:#fff; border:2px solid #d6001c; padding:20px; border-radius:10px; color:#d6001c; font-weight:bold; text-align:center; max-width:500px; margin:20px auto;">❌ Please enter both your reference code and Discord name.</div>`;
    return;
  }

  if (!booking || !booking.referenceCode || !booking.name) {
    statusInfo.innerHTML = `<div style="background:#fff; border:2px solid #d6001c; padding:20px; border-radius:10px; color:#d6001c; font-weight:bold; text-align:center; max-width:500px; margin:20px auto;">❌ No booking found. Try again.</div>`;
    return;
  }

  if (booking.referenceCode !== ref || booking.name.toLowerCase() !== name.toLowerCase()) {
    statusInfo.innerHTML = `<div style="background:#fff; border:2px solid #d6001c; padding:20px; border-radius:10px; color:#d6001c; font-weight:bold; text-align:center; max-width:500px; margin:20px auto;">❌ Invalid reference code or Discord name.</div>`;
    return;
  }

  showTab("status");
  const statusColor =
    selectedFlight.status.includes("On Time") ? "#28a745" :
    selectedFlight.status.includes("Delayed") ? "#ffc107" :
    (selectedFlight.status.includes("Cancelled") || selectedFlight.status.includes("Postponed")) ? "#d6001c" : "#000";

  statusInfo.innerHTML = `
    <div style="background:#fff; border:2px solid #007bff; padding:20px; border-radius:10px; box-shadow:0 0 10px rgba(0,0,0,0.1); max-width:500px; margin:20px auto;">
      <h3>🛫 Flight Status</h3>
      <p><strong>Passenger:</strong> ${booking.name}</p>
      <p><strong>Flight:</strong> ${booking.flightCode}</p>
      <p><strong>From:</strong> ${booking.from}</p>
      <p><strong>To:</strong> ${booking.to}</p>
      <p><strong>Date:</strong> ${booking.date}</p>
      <p><strong>Departure Time:</strong> ${booking.time}</p>
      <p><strong>Gate:</strong> ${booking.gate}</p>
      <p><strong>Seat:</strong> ${booking.seat}</p>
      <p><strong>Baggage:</strong> ${booking.bag}</p>
      <p><strong>Aircraft:</strong> ${booking.aircraft}</p>
      <p><strong>Status:</strong> <span style="color:${statusColor}; font-weight:bold;">${selectedFlight.status}</span></p>
      <p><strong>Reference Code:</strong> <span style="font-weight:bold; color:#d6001c;">${booking.referenceCode}</span></p>
    </div>
  `;
}

const countdownTarget = new Date("2025-10-13T00:00:00");

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownTarget.getTime() - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerHTML = "🎃 Website Updated!";
    document.getElementById("teaser").innerHTML = "🕸️ Halloween Mode Activated!";
    activateHalloweenMode();
    triggerJumpScare();
    clearInterval(timer);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("countdown").innerHTML =
    `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s until Halloween Qantas lands`;
}

function activateHalloweenMode() {
  document.body.classList.remove("black-text");
  document.body.classList.add("red-text");
  document.body.style.backgroundColor = "#1a1a1a";
  document.body.style.fontFamily = "'Creepster', cursive";

  // 🕸️ Removed corner spiderwebs

  const teaser = document.getElementById("teaser");
  if (teaser) {
    teaser.style.color = "orange";
    teaser.style.textShadow = "0 0 10px orange";
    teaser.innerHTML = "🕸️ Halloween Mode Activated!";
  }

  const pumpkinRow = document.createElement("div");
  pumpkinRow.style.fontSize = "40px";
  pumpkinRow.style.marginTop = "20px";
  pumpkinRow.style.textAlign = "center";
  pumpkinRow.innerHTML = "🎃 🎃 🎃 🎃 🎃";
  document.body.appendChild(pumpkinRow);

  const promoImage = document.createElement("div");
  promoImage.style.margin = "30px auto";
  promoImage.style.maxWidth = "600px";
  promoImage.innerHTML = `
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz9vXpQzbFclTFXkWrLF2PIRpacnN9ZU5NzQ&s" alt="Halloween Promo" style="width:100%; border-radius:10px; box-shadow:0 0 20px orange;">
  `;
  document.body.appendChild(promoImage);

  const spider = document.createElement("img");
  
  
  spider.style.position = "fixed";
  spider.style.bottom = "20px";
  spider.style.right = "20px";
  spider.style.width = "80px";
  spider.style.zIndex = "9999";
  spider.style.filter = "drop-shadow(0 0 10px orange)";
  document.body.appendChild(spider);
}

function triggerJumpScare() {
  const scare = document.createElement("div");
  scare.innerHTML = `
    <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:#000; z-index:10000; display:flex; align-items:center; justify-content:center;">
      <img src="https://i.ytimg.com/vi/cD--BFcveeY/maxresdefault.jpg" alt="Scare" style="width:300px; animation: shake 0.5s infinite;">
    </div>
    <style>
      @keyframes shake {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(5deg); }
        50% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
        100% { transform: rotate(0deg); }
      }
    </style>
  `;
  document.body.appendChild(scare);
  setTimeout(() => scare.remove(), 3000);
}

const timer = setInterval(updateCountdown, 1000);

window.onload = function() {
  setTimeout(() => {
    const popup = document.getElementById("newsAlert");
    popup.style.display = "block";
    new Audio("https://www.myinstants.com/media/sounds/airplane-ding.mp3").play();
    startPopupCountdown();
  }, 12500); // 12.5 seconds
};

function closeAlert() {
  document.getElementById("newsAlert").style.display = "none";
}

function startPopupCountdown() {
  const launchDate = new Date();
  launchDate.setMinutes(launchDate.getMinutes() + 5);
  const countdownEl = document.getElementById("countdown-popup");

  const interval = setInterval(() => {
    const now = new Date().getTime();
    const distance = launchDate - now;

    if (distance < 0) {
      clearInterval(interval);
      countdownEl.innerText = "🎉 Launching now!";
    } else {
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      countdownEl.innerText = `⏳ Launching in ${minutes}m ${seconds}s`;
    }
  }, 1000);
}

function snackReact() {
  const snack = document.getElementById("snack").value;
  const reaction = {
    "Hot Cheetos": "🔥 Spicy choice!",
    "Sprite": "🧊 Refreshing!",
    "Roblox Cookies": "🍪 Gamer fuel!",
    "Air Salad": "🥴 You sure about that?"
  };
  document.getElementById("snackReaction").innerText = reaction[snack] || "";
}

document.addEventListener("DOMContentLoaded", () => {
  loadLocalFlight();
  updateCountdown();
});

