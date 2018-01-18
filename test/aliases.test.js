import * as aliases from '../background/src/store/aliases';

describe('aliases', () => {
  // createBookmark
  // { bookmark, tagsToAdd } = originalAction
  it('should create an action to create or update tags', () => {
    // CREATE_BOOKMARK
  });

  it('should create an action to create or update a bookmark', () => {
  });

  // createFolder
  // { folder } = originalAction
  it('should create an action to create a tag from a folder object', () => {
    // CREATE_FOLDER
  });

  // createTag (title, tags, bookmarkId)
  it('should create a tag with an id that does not already exist in the tags object in the store', () => {
  });

  // getTagsToUpdate (tagsToAdd, tagsToDelete, alltags, bookmarkId)
  it('should create a tag for any id we are adding that does not already exist', () => {
  });

  it('should add the bookmark id to the tag object for any tag id we are adding', () => {
  });

  it('should remove the bookmark id from the tag object for any tag id we are removing', () => {
  });

  it('should return an array of tag objects', () => {
  });

  // removeTag
  // { id } = originalAction
  it('should create an action to update selected tags with an array that does not have the id passed in', () => {
    // REMOVE_TAG
  });

  it('should create an action to filter bookmarks and tags based on the new array of selected tags', () => {
  });

  // selectBookmark
  // { id } = originalAction
  it('should create an action to update filtered tags to the tags associated with the bookmark id that is passed in', () => {
    // SELECT_BOOKMARK
  });

  it('should create an action to update filtered tags with an array that does not include any selected tags', () => {
  });

  it('should create an action to set filtered bookmarks to an array of only the selected bookmark id', () => {
  });

  // selectTag
  // { id } = originalAction
  it('should create an action to update selected tags to include the tag id that was passed in', () => {
    // SELECT_TAG
  });

  it('should create an action to filter bookmarks and tags based on the new array of selected tags', () => {
  });

  // updateBookmark
  // { bookmark } = originalAction
  it('should create an action to create or update tags', () => {
    // UPDATE_BOOKMARK
  });

  it('should create an action to update a bookmark', () => {
  });
})
