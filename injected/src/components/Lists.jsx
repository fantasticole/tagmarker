import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import BookmarkList from './BookmarkList';
import TagList from './TagList';

class Lists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTags: [],
      selectedBookmarks: [],
    };
  }

  componentDidMount () {
    this.loadBookmarks();
  }

  handleClickTag (id) {
    let { selectedTags } = this.state,
        tagIndex = selectedTags.indexOf(id);

    tagIndex < 0 ? selectedTags.push(id) : selectedTags.splice(tagIndex, 1);
    this.setState({ selectedTags });
    this.loadBookmarks();
  }

  loadBookmarks () {
    if (this.props.bookmarks) {
      let { bookmarks, tags } = this.props,
          { selectedTags } = this.state,
          // get all bookmarks associated with current tags
          filteredBookmarks = selectedTags.reduce((arr, id) => {
            // filter tag's bookmarks array for duplicates
            let additions = tags[id].bookmarks.filter(bookmark => (
              // return item if not already in arr
              !arr.includes(bookmark)
            ));
            // add unique ids to arr
            return arr.concat(additions)
          // }, []);
          }, []);
          // selectedBookmarks = filteredBookmarks.map(id => (
          //   // get the bookmark object for each id
          //   bookmarks.find(bookmark => (bookmark.id === id))
          // )),
          // selectedBookmarks;

      console.log('filteredBookmarks:', filteredBookmarks)
      console.log('find this many bookmarks:', filteredBookmarks.length);
      var t0 = performance.now();
      this.getBookmarksFromAPI(filteredBookmarks, t0);
      // var t1 = performance.now();
      var t2 = performance.now();
      this.getBookmarksFromLocalStorage(filteredBookmarks, t2);
      // var t3 = performance.now();
      // console.log("Call to get from API took " + (t1 - t0) + " milliseconds.")
      // console.log("Call to get from LocalStorage took " + (t3 - t2) + " milliseconds.")

      // console.log('selectedBookmarks:', selectedBookmarks)
      // this.setState({ selectedBookmarks });
    }
  }

  // getBookmarksFromStore (idList) {
  //   let { bookmarks } = this.props,
  //       selectedStore = idList.map(id => (
  //         // get the bookmark object for each id
  //         bookmarks.find(bookmark => (bookmark.id === id))
  //       ));
  //   console.log('selectedStore:', selectedStore)
  // }

  getBookmarksFromAPI (idList, start) {
    // let selectedAPI = idList.map(id => (
    //       new Promise((resolve, reject) => {
    //         chrome.bookmarks.get(id, resolve);
    //       }).then(arr => (arr[0]))
    //     ));
    chrome.bookmarks.get(idList, selectedBookmarks => {
      var t1 = performance.now();
      console.log("Call to get from API took " + (t1 - start) + " milliseconds.")
      console.log('selectedAPI:', selectedBookmarks)
      // this.setState({ selectedBookmarks });
    });

    // Promise.all(selectedAPI).then(selectedBookmarks => {
    //   var t1 = performance.now();
    //   console.log("Call to get from API took " + (t1 - start) + " milliseconds.")
    //   console.log('selectedAPI:', selectedBookmarks)
    //   this.setState({ selectedBookmarks });
    // });
  }

  getBookmarksFromLocalStorage (idList, start) {
    var t3 = performance.now();
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')),
        selectedBookmarks = idList.map(id => (
          bookmarks.find(bookmark => (bookmark.id === id))
        ));
    console.log("Call to get from LocalStorage took " + (t3 - start) + " milliseconds.")
    console.log('selectedBookmarks:', selectedBookmarks)
    this.setState({ selectedBookmarks });
  }

  render () {
    return (
      <div className='drawer__content lists'>
        <h1 className='drawer__header tags__header'>Tags</h1>
        <TagList
          handleClickTag={(id) => this.handleClickTag(id)}
          selectedTags={this.state.selectedTags}
          />
        <h1 className='drawer__header bookmarks__header'>Bookmarks</h1>
        <BookmarkList
          selectedBookmarks={this.state.selectedBookmarks}
          />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    bookmarks: state.bookmarks,
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(Lists);
