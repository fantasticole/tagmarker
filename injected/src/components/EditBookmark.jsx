import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import EditableTags from './EditableTags';
import MarqueeWrapper from './MarqueeWrapper';

/**
 * EditBookmark
 *
 * @param {function} onChange - function to run when input changes
 * @param {array} selected - list of selected tag ids
 * @param {function} setSelectedTags - function to run when tag is selected
 * @param {array} [suggested] - optional list of suggested tag ids
 * @param {object} tags - all tags from store
 * @param {string} title - bookmark title
 * @param {string} url - bookmark url
 */
export default class EditBookmark extends Component {
  constructor (props) {
    super(props);

    this.state = {
      suggested: this.props.suggested ? this.props.suggested : [],
    }
  }

  componentDidUpdate (prevProps) {
    let { suggested } = this.props,
        lengthChanged = suggested ? suggested.length !== prevProps.suggested.length : false,
        propsChanged;

    // if the length didn't change and we get ids, see if they changed
    if (!lengthChanged && suggested && suggested.length > 0) {
      propsChanged = suggested.some((id, i) => (id !== prevProps.suggested[i]));
    }

    // if the suggested ids have changed
    if (lengthChanged || propsChanged) {
      // update the options
      this.setState({ suggested });
    }
  }

  render () {
    let { suggested } = this.state,
        { selected, tags, title, url } = this.props;

    return (
      <div className='bookmark__details bookmark__details--is_editing'>
        <input
          className='bookmark__input modal__input'
          defaultValue={title}
          name='title'
          onChange={(e) => this.props.onChange('title', e)}
          placeholder='bookmark name'
          type='text'
          />
        <input
          className='bookmark__input modal__input'
          defaultValue={url}
          name='url'
          onChange={(e) => this.props.onChange('url', e)}
          placeholder='url'
          required
          type='url'
          />
        <EditableTags
          selected={selected}
          selectTags={(tags) => this.props.setSelectedTags(tags)}
          suggested={suggested}
          tags={tags}
          />
      </div>
    );
  }
}
