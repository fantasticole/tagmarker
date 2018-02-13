import { api_key } from '../../../api_key';
import store from '../store';

const newSpreadsheet = {
 "sheets": [
  {
   "properties": {
    "gridProperties": {
     "columnCount": 7,
     "frozenRowCount": 1,
     "rowCount": 2
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
     "columnCount": 6,
     "frozenRowCount": 1,
     "rowCount": 2
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
        // if the request is unsuccessful, throw an error
        if (xhr.status !== 200) console.error(xhr.response)
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

        // when we have success, pass the data to the resolve function
        if (xhr.status == 200) {
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
      else reject(xhrOrError);
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
      // if the request is unsuccessful, throw an error
      if (xhrOrError.xhr.status !== 200) console.error(xhr.response)
    }
    else console.error(xhrOrError);
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

        // if we have success
        if (xhr.status == 200) {
          let sheetData = {};

          // get row count to get ranges for tags and bookmarks
          xhr.response.sheets.forEach(sheet => {
            sheetData[sheet.properties.title] = sheet.properties.gridProperties.rowCount;
          });

          // use tag and bookmark counts to get data within that range
          getData(sheetData, id)
            // format and return that data
            .then(tagsAndBookmarks => resolve(formatObjects(tagsAndBookmarks)));
        }
        else if (xhr.status == 404) resolve();
      }
      else reject(xhrOrError);
    }, 'json')
  })
}

function formatObjects ({ tags, bookmarks }) {
  let formatted = { tags: {}, bookmarks: {} };

  // format the tags
  tags.forEach(tag => {
    formatted.tags[tag[3]] = {
      // if bookmarks isn't an empty string, split the ids at the commas
      bookmarks: tag[0] ? tag[0].split(',') : [],
      dateAdded: Number(tag[1]),
      dateGroupModified: Number(tag[2]),
      id: tag[3],
      parentId: tag[4],
      // if parents isn't an empty string, split the ids at the commas
      parents: tag[5] ? tag[5].split(',') : [],
      title: tag[6],
    }
  })
  // format the bookmarks
  bookmarks.forEach(bookmark => {
    formatted.bookmarks[bookmark[1]] = {
      dateAdded: Number(bookmark[0]),
      id: bookmark[1],
      parentId: bookmark[2],
      // if tags isn't an empty string, split the ids at the commas
      tags: bookmark[3] ? bookmark[3].split(',') : [],
      title: bookmark[4],
      url: bookmark[5],
    }
  })

  return formatted;
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

function getData (data, id) {
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values:batchGet?ranges=tags!A2%3AG${data.tags}&ranges=bookmarks!A2%3AF${data.bookmarks}&key=${api_key}`;

  return new Promise((resolve, reject) => {
    newRequest(false, url, 'GET', (xhrOrError) => {
      if (xhrOrError.xhr) {
        let { xhr } = xhrOrError;

        // when the request is successful
        if (xhr.status == 200) {
          let { valueRanges } = xhr.response;

          resolve({
            // find range with name starting with t to get tags
            tags: valueRanges.find(sheet => sheet.range[0] === 't').values,
            // find range with name starting with b to get bookmarks
            bookmarks: valueRanges.find(sheet => sheet.range[0] === 'b').values,
          })
        }
      }
      else reject(xhrOrError);
    }, 'json')
  })
}

export function getRowIndex (sheet, endRange, bookmarkOrTagId) {
  let { id } = store.getState().spreadsheet;
  // get the column that holds the bookmark or tag ids
  let idColumn = sheet === 'bookmarks' ? 'B' : 'D';
  let url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}!${idColumn}1%3A${idColumn}${endRange+1}?valueRenderOption=UNFORMATTED_VALUE&majorDimension=COLUMNS&key=${api_key}`;

  newRequest(false, url, 'GET', (xhrOrError) => {
    if (xhrOrError.xhr) {
      let { xhr } = xhrOrError;

      // if it's successful
      if (xhr.status == 200) {
        // get the index of the row we're looking for
        let rowIndex = xhr.response.values[0].findIndex(id => id === bookmarkOrTagId);
        console.log({rowIndex})
      }
      // otherwise, log the error to the console
      else { console.error(xhr.response.error) }
    }
    else console.error(xhrOrError);
  }, 'json')
}

function newRequest (interactive, url, type, callback, responseType, data) {
  chrome.identity.getAuthToken({ interactive }, (token) => {
    if (token) {
      let xhr = new XMLHttpRequest();
      if (responseType) xhr.responseType = 'json';
      xhr.onreadystatechange = event => {
        // when the request is done, call the callback on the request
        if (xhr.readyState == 4) callback({ xhr });
      }
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
