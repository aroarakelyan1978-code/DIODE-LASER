const profile = {
  name: "An Yan",
  brand: "An Yan Diode Laser",
  handle: "@diode_laserr",
  instagramUrl: "https://www.instagram.com/diode_laserr/",
  instagramMessengerUrl: "https://ig.me/m/diode_laserr",
  phoneDisplay: "818-203-8752",
  phoneDial: "+18182038752",
  followers: "711",
  posts: "65",
  highlights: "10",
  category: "Beauty, cosmetic and personal care",
};

const benefits = [
  {
    title: "Long-term results",
    description: "Built for long-term hair reduction.",
  },
  {
    title: "Face and body areas",
    description: "Popular areas are easy to browse.",
  },
  {
    title: "Easy booking",
    description: "Call, text, or book online fast.",
  },
  {
    title: "Clean service flow",
    description: "Simple layout. Clear next steps.",
  },
];

const services = [
  {
    title: "Consultation and booking call",
  },
  {
    title: "Laser appointment",
  },
];

const laserPricing = {
  Women: [
    "Full legs - $70",
    "All hands - $30",
    "Full back - $30",
    "Armpits - $20",
    "Belly - $30",
    "Bikini - $20",
    "Face - $20",
    "Women full body - $150",
  ],
  Men: [
    "Beard - $20",
    "Back of the neck - $30",
    "Both hands - $70",
    "Belly - $55",
    "Back - $55",
  ],
};

const comparisons = [
  {
    laser: "A short series supports long-term reduction.",
    traditional: "Shaving and waxing become a constant routine.",
  },
  {
    laser: "Smoother skin and fewer ingrowns.",
    traditional: "Razor burn and ingrowns are common.",
  },
  {
    laser: "Hair gets finer over time.",
    traditional: "Stubble comes back fast.",
  },
  {
    laser: "Less time spent on upkeep.",
    traditional: "Upkeep keeps coming back every week.",
  },
  {
    laser: "Better for time, comfort, and confidence.",
    traditional: "Razors and wax visits keep costing more.",
  },
];

const whyChooseUs = [
  {
    title: "Long-term reduction",
    description: "Smoother skin over a full plan.",
  },
  {
    title: "Different skin tones",
    description: "Settings are adjusted by client and area.",
  },
  {
    title: "Comfort-focused",
    description: "Clean, direct, professional sessions.",
  },
  {
    title: "Minimal downtime",
    description: "Most clients go right back to their day.",
  },
  {
    title: "Fast contact",
    description: "Phone, text, and Instagram stay easy to reach.",
  },
  {
    title: "Clear pricing",
    description: "Pricing appears right in the booking flow.",
  },
];

const faqs = [
  {
    question: "What is diode laser hair removal?",
    answer:
      "It uses light energy to target the hair follicle and reduce hair growth over a series of sessions.",
  },
  {
    question: "Is diode laser good for different body areas?",
    answer:
      "Yes. It is commonly used for face, underarms, bikini, legs, arms, back, and more.",
  },
  {
    question: "Does diode laser hurt?",
    answer:
      "Most clients describe it as quick heat or small snaps, not the ongoing discomfort of waxing.",
  },
  {
    question: "How many sessions are usually needed?",
    answer:
      "Most clients need a series of sessions. The number depends on the area and hair growth.",
  },
  {
    question: "Can diode laser help reduce ingrown hairs?",
    answer:
      "Yes. Many clients choose it to help reduce ingrowns and shaving irritation over time.",
  },
  {
    question: "Can I book by text?",
    answer:
      "Yes. The booking form opens a ready-to-send text message.",
  },
  {
    question: "Are prices listed online?",
    answer:
      "Yes. Women’s and men’s pricing is listed in the booking flow.",
  },
  {
    question: "Where can clients see more of the work?",
    answer:
      "On Instagram at @diode_laserr.",
  },
];

const benefitsGrid = document.querySelector("#benefits-grid");
const comparisonGrid = document.querySelector("#comparison-grid");
const whyUsList = document.querySelector("#why-us-list");
const faqGrid = document.querySelector("#faq-grid");
const serviceSelect = document.querySelector("#service-select");
const bookingForm = document.querySelector("#booking-form");
const helpForm = document.querySelector("#help-form");
const helpFormFeedback = document.querySelector("#help-form-feedback");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const laserBookingExtra = document.querySelector("#laser-booking-extra");
const clientTypeSelect = document.querySelector("#client-type-select");
const laserAreaLabel = document.querySelector("#laser-area-label");
const laserAreaSelect = document.querySelector("#laser-area-select");
const dateInput = document.querySelector("#date-input");
const timeSelect = document.querySelector("#time-select");
const bookingTimeStatus = document.querySelector("#booking-time-status");

const bookingStorageKey = "an-yan-booked-slots";
const timeSlots = Array.from({ length: 20 }, (_, index) => {
  const totalMinutes = 510 + index * 30;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
});

const formatTimeLabel = (value) => {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const suffix = hourValue >= 12 ? "PM" : "AM";
  const hour = ((hourValue + 11) % 12) + 1;
  return `${hour}:${String(minuteValue).padStart(2, "0")} ${suffix}`;
};

