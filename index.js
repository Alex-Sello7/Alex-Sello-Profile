// ========== LOADER (outside DOMContentLoaded so window load fires in time) ==========
(function() {
  function getEl(id) { return document.getElementById(id); }

  let pct = 0;
  const interval = setInterval(() => {
    if (pct < 100) {
      pct = Math.min(pct + Math.random() * 8 + 2, 100);
      const loaderPct = getEl('loaderPct');
      const loaderBar = getEl('loaderBar');
      if (loaderPct) loaderPct.textContent = Math.floor(pct) + '%';
      if (loaderBar) loaderBar.style.width = pct + '%';
    }
  }, 80);

  function hideLoader() {
    clearInterval(interval);
    const loaderPct = getEl('loaderPct');
    const loaderBar = getEl('loaderBar');
    const loadingScreen = getEl('loadingScreen');
    if (loaderPct) loaderPct.textContent = '100%';
    if (loaderBar) loaderBar.style.width = '100%';
    setTimeout(() => {
      if (loadingScreen) loadingScreen.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 500);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  setTimeout(() => {
    const loadingScreen = getEl('loadingScreen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
      hideLoader();
    }
  }, 4000);
})();

document.addEventListener('DOMContentLoaded', () => {

  // ========== SCROLL PROGRESS BAR ==========
  const progressBar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';
  });

  // ========== DOT NAVIGATION ==========
  const sections = document.querySelectorAll('section[id]');
  const dots = document.querySelectorAll('.dot');
  
  function updateActiveDot() {
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 150;
      if (window.scrollY >= secTop) current = sec.getAttribute('id');
    });
    dots.forEach(dot => {
      dot.classList.remove('active');
      if (dot.getAttribute('href') === `#${current}`) dot.classList.add('active');
    });
  }
  
  window.addEventListener('scroll', updateActiveDot);
  updateActiveDot();

  // ========== TYPING ANIMATION ==========
  const roles = ['Full Stack Developer', 'UI Engineer', 'Problem Solver', 'Freelancer'];
  let roleIndex = 0, charIndex = 0;
  const typingEl = document.getElementById('typingText');
  
  function typeRole() {
    if (!typingEl) return;
    if (charIndex < roles[roleIndex].length) {
      typingEl.textContent += roles[roleIndex].charAt(charIndex);
      charIndex++;
      setTimeout(typeRole, 100);
    } else {
      setTimeout(() => {
        let deleteInterval = setInterval(() => {
          if (charIndex === 0) {
            clearInterval(deleteInterval);
            roleIndex = (roleIndex + 1) % roles.length;
            typeRole();
          } else {
            typingEl.textContent = roles[roleIndex].substring(0, charIndex - 1);
            charIndex--;
          }
        }, 50);
      }, 2000);
    }
  }
  if (typingEl) typeRole();

  // ========== COUNT-UP ANIMATION ==========
  const countups = document.querySelectorAll('.countup');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 30);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  countups.forEach(c => countObserver.observe(c));

  // ========== AOD — ANIMATE ON DEMAND ENGINE ==========
  const aodElements = document.querySelectorAll('[data-aod]');
  const aodObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.aodDelay || 0);
        setTimeout(() => el.classList.add('aod-visible'), delay);
        aodObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  aodElements.forEach(el => aodObserver.observe(el));

  // Legacy story-reveal still works
  const storyBlocks = document.querySelectorAll('[data-story-reveal]');
  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('revealed');
    });
  }, { threshold: 0.2 });
  storyBlocks.forEach(block => storyObserver.observe(block));

  // ========== INTERACTIVE SKILL ORBIT — ENHANCED ==========
  const skillsData = [
    { name: 'HTML5',       desc: 'Semantic, accessible markup',      icon: '🌐', color: '#e44d26' },
    { name: 'CSS3',        desc: 'Animations, Grid, Flexbox',        icon: '🎨', color: '#264de4' },
    { name: 'JavaScript',  desc: 'ES6+, DOM, Async/Await',           icon: '⚡', color: '#f7df1e' },
    { name: 'React',       desc: 'Hooks, State, Components',         icon: '⚛️',  color: '#61dafb' },
    { name: 'Node.js',     desc: 'REST APIs, Express, Auth',         icon: '🟢', color: '#68a063' },
    { name: 'Bootstrap',   desc: 'Rapid responsive layouts',         icon: '🅱️',  color: '#7952b3' },
    { name: 'SQL',         desc: 'Queries, Joins, Data Analysis',    icon: '🗄️',  color: '#00758f' },
    { name: 'Git',         desc: 'Version control, GitHub flows',    icon: '🔀', color: '#f05032' },
    { name: 'WordPress',   desc: 'Themes, Plugins, CMS',             icon: '📝', color: '#21759b' }
  ];

  const orbitRing = document.getElementById('orbitRing');
  if (orbitRing) {
    const container = document.getElementById('orbitContainer');
    let lines = [];

    function getRadius() {
      const w = container?.offsetWidth || 500;
      return Math.min(210, w * 0.42);
    }

    // Draw SVG connector lines from center to each skill
    function drawLines(r) {
      lines.forEach(l => l.remove());
      lines = [];
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible;';
      const cx = (container?.offsetWidth || 500) / 2;
      const cy = (container?.offsetHeight || 500) / 2;
      skillsData.forEach((skill, i) => {
        const angle = (i / skillsData.length) * Math.PI * 2 - Math.PI / 2;
        const x2 = cx + Math.cos(angle) * r;
        const y2 = cy + Math.sin(angle) * r;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx); line.setAttribute('y1', cy);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        line.setAttribute('stroke', skill.color || 'rgba(0,180,216,0.3)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-opacity', '0.25');
        line.setAttribute('stroke-dasharray', '4 4');
        svg.appendChild(line);
        lines.push(line);
      });
      orbitRing.parentElement.appendChild(svg);
      lines.push(svg);
    }

    function buildOrbit() {
      // Clear existing
      orbitRing.innerHTML = '';
      const r = getRadius();
      drawLines(r);

      skillsData.forEach((skill, i) => {
        const angle = (i / skillsData.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        const div = document.createElement('div');
        div.className = 'orbit-skill';
        div.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        div.style.setProperty('--skill-color', skill.color || 'var(--cyan)');
        div.innerHTML = `
          <div class="orbit-skill-icon">${skill.icon}</div>
          <strong>${skill.name}</strong>
          <small>${skill.desc}</small>`;

        // Hover: highlight matching line
        div.addEventListener('mouseenter', () => {
          const svgEl = orbitRing.parentElement.querySelector('svg');
          if (svgEl) {
            const lineEls = svgEl.querySelectorAll('line');
            if (lineEls[i]) {
              lineEls[i].setAttribute('stroke-opacity', '0.9');
              lineEls[i].setAttribute('stroke-width', '2');
            }
          }
        });
        div.addEventListener('mouseleave', () => {
          const svgEl = orbitRing.parentElement.querySelector('svg');
          if (svgEl) {
            const lineEls = svgEl.querySelectorAll('line');
            if (lineEls[i]) {
              lineEls[i].setAttribute('stroke-opacity', '0.25');
              lineEls[i].setAttribute('stroke-width', '1');
            }
          }
        });

        orbitRing.appendChild(div);
      });
    }

    buildOrbit();
    setTimeout(buildOrbit, 300);
    window.addEventListener('resize', () => setTimeout(buildOrbit, 100));
  }

  // ========== TIMELINE ANIMATION ==========
  const timelineItems = document.querySelectorAll('[data-timeline]');
  const timelineLine = document.getElementById('timelineLine');
  
  function updateTimeline() {
    let visibleCount = 0;
    timelineItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        item.classList.add('visible');
        visibleCount++;
      }
    });
    if (timelineLine) {
      const percent = (visibleCount / timelineItems.length) * 100;
      timelineLine.style.height = percent + '%';
    }
  }
  
  window.addEventListener('scroll', updateTimeline);
  updateTimeline();

  // ========== FLIP CARDS ==========
  const flipCards = document.querySelectorAll('[data-flip]');
  flipCards.forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });

  // ========== MAGNETIC BUTTONS ==========
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
  });

  // ========== HERO CANVAS ==========
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let W, H, mouseX = 0.5, mouseY = 0.5;
    
    function resizeHero() {
      W = heroCanvas.width = heroCanvas.offsetWidth;
      H = heroCanvas.height = heroCanvas.offsetHeight;
    }
    
    window.addEventListener('resize', resizeHero);
    resizeHero();
    
    const heroParent = heroCanvas.parentElement;
    if (heroParent) {
      heroParent.addEventListener('mousemove', (e) => {
        const rect = heroCanvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / W;
        mouseY = (e.clientY - rect.top) / H;
      });
    }
    
    function drawHero() {
      if (!ctx || !W || !H) {
        requestAnimationFrame(drawHero);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#020a14');
      grad.addColorStop(0.5, '#050f1c');
      grad.addColorStop(1, '#030810');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      
      for (let i = 0; i < 80; i++) {
        ctx.beginPath();
        const angle = Date.now() * 0.001 + i;
        const x = (Math.sin(angle) * 0.5 + 0.5) * W;
        const y = (Math.cos(angle * 0.7) * 0.5 + 0.5) * H;
        const offsetX = (mouseX - 0.5) * 60;
        const offsetY = (mouseY - 0.5) * 60;
        ctx.arc(x + offsetX, y + offsetY, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,216,${0.2 + Math.sin(angle) * 0.1})`;
        ctx.fill();
      }
      requestAnimationFrame(drawHero);
    }
    drawHero();
  }

  // ========== SECTION CANVAS BACKGROUNDS ==========
  const sectionIds = ['about', 'skills', 'experience', 'education', 'certificates'];
  
  sectionIds.forEach(sectionId => {
    const canvas = document.getElementById(`${sectionId}Canvas`);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    
    function resizeSection() {
      const parent = canvas.parentElement;
      if (parent) {
        const rect = parent.getBoundingClientRect();
        W = canvas.width = rect.width || parent.offsetWidth || window.innerWidth;
        H = canvas.height = rect.height || parent.offsetHeight || 500;
      }
    }
    
    window.addEventListener('resize', resizeSection);
    // Try immediately, then retry after layout settles
    resizeSection();
    setTimeout(resizeSection, 200);
    setTimeout(resizeSection, 800);
    
    let time = 0;
    const isLight = sectionId === 'about' || sectionId === 'experience' || sectionId === 'certificates';
    
    function drawSection() {
      // Re-check size if still 0
      if (!W || !H) { resizeSection(); }
      if (!ctx || !W || !H) {
        requestAnimationFrame(drawSection);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      
      ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.9)' : 'rgba(6, 13, 22, 0.9)';
      ctx.fillRect(0, 0, W, H);
      
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const yOffset = Math.sin(time * 0.5 + i) * 25;
        for (let x = 0; x <= W; x += 20) {
          const y = H * (0.3 + i * 0.1) + Math.sin(x * 0.008 + time + i) * 35 + yOffset;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = isLight
          ? `rgba(0, 119, 182, ${0.06 + i * 0.02})`
          : `rgba(0, 180, 216, ${0.08 + i * 0.02})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      
      time += 0.015;
      requestAnimationFrame(drawSection);
    }
    
    drawSection();
  });

  // ========== AI CHAT ASSISTANT — Claude-powered ==========
  const chatButton = document.getElementById('chatButton');
  const chatContainer = document.getElementById('chatContainer');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const typingIndicator = document.getElementById('typingIndicator');

    const ALEX_CONTEXT = `You are Alex Sello's personal AI assistant, embedded in his interactive CV website. Your job is to answer ANY question a visitor, recruiter, or potential client might ask about Alex — naturally, warmly, and confidently, as if you know him personally.

TONE: Conversational, friendly, enthusiastic about Alex's work. Never robotic. Use natural language, not bullet lists unless specifically listing things.

RESPONSE LENGTH: Keep it concise — 2 to 5 sentences is ideal. If someone asks a simple factual question like "what's his phone number", just give the answer directly. Don't over-explain.

IMPORTANT — HANDLE THESE QUESTION TYPES NATURALLY:
- "Who is Alex?" / "Tell me about Alex" → Give a warm 3-4 sentence intro covering who he is, what he does, where he's from, and what makes him stand out.
- "What is Alex's last name?" → His last name is Sello. Full name: Alex Thabo Sello.
- "What is his phone number?" / "How do I call him?" → 072 078 6569
- "What is his email?" → atsello4@gmail.com
- "Where is he from?" / "Where does he live?" → Pretoria, South Africa (specifically Ga-Rankuwa)
- "What social media is he on?" / "Where can I find him online?" → GitHub (github.com/Alex-Sello7) and LinkedIn (linkedin.com/in/alex-sello). He's most active on GitHub.
- "How good is he?" / "Is he skilled?" / "How good is his design?" / "Can he build good websites?" → Speak confidently and specifically about his skills, highlight real evidence like projects delivered, distinctions earned, and the quality of this very CV site as proof.
- "Is he available?" / "Can I hire him?" → Yes, he's actively open to freelance and full-time opportunities.
- "What does he charge?" / "How much does he cost?" → That's best discussed directly with Alex — contact him at atsello4@gmail.com or 072 078 6569.
- "How old is he?" → Born 7 April 1995, so he's 30 years old.
- Questions about his CV or this website → This site itself is one of his projects — built entirely from scratch with Vanilla JS, Canvas API, CSS animations, and no frameworks. It's proof of his frontend ability.

EVERYTHING YOU KNOW ABOUT ALEX:

IDENTITY:
- Full name: Alex Thabo Sello
- Date of birth: 7 April 1995 (age 30)
- Location: Pretoria, Ga-Rankuwa, South Africa
- Student number at UNISA: 6231-625-7

CONTACT:
- Phone: 072 078 6569
- Email: atsello4@gmail.com
- GitHub: github.com/Alex-Sello7
- LinkedIn: linkedin.com/in/alex-sello

WHAT HE DOES:
Alex is a Front End Developer and final-year IT student who builds responsive, production-ready web interfaces. He's particularly strong at translating client requirements into clean, maintainable code. He works independently, manages multiple projects, and consistently meets deadlines without needing hand-holding.

HIS STRENGTHS & QUALITY:
- His code is clean, modular, and structured — he builds reusable component libraries, not messy spaghetti code
- He has a genuine eye for design — spacing, typography, layout hierarchy, and interaction flow are things he actively refines
- He does mobile-first design with systematic cross-browser testing before every deployment
- He's delivered 12+ websites for real clients, which means he knows how to handle real-world requirements, feedback, and revisions
- Several of his UNISA modules were passed with distinction — showing academic rigour alongside practical skills
- This interactive CV website itself is evidence of his ability: Canvas API animations, a skill orbit, scroll-triggered storytelling, a working AI assistant, case study modals, and a recruiter mode — all in Vanilla JS with zero frameworks

TECHNICAL SKILLS:
- Frontend: HTML5, CSS3, JavaScript ES6+, Bootstrap, React (basics — component structure, hooks, state)
- Backend: Node.js, Express, REST APIs
- Databases: SQL (certified), basic MongoDB
- Tools: Git & GitHub, VS Code, WordPress (certified), SQL Server Management Studio, Microsoft 365
- Practices: Responsive/mobile-first design, reusable UI components, cross-browser compatibility testing, clean code & maintainability, structured Git workflows, Agile basics

EXPERIENCE:
1. Freelance Web Developer — Self-employed (February 2024 – Present)
   - Delivered 12+ responsive websites for small businesses
   - Increased cross-device reliability with mobile-first design and cross-browser testing
   - Built reusable UI component libraries, reducing revision cycles
   - Managed multiple concurrent projects independently, meeting deadlines
   - Decreased revision cycles by carefully interpreting stakeholder scope documents
   - Enhanced UX through spacing, typography, layout hierarchy, and interaction flow
   - Tech stack: HTML5, CSS3, JavaScript ES6+, Bootstrap, Git, WordPress

2. Sales Assistant — Street Fever (October 2018 – December 2019)
   - Fast-paced retail: client communication, transaction handling, stock management
   - Developed strong communication and problem-solving skills

EDUCATION:
1. Diploma in Information Technology — UNISA (2022 – Present)
   - 216 out of 360 credits completed — NQF Level 6
   - Modules passed with DISTINCTION: Business Management (80%), Ethical ICT (76%), Network Technical Skills (75%), Interactive Programming (82%)
   - All other modules: Web Design, Databases, Systems Analysis, Object-Oriented Analysis, Business Informatics I/II/III, GUI Programming, Workstation Skills
   - Qualification is in progress — expected to complete remaining 144 credits

2. National Senior Certificate — Modiri Secondary School (December 2013)
   - Subjects: Mathematics, Physical Science, Life Science, Geography

CERTIFICATIONS (all verified):
- Full Stack Web Development Bootcamp — Udemy (HTML, CSS, JS, React, Node, Express, MongoDB)
- Full Stack Web Development — FNB App Academy (industry-aligned programme)
- SQL for Data Analysis — Simplilearn
- WordPress Development — Simplilearn

PROJECTS:
1. Cascade Creations — https://alex-sello7.github.io/CascadeMainWebsite/
   - Responsive single-page business website built from scratch
   - Reusable UI sections, mobile-first, consistent design patterns

2. Seamless Travel Revamp — https://alex-sello7.github.io/Seamless-Travel/
   - Full layout redesign, improved visual hierarchy and usability
   - Cross-browser tested, structured CSS organisation

3. Interactive Storytelling CV (this site — the one you're on right now)
   - Built entirely from scratch: Canvas API animations, skill orbit with SVG connector lines
   - Scroll-triggered AOD animations, case study modals, recruiter mode, AI assistant
   - Zero frameworks — pure HTML, CSS, Vanilla JavaScript

PERSONALITY & WORK STYLE:
- Self-driven and works well independently without supervision
- Detail-oriented — sweats the small stuff like pixel spacing and interaction timing
- Communicates clearly with clients and interprets briefs carefully before building
- Passionate about the craft — this CV site is something he built in his own time to stand out

AVAILABILITY: Actively open to freelance projects and full-time employment opportunities.

If asked something genuinely not covered above (like his hobbies or personal opinions), be honest that you don't have that info and suggest they reach out to Alex directly via email or phone.`;

  const chatHistory = [];

  function addMessage(text, type) {
    const div = document.createElement('div');
    div.classList.add('message', type);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    div.innerHTML = `<div class="message-content">${text}</div><div class="message-time">${time}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function getAIResponse(userMessage) {
    chatHistory.push({ role: 'user', content: userMessage });

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: ALEX_CONTEXT,
          messages: chatHistory
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Try again!";
      chatHistory.push({ role: 'assistant', content: reply });
      return reply;

    } catch (err) {
      // Fallback keyword responses if API is unavailable
      const lower = userMessage.toLowerCase();

      // Identity & personal
      if (lower.includes('who is') || lower.includes('tell me about') || lower.includes('introduce'))
        return "Alex Thabo Sello is a Front End Developer and IT student from Pretoria, South Africa. He builds responsive, production-ready websites and has delivered 12+ projects for real clients. He's currently studying for a Diploma in IT at UNISA and is open to freelance and full-time work.";
      if (lower.includes('last name') || lower.includes('surname') || lower.includes('full name'))
        return "His full name is Alex Thabo Sello. Last name: Sello.";
      if (lower.includes('age') || lower.includes('born') || lower.includes('old'))
        return "Alex was born on 7 April 1995, making him 30 years old.";
      if (lower.includes('where') && (lower.includes('from') || lower.includes('live') || lower.includes('based')))
        return "Alex is based in Pretoria, South Africa — specifically Ga-Rankuwa.";

      // Contact
      if (lower.includes('phone') || lower.includes('call') || lower.includes('number'))
        return "Alex's phone number is 072 078 6569.";
      if (lower.includes('email') || lower.includes('mail'))
        return "You can email Alex at atsello4@gmail.com.";
      if (lower.includes('social') || lower.includes('github') || lower.includes('linkedin') || lower.includes('find him') || lower.includes('online'))
        return "You can find Alex on GitHub at github.com/Alex-Sello7 and on LinkedIn at linkedin.com/in/alex-sello. He's most active on GitHub where you can browse his projects.";
      if (lower.includes('contact') || lower.includes('reach') || lower.includes('hire') || lower.includes('available'))
        return "Alex is actively available for freelance and full-time opportunities! Reach him at 072 078 6569 or atsello4@gmail.com.";

      // Quality / skills
      if (lower.includes('how good') || lower.includes('is he good') || lower.includes('skill') || lower.includes('capable') || lower.includes('design') || lower.includes('developer'))
        return "Alex has a strong eye for design and writes clean, modular code. He's delivered 12+ websites for real clients, passed multiple UNISA modules with distinction, and built this entire interactive CV from scratch in Vanilla JS — no frameworks. That's a pretty solid answer right there.";
      if (lower.includes('tech') || lower.includes('stack') || lower.includes('language'))
        return "Alex works with HTML5, CSS3, JavaScript ES6+, Bootstrap, React (basics), Node.js, SQL, Git, and WordPress. He's also comfortable with systems analysis, database design, and business informatics.";

      // Work & projects
      if (lower.includes('project') || lower.includes('portfolio') || lower.includes('built') || lower.includes('work'))
        return "Alex has built 12+ projects including Cascade Creations (business website), Seamless Travel (layout revamp), and this interactive CV. Check the Projects section to see case studies!";
      if (lower.includes('experience') || lower.includes('job') || lower.includes('career'))
        return "Alex has been freelancing as a web developer since February 2024, delivering responsive sites for small businesses. Before that he worked in sales at Street Fever, where he developed strong communication and client-handling skills.";
      if (lower.includes('education') || lower.includes('study') || lower.includes('degree') || lower.includes('unisa'))
        return "Alex is studying for a Diploma in IT at UNISA with 216 of 360 credits completed. Several modules were passed with distinction. He also completed his NSC at Modiri Secondary School in 2013.";
      if (lower.includes('certif'))
        return "Alex holds 4 certifications: Full Stack Bootcamp (Udemy), Full Stack Web Dev (FNB App Academy), SQL for Data Analysis (Simplilearn), and WordPress Development (Simplilearn).";

      return "I'm Alex's AI assistant! You can ask me anything — who he is, his contact details, his skills, projects, social media, or whether he's available for work.";
    }
  }

  async function sendMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addMessage(msg, 'sent');
    chatInput.value = '';
    typingIndicator.classList.add('active');
    chatInput.disabled = true;
    chatSend.disabled = true;

    const reply = await getAIResponse(msg);
    typingIndicator.classList.remove('active');
    addMessage(reply, 'received');
    chatInput.disabled = false;
    chatSend.disabled = false;
    chatInput.focus();
  }

  if (chatButton && chatContainer) {
    chatButton.addEventListener('click', () => {
      chatContainer.classList.add('active');
      setTimeout(() => chatInput?.focus(), 300);
    });
    chatClose?.addEventListener('click', () => chatContainer.classList.remove('active'));
    chatSend?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });

    document.addEventListener('click', (e) => {
      if (chatContainer.classList.contains('active') &&
          !chatContainer.contains(e.target) &&
          !chatButton.contains(e.target)) {
        chatContainer.classList.remove('active');
      }
    });
  }


  // ========== CASE STUDY MODAL ==========
  const modal = document.getElementById('caseStudyModal');
  const modalClose = document.getElementById('modalClose');

  function openModal(card) {
    const title   = card.dataset.projectTitle;
    const problem = card.dataset.projectProblem;
    const sol     = card.dataset.projectSolution;
    const stack   = card.dataset.projectStack;
    const url     = card.dataset.projectUrl;
    const color   = card.dataset.projectColor || 'var(--cyan)';

    document.getElementById('modalTitle').textContent   = title;
    document.getElementById('modalProblem').textContent = problem;
    document.getElementById('modalSolution').textContent = sol;
    document.getElementById('modalAccent').style.background = color;

    const stackEl = document.getElementById('modalStack');
    stackEl.innerHTML = '';
    stack.split(',').forEach(t => {
      const span = document.createElement('span');
      span.textContent = t.trim();
      stackEl.appendChild(span);
    });

    const liveLink = document.getElementById('modalLiveLink');
    liveLink.href = url;
    liveLink.style.display = url === '#' ? 'none' : 'inline-flex';

    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  // Open on case study button click
  document.querySelectorAll('.project-case-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.closest('.project-card'));
    });
  });

  // Also open on card click (not on link clicks)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.project-link-btn') && !e.target.closest('.project-case-btn')) {
        openModal(card);
      }
    });
  });

  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ========== RECRUITER MODE ==========
  const recruiterBtn  = document.getElementById('recruiterBtn');
  const recruiterOverlay = document.getElementById('recruiterOverlay');
  const recruiterClose   = document.getElementById('recruiterClose');

  recruiterBtn?.addEventListener('click', () => {
    recruiterOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  recruiterClose?.addEventListener('click', () => {
    recruiterOverlay?.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  recruiterOverlay?.addEventListener('click', (e) => {
    if (e.target === recruiterOverlay) {
      recruiterOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  // ========== HAMBURGER MENU ==========
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => navLinks?.classList.toggle('active'));
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks?.classList.remove('active'));
  });

  // ========== CURRENT YEAR ==========
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});