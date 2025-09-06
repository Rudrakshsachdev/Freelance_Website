// script.js

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initSmoothScrolling();
  initAnimations();
  initPortfolioFilter();
  initContactForm();
  initBackToTop();
  initParticles();
  initScrollIndicator();
  initServiceCardAnimations();
  initPriceCardInteractions();
  initTestimonialsCarousel();
  initScrollProgress();
});

// Initialize navigation functionality (mobile menu, sticky header)
function initNavigation() {
  const header = document.querySelector(".header");
  const menuBtn = document.querySelector(".menu-btn");
  const navLinks = document.querySelector(".nav-links");

  // Toggle mobile menu
  menuBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  });

  // Sticky header on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Initialize animations with Intersection Observer
function initAnimations() {
  const animatedElements = document.querySelectorAll(
    ".service-card, .price-card, .portfolio-card, .step, .feature"
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach((element) => {
    observer.observe(element);
  });
}

// Initialize portfolio filtering
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      // Filter portfolio items
      portfolioItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.classList.remove("hide");
          setTimeout(() => {
            item.style.display = "block";
          }, 300);
        } else {
          item.classList.add("hide");
          setTimeout(() => {
            item.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

// Initialize contact form submission with validation and AJAX

function initContactForm() {
  const contactForm = document.getElementById('projectForm');

  if (!contactForm) return;

  contactForm.style.display = 'block';

  // Helper: get CSRF token from form or cookie
  function getCSRFToken() {
    const tokenFromForm = contactForm.querySelector('input[name="csrfmiddlewaretoken"]');
    if (tokenFromForm) return tokenFromForm.value;

    const match = document.cookie.match(/(^|; )csrftoken=([^;]+)/);
    return match ? decodeURIComponent(match[2]) : null;
  }

  contactForm.addEventListener('submit', async function(e) {
   // e.preventDefault();

    const nameInput = this.querySelector('input[name="name"]');
    const emailInput = this.querySelector('input[name="email"]');
    const phoneInput = this.querySelector('input[name="phone"]');
    const serviceInput = this.querySelector('select[name="service"]');
    const messageInput = this.querySelector('textarea[name="message"]');

    let isValid = true;

    // Clear previous errors
    this.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    this.querySelectorAll('.error-message').forEach(el => el.remove());

    // Validation
    if (!nameInput.value.trim()) { showError(nameInput, 'Please enter your name'); isValid=false; }
    if (!emailInput.value.trim()) { showError(emailInput, 'Please enter your email'); isValid=false; }
    else if (!isValidEmail(emailInput.value)) { showError(emailInput, 'Please enter a valid email'); isValid=false; }
    if (!serviceInput.value) { showError(serviceInput, 'Please select a service'); isValid=false; }
    if (!messageInput.value.trim()) { showError(messageInput, 'Please enter your message'); isValid=false; }

    if (!isValid) return;

    // Loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action || window.location.href, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRFToken': getCSRFToken(),
        },
        body: formData,
        credentials: 'same-origin'
      });

      let data;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // fallback if non-JSON returned
        const text = await response.text();
        try { data = JSON.parse(text); } 
        catch { data = { success: response.ok, message: text || 'Server error' }; }
      }

      if (response.ok && data.success) {
        showNotification(data.message || 'Message sent successfully!', 'success');
        contactForm.reset();
      } else {
        showNotification(data.message || 'Failed to send message.', 'error');
      }

    } catch (err) {
      console.error(err);
      showNotification('An unexpected error occurred. Please try again.', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}




// Show error message for form fields
function showError(input, message) {
  input.classList.add("error");

  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.style.color = "#f94144";
  errorDiv.style.fontSize = "0.875rem";
  errorDiv.style.marginTop = "0.25rem";
  errorDiv.innerHTML = message;

  input.parentNode.appendChild(errorDiv);
}

// Validate email format
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Show notification
function showNotification(message, type = "success") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${
        type === "success" ? "check-circle" : "exclamation-circle"
      }"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Add styles
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.padding = "1rem 1.5rem";
  notification.style.backgroundColor =
    type === "success" ? "#4cc9f0" : "#f94144";
  notification.style.color = "white";
  notification.style.borderRadius = "0.5rem";
  notification.style.boxShadow =
    "0 10px 25px rgba(0, 0, 0, 0.1), 0 5px 10px rgba(0, 0, 0, 0.05)";
  notification.style.display = "flex";
  notification.style.alignItems = "center";
  notification.style.justifyContent = "space-between";
  notification.style.gap = "1rem";
  notification.style.zIndex = "9999";
  notification.style.maxWidth = "400px";
  notification.style.transform = "translateX(100%)";
  notification.style.transition = "transform 0.3s ease";

  // Add close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      notification.remove();
    }, 300);
  });

  // Add to document
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
}

