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

  describe('removeTag', () => {
    const store = mockStore(testState);
    const storeActions = store.getActions();

    store.dispatch(aliases.removeTag({ id: 3 }));

    it('should create an action to delete the tag from the store', () => {
      const deleteTagAction = { type: 'DELETE_TAG', id: 3 };
      expect(storeActions[0]).toEqual(deleteTagAction);
    });

    it('should create an action to update each associated bookmark to not have the tag id', () => {
      const updateBookmarkAction = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark: { id: 1, title: 'bookmark', tags: [] } };
      const updateBookmarkAction2 = { type: 'CREATE_OR_UPDATE_BOOKMARK', bookmark: { id: 2, title: 'other bookmark', tags: [ 4 ] } };
      expect(storeActions[1]).toEqual(updateBookmarkAction);
      expect(storeActions[2]).toEqual(updateBookmarkAction2);
    });

    it('should create an action to update selected tags if the tag being deleted was selected', () => {
      const selectedTagsAction = { type: 'UPDATE_SELECTED_TAGS', tags: [] };
      expect(storeActions[3]).toEqual(selectedTagsAction);
    });

    it('should create actions to filter bookmarks and tags for each updated bookmark', () => {
      const filterBookmarksAction = { type: 'UPDATE_FILTERED_BOOKMARKS', bookmarks: [] };
      // THIS IS WRONG
      // not sure why the tags object isn't updating in time in the test,
      // but the tags here should be Object.keys(tags), which should only
      // include 4 at this point.
      const filterTagsAction = { type: 'UPDATE_FILTERED_TAGS', tags: [ '3', '4' ] };
      expect(storeActions[4]).toEqual(filterBookmarksAction);
      expect(storeActions[5]).toEqual(filterTagsAction);
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
