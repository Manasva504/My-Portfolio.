// Contact form submission via Web3Forms (https://web3forms.com).
// TODO: paste your real access key into the hidden "access_key" input
// in index.html — this only sends the request, it doesn't need any change here.

// ---------- Toast notifications (replaces native alert()) ----------

function getToastContainer() {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message, type = "success") {
  const container = getToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icon =
    type === "success" ? "fa-circle-check" : "fa-circle-exclamation";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  const dismiss = () => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  };

  toast.querySelector(".toast-close").addEventListener("click", dismiss);
  setTimeout(dismiss, 5000);
}

// ---------- Contact form ----------

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (name === "") {
      showToast("Please enter your name.", "error");
      return;
    }

    if (email === "") {
      showToast("Please enter your email.", "error");
      return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = "Sending...";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      const result = await response.json();

      if (result.success) {
        showToast("Message sent successfully! I'll get back to you soon.", "success");
        form.reset();
      } else {
        showToast("Something went wrong. Please try again later.", "error");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
});

// ---------- Scroll-triggered section reveal ----------

document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
});
