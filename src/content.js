console.log('Setting up the observer...');

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

function removeElements(container) {
  // Remove undesired elements

  // Remove followers / repost
  var followers = container.querySelectorAll('.r-ttdzmv');
  followers[0].remove();

  // Remove menu
  var menus = container.querySelectorAll('.r-1jkjb');
  menus.forEach(function (menu) {
    menu.remove();
  });

  // Remove hidden replies
  var hiddenReplies = container.querySelectorAll('[aria-label="Hidden replies"]');
  hiddenReplies.forEach(function (reply) {
    reply.remove();
  });

  // Remove bottom border
  var element = container.querySelector('.r-qklmqi');
  element.classList.remove('r-qklmqi');

  return container;
}

function handleButtonClick(article) {
  return function () {
    console.log('Handling button click');
    
    // Add extra padding around article
    article.style.padding = '16px 16px 6px 16px';

    var container = article;
    container = removeElements(container);

    /* OLD SCALING / CLEANING CODE

    var body = document.body;
    article.style.padding = '16px 16px 6px 16px';

    var container = document.createElement('div');
    container.appendChild(article.cloneNode(true));

    body.innerHTML = '';
    body.style.width = '600px';
    body.appendChild(container);

    var followers = container.querySelectorAll('.r-ttdzmv');
    followers.forEach(function (follower) {
      follower.remove();
    });

    var menus = container.querySelectorAll('.r-1jkjb');
    menus.forEach(function (menu) {
      menu.remove();
    });

    var hiddenReplies = container.querySelectorAll('[aria-label="Hidden replies"]');
    hiddenReplies.forEach(function (reply) {
      reply.remove();
    });

    // Remove bottom border
    var element = container.querySelector('.r-qklmqi');
    element.classList.remove('r-qklmqi');

    // Scale (zoom out) the article. Adjust the scale factor as needed.
    var scaleFactor = 0.75; // % of the original size
    container.style.transform = `scale(${scaleFactor})`;
    container.style.transformOrigin = 'top left';

    */ // OLD SCALING / CLEANING CODE

    var rect = container.getBoundingClientRect();

    console.log(rect);
    if (rect.width === 0 || rect.height === 0) {
      console.error('Cannot capture screenshot: Article dimensions are zero.');
      return;
    }

    setTimeout(() => {
      chrome.runtime.sendMessage({ action: 'capture', rect: rect }, function (response) {
        if (response && response.status === 'captured') {
          // Captured, now reload
          //window.location.reload();
        }
      });
    }, 200);
  };
}

var observer = new MutationObserver(function (mutations) {
  var article = document.querySelector("article[tabindex='-1']:first-of-type"); // Directly select the first article with tabindex of -1

  if (article && !article.id) {
    article.id = generateUniqueId('article_');
  }

  var grandparent = article && article.parentNode ? article.parentNode.parentNode : null;

  // Check if the article exists, doesn't have the button yet, and its grandparent is not the main body
  if (
    article &&
    grandparent !== document.body &&
    !article.parentNode.querySelector('[data-article-id="' + article.id + '"]')
  ) {
    console.log("Found the first article element with tabindex='-1' and inserting the capture button...");
    var captureButton = createCaptureButton(article);
    article.insertAdjacentElement('afterend', captureButton);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
