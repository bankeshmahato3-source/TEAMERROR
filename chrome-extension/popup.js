document.addEventListener('DOMContentLoaded', async () => {
  const urlDisplay = document.getElementById('current-url');
  const crawlBtn = document.getElementById('crawl-btn');
  const dashboardInput = document.getElementById('dashboard-url');

  let currentUrl = '';

  // Load saved dashboard URL
  chrome.storage.local.get(['dashboardUrl'], (result) => {
    if (result.dashboardUrl) {
      dashboardInput.value = result.dashboardUrl;
    }
  });

  // Save dashboard URL when changed
  dashboardInput.addEventListener('change', (e) => {
    const val = e.target.value.trim().replace(/\/$/, '');
    chrome.storage.local.set({ dashboardUrl: val });
  });

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
      let base = dashboardInput.value.trim().replace(/\/$/, '');
      if (!base) base = 'http://localhost:5173';
      const dashboardUrl = `${base}/admin/crawler?url=${encodeURIComponent(currentUrl)}`;
      chrome.tabs.create({ url: dashboardUrl });
    }
  });
});
