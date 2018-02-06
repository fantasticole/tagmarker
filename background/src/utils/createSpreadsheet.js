// import { api_key } from '../../../api_key';

let newSpreadsheet = {
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

// unrestricted key
const apiKey = 'lol';

export default function createSpreadsheet (sendResponse) {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (token) {
        let url = `https://sheets.googleapis.com/v4/spreadsheets?fields=spreadsheetId%2CspreadsheetUrl&key=${apiKey}`;
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onreadystatechange = event => {
          if (xhr.readyState == 4 && xhr.status == 200) resolve(xhr.response);
        }
        xhr.open('POST', url, newSpreadsheet);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(JSON.stringify(newSpreadsheet));
      } else {
          var message = "";
          if (chrome.runtime.lastError)
              message = chrome.runtime.lastError.message;
          reject({ status: "Not signed into Chrome, network error or no permission.\n" + message });
      }
    });
  })
}

// // xhr response sample
// {
//   onabort: null
//   onerror: null
//   onload: null
//   onloadend: null
//   onloadstart: null
//   onprogress: null
//   onreadystatechange: ƒ (event)
//   ontimeout: null
//   readyState: 4
//   response: '{↵  "spreadsheetId": "13SIaHptYc4aUORzDarl7eFUt39mOJcIbr9H8rsZamJ8",↵  "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/13SIaHptYc4aUORzDarl7eFUt39mOJcIbr9H8rsZamJ8/edit"↵}↵'
//   responseText: '{↵  "spreadsheetId": "13SIaHptYc4aUORzDarl7eFUt39mOJcIbr9H8rsZamJ8",↵  "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/13SIaHptYc4aUORzDarl7eFUt39mOJcIbr9H8rsZamJ8/edit"↵}↵'
//   responseType: ""
//   responseURL: "https://sheets.googleapis.com/v4/spreadsheets?fields=spreadsheetId%2CspreadsheetUrl&key=lol"
//   responseXML: null
//   status: 200
//   statusText: ""
//   timeout: 0
//   upload: XMLHttpRequestUpload {onloadstart: null, onprogress: null, onabort: null, onerror: null, onload: null, …}
//   withCredentials: false
// }
