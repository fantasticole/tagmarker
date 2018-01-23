import React from 'react'
import { Provider } from 'react-redux';
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15';
import configureMockStore from 'redux-mock-store'

import BookmarkList from '../injected/src/components/BookmarkList'
import testState from './testState';

const store = configureMockStore()(testState);
const storeState = store.getState();

Enzyme.configure({ adapter: new Adapter() });

function bookmarkListSetup (filteredBookmarks) {
  const props = {
    ascending: storeState.sort.bookmarks.ascending,
    filteredBookmarks,
    sortBy: storeState.sort.bookmarks.sortBy,
  }

  const enzymeWrapper = mount(
    <Provider store={store}>
      <BookmarkList {...props} store={store} />
    </Provider>
  )

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('BookmarkList', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = bookmarkListSetup(Object.values(storeState.bookmarks))

      expect(enzymeWrapper.find('div').first().hasClass('bookmark-list__container')).toBe(true)
      expect(enzymeWrapper.find('ul').hasClass('tagmarker-list')).toBe(true)
      expect(enzymeWrapper.find('ul').hasClass('bookmark-list')).toBe(true)

      const BookmarkActions = enzymeWrapper.find('BookmarkActions').props()
      expect(enzymeWrapper.find('BookmarkActions').exists()).toEqual(true);
      
      const BookmarkListItems = enzymeWrapper.find('BookmarkListItem')
      expect(BookmarkListItems).toHaveLength(2);

      const BookmarkListItemProps = enzymeWrapper.find('BookmarkListItem').first().props()
      expect(BookmarkListItemProps.bookmark).toBe(storeState.bookmarks[1])
      expect(BookmarkListItemProps.isActive).toBe(false)
      expect(BookmarkListItemProps.tags).toBe(storeState.tags)
    })

    it('should render the first BookmarkListItem active if it is the only one', () => {
      const { enzymeWrapper } = bookmarkListSetup([storeState.bookmarks[1]])

      const BookmarkListItemProps = enzymeWrapper.find('BookmarkListItem').props()
      expect(BookmarkListItemProps.isActive).toBe(true)
    })

    it('should render empty state if there are no filteredBookmarks ', () => {
      const { enzymeWrapper } = bookmarkListSetup([])

      expect(enzymeWrapper.find('p').hasClass('empty-list__message')).toBe(true)
      expect(enzymeWrapper.find('p').text()).toBe('no bookmarks to display');
    })
  })
})
