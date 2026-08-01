// assets/js/main.js
// Starter JS: menu toggle, preloader hide, accessibility improvements
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

  // Mobile menu toggle with accessibility
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');
  var menuOverlay = document.getElementById('menu-overlay');
  if (menuToggle && mobileMenu && menuOverlay) {
    // ensure initial aria state
    menuToggle.setAttribute('aria-expanded', 'false');

    function openMenu() {
      mobileMenu.classList.add('open');
      menuOverlay.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      // move focus to first link inside mobile menu
      var firstLink = mobileMenu.querySelector('a');
      if (firstLink) firstLink.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      menuOverlay.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus();
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('open');
      if (isOpen) closeMenu(); else openMenu();
    });

    menuOverlay.addEventListener('click', function () {
      closeMenu();
    });

    // Close menu on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (mobileMenu.classList.contains('open')) {
          closeMenu();
        }
      }
    });

    // Make sure mobile nav links close the menu when clicked
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
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

  // Enhance keyboard focus visibility for interactive elements (optional runtime helper)
  document.body.classList.add('js-enabled');
});
