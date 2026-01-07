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

document.querySelectorAll('.skill-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    const skill = item.getAttribute('data-skill');
    const mastery = item.getAttribute('data-mastery');
    document.getElementById('skill-desc').innerText = `SKILL: ${skill} | CLASS: ${mastery}`;
  });
  
  item.addEventListener('mouseleave', () => {
    document.getElementById('skill-desc').innerText = "Hover over a skill to see mastery level.";
  });
});

window.onscroll = function() {
    const scrollBtn = document.getElementById("scroll-to-top");
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollBtn.classList.add("visible");
    } else {
        scrollBtn.classList.remove("visible");
    }
};