const readBookedSlots = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(bookingStorageKey) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
};

const writeBookedSlots = (slots) => {
  window.localStorage.setItem(bookingStorageKey, JSON.stringify(slots));
};

const markSlotBooked = (date, time) => {
  if (!date || !time) {
    return;
  }

  const slots = readBookedSlots();
  const existingTimes = Array.isArray(slots[date]) ? slots[date] : [];

  if (!existingTimes.includes(time)) {
    slots[date] = [...existingTimes, time].sort();
    writeBookedSlots(slots);
  }
};

const setBookingTimeStatus = (message, isWarning = false) => {
  bookingTimeStatus.textContent = message;
  bookingTimeStatus.classList.toggle("is-warning", isWarning);
};

const setHelpFormFeedback = (message) => {
  if (!helpFormFeedback) {
    return;
  }

  helpFormFeedback.textContent = message;
  helpFormFeedback.hidden = !message;
};

const renderTimeOptions = (dateValue) => {
  const currentValue = timeSelect.value;

  if (!dateValue) {
    timeSelect.innerHTML = '<option value="">Select date first</option>';
    timeSelect.disabled = true;
    setBookingTimeStatus("Choose a date to see available time slots.");
    return;
  }

  const bookedSlots = new Set(readBookedSlots()[dateValue] || []);
  timeSelect.innerHTML = '<option value="">Select time</option>';

  timeSlots.forEach((slot) => {
    const option = document.createElement("option");
    const isBooked = bookedSlots.has(slot);
    option.value = slot;
    option.textContent = `${formatTimeLabel(slot)}${isBooked ? " — Booked" : ""}`;
    option.disabled = isBooked;
    timeSelect.appendChild(option);
  });

  timeSelect.disabled = false;

  if (currentValue && !bookedSlots.has(currentValue)) {
    timeSelect.value = currentValue;
  }

  if (bookedSlots.size >= timeSlots.length) {
    timeSelect.value = "";
    setBookingTimeStatus("That day is fully booked.", true);
    return;
  }

  if (bookedSlots.size > 0) {
    setBookingTimeStatus("Booked times are marked unavailable for that day.");
    return;
  }

  setBookingTimeStatus("");
};

if (siteHeader && menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    siteHeader.classList.toggle("nav-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteHeader.classList.remove("nav-open");
    });
  });
}

