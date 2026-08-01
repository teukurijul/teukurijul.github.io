// assets/js/main.js
// Starter JS: menu toggle, preloader hide, basic helpers
'use strict';

document.addEventListener('DOMContentLoaded', function () {
  // Preloader: hide after window load
  var preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', function () {
      try {
        preloader.style.transition = 'opacity 0.4s ease';
        preloader.style.opacity = '0';
        setTimeout(function () { preloader.style.display = 'none'; }, 500);
      } catch (e) {
        preloader.style.display = 'none';
      }
    });
  }

  // Mobile menu toggle
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOverlay = document.getElementById('menu-overlay');
  if (menuToggle && mobileMenu && menuOverlay) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('open');
      menuOverlay.classList.toggle('open', open);
      var iconOpen = document.getElementById('menu-icon-open');
      var iconClose = document.getElementById('menu-icon-close');
      if (iconOpen) iconOpen.classList.toggle('hidden', open);
      if (iconClose) iconClose.classList.toggle('hidden', !open);
    });
    menuOverlay.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      var iconOpen = document.getElementById('menu-icon-open');
      var iconClose = document.getElementById('menu-icon-close');
      if (iconOpen) iconOpen.classList.remove('hidden');
      if (iconClose) iconClose.classList.add('hidden');
    });
  }

  // Back-to-top visibility
  var backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    });
  }

});
