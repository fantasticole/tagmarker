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
      options.push({ label: tag.title, value: id });
      // sort the options to appear alphabetically
      options = this.sortOptions(options);
    }
    // update the state
    this.setState({ options, selected });
    this.props.selectTags(selected)
  }

  selectTag (id) {
    let { options, selected } = this.state,
        index = options.findIndex(o => (o.value === id));

    selected.push(id);
    // if it's in the options array, remove it
    if (index > -1) options.splice(index, 1);
    this.setState({ options, selected });
    this.props.selectTags(selected)
  }

  setOptions () {
    let { selected } = this.state,
        { tags } = this.props,
        options = [],
        sortedOptions;

    Object.values(tags).forEach(tag => {
      if (!selected.includes(tag.id)) {
        options.push({ label: tag.title, value: tag.id });
      }
    })
    // sort the options to appear alphabetically
    sortedOptions = this.sortOptions(options);
    this.setState({ options: sortedOptions });
  }

  sortOptions (options) {
    return options.sort((a, b) => {
      let aLabel = a.label.toLowerCase(),
          bLabel = b.label.toLowerCase();

      if (aLabel < bLabel) return -1;
      if (aLabel > bLabel) return 1;
      return 0;
    });
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
            multi={false}
            name='tag-select'
            onChange={(selected) => this.selectTag(selected.value)}
            options={this.state.options}
            placeholder=''
            promptTextCreator={(label) => (`Create tag "${label}"`)}
            value=''
            />
        </div>
      </div>
    );
  }
}
