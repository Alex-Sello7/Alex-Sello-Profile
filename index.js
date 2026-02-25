// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease',
  once: true,
  offset: 100
});

// Minimalist loader
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loader').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('loader').style.display = 'none';
    }, 800);
  }, 2000);
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', function() {
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
  item.addEventListener('click', function() {
    navLinks.classList.remove('active');
  });
});

// Active link highlighting
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', function() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// Contact form
const contactForm = document.getElementById('contactForm');
const alert = document.getElementById('alert');
const alertMessage = document.getElementById('alertMessage');

function showAlert(message, type = 'success') {
  alert.className = `alert show alert-${type}`;
  alertMessage.textContent = message;
  alert.style.display = 'flex';
  
  setTimeout(() => {
    closeAlert();
  }, 5000);
}

function closeAlert() {
  alert.classList.remove('show');
  setTimeout(() => {
    alert.style.display = 'none';
  }, 300);
}

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;
  
  if (name && email && message) {
    showAlert('Thank you for your message! I\'ll get back to you soon.', 'success');
    contactForm.reset();
  } else {
    showAlert('Please fill in all fields.', 'error');
  }
});

// ===== CHATBOX FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
  // Get chat elements
  const chatButton = document.getElementById('chatButton');
  const chatContainer = document.getElementById('chatContainer');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');
  const WHATSAPP_NUMBER = '27720786569'; 

  // Check if all chat elements exist
  if (!chatButton || !chatContainer || !chatClose || !chatInput || !chatSend || !chatMessages || !typingIndicator) {
    console.error('Chat elements not found');
    return;
  }

  // Function to add message to chat
  function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
      <div class="message-content">${text}</div>
      <div class="message-time">${timeString}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Function to send message
  function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, 'sent');
    
    // Clear input
    chatInput.value = '';
    
    // Show typing indicator
    typingIndicator.classList.add('active');
    
    // Disable input and send button while "typing"
    chatInput.disabled = true;
    chatSend.disabled = true;
    
    // Simulate typing delay 
    setTimeout(() => {
      // Hide typing indicator
      typingIndicator.classList.remove('active');
      
      // Add auto-reply
      addMessage("Thanks for your message! I'll get back to you shortly. 👋", 'received');
      
      // Re-enable input and send button
      chatInput.disabled = false;
      chatSend.disabled = false;
      chatInput.focus();
      
      // Open WhatsApp with the user's message
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }, 2000);
  }

  // Open chat
  chatButton.addEventListener('click', function(e) {
    e.stopPropagation();
    chatContainer.classList.add('active');
    // Focus on input after chat opens
    setTimeout(() => chatInput.focus(), 300);
  });

  // Close chat
  chatClose.addEventListener('click', function(e) {
    e.stopPropagation();
    chatContainer.classList.remove('active');
  });

  // Send message on button click
  chatSend.addEventListener('click', function(e) {
    e.stopPropagation();
    sendMessage();
  });

  // Send message on Enter key
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });

  // Close chat when clicking outside
  document.addEventListener('click', function(e) {
    if (chatContainer.classList.contains('active')) {
      // Check if click is outside chat container and chat button
      if (!chatContainer.contains(e.target) && !chatButton.contains(e.target)) {
        chatContainer.classList.remove('active');
      }
    }
  });

  // Prevent clicks inside chat from closing it
  chatContainer.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  // Add welcome message with slight delay on page load
  setTimeout(function() {
    if (chatMessages.children.length === 1) { // Only if there's just the initial message
      addMessage("Please note, this feature is still in progress. I'll be adding more functionality soon!", 'received');
    }
  }, 1000);

  // Handle window resize for mobile
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      // Any desktop-specific adjustments if needed
    }
  });

  // Add error handling for WhatsApp URL
  function isValidWhatsAppNumber(number) {
    return /^\d+$/.test(number); // Checks if string contains only digits
  }

  // Validate WhatsApp number on load
  if (!isValidWhatsAppNumber(WHATSAPP_NUMBER)) {
    console.error('Invalid WhatsApp number format');
  }
});