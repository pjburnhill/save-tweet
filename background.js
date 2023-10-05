chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture") {
    captureScreenshot(sender.tab.id, message.rect, sendResponse);
    return true; // indicates the response is sent asynchronously
  }
});


function captureScreenshot(tabId, rect, callback) {
  chrome.tabs.get(tabId, function (tab) {
    let filename =
      tab.url
        .replace(/https?:\/\//, "") // Remove the http:// or https://
        .replace(/\W/g, "_") + // Replace all non-alphanumeric characters with underscores
      ".png";

    let scaleFactor = 1; // Adjust this value as needed. 2 means 2x the current resolution.

    chrome.debugger.attach({ tabId: tabId }, "1.0", function () {
      chrome.debugger.sendCommand(
        { tabId: tabId },
        "Page.captureScreenshot",
        {
          format: "png",
          clip: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            scale: scaleFactor, // Set the scale factor here
          },
        },
        ({ data }) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            chrome.debugger.detach({ tabId: tabId });
            return;
          }

          callback({ status: "captured" });

          // Download the captured image
          const url = `data:image/png;base64,${data}`;
          chrome.downloads.download({ url, filename: filename });

          // Detach the debugger
          chrome.debugger.detach({ tabId: tabId });
        }
      );
    });
  });
}
