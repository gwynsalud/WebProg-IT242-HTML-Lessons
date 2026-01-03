const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Show the Quest Banner
      document.getElementById('quest-alert').classList.add('show');
      // You could also trigger your typewriter effect here!
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector('#about'));