// Initialize back to top button
function initBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

// Initialize particles.js
function initParticles() {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#4361ee",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#4361ee",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 140,
            line_linked: {
              opacity: 1,
            },
          },
          push: {
            particles_nb: 4,
          },
        },
      },
      retina_detect: true,
    });
  }
}

// Initialize scroll indicator
function initScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollIndicator.style.opacity = "0";
        scrollIndicator.style.visibility = "hidden";
      } else {
        scrollIndicator.style.opacity = "1";
        scrollIndicator.style.visibility = "visible";
      }
    });
  }
}

// Initialize service card animations
function initServiceCardAnimations() {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Initialize price card interactions
function initPriceCardInteractions() {
  const priceCards = document.querySelectorAll(".price-card");

  priceCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Remove featured class from all cards
      priceCards.forEach((c) => c.classList.remove("featured"));

      // Add featured class to clicked card
      card.classList.add("featured");

      // Scroll to contact section
      document.querySelector("#contact").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

// Initialize testimonials carousel
function initTestimonialsCarousel() {
  // This is a placeholder for a testimonials carousel
  // In a real implementation, you would fetch testimonials from an API or database
  // and display them in a rotating carousel
  console.log("Testimonials carousel would be initialized here");
}

// Initialize scroll progress indicator
function initScrollProgress() {
  // Create scroll progress bar
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.style.position = "fixed";
  progressBar.style.top = "0";
  progressBar.style.left = "0";
  progressBar.style.height = "4px";
  progressBar.style.width = "0%";
  progressBar.style.backgroundColor = "#4361ee";
  progressBar.style.zIndex = "9999";
  progressBar.style.transition = "width 0.2s ease";

  document.body.appendChild(progressBar);

  // Update progress on scroll
  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

    progressBar.style.width = scrollPercent + "%";
  });
}

// Utility function for debouncing
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Add CSS for animations and other dynamic styles
function injectDynamicStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* Animation classes */
    .animate-in {
      animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Stagger animations for child elements */
    .service-cards .service-card:nth-child(1) { animation-delay: 0.1s; }
    .service-cards .service-card:nth-child(2) { animation-delay: 0.2s; }
    .service-cards .service-card:nth-child(3) { animation-delay: 0.3s; }
    .service-cards .service-card:nth-child(4) { animation-delay: 0.4s; }
    
    .price-card:nth-child(1) { animation-delay: 0.1s; }
    .price-card:nth-child(2) { animation-delay: 0.2s; }
    .price-card:nth-child(3) { animation-delay: 0.3s; }
    
    .step:nth-child(1) { animation-delay: 0.1s; }
    .step:nth-child(2) { animation-delay: 0.2s; }
    .step:nth-child(3) { animation-delay: 0.3s; }
    .step:nth-child(4) { animation-delay: 0.4s; }
    .step:nth-child(5) { animation-delay: 0.5s; }
    .step:nth-child(6) { animation-delay: 0.6s; }
    
    /* Mobile menu styles */
    .nav-links {
      transition: transform 0.3s ease;
    }
    
    @media (max-width: 768px) {
      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 70%;
        height: 100vh;
        background: white;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        box-shadow: -5px 0 25px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }
      
      .nav-links.active {
        right: 0;
        transform: translateX(0);
      }
      
      .no-scroll {
        overflow: hidden;
      }
    }
    
    /* Form error styles */
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
      border-color: #f94144;
    }
    
    /* Portfolio filter transition */
    .portfolio-item {
      transition: all 0.3s ease;
    }
    
    .portfolio-item.hide {
      opacity: 0;
      transform: scale(0.8);
    }
  `;

  document.head.appendChild(style);
}

// Inject dynamic styles when DOM is loaded
document.addEventListener("DOMContentLoaded", injectDynamicStyles);
