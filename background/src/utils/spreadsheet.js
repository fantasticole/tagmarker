import { api_key } from '../../../api_key';
import store from '../store';

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
    let url = `https://sheets.googleapis.com/v4/spreadsheets?fields=sheets%2CspreadsheetId%2CspreadsheetUrl&key=${api_key}`;

    newRequest(true, url, 'POST', (xhrOrError) => {
      if (xhrOrError.xhr) {
        let { xhr } = xhrOrError;

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
      else if (xhrOrError.error) reject(xhrOrError.error);
      else reject({ xhrOrError });
    }, 'json', newSpreadsheet)
  })
}

export function deleteRow (sheet, index) {
  let { spreadsheet } = store.getState();
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheet.id}:batchUpdate?fields=replies%2CspreadsheetId%2CupdatedSpreadsheet&key=${api_key}`;

  const request = {
    requests: [
      {
        deleteDimension: {
          range: {
            sheetId: spreadsheet[`${sheet}Sheet`],
            dimension: 'ROWS',
            startIndex: index,
            endIndex: index + 1
          }
        }
      }
    ]
  };

  newRequest(false, url, 'POST', (xhrOrError) => {
    if (xhrOrError.xhr) {
      let { xhr } = xhrOrError;

      // when the request is done
      if (xhr.readyState == 4 && xhr.status !== 200) console.error(xhr.response)
    }
    else if (xhrOrError.error) console.error(xhrOrError.error);
    else console.log({ xhrOrError });
  }, null, request)
}

// TODO: check if file is in the trash
// can still be updated there though
export function exists (id) {
  return new Promise((resolve, reject) => {
    let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}?key=${api_key}`;

    newRequest(true, url, 'GET', (xhrOrError) => {
      if (xhrOrError.xhr) {
        let { xhr } = xhrOrError;

        if (xhr.status == 200) resolve(true);
        else if (xhr.status == 404) resolve(false);
      }
      else if (xhrOrError.error) reject(xhrOrError.error);
      else reject({ xhrOrError });
    })
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

export function getRowIndex (sheet, endRange, bookmarkOrTagId) {
  let { id } = store.getState().spreadsheet;
  // get the column that holds the bookmark or tag ids
  let idColumn = sheet === 'bookmarks' ? 'B' : 'D';
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}!${idColumn}1%3A${idColumn}${endRange+1}?valueRenderOption=UNFORMATTED_VALUE&majorDimension=COLUMNS&key=${api_key}`;

  newRequest(false, url, 'GET', (xhrOrError) => {
    if (xhrOrError.xhr) {
      let { xhr } = xhrOrError;

      // when the request is done
      if (xhr.readyState == 4) {
        // if it's successful
        if (xhr.status == 200) {
          // get the index of the row we're looking for
          let rowIndex = xhr.response.values[0].findIndex(id => id === bookmarkOrTagId);
          console.log({rowIndex})
        }
        // otherwise, log the error to the console
        else { console.error(xhr.response.error) }
      }
    }
    else if (xhrOrError.error) console.error(xhrOrError.error);
    else console.log({ xhrOrError });
  }, 'json')
}

function newRequest (interactive, url, type, callback, responseType, data) {
  chrome.identity.getAuthToken({ interactive }, (token) => {
    if (token) {
      let xhr = new XMLHttpRequest();
      if (responseType) xhr.responseType = 'json';
      xhr.onreadystatechange = event => { callback({ xhr }); }
      xhr.open(type, url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      data ? xhr.send(JSON.stringify(data)) : xhr.send();
    }
    else {
      let message = chrome.runtime.lastError ? chrome.runtime.lastError.message : "";
      callback({ error: "Not signed into Chrome, network error or no permission.\n" + message });
    }
  });
}
