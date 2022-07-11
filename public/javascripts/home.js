// Banner beer animation
const beerAnimation = bodymovin.loadAnimation({
  container: document.getElementById("beerBannerAnimation"),
  renderer: 'svg',
  loop: false,
  autoplay: true,
  path: '../animations/beerBanner.json'
})

// Start Now button scroll
$(document).ready(function() {
  $(".startNowButton").click(function() {
    $('html,body').animate({
        scrollTop: $("#using-beerboss").offset().top
      },
      'slow');
  });
})