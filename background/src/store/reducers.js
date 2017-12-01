export function count (state = 0, action) {
  switch (action.type) {
    case 'ADD_COUNT':
      return state + (action.payload || 1);
    default:
      return state;
  }
};

export function setBookmarks (state = [], action) {
  switch (action.type) {
    case 'SET_BOOKMARKS':
      return action.data;
    default:
      return state;
  }
};

export function setTags (state = {}, action) {
  switch (action.type) {
    case 'SET_TAGS':
      return action.data;
    default:
      return state;
  }
};
