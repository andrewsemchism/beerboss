var beerAnimation = bodymovin.loadAnimation({
  container: document.getElementById("beerBannerAnimation"),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: '../animations/beerBanner.json'
})