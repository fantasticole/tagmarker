import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as aliases from '../background/src/store/aliases';
import testState from './testState';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('aliases', () => {
  describe('createBookmark', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();
    const storeState = store.getState();
    const bookmark = { id: 5, title: 'bookmark' };
    const tagsToAdd = [ 3, 4 ];

    store.dispatch(aliases.createBookmark({ bookmark, tagsToAdd }))

    it('should create an action to create or update tags', () => {
      const tags = [
        { id: 3, title: 'tag', bookmarks: [ 1, 2, 5 ], parents: [ 4 ] },
        { id: 4, title: 'other tag', bookmarks: [ 1, 5 ] }
      ];
      const createOrUpdateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags };
      expect(storeActions[0]).toEqual(createOrUpdateTagsAction)
    });

    it('should create an action to create or update a bookmark', () => {
      const newBookmark = Object.assign({}, bookmark, { tags: tagsToAdd } )
      const createOrUpdateBookmarkAction = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark: newBookmark };
      expect(storeActions[1]).toEqual(createOrUpdateBookmarkAction)
    });
  })

  describe('createFolder', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();
    const storeState = store.getState();
    const folder = {
      dateAdded: 1317956200396,
      dateGroupModified: 1516230597434,
      id: 6,
      parentId: 3,
      title: 'title',
    };

    store.dispatch(aliases.createFolder({ folder }))

    it('should create an action to create a tag from a folder object', () => {
      const parentsList = storeState.tags[folder.parentId].parents;
      const tags = [Object.assign({}, folder, {
        bookmarks: [],
        parents: [...parentsList, folder.parentId],
      })];
      const createOrUpdateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags };
      expect(storeActions[0]).toEqual(createOrUpdateTagsAction)
    });

    it('should create an action to update filtered bookmarks', () => {
      const filteredBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [ 1, 2 ] };
      expect(storeActions[1]).toEqual(filteredBookmarksAction);
    });

    it('should create an action to update filtered tags', () => {
      const filteredTagsAction = { type: 'UPDATE_FILTERED_TAGS', tags: [ 4 ] };
      expect(storeActions[2]).toEqual(filteredTagsAction);
    });
  })

  describe('createTag', () => {
    const store = mockStore(testState);
    const storeState = store.getState();

    it('should create a tag with an id that does not already exist in the tags object in the store', () => {
      const title = 'new Tag';
      const { tags } = storeState;
      const bookmarkId = 1;
      const newTag = aliases.createTag(title, tags, bookmarkId);
      // newTag's id should not exist in the store
      expect(tags[newTag.id]).toEqual(undefined);
      expect(newTag.title).toEqual(title);
      expect(newTag.bookmarks).toEqual([bookmarkId]);
    });
  })

  describe('deselectTag', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();

    // set up for seleted to not be empty
    const newState = Object.assign({}, testState, { selected: [3, 4] })
    const newStore = mockStore(newState);
    const newStoreActions = newStore.getActions();

    // test case where selected tags becomes an empty array
    store.dispatch(aliases.deselectTag({ id: 3 }));
    // test case where selected tags goes down to one
    newStore.dispatch(aliases.deselectTag({ id: 3 }));

    it('should create an action to update selected tags with an array that does not have the id passed in', () => {
      const selectedTagsAction = { type: 'UPDATE_SELECTED_TAGS', tags: [] };
      const newSelectedTagsAction = { type: 'UPDATE_SELECTED_TAGS', tags: [ 4 ] };
      expect(storeActions[0]).toEqual(selectedTagsAction);
      expect(newStoreActions[0]).toEqual(newSelectedTagsAction);
    });

    it('should create an action to filter bookmarks based on the new array of selected tags', () => {
      const filteredBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [] };
      const newFilteredBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [ 2 ] };
      expect(storeActions[1]).toEqual(filteredBookmarksAction);
      expect(newStoreActions[1]).toEqual(newFilteredBookmarksAction);
    });

    it('should create an action to filter tags based on the new array of selected tags', () => {
      // when no tags are selected, the tags are strings because
      // they're the keys from the tags object
      const filteredTagsAction = { type: 'UPDATE_FILTERED_TAGS', tags: [ "3", "4" ] };
      const newFilteredTagsAction = { type: 'UPDATE_FILTERED_TAGS', tags: [ 3 ] };
      expect(storeActions[2]).toEqual(filteredTagsAction);
      expect(newStoreActions[2]).toEqual(newFilteredTagsAction);
    });
  })

  describe('getTagsToUpdate', () => {
    const store = mockStore(testState);
    const storeState = store.getState();
    const tagsToAdd = [ 'test' ];
    const tagsToDelete = [ 4 ];
    const { tags } = storeState;
    const bookmarkId = 2;
    const tagsToUpdate = aliases.getTagsToUpdate(tagsToAdd, tagsToDelete, tags, bookmarkId);
    const newTag = tagsToUpdate.find(tag => tag.title === 'test')

    it('should create a tag for any id we are adding that does not already exist', () => {
      expect(tags[newTag.id]).toEqual(undefined);
    });

    it('should add the bookmark id to the tag object for any tag id we are adding', () => {
      expect(newTag.bookmarks).toEqual([ bookmarkId ]);
    });

    it('should remove the bookmark id from the tag object for any tag id we are removing', () => {
      const removedTagBookmarks = tagsToUpdate[1].bookmarks;
      expect(removedTagBookmarks.includes(bookmarkId)).toEqual(false);
    });

    it('should return an array of tag objects', () => {
      tagsToUpdate.forEach(tag => {
        expect(typeof tag).toEqual("object");
      })
    });
  })

  describe('removeBookmark', () => {
    testState.filteredBookmarks.push(1);
    const store = mockStore(testState);
    const storeActions = store.getActions();

    // test case where filtered bookmarks becomes an empty array
    store.dispatch(aliases.removeBookmark({ id: 1 }));

    it('should create an action to update the bookmark tags to not have the bookmark id', () => {
      const updateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags: [ { id: 3, title: 'tag', bookmarks: [ 2 ], parents: [ 4 ] } ] };
      expect(storeActions[0]).toEqual(updateTagsAction);
    });

    it('should create an action to update the filtered bookmarks to not have the bookmark id', () => {
      const filteredBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [] };
      expect(storeActions[1]).toEqual(filteredBookmarksAction);
    });

    it('should create an action to delete the bookmark from the store', () => {
      const deleteBookmarkAction = { type: 'DELETE_BOOKMARK', id: 1 };
      expect(storeActions[2]).toEqual(deleteBookmarkAction);
    });
  })

  describe('selectBookmark', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();

    store.dispatch(aliases.selectBookmark({ id: 2 }));

    it('should create an action to update filtered tags with an array that does not include any selected tags', () => {
      const filteredTagsAction = { type: 'UPDATE_FILTERED_TAGS', tags: [ 4 ] };
      expect(storeActions[0]).toEqual(filteredTagsAction);
    });

    it('should create an action to set filtered bookmarks to an array of only the selected bookmark id', () => {
      const filteredBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [ 2 ] };
      expect(storeActions[1]).toEqual(filteredBookmarksAction);
    });
  })

  describe('selectTag', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();

    store.dispatch(aliases.selectTag({ id: 4 }));

    it('should create an action to update selected tags to include the tag id that was passed in', () => {
      const selectedTagsAction = { type: 'UPDATE_SELECTED_TAGS', tags: [ 3, 4 ] };
      expect(storeActions[0]).toEqual(selectedTagsAction);
    });

    it('should create an action to filter bookmarks based on the new array of selected tags', () => {
      const filteredBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [ 2 ] };
      expect(storeActions[1]).toEqual(filteredBookmarksAction);
    });

    it('should create an action to filter tags based on the new array of selected tags', () => {
      const filteredTagsAction = { type: 'UPDATE_FILTERED_TAGS', tags: [] };
      expect(storeActions[2]).toEqual(filteredTagsAction);
    });
  })

  describe('updateBookmark', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();
    const bookmark = Object.assign({}, testState.bookmarks[2], { title: 'new title' })

    store.dispatch(aliases.updateBookmark({ bookmark }));

    it('should create an action to create or update tags', () => {
      const tags = [];
      const createOrUpdateTagsAction = { type: 'CREATE_OR_UPDATE_TAGS', tags };
      expect(storeActions[0]).toEqual(createOrUpdateTagsAction)
    });

    it('should create an action to update a bookmark', () => {
      const createOrUpdateBookmarkAction = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark };
      expect(storeActions[1]).toEqual(createOrUpdateBookmarkAction)
    });
  })
})
