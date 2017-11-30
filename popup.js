function logToConsole (...data) {
  // use '...data' to pass in arbitrary number of arguments
  chrome.extension.getBackgroundPage().console.log(...data);
}

function renderTags (tagData) {
  let tagDiv = document.getElementById('tags'),
      tags = Object.values(tagData.tags),
      tagValues = tags.map(tag => ({
        title: tag.title,
        value: tag.bookmarks.length,
      }));

  logToConsole('tagData:', tagData);
  logToConsole('tagValues:', tagValues);
  for (x in tagValues) {
    let { title, value } = tagValues[x],
        fontSize = (value + 5) < 75 ? value + 5 : 75,
        p = document.createElement("p");

    p.innerHTML = title;
    p.setAttribute("style", `font-size:${fontSize}px;line-height:${fontSize}px`);
    p.setAttribute("class", "tag");

    tagDiv.append(p)
  }
}

// when the popup opens, alert the background
chrome.runtime.sendMessage({ msg: "opened" });

// get data from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.slug === "tag_data") renderTags(request.data);
});
