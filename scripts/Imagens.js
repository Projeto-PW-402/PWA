document.querySelectorAll('.image-input').forEach((input, index) => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      const preview = document.getElementById(`preview${index + 1}`);
      const box = input.closest('.image-upload-box');
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          preview.src = reader.result;
          preview.style.display = 'block';
          box.classList.add('has-image');
        };
        reader.readAsDataURL(file);
      }
    });
  });
  