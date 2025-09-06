// Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');
    const printBtn = document.getElementById('printButton');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
        printBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
        printBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Print functionality
    printBtn.addEventListener('click', () => {
      window.print();
    });

    // Add subtle animation to list items
    document.querySelectorAll('li').forEach((item, index) => {
      item.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
    });

    // Add animation to paragraphs
    document.querySelectorAll('p').forEach((p, index) => {
      p.style.animation = `fadeIn 0.5s ease ${index * 0.05 + 0.3}s both`;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Highlight current section in TOC when scrolling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.toc a');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 150) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
          link.style.borderColor = 'var(--primary)';
          link.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
        } else {
          link.style.borderColor = '';
          link.style.backgroundColor = '';
        }
      });
    });