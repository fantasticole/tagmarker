import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select';

/**
 * FolderSelection
 *
 * @param {function} onSelect - function to select folder
 * @param {number} parentId - parent folder title
 */
export default class FolderSelection extends Component {
  constructor (props) {
    super(props);

    this.state = {
      options: [],
      selected: this.props.parentId,
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
    if (!selected) selected = { value: '' };
    this.setState({ selected });
    this.props.onSelect(selected);
  }

  renderOption (option) {
    let indents = [];

    for (var x = 0; x < option.level; x++) {
      indents.push(<span className='indent' key={x} />);
    }

    return (<span>{indents}{option.label}</span>);
  }

  render () {
    return (
      <Select
        className='folder-selector'
        multi={false}
        name='folder-select'
        onChange={(selected) => this.selectFolder(selected)}
        options={this.state.options}
        optionRenderer={(option) => this.renderOption(option)}
        placeholder=''
        value={this.state.selected}
        />
    );
  }
}
