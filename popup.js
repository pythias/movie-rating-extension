document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('api-token-input');

  chrome.storage.local.get('apiToken', function(data) {
    if (data.apiToken) {
      input.value = data.apiToken;
    }
  });

  var form = document.querySelector('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    var apiToken = input.value.trim();
    if (apiToken !== '') {
      chrome.storage.local.set({ apiToken: apiToken }, function() {
        alert('API token saved!');
      });
    }
  });
});
