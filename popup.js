document.getElementById('saveBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  alert('Current Tab:', [tab]);
  console
  if (!tab) {
    console.error('No active tab found.');
    return;
  }
  if (!tab.url.includes('linkedin.com/jobs/')) {
    alert('Please open a LinkedIn job posting.');
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapeJobData,
    args: [tab.url]
  });
});
        
document.getElementById('syncBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'syncToSheets' });
});

function scrapeJobData(sourceUrl) {
  const title = document.querySelector('h1')?.innerText || "";
  const company = document.querySelector('.topcard__org-name-link, .topcard__flavor')?.innerText || "";
  const location = document.querySelector('.topcard__flavor--bullet')?.innerText || "";
  const description = document.querySelector('div.jobs-description__content.jobs-description-content')?.innerText || "";
  console.log('Scraping Job: ',description);
  const timestamp = new Date().toISOString();
  const job = {
    title,
    company,
    location,
    description: description.replace(/\n/g, ' '),
    dateSaved: timestamp,
    sourceUrl,
    applyUrl: window.location.href
  };
  chrome.storage.local.get({ jobs: [] }, (result) => {
    const jobs = result.jobs;
    jobs.push(job);
    chrome.storage.local.set({ jobs }, () => {
      chrome.runtime.sendMessage({ action: 'notify', message: 'Job saved locally.' });
      console.log('Job saved:', jobs);
    });
  });
}
