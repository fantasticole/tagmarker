import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import EditableTags from './EditableTags';
import MarqueeWrapper from './MarqueeWrapper';
import Select from 'react-select';

import ifTrue from '../utils/ifTrue';

export default class Bookmark extends Component {
  constructor (props) {
    super(props);

    this.state = {
      active: false,
      isEditing: false,
      selected: [...this.props.bookmark.tags],
    };
  }

  handleClickEdit () {
    this.setState({ isEditing: true });
  }

  handleClickSave () {
    let { bookmark } = this.props,
        { selected } = this.state,
        tagsToAdd = selected.filter(t => (!bookmark.tags.includes(t))),
        tagsToDelete = bookmark.tags.filter(t => (!selected.includes(t)));

    // delete tags to be deleted if we have any
    if (tagsToDelete.length) this.props.deleteTags(bookmark.id, tagsToDelete);
    // add tags to be added if we have any
    if (tagsToAdd.length) this.props.addTags(bookmark.id, tagsToAdd);
    // exit editing state
    this.setState({ isEditing: false });
  }

  handleExitEdit (reset) {
    // reset tags and exit editing state
    this.setState({
      isEditing: false,
      selected: [...this.props.bookmark.tags],
    });
  }

  handleToggleDetails () {
    this.setState({ active: !this.state.active });
  }

  setSelectedTags (selected) {
    this.setState({ selected });
  }

  renderBookmarkActions () {
    if (this.state.isEditing) {
      return (
        <span className='bookmark__actions'>
          <button className='button bookmark-action__button action-button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
          <button className='button bookmark-action__button action-button' onClick={() => this.handleExitEdit()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      );
    }
    return (
      <button className='button bookmark-action__button action-button' onClick={() => this.handleClickEdit()}>Edit <i className='fa fa-pencil'/></button>
    );
  }

  renderTags () {
    let { selected } = this.state,
        // get tag object for each id
        tags = selected.map(id => {
          // if a tag object exists for the id, return that
          if (this.props.tags[id]) return this.props.tags[id];
          // otherwise, create an object for the tag to be created
          return { title: id, id: id }
        });

    if (this.state.isEditing) {
      // render each tag associated with the bookmark, plus
      // the ones staged to be added to the bookmark
      return (
        <EditableTags
          selectTags={(tags) => this.setSelectedTags(tags)}
          selected={selected}
          tags={this.props.tags}
          />
      );
    }
    return (
      <MarqueeWrapper>
        {tags.map(tag => (
          <span className='bookmark__tag' key={tag.id}>{tag.title}</span>
        ))}
      </MarqueeWrapper>
    );
  }

  render () {
    let { bookmark } = this.props,
        { active } = this.state,
        bookmarkClasses = classNames('bookmark', {
          'active': active,
        });
    
    return (
      <li className={bookmarkClasses} key={bookmark.id} ref={`bookmark-${bookmark.id}`}>
        <p
          className='bookmark__title'
          onClick={() => this.handleToggleDetails()}
          >
          <button className='show-more'><i className='fa fa-caret-right'/></button>
          {bookmark.title}
        </p>
        {ifTrue(active).render(() => (
          <div className='bookmark__details'>
            <div className='bookmark-detail bookmark-detail__link'>
              <a className='bookmark-detail__link' href={bookmark.url} target='_parent'><img className='bookmark-favicon' src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}/>{bookmark.title || bookmark.url}</a>
            </div>
            <div className='bookmark-detail bookmark-detail__date'>
              <span className='detail-title'>Created:</span> { new Date(bookmark.dateAdded).toLocaleString() }
            </div>
            <div className='bookmark-detail bookmark-detail__tags'>
              {this.renderTags()}
            </div>
            <div className='bookmark-detail bookmark-detail__actions'>
              {this.renderBookmarkActions()}
            </div>
          </div>
        ))}
      </li>
    );
  }
}
