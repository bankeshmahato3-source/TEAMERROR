document.addEventListener('DOMContentLoaded', async () => {
  const urlDisplay = document.getElementById('current-url');
  const crawlBtn = document.getElementById('crawl-btn');

  let currentUrl = '';

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.url) {
      currentUrl = tabs[0].url;
      urlDisplay.textContent = currentUrl;
    } else {
      urlDisplay.textContent = 'Cannot determine URL';
      crawlBtn.disabled = true;
    }
  } catch (err) {
    urlDisplay.textContent = 'Error fetching URL';
    crawlBtn.disabled = true;
  }

  crawlBtn.addEventListener('click', () => {
    if (currentUrl) {
      const dashboardUrl = `http://localhost:5173/admin/crawler?url=${encodeURIComponent(currentUrl)}`;
      chrome.tabs.create({ url: dashboardUrl });
    }
  });
});
