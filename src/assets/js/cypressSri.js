if (window.Cypress) {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    const processNode = (node) => {
      const tagName = (node.tagName || '').toLowerCase();
      if (
        tagName === 'script'
        && node.integrity
      ) {
        node.onerror = () => {
          const fb = document.createElement(tagName);
          const parent = node.parentNode;
          if (node.src) fb.setAttribute('src', node.getAttribute('src'));
          parent.appendChild(fb);
          node.remove();
        };
      }
    };

    if (MutationObserver) {
      new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach(processNode);
        });
      }).observe(document, { childList: true, subtree: true });
    }
}