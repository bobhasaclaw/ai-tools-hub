#!/usr/bin/env python3
import os
import re

articles_dir = "/home/pfam/.openclaw/workspace/ai-affiliate-site-v2/articles"

# CSS to add before </style></head><body>
back_to_top_css = '''
  /* Back to Top Button */
  .back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    background: var(--accent-primary);
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }
  .back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .back-to-top:hover {
    background: var(--accent-secondary);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
  }
  .back-to-top svg {
    width: 24px;
    height: 24px;
  }
'''

# JavaScript to add
back_to_top_js = '''

// Back to Top button functionality
(function() {
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
'''

# Button HTML
back_to_top_html = '''

  <!-- Back to Top Button -->
  <button class="back-to-top" id="backToTop" aria-label="Back to top">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  </button>
'''

# Process each HTML file in articles directory
for filename in os.listdir(articles_dir):
    if filename.endswith('.html'):
        filepath = os.path.join(articles_dir, filename)
        
        with open(filepath, 'r') as f:
            content = f.read()
        
        original = content
        
        # Add CSS before </style></head><body>
        content = content.replace('</style></head><body>', 
                                  back_to_top_css + '</style></head><body>')
        
        # Add button HTML before </footer></body> OR </body><script>
        if '</footer></body>' in content:
            content = content.replace('</footer></body>', 
                                      back_to_top_html + '</footer></body>')
        elif '</body><script>' in content:
            # Insert button before </body>
            content = content.replace('</body><script>', 
                                      back_to_top_html + '</body><script>')
        
        # Add JavaScript at the end before </html>
        # Check for </script></html> at the very end
        if '</script></html>' in content:
            content = content.replace('</script></html>', 
                                      back_to_top_js + '</script></html>')
        
        if content != original:
            with open(filepath, 'w') as f:
                f.write(content)
            print(f"Updated: {filename}")
        else:
            print(f"Skipped (no match): {filename}")

print("Done!")
