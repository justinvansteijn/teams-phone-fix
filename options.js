const defaultUserAgent = 'Extension Default';
const availableUserAgents = {
  'Extension Default': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43',
  'Custom': '',
};

const userAgentElement = document.getElementById('useragent');
const availableUserAgentsElement = document.getElementById('available_useragents');

/**
 * read user agent from local storage
 */
function loadUserAgent() {
  browser.storage.local.get({
    'userAgent': availableUserAgents[defaultUserAgent],
    'userAgentType': defaultUserAgent
  }).then(
    (item) => {
      userAgentElement.value = item.userAgent;
      populateAvailableUserAgents(item.userAgentType);
    },
    () => {
      userAgentElement.value = availableUserAgents[defaultUserAgent];
      populateAvailableUserAgents();
    }
  );
}

/**
 * save user agent to localstorage
 */
function saveUserAgent() {
  const uaObject = {
    userAgent: userAgentElement.value,
    userAgentType: availableUserAgentsElement.selectedOptions[0].text,
  };
  browser.storage.local.set(uaObject).then(null, () => {
    alert('Unable to save user agent to storage');
  });
}

/**
 * populate available user agents to select element
 */
function populateAvailableUserAgents(currentUserAgent = null) {
  if (!currentUserAgent) {
    currentUserAgent = defaultUserAgent;
  }
  Object.entries(availableUserAgents)
    .forEach(([name, value]) => {
      const option = document.createElement('option');
      option.value = value;
      option.text = name;
      if (name === currentUserAgent) {
        option.selected = 'selected';
      }
      availableUserAgentsElement.appendChild(option);
    });

  userAgentElement.disabled = currentUserAgent === 'Custom' ? false : "disabled";
}

/**
 * handler to change user agent
 */
function changeUserAgent() {
  const current = availableUserAgentsElement.selectedOptions[0];
  if (current.text === 'Custom') {
    userAgentElement.disabled = false;
  } else {
    userAgentElement.disabled = "disabled";
    userAgentElement.value = current.value;
  }
}

// register event handlers
userAgentElement.addEventListener('keyup', saveUserAgent);
userAgentElement.addEventListener('change', saveUserAgent);
availableUserAgentsElement.addEventListener('change', () => {
  changeUserAgent();
  saveUserAgent();
});

// initialize
loadUserAgent();
