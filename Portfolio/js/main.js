// AOS init
AOS.init({
  duration: 700,
  once: true
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Dynamic year for footer
document.getElementById("yr").textContent = new Date().getFullYear();
