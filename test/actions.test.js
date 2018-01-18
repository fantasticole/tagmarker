import * as actions from '../background/src/store/actions';

describe('actions', () => {
  it('should create a tag', () => {
    const tags = [{ title: 'test' }];
    const expectedAction = {
      type: 'CREATE_OR_UPDATE_TAGS',
      tags
    }
    expect(actions.createOrUpdateTags(tags)).toEqual(expectedAction)
  })
})
