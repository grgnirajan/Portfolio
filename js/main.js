// ---- Contact form handling ----
(function initContactForm() {
  var DESTINATION_EMAIL = 'nirajangurung680@gmail.com';
  var form = document.getElementById('contactForm');
  if (!form) return;

  var note = document.getElementById('formNote');
  var sendBtn = form.querySelector('.send-btn');
  var btnLabel = sendBtn.querySelector('.btn-label');
  var originalLabel = btnLabel.textContent;

  function setNote(text, type) {
    note.textContent = text;
    note.className = 'form-note show' + (type ? ' ' + type : '');
  }

  form.addEventListener('input', function (e) {
    var fieldEl = e.target.closest('.field');
    if (fieldEl) clearFieldState(fieldEl);
    note.className = 'form-note';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var nameField = form.querySelector('[data-field="name"]');
    var phoneField = form.querySelector('[data-field="phone"]');
    var emailField = form.querySelector('[data-field="email"]');
    var messageField = form.querySelector('[data-field="message"]');

    var nameInput = nameField.querySelector('input');
    var phoneInput = phoneField.querySelector('input');
    var emailInput = emailField.querySelector('input');
    var messageInput = messageField.querySelector('textarea');

    [nameField, emailField, messageField].forEach(clearFieldState);
    sendBtn.classList.remove('is-success', 'is-error');

    var valid = true;

    if (!nameInput.value.trim()) {
      markInvalid(nameField);
      valid = false;
    }
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
      markInvalid(emailField);
      valid = false;
    }
    if (!messageInput.value.trim()) {
      markInvalid(messageField);
      valid = false;
    }

    if (!valid) {
      setNote('Please fill in the highlighted fields correctly.', 'error');
      return;
    }

    // build a mailto link so the message goes straight to the destination inbox
    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    var subject = 'Portfolio inquiry from ' + name;
    var bodyLines = ['Name: ' + name, 'Email: ' + email];
    if (phone) bodyLines.push('Phone: ' + phone);
    bodyLines.push('', 'Message:', message);

    var mailtoUrl =
      'mailto:' + encodeURIComponent(DESTINATION_EMAIL) +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(bodyLines.join('\n'));

    sendBtn.disabled = true;
    btnLabel.textContent = 'Opening your mail app…';
    setNote('', '');

    setTimeout(function () {
      window.location.href = mailtoUrl;

      sendBtn.classList.add('is-success');
      btnLabel.textContent = 'Ready to Send ✓';
      setNote('Your email app should now be open with everything filled in — just hit send there.', 'success');

      setTimeout(function () {
        form.reset();
        sendBtn.disabled = false;
        sendBtn.classList.remove('is-success');
        btnLabel.textContent = originalLabel;
        note.className = 'form-note';
      }, 3600);
    }, 700);
  });
})();
