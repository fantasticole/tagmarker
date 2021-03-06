import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select';

/**
 * FolderSelection
 *
 * @param {bool} creatable - if a folder can be created from the select or not
 * @param {function} onSelect - function to select folder
 * @param {number} parent - parent folder data
 */
export default class FolderSelection extends Component {
  constructor (props) {
    super(props);

    let { parent } = this.props;

    this.state = {
      options: [],
      selected: parent ? { label: parent.title, value: parent.id } : null,
    };
  }

  componentDidMount () {
    this.loadFolders();
  }

  getChildOptions (childNode, options, level) {
    return childNode.children.reduce((list, child) => {
      if (child.children) {
        // increase the level for when we go another level down
        let nextLevel = level + 1;

        list.push({
          label: child.title,
          level,
          value: child.id,
        });
        return this.getChildOptions(child, list, nextLevel);
      }
      return list;
    }, options)
  }

  loadFolders () {
    chrome.bookmarks.getTree(arr => {
      // get select options from bookmark tree
      let options = this.getChildOptions(arr[0], [], 0);

      this.setState({ options });
    })
  }

  selectFolder (selected) {
    let { options } = this.state;

    // remove created option from options array
    options = options.filter(option => !option.className);
    this.setState({ options, selected });
    if (!selected) selected = { value: '' };
    this.props.onSelect(selected.value);
  }

  renderOption (option) {
    let indents = [];

    for (var x = 0; x < option.level; x++) {
      indents.push(<span className='indent' key={x} />);
    }

    return (<span>{indents}{option.label}</span>);
  }

  render () {
    let SelectType = this.props.creatable ? Select.Creatable : Select;

    return (
      <SelectType
        className='folder-selector'
        multi={false}
        name='folder-select'
        onChange={(selected) => this.selectFolder(selected)}
        options={this.state.options}
        optionRenderer={(option) => this.renderOption(option)}
        placeholder='select folder'
        promptTextCreator={(label) => (`Create folder "${label}"`)}
        value={this.state.selected}
        />
    );
  }
}
