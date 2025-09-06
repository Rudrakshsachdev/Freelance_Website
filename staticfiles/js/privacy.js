 // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Add subtle animation to list items
    document.querySelectorAll('li').forEach((item, index) => {
      item.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
    });

    // Add animation to paragraphs
    document.querySelectorAll('p').forEach((p, index) => {
      p.style.animation = `fadeIn 0.5s ease ${index * 0.05 + 0.3}s both`;
    });

    // Add section highlighting when navigating with anchor links
    document.querySelectorAll('h2').forEach(section => {
      section.addEventListener('click', () => {
        const id = section.parentElement.id;
        if (id) {
          navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
          
          // Show a subtle confirmation
          const originalBg = section.style.backgroundColor;
          section.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
          setTimeout(() => {
            section.style.backgroundColor = originalBg;
          }, 1000);
        }
      });
    });

    // Add print functionality
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Policy';
    printButton.style.position = 'fixed';
    printButton.style.bottom = '30px';
    printButton.style.left = '30px';
    printButton.style.padding = 'var(--spacing-md) var(--spacing-lg)';
    printButton.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)';
    printButton.style.color = 'white';
    printButton.style.border = 'none';
    printButton.style.borderRadius = 'var(--radius-lg)';
    printButton.style.cursor = 'pointer';
    printButton.style.boxShadow = 'var(--shadow-md)';
    printButton.style.zIndex = '1000';
    printButton.style.fontFamily = 'var(--font-primary)';
    printButton.style.fontWeight = '500';
    printButton.addEventListener('click', () => window.print());
    
    document.body.appendChild(printButton);