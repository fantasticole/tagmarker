import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import MarqueeWrapper from './MarqueeWrapper';
import Select from 'react-select';

/**
 * EditableTags
 *
 * @param {array} [selected] - optional list of selected tag ids
 * @param {function} selectTags - function to run when tag is selected
 * @param {array} suggested - optional list of suggested tag ids
 * @param {object} tags - all tags from store
 */
export default class EditableTags extends Component {
  constructor (props) {
    super(props);

    this.state = {
      options: [],
      selected: this.props.selected ? this.props.selected : [],
    };
  }

  componentDidMount () {
    this.setOptions();
  }

  handleDeleteTag (id) {
    let { options, selected } = this.state,
        { tags } = this.props,
        tag = tags[id],
        // find index of tag to remove
        tagIndex = selected.indexOf(id);

    // remove the tag id
    selected.splice(tagIndex, 1);
    // if we have a tag object for it,
    if (tag) {
      // add it back to the options
      options.push(tag);
      // sort the options to appear alphabetically
      options = this.sortOptions(options);
    }
    // update the state
    this.setState({ options, selected });
    this.props.selectTags(selected)
  }

  selectTag (id) {
    let { options, selected } = this.state,
        index = options.findIndex(o => (o.id === id));

    selected.push(id);
    // if it's in the options array, remove it
    if (index > -1) options.splice(index, 1);
    this.setState({ options, selected });
    this.props.selectTags(selected)
  }

  setOptions () {
    let { selected } = this.state,
        { tags } = this.props,
        tagOptions = Object.values(tags).filter(tag => !selected.includes(tag.id)),
        options = this.sortOptions(tagOptions);

    this.setState({ options });
  }

  sortOptions (options) {
    return options.sort((a, b) => {
      let aTitle = a.title.toLowerCase(),
          bTitle = b.title.toLowerCase();

      if (aTitle < bTitle) return -1;
      if (aTitle > bTitle) return 1;
      return 0;
    });
  }

  renderOption (tag) {
    if (!tag.className) {
      let { tags } = this.props,
          parent = tags[tag.parentId],
          tagCount = tag.bookmarks.length,
          tagNoun = tagCount === 1 ? ' bookmark' : ' bookmarks',
          tagParent = parent ? `, in folder ${parent.title}` : '';

      return (
        <span>
          <p className='tag-title'>{tag.title}</p>
          <p className='tag-info'>{tagCount}{tagNoun}{tagParent}</p>
        </span>
      );
    }
    return <span><p className='tag-title'>{tag.title}</p></span>
  }

  renderTags (tags, type) {
    // always render if there are tags
    if (tags.length) {
      let tagClasses = classNames('button', 'bookmark__button', 'bookmark__tag', {
            'bookmark__tag--is_editing': type === 'selected',
            'bookmark__tag--is_suggested': type === 'suggested',
          }),
          iconClasses = classNames('fa', {
            'fa-times-circle': type === 'selected',
            'fa-plus-circle': type === 'suggested',
          });

      return (
        <div className={`bookmark__tags--are_${type}`}>
          {tags.map(tag => (
            <MarqueeWrapper key={tag.id}>
              <button className={tagClasses} onClick={() => {type === 'selected' ? this.handleDeleteTag(tag.id) : this.selectTag(tag.id)}}>{tag.title} <i className={iconClasses}/></button>
            </MarqueeWrapper>
          ))}
        </div>
      )
    }
    else if (type === 'selected') {
      return (
        <p className='empty-list__message'>no tags selected</p>
      );
    }
  }

  render () {
    let { selected } = this.state,
        { suggested, tags } = this.props,
        selectedTags = selected.map(id => {
          let tag = tags[id];

          // if we have a tag object for the id, return that
          if (tag) return tag;
          // otherwise, mock one
          else return { title: id, id }
        }),
        // if we have suggestions, render those that aren't selected
        suggestedTags = suggested ? suggested.filter(id => !selected.includes(id))
          // a suggestion may be a folder that's getting created from
          // the CreateBookmarkModal, in which case, a tag should be faked
          .map(id => tags[id] ? tags[id] : { title: id, id }) : [];

    return (
      <div className='bookmark__tags'>
        <p className='bookmark__tags-title'>tags</p>
        {this.renderTags(selectedTags, 'selected')}
        {this.renderTags(suggestedTags, 'suggested')}
        <div className='bookmark__tags-search'>
          <Select.Creatable
            className='tag-selector'
            labelKey='title'
            multi={false}
            name='tag-select'
            onChange={(selected) => this.selectTag(selected.id)}
            optionRenderer={(option) => this.renderOption(option)}
            options={this.state.options}
            placeholder='select tags'
            promptTextCreator={(label) => (`Create tag "${label}"`)}
            valueKey='id'
            />
        </div>
      </div>
    );
  }
}
