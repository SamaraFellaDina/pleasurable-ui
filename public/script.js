document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('featured-carousel');
    let items = Array.from(carousel.children);
    
    // Duplicate the items to create the infinite effect
    items.forEach(item => {
      const clone = item.cloneNode(true);
      carousel.appendChild(clone);
    });
  
    // Adjust the scroll position to the middle of the duplicated items
    carousel.scrollLeft = items[0].clientWidth * items.length;
    const itemWidth = items[0].clientWidth;
  
    // Handle the scroll event
    carousel.addEventListener('scroll', () => {
      const scrollLeft = carousel.scrollLeft;
      const itemWidth = items[0].clientWidth;
      const totalWidth = itemWidth * items.length;
  
      if (scrollLeft >= totalWidth) {
        // Move to the original set of items
        carousel.scrollLeft = scrollLeft - totalWidth;
      } else if (scrollLeft <= 0) {
        // Move to the duplicated set of items
        carousel.scrollLeft = scrollLeft + totalWidth;
      }
    });
});