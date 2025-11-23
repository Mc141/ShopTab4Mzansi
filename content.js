/**
 * #ShopTab4Mzansi — Adds a Shopping button to Google Search results pages.
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

  const TAB_LABEL = 'Shopping';
  const TAB_ID = 'shoptab4mzansi-tab';
  const INJECTED_CLASS = 'shoptab4mzansi-injected';
  
  function isGoogleSearchPage() {
    const url = window.location.href;
    return url.includes('www.google.com') && 
           (url.includes('/search') || url.includes('?q=') || url.includes('&q='));
  }

  function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  }

  function isOnShoppingPage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('udm') === '28';
  }

  function buildShoppingUrl(query) {
    if (!query) return null;
    
    const currentParams = new URLSearchParams(window.location.search);
    const shoppingParams = new URLSearchParams();
    
    shoppingParams.set('udm', '28');
    shoppingParams.set('q', query);
    
    if (currentParams.has('sca_esv')) {
      shoppingParams.set('sca_esv', currentParams.get('sca_esv'));
    }
    if (currentParams.has('sxsrf')) {
      shoppingParams.set('sxsrf', currentParams.get('sxsrf'));
    }
    
    return `https://www.google.com/search?${shoppingParams.toString()}`;
  }

  function findTabBar() {
    const modernTabList = document.querySelector('div.beZ0tf.O1uzAe[role="list"]');
    if (modernTabList) {
      return modernTabList;
    }

    const selectors = [
      '#hdtb-msb',
      '.hdtb-mitem',
      '[role="tablist"]',
      '.hdtb-mitem.hdtb-msel',
      '#hdtb'
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) {
        const parent = element.closest('#hdtb') || 
                      element.closest('.hdtb') ||
                      element.parentElement;
        if (parent) return parent;
      }
    }

    const tabContainers = document.querySelectorAll('[class*="hdtb"], [id*="hdtb"]');
    for (const container of tabContainers) {
      if (container.querySelector('a[href*="/search"]')) {
        return container;
      }
    }

    return null;
  }

  function createShoppingTab(query) {
    const shoppingUrl = buildShoppingUrl(query);
    if (!shoppingUrl) return null;

    if (document.getElementById(TAB_ID)) {
      return null;
    }

    const listItem = document.createElement('div');
    listItem.setAttribute('role', 'listitem');
    listItem.setAttribute('data-hveid', '');
    listItem.setAttribute('data-ved', '');
    listItem.id = TAB_ID;
    listItem.className = INJECTED_CLASS;

    const link = document.createElement('a');
    link.className = 'C6AK7c';
    link.href = shoppingUrl;
    link.setAttribute('jsname', 'pxBnId');
    link.setAttribute('data-hveid', '');
    link.setAttribute('data-ved', '');
    link.style.cursor = 'pointer';

    const innerDiv = document.createElement('div');
    innerDiv.setAttribute('jsname', 'xBNgKe');
    innerDiv.className = 'mXwfNd';

    const span = document.createElement('span');
    span.className = 'R1QWuf';
    span.textContent = TAB_LABEL;

    innerDiv.appendChild(span);
    link.appendChild(innerDiv);
    listItem.appendChild(link);

    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = shoppingUrl;
    });

    return listItem;
  }

  function removeShoppingTab() {
    const existingTab = document.getElementById(TAB_ID);
    if (existingTab) {
      existingTab.remove();
    }
  }

  function injectShoppingTab() {
    if (!isGoogleSearchPage()) {
      return;
    }

    if (isOnShoppingPage()) {
      removeShoppingTab();
      return true;
    }

    const query = getSearchQuery();
    if (!query) {
      return;
    }

    if (document.getElementById(TAB_ID)) {
      return true;
    }

    const tabBar = findTabBar();
    if (!tabBar) {
      return false;
    }

    const shoppingTab = createShoppingTab(query);
    if (!shoppingTab) {
      return true;
    }

    const existingTabs = tabBar.querySelectorAll('div[role="listitem"]:not(.' + INJECTED_CLASS + ')');
    
    if (existingTabs.length > 0) {
      let insertAfter = null;
      for (const tab of existingTabs) {
        if (tab.textContent.trim() === 'Forums') {
          insertAfter = tab;
          break;
        }
      }
      
      if (insertAfter) {
        insertAfter.parentNode.insertBefore(shoppingTab, insertAfter.nextSibling);
      } else {
        const firstTab = existingTabs[0];
        firstTab.parentNode.insertBefore(shoppingTab, firstTab.nextSibling);
      }
    } else {
      const fallbackTabs = tabBar.querySelectorAll('a.C6AK7c:not(.' + INJECTED_CLASS + ')');
      if (fallbackTabs.length > 0) {
        const firstTab = fallbackTabs[0].closest('div[role="listitem"]') || fallbackTabs[0].parentElement;
        if (firstTab && firstTab.parentNode) {
          firstTab.parentNode.insertBefore(shoppingTab, firstTab.nextSibling);
        } else {
          tabBar.appendChild(shoppingTab);
        }
      } else {
        tabBar.appendChild(shoppingTab);
      }
    }

    return true;
  }

  let retryCount = 0;
  const maxRetries = 10;
  const retryDelay = 500;

  function attemptInjection() {
    const success = injectShoppingTab();
    
    if (!success && retryCount < maxRetries) {
      retryCount++;
      setTimeout(attemptInjection, retryDelay * retryCount);
    }
  }

  function setupObserver() {
    const observer = new MutationObserver(function(mutations) {
      const isShopping = isOnShoppingPage();
      const tabExists = document.getElementById(TAB_ID);
      
      if (isShopping && tabExists) {
        removeShoppingTab();
      } else if (!isShopping && !tabExists) {
        attemptInjection();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        attemptInjection();
        setupObserver();
      });
    } else {
      attemptInjection();
      setupObserver();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        retryCount = 0;
        
        if (isOnShoppingPage()) {
          removeShoppingTab();
        } else {
          setTimeout(attemptInjection, 300);
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }

  init();
})();