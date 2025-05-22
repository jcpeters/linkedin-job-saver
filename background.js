chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'syncToSheets') {
    console.log('Syncing to sheet');
    chrome.storage.local.get({ jobs: [] }, (result) => {
      const jobs = result.jobs;
    console.log('Jobs to sync:', jobs);
      if (jobs.length === 0) {
        console.log('No jobs to sync.');
        return;
      }
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwCsMljq9gd3rX0FsO0lGQdgOB0cj8MluVizv8x-7L-X8omKK_td8xi7NX6DfCZLKay/exec';
      fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ jobs })
      })
      .then(response => response.text())
      .then(result => {
        console.log('Jobs synced to Google Sheets:', result);
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'LinkedIn Job Saver',
          message: 'Jobs synced to Google Sheets.'
        });
        chrome.storage.local.set({ jobs: [] }); // Clear after sync
      })
      .catch(error => {
        console.error('Error syncing to Google Sheets:', error);
        // Notify user of the error
        // You can use a different notification type or style if needed
        // For example, you can use a different icon or title
        // to indicate an error
        // This is a basic notification, you can customize it further
        // based on your requirements
        // Example of a different notification for error
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'LinkedIn Job Saver',
          message: 'Failed to sync: ' + error
        });
      });
    });
  }
  if (message.action === 'notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'LinkedIn Job Saver',
      message: message.message
    });
  }
});
