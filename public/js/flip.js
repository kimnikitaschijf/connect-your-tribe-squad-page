document.querySelectorAll('.card-layout').forEach(card => {
    card.addEventListener('click', function() {
      const cardInner = this.querySelector('.card-inner');
      cardInner.classList.toggle('do-flip'); // Draai de kaart om
    });
  });