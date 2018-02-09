import { api_key } from '../../../api_key';

const newSpreadsheet = {
 "sheets": [
  {
   "properties": {
    "gridProperties": {
     "frozenRowCount": 1
    },
    "title": "tags"
   },
   "data": [
    {
     "rowData": [
      {
       "values": [
        {
         "userEnteredValue": {
          "stringValue": "bookmarks"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "dateAdded"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "dateGroupModified"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "id"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "parentId"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "parents"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "title"
         }
        }
       ]
      }
     ]
    }
   ],
  },
  {
   "properties": {
    "gridProperties": {
     "frozenRowCount": 1
    },
    "title": "bookmarks"
   },
   "data": [
    {
     "rowData": [
      {
       "values": [
        {
         "userEnteredValue": {
          "stringValue": "dateAdded"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "id"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "parentId"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "tags"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "title"
         }
        },
        {
         "userEnteredValue": {
          "stringValue": "url"
         }
        }
       ]
      }
     ]
    }
   ],
  }
 ],
 "properties": {
  "title": "TagMarker Data"
 }
}

export function addRows (sheet, data, id) {
  let formattedRows = formatRows(sheet, data);

  chrome.identity.getAuthToken({ interactive: false }, (token) => {
    if (token) {
      let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}!A1:append?valueInputOption=RAW&key=${api_key}`;
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onreadystatechange = event => {
        if (xhr.readyState == 4 && xhr.status !== 200) console.error(xhr.response)
      }
      xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send(JSON.stringify(formattedRows));
    }
    else {
      let message = chrome.runtime.lastError ? chrome.runtime.lastError.message : "";
      console.error({ status: "Not signed into Chrome, network error or no permission.\n" + message });
    }
  });
}

export function create () {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token) {
        let url = `https://sheets.googleapis.com/v4/spreadsheets?fields=sheets%2CspreadsheetId%2CspreadsheetUrl&key=${api_key}`;
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onreadystatechange = event => {
          // when we have the response, pass it to the resolve function
          if (xhr.readyState == 4 && xhr.status == 200) {
            let tagsSheet = xhr.response.sheets.find(sheet => sheet.properties.title === 'tags'),
                bookmarksSheet = xhr.response.sheets.find(sheet => sheet.properties.title === 'bookmarks'),
                // gather spreadsheet data
                spreadsheet = {
                  id: xhr.response.spreadsheetId,
                  bookmarksSheet: bookmarksSheet.properties.sheetId,
                  tagsSheet: tagsSheet.properties.sheetId,
                }

            resolve(spreadsheet);
          }
        }
        xhr.open('POST', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(JSON.stringify(newSpreadsheet));
      }
      else {
        let message = chrome.runtime.lastError ? chrome.runtime.lastError.message : "";
        reject({ status: "Not signed into Chrome, network error or no permission.\n" + message });
      }
    });
  })
}

// TODO: check if file is in the trash
// can still be updated there though
export function exists (id) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token) {
        let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}?key=${api_key}`;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = event => {
          if (xhr.status == 200) resolve(true);
          else if (xhr.status == 404) resolve(false);
        }
        xhr.open('GET', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send();
      }
      else {
        let message = chrome.runtime.lastError ? chrome.runtime.lastError.message : "";
        reject({ status: "Not signed into Chrome, network error or no permission.\n" + message });
      }
    });
  })
}

function formatRows (sheet, arrayOfObjects) {
  let values = arrayOfObjects.map(obj => {
    let arr = [];

    // push objects in specific order
    if (sheet === 'tags') {
      arr.push(
        obj.bookmarks.join(','),
        obj.dateAdded,
        obj.dateGroupModified,
        obj.id,
        obj.parentId,
        obj.parents.join(','),
        obj.title
      )
    }
    else if (sheet === 'bookmarks') {
      arr.push(
        obj.dateAdded,
        obj.id,
        obj.parentId,
        obj.tags.join(','),
        obj.title,
        obj.url
      )
    }
    return arr;
  });

  return { values };
}

export function getRow (sheet, index, id) {
  chrome.identity.getAuthToken({ interactive: false }, (token) => {
    if (token) {
      let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}!A${index+2}%3AH${index+2}?valueRenderOption=UNFORMATTED_VALUE&key=${api_key}`;
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onreadystatechange = event => {
        if (xhr.readyState == 4 && xhr.status == 200) console.log(xhr.response)
      }
      xhr.open('GET', url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.send();
    }
    else {
      let message = chrome.runtime.lastError ? chrome.runtime.lastError.message : "";
      console.error({ status: "Not signed into Chrome, network error or no permission.\n" + message });
    }
  });
}
