
  const toggleBtn = document.getElementById('toggleAddProjectBtn');
  const form = document.getElementById('addProjectForm');

  toggleBtn.addEventListener('click', () => {
    form.classList.toggle('active');
    if (form.classList.contains('active')) {
      form.scrollIntoView({ behavior: 'smooth' });
    }
  });
