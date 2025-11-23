/**
 * #ShopTab4Mzansi — Popup script.
 * Copyright (C) 2025  M.C. Wolmarans
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

(function() {
  'use strict';
  
  const logo = document.getElementById('logo');
  if (!logo) return;
  
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
    logo.src = chrome.runtime.getURL('icons/icon48.png');
  } else if (typeof browser !== 'undefined' && browser.runtime && browser.runtime.getURL) {
    logo.src = browser.runtime.getURL('icons/icon48.png');
  } else {
    logo.src = 'icons/icon48.png';
  }
  
  logo.onerror = function() {
    this.style.display = 'none';
  };
})();

