// this variable will work to enable/disable the extension
var extensionEnabled = false;

// get the toggle_extension  div to check
// if it is clicked or not
var toggleExtension = document.getElementById("toggle_extension");

// get the number placement select value
var numberPlacement = document.getElementById("numberPlacement");

//get the fony size value
var fontSize = document.getElementById("fontSize");

//get the includesmallimages value


// function which checks if the user has changed the
// number placement settings option
numberPlacement.onchange = () => {
	// set the numberPosition variable to changed variable name
	let numberPosition = numberPlacement.value;

	// sets the numberPlacementPosition variable on chrome storage
	chrome.storage.local.set({ numberPosition: numberPosition });

	// re-generate the options
	imagePlacementOptionGenerator();
	// reloads the active chrome tab
	chrome.tabs.reload();
};

// function which checks if the user has changed the
// font size settings option
fontSize.onchange = () => {
	// set the fontSize variable to changed variable name
	let selectedFontSize = fontSize.value;

	// sets the fontSize variable on chrome storage
	chrome.storage.local.set({ fontSize: selectedFontSize });

	// re-generate the options
	fontSizeOptionGenerator();
	// reloads the active chrome tab
	chrome.tabs.reload();
};

// function which checks if the user has changed the
// include small images settings option
// Assuming you have an input element with the id "includeSmallImagesCheckbox" for the checkbox
const includeSmallImagesCheckbox = document.getElementById("includeSmallImagesCheckbox");

// Function to update the value in local storage and reload the tab
function updateIncludeSmallImages() {
  const includeSmallImagesValue = includeSmallImagesCheckbox.checked;

  // sets the includeSmallImages variable on chrome storage
  chrome.storage.local.set({ includeSmallImages: includeSmallImagesValue });

  // reloads the active chrome tab
  chrome.tabs.reload();
}

// Add an event listener to handle changes to the checkbox state
includeSmallImagesCheckbox.addEventListener("change", updateIncludeSmallImages);

// Function to set the checkbox state based on the value in local storage
function updateCheckboxState() {
  // Retrieve the value from local storage
  chrome.storage.local.get("includeSmallImages", (data) => {
    // Get the value from chrome storage, default to false if not set
    const includeSmallImages = data.includeSmallImages || false;

    // Set the checkbox state based on the value from chrome storage
    includeSmallImagesCheckbox.checked = includeSmallImages;
  });
}

// Call the function to set the initial checkbox state
updateCheckboxState();

// Add an event listener to listen for changes to local storage and update the checkbox accordingly
chrome.storage.onChanged.addListener((changes) => {
  if (changes.includeSmallImages) {
    updateCheckboxState();
  }
});


// generate option list for number placement
// with current number position as selected value
function imagePlacementOptionGenerator() {
	// define the option value to be used
	let optionValues = [ "Top Left","Top Right","Center","Bottom Left","Bottom Right"];

	// get the selector
	var selector = document.getElementById("numberPlacement");

	//if options are set remove them
	while (selector.options.length > 0) {
		selector.remove(0);
	}
	// loop through the optionsValue and create the option to be placed
	for (const val of optionValues) {
		// create the option
		let option = document.createElement("option");
		// set the option value
		option.value = val;
		// set the option value text
		option.text = val.charAt(0).toUpperCase() + val.slice(1);

		// now check if the option value same as saved in chrome storage
		chrome.storage.local.get("numberPosition", (data) => {
			// get the number position from the chrome storage
			let numberPosition = data.numberPosition;

			// now check which position is to be displayed as selected
			if (numberPosition === undefined) {
				// if numberPosition is undefined then Top Left value is selected
				option.value === "Top Left" ? (option.selected = "selected") : "";
			} else {
				// else then the value at the chrome storage is selected
				option.value === numberPosition ? (option.selected = "selected") : "";
			}
		});
		selector.appendChild(option);
	}
}

// generate option list for font size
// with current size as selected value
function fontSizeOptionGenerator() {
	// define the option value to be used
	let optionValues = ["12px", "14px", "16px","18px"];

	// get the selector
	var selector = document.getElementById("fontSize");

	//if options are set remove them
	while (selector.options.length > 0) {
		selector.remove(0);
	}
	// loop through the optionsValue and create the option to be placed
	for (const val of optionValues) {
		// create the option
		let option = document.createElement("option");
		// set the option value
		option.value = val;
		// set the option value text
		option.text = val.charAt(0).toUpperCase() + val.slice(1);

		// now check if the option value same as saved in chrome storage
		chrome.storage.local.get("fontSize", (data) => {
			// get the number position from the chrome storage
			let fontSize = data.fontSize;

			// now check which position is to be displayed as selected
			if (fontSize === undefined) {
				// if numberPosition is undefined then smallest value is selected
				option.value === "12px" ? (option.selected = "selected") : "";
			} else {
				// else then the value at the chrome storage is selected
				option.value === fontSize ? (option.selected = "selected") : "";
			}
		});
		selector.appendChild(option);
	}
}


//codes to be run while the settings and about page is loaded
window.onload = () => {
	// number options should be generated
	imagePlacementOptionGenerator();

	// font size options should be generated
	fontSizeOptionGenerator();

	

};

document.getElementById("hotkey").onclick = () =>
	chrome.tabs.create({
		url: "chrome://extensions/configureCommands",
	});


// first check the status of extension in chrome storage
// when the chrome page is first loaded
chrome.storage.local.get("extensionEnabled", (data) => {
	// get the status of extension from chrome storage
	// and set it to the extensionEnabled variable
	extensionEnabled = !!data.extensionEnabled;

	// pass the extensionEnabled variable to setToggleExtensionIcon function
	// and add the return value to toggleExtension element's as an html
	toggleExtension.innerHTML = setToggleExtensionIcon(extensionEnabled);

	// pass the extensionEnabled variable to setIcon function
	// which sets the chrome extension's icon on
	// google chrome bar
	setIcon(extensionEnabled);
});

// function which checks if the user has clicked on the toggle button
toggleExtension.onclick = () => {
	// invert the value of extensionEnabled(global) variable
	extensionEnabled = !extensionEnabled;

	// pass the extensionEnabled(local) variable to setToggleExtensionIcon function
	// and add the return value to toggleExtension element's as an html
	toggleExtension.innerHTML = setToggleExtensionIcon(extensionEnabled);

	// pass the extensionEnabled(local) variable to setIcon function
	// which sets the chrome extension's icon on
	// google chrome bar
	setIcon(extensionEnabled);

	// sets the extensionEnabled variable on chrome storage
	chrome.storage.local.set({ extensionEnabled: extensionEnabled });

	// reloads the active chrome tab
	chrome.tabs.reload();
};

// function to change the icon on google chrome bar
function setIcon(extensionEnabled) {
	if (extensionEnabled) {
		chrome.action.setIcon({ path: "images/ik-icon-on_64.png" });
	} else {
		chrome.action.setIcon({ path: "images/ik-icon-off_64.png" });
	}
}

// function to change the icon on the popup
function setToggleExtensionIcon(extensionEnabled) {
	return extensionEnabled
		? '<img src="images/stop.png" style="width: 100px; height:100px; cursor:pointer;"alt="on">'
		: '<img src="images/start.png" style="width: 100px; height:100px; cursor:pointer;"alt="off">';
}
