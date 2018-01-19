import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as aliases from '../background/src/store/aliases';
import initialState from '../background/src/store/initialState';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const testState = {
  bookmarks: {
    1: { id: 1, title: 'bookmark', tags: [ 3 ] },
    2: { id: 2, title: 'other bookmark', tags: [ 3, 4 ] },
  },
  filteredBookmarks: [],
  filteredTags: [],
  selected: [],
  sort: {
    bookmarks: { ascending: true, sortBy: 'date' },
    tags: { ascending: true, sortBy: 'alpha' },
  },
  tags: {
    3: { id: 3, title: 'tag', bookmarks: [ 1 ] },
    4: { id: 4, title: 'other tag', bookmarks: [ 1, 2 ] },
  },
};

describe('aliases', () => {
  // createBookmark
  // { bookmark, tagsToAdd } = originalAction
  describe('createBookmark', () => {
    it('should create an action to create or update tags', () => {
      // CREATE_BOOKMARK
    });

    it('should create an action to create or update a bookmark', () => {
    });
  })

  // createFolder
  // { folder } = originalAction
  describe('createFolder', () => {
    it('should create an action to create a tag from a folder object', () => {
      // CREATE_FOLDER
    });
  })

  // createTag (title, tags, bookmarkId)
  describe('createTag', () => {
    it('should create a tag with an id that does not already exist in the tags object in the store', () => {
    });
  })

  // getTagsToUpdate (tagsToAdd, tagsToDelete, alltags, bookmarkId)
  describe('getTagsToUpdate', () => {
    it('should create a tag for any id we are adding that does not already exist', () => {
    });

    it('should add the bookmark id to the tag object for any tag id we are adding', () => {
    });

    it('should remove the bookmark id from the tag object for any tag id we are removing', () => {
    });

    it('should return an array of tag objects', () => {
    });
  })

  // removeTag
  // { id } = originalAction
  describe('removeTag', () => {
    it('should create an action to update selected tags with an array that does not have the id passed in', () => {
      // REMOVE_TAG
    });

    it('should create an action to filter bookmarks and tags based on the new array of selected tags', () => {
    });
  })

  // selectBookmark
  // { id } = originalAction
  describe('selectBookmark', () => {
    it('should create an action to update filtered tags to the tags associated with the bookmark id that is passed in', () => {
      // SELECT_BOOKMARK
    });

    it('should create an action to update filtered tags with an array that does not include any selected tags', () => {
    });

    it('should create an action to set filtered bookmarks to an array of only the selected bookmark id', () => {
    });
  })

  // selectTag
  // { id } = originalAction
  describe('selectTag', () => {
    it('should create an action to update selected tags to include the tag id that was passed in', () => {
      // SELECT_TAG
    });

    it('should create an action to filter bookmarks and tags based on the new array of selected tags', () => {
    });
  })

  // updateBookmark
  // { bookmark } = originalAction
  describe('updateBookmark', () => {
    it('should create an action to create or update tags', () => {
      // UPDATE_BOOKMARK
    });

    it('should create an action to update a bookmark', () => {
    });
  })
})
