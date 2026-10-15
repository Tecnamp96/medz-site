const galleryButtons = [...document.querySelectorAll('.digital-gallery-trigger')];
const lightbox = document.querySelector('.digital-lightbox');

if (galleryButtons.length && lightbox && typeof lightbox.showModal === 'function') {
  const image = lightbox.querySelector('.digital-lightbox-image');
  const caption = lightbox.querySelector('.digital-lightbox-caption');
  const closeButton = lightbox.querySelector('.digital-lightbox-close');
  const previousButton = lightbox.querySelector('.digital-lightbox-previous');
  const nextButton = lightbox.querySelector('.digital-lightbox-next');
  let activeIndex = 0;
  let opener = null;

  function showImage(index) {
    activeIndex = (index + galleryButtons.length) % galleryButtons.length;
    const button = galleryButtons[activeIndex];
    const source = button.querySelector('img');
    const label = button.querySelector('.digital-gallery-caption');
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    caption.textContent = label.textContent.trim();
  }

  galleryButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      opener = button;
      showImage(index);
      lightbox.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', () => lightbox.close());
  previousButton.addEventListener('click', () => showImage(activeIndex - 1));
  nextButton.addEventListener('click', () => showImage(activeIndex + 1));

  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
    if (event.key === 'ArrowRight') showImage(activeIndex + 1);
  });

  lightbox.addEventListener('close', () => {
    if (opener) opener.focus();
  });
}
