// CSS styles for different label positions
const positionStyles = {
  "Top Left": `
    top: 10px;
    left: 10px;
  `,
  "Top Right": `
    top: 10px;
    right: 10px;
  `,
  "Bottom Left": `
    bottom: 10px;
    left: 10px;
  `,
  "Bottom Right": `
    bottom: 10px;
    right: 10px;
  `,
  "Center": `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
};

let totalImages = 0; // Total number of images on the page


// set the numberPlacementPosition if it is undefined
chrome.storage.local.get("numberPosition", (data) => {
	// get the numberPlacement from chrome storage
	let numberPlacement = data.numberPosition;
	// if undefined then set it to default value
	if (numberPlacement === undefined) {
		chrome.storage.local.set({ numberPosition: "Top Left" });
	}
});


// set the fontSize if it is undefined
chrome.storage.local.get("fontSize", (data) => {
	// get the fontSize from chrome storage
	let fontSize = data.fontSize;
	// if undefined then set it to default value
	if (fontSize === undefined) {
		chrome.storage.local.set({ fontSize: "12px" });
	}
});

//set the includeSmallImages if it is undefined
chrome.storage.local.get("includeSmallImages", (data) => {
	// get the includeSmallImages from chrome storage
	let includeSmallImages = data.includeSmallImages;
	// if undefined then set it to default value
	if (includeSmallImages === undefined) {
		chrome.storage.local.set({ includeSmallImages: false });
	}

});


// we set the fecth value null to get all
// the keys from the chrome.storage.local
chrome.storage.local.get(null, (data) => {
	// check if the extensionEnabled variable
	// in chrome storage is true
	if (data.extensionEnabled) {
		// if the extensionEnabled variable in chrome
		// storage is true call the following function
		addCountToImage(data.numberPosition, data.fontSize);

		// if the user starts scrolling then call
		// the following function
		window.addEventListener("scroll", () => {
			addCountToImage(data.numberPosition,data.fontSize);
		});
	}
});


function getIncludeSmallImagesSetting() {
	return new Promise((resolve) => {
	  chrome.storage.local.get("includeSmallImages", (data) => {
		// Get the value from chrome storage, default to false if not set
		const includeSmallImages = data.includeSmallImages || false;
		resolve(includeSmallImages);
	  });
	});
  }

// Function to check if an image is considered small
async function isSmallImage(image) {

	const MIN_WIDTH = 50; // Minimum width threshold for small images
	const MIN_HEIGHT = 50; // Minimum height threshold for small images

	try{
		const includeSmallImages = await getIncludeSmallImagesSetting();

		return includeSmallImages && (image.width < MIN_WIDTH || image.height < MIN_HEIGHT);
	}
	catch(err){
		console.log(err);
		return false;
	}
	
}


// function to add overlay to the images
// with numberPosition and fontSize parameters
async function addCountToImage(numberPosition,fontSize) {
	// get all the tags with img tag
	var img = document.getElementsByTagName("img");

	// setting the variable for adding count
	// on the overlay of image
	var counter = 1;
	totalImages = 0;

	// looping through all the img tags fetched
	// we start looping from 4th image because
	// the images we want to overlay starts
	// from the fourth elemet of img array
	for (var i = 0; i < img.length; i++) {
		const image = img[i];

		// Ignore small images if the option is enabled
		if (!await isSmallImage(image)) {
			totalImages++;

			const labelStyles = `
				position: absolute;
				padding: 4px 8px;
				background-color: rgba(0, 0, 0, 0.75);
				color: #fff;
				font-size: ${fontSize || "25px"};
				font-weight: bold;
				z-index: 9999;
				`;

			const numberLabel = document.createElement("div");
			numberLabel.innerText = totalImages;
			// numberLabel.style.cssText = labelStyles;

			numberLabel.style.cssText = labelStyles + positionStyles[numberPosition];


			image.parentNode.insertBefore(numberLabel, image);

		}
	}
}

