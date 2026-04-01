function initWow() {
  // Config for WOW
  var wowConfig = {
    boxClass: 'wow',      // animated element css class (default is wow)
    animateClass: 'animate__animated', // animation css class (default is animated)
    offset: 0,          // distance to the element when triggering the animation (default is 0)
    mobile: true,       // trigger animations on mobile devices (default is true)
    live: true,         // act on asynchronously loaded content (default is true)
    scrollContainer: null // optional scroll container selector, otherwise use window
  };

  // Target: Recent Posts (Home)
  const recentPosts = document.querySelectorAll('.recent-post-item');
  recentPosts.forEach((item, index) => {
    // Add classes if not present
    if (!item.classList.contains('wow')) {
        item.classList.add('wow');
        item.classList.add('animate__fadeInRight');
        item.setAttribute('data-wow-delay', `${index * 0.2}s`);
        item.setAttribute('data-wow-duration', '1s');
        // Force visibility hidden initially so WOW can reveal it
        item.style.visibility = 'hidden'; 
    }
  });

  // Target: Timeline (Archive/Category/Tags)
  const sortItems = document.querySelectorAll('.article-sort-item');
  sortItems.forEach((item, index) => {
    if (!item.classList.contains('wow')) {
        item.classList.add('wow');
        item.classList.add('animate__fadeInRight');
        item.setAttribute('data-wow-delay', `${index * 0.1}s`);
        item.setAttribute('data-wow-duration', '1s');
        item.style.visibility = 'hidden';
    }
  });
  
  // Target: Card Widgets (Sidebar)
  const cardWidgets = document.querySelectorAll('.card-widget');
  cardWidgets.forEach((item, index) => {
      if (!item.classList.contains('wow')) {
          item.classList.add('wow');
          item.classList.add('animate__fadeInRight');
          item.setAttribute('data-wow-delay', `${index * 0.1}s`);
          item.style.visibility = 'hidden';
      }
  });

  // Init WOW
  new WOW(wowConfig).init();
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  initWow();
});

// PJAX reload
document.addEventListener('pjax:complete', () => {
  initWow();
});
