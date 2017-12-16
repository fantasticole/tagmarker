import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import MarqueeWrapper from './MarqueeWrapper';
import Select from 'react-select';

import ifTrue from '../utils/ifTrue';
import { addTags, deleteTags } from '../utils/actions';

class Bookmark extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      isAdding: false,
      isEditing: false,
      options: [],
      tags: [...this.props.bookmark.tags],
    };
  }

  handleAddTag (selectedOption) {
    let { options, tags } = this.state,
        { value } = selectedOption,
        index = options.findIndex(o => (o.value === value));

    tags.push(value);
    if (index > -1) {
      options.splice(index, 1);
      this.setState({ options, tags });
    }
    else {
      this.setState({ tags });
    }
  }

  handleClickAdd () {
    this.setState({ isAdding: true });
  }

  handleClickEdit () {
    // if we don't already have options, set them
    if (!this.state.options.length) this.setOptions();
    this.setState({ isEditing: true });
  }

  handleClickSave () {
    let { bookmark } = this.props,
        { tags } = this.state,
        tagsToAdd = tags.filter(t => (!bookmark.tags.includes(t))),
        tagsToDelete = bookmark.tags.filter(t => (!tags.includes(t)));

    // delete tags to be deleted if we have any
    if (tagsToDelete.length) deleteTags(bookmark.id, tagsToDelete);
    // add tags to be added if we have any
    if (tagsToAdd.length) addTags(bookmark.id, tagsToAdd);
    // exit editing state
    this.handleExitEdit();
  }

  handleDeleteTag (tagId) {
    let { options, tags } = this.state,
        currentTag = this.props.tags[tagId],
        sortedOptions;

    // remove it from array of bookmark tags
    tags.splice(tags.indexOf(tagId), 1);
    // if we have a tag object, add it to the tag options
    if (currentTag) options.push({ label: currentTag.title, value: currentTag.id })
    sortedOptions = this.sortOptions(options);
    // update the state
    this.setState({ options: sortedOptions, tags });
  }

  handleExitEdit () {
    this.setState({ isAdding: false, isEditing: false });
  }

  handleToggleDetails () {
    this.setState({ active: !this.state.active });
  }

  setOptions () {
    let { tags } = this.props,
        allTags = Object.values(tags),
        currentTags = this.state.tags,
        options = [],
        sortedOptions;

    allTags.forEach(t => {
      if (!currentTags.includes(t.id)) {
        options.push({ label: t.title, value: t.id });
      }
    });
    // sort the options to appear alphabetically
    sortedOptions = this.sortOptions(options);
    this.setState({ options: sortedOptions });
  }

  sortOptions(options) {
    return options.sort((a, b) => {
      let aLabel = a.label.toLowerCase(),
          bLabel = b.label.toLowerCase();

      if (aLabel < bLabel) return -1;
      if (aLabel > bLabel) return 1;
      return 0;
    });
  }

  renderBookmarkActions () {
    if (this.state.isEditing) {
      return (
        <span>
          <button className='button bookmark__action-button add-tag' onClick={() => this.handleClickAdd()}>Add Tag <i className='fa fa-plus-circle'/></button>
          <button className='button bookmark__action-button' onClick={() => this.handleClickSave()}>Save <i className='fa fa-floppy-o'/></button>
          <button className='button bookmark__action-button' onClick={() => this.handleExitEdit()}>Cancel <i className='fa fa-ban'/></button>
        </span>
      );
    }
    return (
      <button className='button bookmark__action-button' onClick={() => this.handleClickEdit()}>Edit <i className='fa fa-pencil'/></button>
    );
  }

  renderInput () {
    if (this.state.isAdding) {
      return (
        <div className='bookmark-detail bookmark-detail__is-select'>
          <Select.Creatable
            className='tag-selector'
            multi={false}
            name='tag-select'
            onChange={(selected) => this.handleAddTag(selected)}
            options={this.state.options}
            value=''
            />
        </div>
      );
    }
  }

  renderTags () {
    let tagIds = this.state.tags,
        // get tag object for each id
        tags = tagIds.map(id => {
          // if a tag object exists for the id, return that
          if (this.props.tags[id]) return this.props.tags[id];
          // otherwise, create an object for the tag to be created
          return { title: id, id: id }
        });

    if (this.state.isEditing) {
      // render each tag associated with the bookmark, plus
      // the ones staged to be added to the bookmark
      return (
        <span className='bookmark-tags__editing'>
          {tags.map(tag => (
            <button className='button bookmark-button bookmark-tag' key={tag.id} onClick={() => this.handleDeleteTag(tag.id)}>{tag.title} <i className='fa fa-times-circle'/></button>
          ))}
        </span>
      );
    }
    return (
      <MarqueeWrapper>
        {tags.map(tag => (
          <span className='bookmark-tag' key={tag.id}>{tag.title}</span>
        ))}
      </MarqueeWrapper>
    );
  }

  render () {
    let { bookmark } = this.props,
        { active } = this.state,
        bookmarkClasses = ['bookmark'];

    if (active) bookmarkClasses.push('active');
    
    return (
      <li className={bookmarkClasses.join(' ')} key={bookmark.id} ref={`bookmark-${bookmark.id}`}>
        <p
          className='bookmark-title'
          onClick={() => this.handleToggleDetails()}
          >
          <button className='show-more'><i className='fa fa-caret-right'/></button>
          {bookmark.title}
        </p>
        {ifTrue(active).render(() => (
          <div className='bookmark-info'>
            <div className='bookmark-detail bookmark-detail__is-link'>
              <a className='bookmark-info__link' href={bookmark.url} target='_parent'>{bookmark.title || bookmark.url}</a>
            </div>
            <div className='bookmark-detail bookmark-detail__is-date'>
              <span className='detail-title'>Date Added:</span> { new Date(bookmark.dateAdded).toLocaleString() }
            </div>
            <div className='bookmark-detail bookmark-detail__is-tags'>
              { this.renderTags() }
            </div>
            {this.renderInput()}
            <div className='bookmark-detail bookmark-detail__is-actions'>
              {this.renderBookmarkActions()}
            </div>
          </div>
        ))}
      </li>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tags: state.tags,
  };
}

export default connect(mapStateToProps)(Bookmark);
