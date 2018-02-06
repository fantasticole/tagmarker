// import { api_key } from '../../../api_key';

// unrestricted key
const apiKey = 'lol';

const newSpreadsheet = {
 "sheets": [
  {
   "properties": {
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
   ]
  },
  {
   "properties": {
    "title": "bookmarks"
   },
   "data": [
    {
     "rowData": [
      {
       "values": [
        {
         "userEnteredValue": {
          "stringValue": "tags"
         }
        },
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
          "stringValue": "url"
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
   ]
  }
 ],
 "properties": {
  "title": "mew tagmarker data"
 }
}

export function create (sendResponse) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (token) {
        let url = `https://sheets.googleapis.com/v4/spreadsheets?fields=spreadsheetId%2CspreadsheetUrl&key=${apiKey}`;
        let xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onreadystatechange = event => {
          if (xhr.readyState == 4 && xhr.status == 200) resolve(xhr.response);
        }
        xhr.open('POST', url, newSpreadsheet);
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
