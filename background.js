chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "closeTab" && sender.tab?.id) {
      chrome.tabs.remove(sender.tab.id);
    }
  });
  