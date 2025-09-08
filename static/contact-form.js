document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    fetch(form.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    })
    .then(response => {
      if (response.ok) {
        form.reset();
        showSuccessMessage();
      } else {
        response.json().then(data => {
          showErrorMessage(data.error || 'Something went wrong.');
        });
      }
    })
    .catch(() => {
      showErrorMessage('Network error. Please try again later.');
    });
  });

  function showSuccessMessage() {
    let msg = document.getElementById('form-success');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'form-success';
      msg.className = 'mt-4 text-green-600 font-semibold';
      form.parentNode.appendChild(msg);
    }
    msg.textContent = 'Message sent successfully!';
  }

  function showErrorMessage(error) {
    let msg = document.getElementById('form-error');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'form-error';
      msg.className = 'mt-4 text-red-600 font-semibold';
      form.parentNode.appendChild(msg);
    }
    msg.textContent = error;
  }
});
