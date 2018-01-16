import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select';

export default class EditableTags extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isEditing: false,
      isAdding: false,
      options: [],
      selected: [],
      suggested: [...this.props.suggested],
    };
  }

  componentDidMount () {
    this.setOptions();
  }

  componentDidUpdate (prevProps) {
    let { suggested } = this.props;

    // if the suggested ids have changed
    if (prevProps.suggested.some((id, i) => (id !== suggested[i]))) {
      // update the state
      this.setState({ suggested });
      // update the options
      this.setOptions();
    }
  }

  handleAddTags () {
    this.setState({ isAdding: true });
  }

  handleDeleteTag (id) {
    let { options, selected } = this.state,
        { tags } = this.props,
        // find index of tag to remove
        tagIndex = selected.indexOf(id),
        sortedOptions;

    // remove the tag id
    selected.splice(tagIndex, 1);
    // add it to the options
    options.push({ label: tags[id].title, value: id });
    // sort the options to appear alphabetically
    sortedOptions = this.sortOptions(options);
    // update the state
    this.setState({ selected, options: sortedOptions });
  }

  handleSelectSuggested (id) {
    let { suggested } = this.state;

    // remove the tag from suggestions
    suggested.splice(suggested.indexOf(id), 1);
    // update the state
    this.setState({ suggested });
    // add to selected
    this.selectTag(id);
  }

  selectTag (id) {
    let { options, selected } = this.state,
        index = options.findIndex(o => (o.value === id));

    selected.push(id);
    // if it's in the options array, remove it
    if (index > -1) options.splice(index, 1);
    this.setState({ isAdding: false, options, selected });
  }

  setOptions () {
    let { selected, suggested } = this.state,
        { tags } = this.props,
        toIgnore = [...selected, ...suggested],
        options = [],
        sortedOptions;

    Object.values(tags).forEach(tag => {
      if (!toIgnore.includes(tag.id)) {
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

  render () {
    let { isAdding, selected, suggested } = this.state,
        { tags } = this.props,
        selectedTags = selected.map(id => tags[id]),
        suggestedTags = suggested.map(id => tags[id]);

    return (
      <div className='create-bookmark__tags'>
        {selectedTags.map(tag => (
          <button className='button bookmark__button bookmark__tag bookmark__tag--is_editing' key={tag.id} onClick={() => this.handleDeleteTag(tag.id)}>{tag.title} <i className='fa fa-times-circle'/></button>
        ))}
        {suggestedTags.map(tag => (
          <button className='button bookmark__button bookmark__tag bookmark__tag--is_suggested' key={tag.id} onClick={() => this.selectTag(tag.id)}>{tag.title} <i className='fa fa-times-circle'/></button>
        ))}
        {
          isAdding ?
          <Select.Creatable
            autoFocus
            className='tag-selector'
            multi={false}
            name='tag-select'
            onChange={(selected) => this.selectTag(selected.value)}
            options={this.state.options}
            placeholder=''
            value=''
            /> :
          <button className='button bookmark__button bookmark__button--is_add' onClick={() => this.handleAddTags()}><i className='fa fa-plus-circle'/></button>
        }
      </div>
    );
  }
}
