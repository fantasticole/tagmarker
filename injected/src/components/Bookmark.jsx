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
      tagsToAdd: [],
      tagsToDelete: [],
      value: '',
    };
  }

  handleAddTag (tagId) {
    let { tagsToAdd } = this.state;

    tagsToAdd.push(tagId);
    this.setState({ tagsToAdd });
  }

  handleClickAdd () {
    this.setState({ isAdding: true });
  }

  handleClickEdit () {
    this.setState({ isEditing: true });
  }

  handleClickSave () {
    let { bookmark } = this.props,
        { tagsToAdd, tagsToDelete } = this.state;

    // delete tags to be deleted
    deleteTags(bookmark.id, tagsToDelete);
    // add tags to be added
    addTags(bookmark.id, tagsToAdd);
    // exit editing state
    this.handleExitEdit();
  }

  handleDeleteTag (tagId) {
    let { tagsToAdd, tagsToDelete } = this.state;

    // see if the tag is just staged to be added
    if (tagsToAdd.includes(tagId)) {
      // in which case, remove it from array of tags to add
      tagsToAdd = tagsToAdd.splice(tagsToAdd.indexOf(tagId), 1);
      this.setState({ tagsToAdd });
    }
    else {
      // otherwise, add it to array of tags to delete
      tagsToDelete.push(tagId);
      this.setState({ tagsToDelete });
    }
  }

  handleExitEdit () {
    this.setState({ isEditing: false });
    this.setState({ isAdding: false });
  }

  handleSelectTag (selectedOption) {
    let { tagsToAdd } = this.state;

    // add tag to add to 'tagsToAdd' array
    tagsToAdd.push(selectedOption);
    this.setState({ tagsToAdd });
  }

  handleToggleDetails () {
    this.setState({ active: !this.state.active });
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
      let { bookmark, tags } = this.props,
          { tagsToAdd } = this.state,
          options = [],
          allTags = Object.values(tags),
          sortedOptions;

      allTags.forEach(t => {
        // if the tag isn't already associated with the bookmark or
        // staged to be added, include it as an option

        // TODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
        // Make sure tags that shouldn't be in the list aren't
        // if they're in tagsToAdd, don't render them as options
        // if they're in tagsToDelete, do render them as an option
        // TODOTODOTODOTODOTODOTODOTODOTODOTODOTODO
        
        if (!bookmark.tags.includes(t.id) && !tagsToAdd.includes(t.id)) {
          options.push({ label: t.title, value: t.id });
        }
      });
      // sort the options to appear alphabetically
      sortedOptions = options.sort((a, b) => {
        let aLabel = a.label.toLowerCase(),
            bLabel = b.label.toLowerCase();

        if (aLabel < bLabel) return -1;
        if (aLabel > bLabel) return 1;
        return 0;
      });
      return (
        <div className='bookmark-detail bookmark-detail__is-select'>
          <Select.Creatable
            className='tag-selector'
            multi={false}
            name='tag-select'
            onChange={(selected) => this.handleSelectTag(selected)}
            options={sortedOptions}
            value={this.state.value}
            />
        </div>
      );
    }
  }

  renderTags () {
    let tagIds = this.props.bookmark.tags,
        // get tag object for each id
        tags = tagIds.map(t => (this.props.tags[t]));

    if (this.state.isEditing) {
      let newTags = [];

      // create object to render for each 'tagToAdd' on save
      this.state.tagsToAdd.forEach(newTag => {
        if (!tagIds.includes(newTag.value)) {
          newTags.push({ title: newTag.label, id: newTag.value });
        }
      });

      tags = tags.concat(newTags);

      // render each tag associated with the bookmark, plus
      // the ones staged to be added to the bookmark
      return (
        <span className='bookmark-tags__editing'>
          {tags.map(tag => {
            if (!this.state.tagsToDelete.includes(tag.id)){
              return (
                <button className='button bookmark-button bookmark-tag' key={tag.id} onClick={() => this.handleDeleteTag(tag.id)}>{tag.title} <i className='fa fa-times-circle'/></button>
              );
            }
          })}
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
