// listens to the command defined on manifest.json
chrome.commands.onCommand.addListener(function (command) {
	switch (command) {
		case "duplicate-tab":
			toggleExtensionState();
			break;
		default:
			console.log(`Command ${command} not found`);
	}
});

/**
 * Gets the current active tab URL and opens a new tab with the same URL.
 */
function toggleExtensionState() {
	const query = { active: true, currentWindow: true };

	chrome.tabs.query(query, (tabs) => {
		chrome.storage.local.get("extensionEnabled", (data) => {
			// get the extensionEnabled variable from the chrome storage
			let extensionEnabled = !!data.extensionEnabled;
			// invert the value of the extensionEnabled variable
			extensionEnabled = !extensionEnabled;

			// pass the extensionEnabled(local) variable to setIcon function
			// which sets the chrome extension's icon on
			// google chrome bar
			setIcon(extensionEnabled);
			chrome.storage.local.set({ extensionEnabled: extensionEnabled });
		});
		chrome.tabs.reload();
	});
}

// function to change the icon on google chrome bar
function setIcon(extensionEnabled) {
	if (extensionEnabled) {
		chrome.action.setIcon({ path: "images/ik-icon-on_64.png" });
	} else {
		chrome.action.setIcon({ path: "images/ik-icon-off_64.png" });
	}
}