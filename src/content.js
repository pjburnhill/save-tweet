console.log('[Save Tweet]: Waiting for tweets...');

function generateUniqueId(prefix = '') {
  return prefix + Math.random().toString(36).substr(2, 9);
}

function createCaptureButton(article) {
  var captureButton = document.createElement('button');
  captureButton.innerText = 'Save Tweet';
  captureButton.dataset.articleId = article.id;
  captureButton.id = 'btn_saveTweet';

  captureButton.addEventListener('click', function () {
    var associatedArticle = document.getElementById(this.dataset.articleId);
    handleButtonClick(associatedArticle)();
  });

  return captureButton;
}

function amendElements(container) {
  // Remove undesired elements

  // Remove followers / repost
  var followers = container.querySelectorAll('.r-ttdzmv');
  followers[0].remove();

  // Get the menu element
  var menu = container.querySelector('.r-1jkjb');

  // Remove all child elements from menu
  while (menu.firstChild) {
    menu.removeChild(menu.firstChild);
  }

  // Find the X logo element (with class 'r-lrsllp'), clone it and add it to 'menu'
  var xLogoElement = document.querySelector('.r-lrsllp');
  if (xLogoElement) {
    var clonedElement = xLogoElement.cloneNode(true); // deep clone
    menu.appendChild(clonedElement);
  }

  // Remove hidden replies
  var hiddenReplies = container.querySelectorAll(
    '[aria-label="Hidden replies"]',
  );
  hiddenReplies.forEach(function (reply) {
    reply.remove();
  });

  // Remove bottom border
  var bottomBorderEl = container.querySelector('.r-qklmqi');
  if (bottomBorderEl) {
    bottomBorderEl.classList.remove('r-qklmqi');
  }

  // Remove 'Who can reply?'
  var whoCanReplyEl = container.querySelector('.r-1ifxtd0');
  if (whoCanReplyEl) {
    whoCanReplyEl.remove();
  }

  return container;
}

function handleButtonClick(article) {
  return function () {
    console.log('[Save Tweet]: Cleaning and saving tweet.');

    // Add extra padding around article
    article.style.padding = '16px 16px 6px 16px';

    var container = article;
    container = amendElements(container);

    // Get element bounding rectangle and adjust by window scroll amount
    var rect = container.getBoundingClientRect();
    rect.y += window.scrollY;

    if (rect.width === 0 || rect.height === 0) {
      console.error('Cannot capture screenshot: Article dimensions are zero.');
      return;
    }

    setTimeout(() => {
      chrome.runtime.sendMessage(
        { action: 'capture', rect: rect },
        function (response) {
          if (response && response.status === 'captured') {
            // Captured
            console.log('[Save Tweet]: Tweet captured.');
            //window.location.reload();
          }
        },
      );
    }, 200);
  };
}

var observer = new MutationObserver(function (mutations) {
  var article = document.querySelector("article[tabindex='-1']:first-of-type"); // Directly select the first article with tabindex of -1

  if (article && !article.id) {
    article.id = generateUniqueId('article_');
  }

  var grandparent =
    article && article.parentNode ? article.parentNode.parentNode : null;

  // Check if the article exists, doesn't have the button yet, and its grandparent is not the main body
  if (
    article &&
    grandparent !== document.body &&
    !article.parentNode.querySelector('[data-article-id="' + article.id + '"]')
  ) {
    console.log(
      "[Save Tweet]: Found twitter article, inserting 'save tweet' button...",
    );
    var captureButton = createCaptureButton(article);
    article.insertAdjacentElement('afterend', captureButton);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
