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

export function toggleDrawer (state = true, action) {
  switch (action.type) {
    case 'TOGGLE_DRAWER':
      return action.data;
    default:
      return state;
  }
};
