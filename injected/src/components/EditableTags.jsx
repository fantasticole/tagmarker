import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import Select from 'react-select';

export default class EditableTags extends Component {
  constructor (props) {
    super(props);

    this.state = {
      options: [],
      selected: [],
    };
  }

  componentDidMount () {
    this.setOptions();
  }

  componentDidUpdate (prevProps) {
    let { suggested } = this.props,
        lengthChanged = suggested.length !== prevProps.suggested.length,
        propsChanged;

    // if the length didn't change and we get ids, see if they changed
    if (!lengthChanged && suggested.length > 0) {
      propsChanged = suggested.some((id, i) => (id !== prevProps.suggested[i]));
    }

    // if the suggested ids have changed
    if (lengthChanged || propsChanged) {
      // update the options
      this.setOptions();
    }
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
    // always render if the type is suggested or if there are tags
    if (type === 'suggested' || tags.length) {
      let tagClasses = classNames('button', 'bookmark__button', 'bookmark__tag', {
            'bookmark__tag--is_editing': type === 'selected',
            'bookmark__tag--is_suggested': type === 'suggested',
          }),
          iconClasses = classNames('fa', {
            'fa-times-circle': type === 'selected',
            'fa-plus-circle': type === 'suggested',
          });

      return (
        <div className={`create-bookmark__tags--are_${type}`}>
          {tags.map(tag => (
            <button className={tagClasses} key={tag.id} onClick={() => {type === 'selected' ? this.handleDeleteTag(tag.id) : this.selectTag(tag.id)}}>{tag.title} <i className={iconClasses}/></button>
          ))}
        </div>
      )
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
        // render suggested tags that aren't already selected
        suggestedTags = suggested.filter(id => !selected.includes(id)).map(id => tags[id]);

    return (
      <div className='create-bookmark__tags'>
        {this.renderTags(selectedTags, 'selected')}
        {this.renderTags(suggestedTags, 'suggested')}
        <Select.Creatable
          autoFocus
          className='tag-selector'
          multi={false}
          name='tag-select'
          onChange={(selected) => this.selectTag(selected.value)}
          options={this.state.options}
          placeholder='search for tags'
          value=''
          />
      </div>
    );
  }
}
