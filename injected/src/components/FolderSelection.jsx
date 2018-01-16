import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Select from 'react-select';

export default class FolderSelection extends Component {
  constructor (props) {
    super(props);

    this.state = {
      options: [],
      selected: '',
    };
  }

  componentDidMount () {
    this.loadFolders();
  }

  getChildOptions (childNode, options, level) {
    return childNode.children.reduce((list, child) => {
      if (child.children) {
        let indents = Array(level).fill(<span className='indent'/>),
            label = <span>{indents}{child.title}</span>,
            nextLevel = level + 1;

        list.push({ label, value: child.id, className: `level-${level}` });
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
    this.setState({ selected });
    this.props.onSelect(selected);
  }

  render () {
    return (
      <Select
        className='folder-selector'
        multi={false}
        name='folder-select'
        onChange={(selected) => this.selectFolder(selected)}
        options={this.state.options}
        placeholder=''
        value={this.state.selected}
        />
    );
  }
}
