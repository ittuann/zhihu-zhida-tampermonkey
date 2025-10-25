// ==UserScript==
// @name              移除知乎的知乎直答跳转链接
// @name:en           Remove Zhida.ai Link at Zhihu Site
// @description       将知乎网页中的知乎直答转为纯文本，去除样式和跳转
// @description:en    Remove Zhida.ai links and styles with plain text at Zhihu site
// @source            https://github.com/ittuann/zhihu-zhida-tampermonkey
// @namespace         https://github.com/ittuann/zhihu-zhida-tampermonkey
// @match             *://*.zhihu.com/*
// @exclude           https://www.zhihu.com/signin*
// @icon              https://www.zhihu.com/favicon.ico
// @license           Apache-2.0
// @version           1.0.0
// @author            ittuann
// @homepage          https://github.com/ittuann/zhihu-zhida-tampermonkey
// @homepageURL       https://github.com/ittuann/zhihu-zhida-tampermonkey
// @supportURL        https://github.com/ittuann/zhihu-zhida-tampermonkey/issues
// ==/UserScript==

(function () {
  "use strict";

  function removeLink(a) {
    // Extract text content
    const text = a.textContent;
    const parentSpan = a.parentElement;
    const parentP = parentSpan ? parentSpan.parentElement : null;

    // Replace a tag
    const textNode = document.createTextNode(text);
    a.replaceWith(textNode);

    // Unwrap empty span tag
    if (
      parentSpan &&
      parentSpan.tagName === "SPAN" &&
      parentSpan.attributes.length === 0 &&
      parentSpan.children.length === 0
    ) {
      parentSpan.parentElement.insertBefore(textNode, parentSpan);
      parentSpan.remove();
    }
  }

  function process(root = document) {
    root.querySelectorAll("a.RichContent-EntityWord").forEach(removeLink);
  }

  process();

  // Observe for dynamically added content
  const mo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes.length) return;

      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (
            node.matches("a.RichContent-EntityWord") ||
            node.querySelectorAll("a.RichContent-EntityWord")
          ) {
            process(node);
          }
        }
      });
    });
  });
  mo.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // idle callback to process initial content
  (window.requestIdleCallback || window.setTimeout)(
    () => process(document),
    800,
  );
})();