benefits.forEach((item) => {
  const card = document.createElement("article");
  card.className = "benefit-card";
  card.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.description}</p>
  `;
  benefitsGrid.appendChild(card);
});

services.forEach((service) => {
  const option = document.createElement("option");
  option.value = service.title;
  option.textContent = service.title;
  serviceSelect.appendChild(option);
});

const resetLaserBookingFields = () => {
  clientTypeSelect.value = "";
  laserAreaSelect.innerHTML = '<option value="">Select area</option>';
  laserAreaLabel.hidden = true;
};

const renderLaserAreaOptions = (clientType) => {
  const options = laserPricing[clientType] || [];
  laserAreaSelect.innerHTML = '<option value="">Select area</option>';

  options.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    laserAreaSelect.appendChild(option);
  });
};

const syncLaserBookingFields = () => {
  const isLaserAppointment = serviceSelect.value === "Laser appointment";
  laserBookingExtra.hidden = !isLaserAppointment;

  if (!isLaserAppointment) {
    resetLaserBookingFields();
    return;
  }

  const clientType = clientTypeSelect.value;
  const hasClientPricing = Boolean(laserPricing[clientType]);

  laserAreaLabel.hidden = !hasClientPricing;

  if (hasClientPricing) {
    const currentValue = laserAreaSelect.value;
    renderLaserAreaOptions(clientType);
    if (laserPricing[clientType].includes(currentValue)) {
      laserAreaSelect.value = currentValue;
    }
  } else {
    laserAreaSelect.innerHTML = '<option value="">Select area</option>';
    laserAreaSelect.value = "";
  }
};

serviceSelect.addEventListener("change", () => {
  syncLaserBookingFields();
});

clientTypeSelect.addEventListener("change", () => {
  syncLaserBookingFields();
});

syncLaserBookingFields();

if (dateInput && timeSelect && bookingTimeStatus) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
  renderTimeOptions(dateInput.value);

  dateInput.addEventListener("change", () => {
    renderTimeOptions(dateInput.value);
  });
}

const comparisonHeader = document.createElement("div");
comparisonHeader.className = "comparison-header";
comparisonHeader.innerHTML = `
  <div class="comparison-title comparison-title-laser">Diode Laser</div>
  <div class="comparison-title comparison-title-traditional">Waxing &amp; Shaving</div>
`;
comparisonGrid.appendChild(comparisonHeader);

comparisons.forEach((item) => {
  const row = document.createElement("div");
  row.className = "comparison-row";
  row.innerHTML = `
    <article class="comparison-cell comparison-cell-laser">
      <span class="comparison-mark comparison-mark-positive" aria-hidden="true"></span>
      <p>${item.laser}</p>
    </article>
    <article class="comparison-cell comparison-cell-traditional">
      <span class="comparison-mark comparison-mark-negative" aria-hidden="true"></span>
      <p>${item.traditional}</p>
    </article>
  `;
  comparisonGrid.appendChild(row);
});

whyChooseUs.forEach((item) => {
  const row = document.createElement("article");
  row.className = "why-us-item";
  row.innerHTML = `
    <p><strong>${item.title}:</strong> ${item.description}</p>
  `;
  whyUsList.appendChild(row);
});

faqs.forEach((item, index) => {
  const card = document.createElement("article");
  card.className = "faq-item";
  card.innerHTML = `
    <button class="faq-trigger" type="button" aria-expanded="false">
      <span class="faq-question">${index + 1}. ${item.question}</span>
      <span class="faq-icon" aria-hidden="true"></span>
    </button>
    <div class="faq-panel" hidden>
      <p>${item.answer}</p>
    </div>
  `;
  faqGrid.appendChild(card);
});

const faqTriggers = Array.from(document.querySelectorAll(".faq-trigger"));

faqTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";

    faqTriggers.forEach((itemTrigger) => {
      itemTrigger.setAttribute("aria-expanded", "false");
      const panel = itemTrigger.nextElementSibling;
      if (panel) {
        panel.hidden = true;
      }
    });

    if (!isOpen) {
      trigger.setAttribute("aria-expanded", "true");
      const panel = trigger.nextElementSibling;
      if (panel) {
        panel.hidden = false;
      }
    }
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const name = (formData.get("name") || "").toString().trim();
  const service = (formData.get("service") || "").toString().trim();
  const clientType = (formData.get("clientType") || "").toString().trim();
  const laserArea = (formData.get("laserArea") || "").toString().trim();
  const date = (formData.get("date") || "").toString().trim();
  const time = (formData.get("time") || "").toString().trim();

  if (service === "Laser appointment" && !clientType) {
    clientTypeSelect.focus();
    return;
  }

  if (service === "Laser appointment" && !laserArea) {
    laserAreaSelect.focus();
    return;
  }

  if (!date) {
    dateInput.focus();
    return;
  }

  if (!time) {
    timeSelect.focus();
    return;
  }

  const bookedSlots = new Set(readBookedSlots()[date] || []);
  if (bookedSlots.has(time)) {
    setBookingTimeStatus(`${formatTimeLabel(time)} is booked for that day.`, true);
    renderTimeOptions(date);
    timeSelect.focus();
    return;
  }

  const messageLines = [
    `Hi ${profile.name}, I found your website and would like to book an appointment.`,
    `Name: ${name || "Not provided"}`,
    `Appointment type: ${service || "Not selected"}`,
    `Preferred date: ${date || "Flexible"}`,
    `Preferred time: ${time || "Flexible"}`,
  ];

  if (service === "Laser appointment") {
    messageLines.splice(
      3,
      0,
      `Client type: ${clientType || "Not selected"}`,
      `Laser area: ${laserArea || "Not selected"}`,
    );
  }

  markSlotBooked(date, time);
  renderTimeOptions(date);

  const message = encodeURIComponent(messageLines.join("\n"));
  const smsUrl = `sms:${profile.phoneDial}?body=${message}`;
  window.location.href = smsUrl;
});

if (helpForm) {
  const helpSubmitButton = helpForm.querySelector('button[type="submit"]');
  const defaultHelpButtonLabel = helpSubmitButton ? helpSubmitButton.textContent.trim() : "";

  helpForm.addEventListener("input", () => {
    setHelpFormFeedback("");
  });

  helpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(helpForm);
    const name = (formData.get("name") || "").toString().trim();
    const mobile = (formData.get("mobile") || "").toString().trim();
    const note = (formData.get("note") || "").toString().trim();
    if (!name) {
      helpForm.querySelector('input[name="name"]')?.focus();
      return;
    }

    if (!mobile) {
      helpForm.querySelector('input[name="mobile"]')?.focus();
      return;
    }

    if (!note) {
      helpForm.querySelector('textarea[name="note"]')?.focus();
      return;
    }

    if (helpSubmitButton) {
      helpSubmitButton.disabled = true;
      helpSubmitButton.textContent = "Sending...";
    }

    fetch("/api/help-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        mobile,
        note,
        consent: true,
      }),
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || "Unable to send your message right now.");
        }

        helpForm.reset();
        setHelpFormFeedback("");

        if (helpSubmitButton) {
          helpSubmitButton.textContent = "Sent";
          window.setTimeout(() => {
            helpSubmitButton.textContent = defaultHelpButtonLabel;
          }, 1800);
        }
      })
      .catch((error) => {
        const message =
          error && typeof error.message === "string" && error.message
            ? error.message
            : "Unable to send your message right now. Please call or text instead.";
        setHelpFormFeedback(message);

        if (helpSubmitButton) {
          helpSubmitButton.textContent = defaultHelpButtonLabel;
        }
      })
      .finally(() => {
        if (helpSubmitButton) {
          helpSubmitButton.disabled = false;
        }
      });
  });
}
