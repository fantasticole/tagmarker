import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Marquee extends Component {
  constructor(props) {
    super(props);

    this.state = { scrollDistance: 0 };
  }

  handleScroll () {
    let marquee = ReactDOM.findDOMNode(this),
        // get width of parent
        parentWidth = marquee.parentNode.getBoundingClientRect().width,
        // get width of element
        { width } = marquee.getBoundingClientRect();

    // see if we need to scroll
    if (width > parentWidth) {
      // for scrolling to the left, distance should be negative
      let scrollDistance = parentWidth - width;

      // set disctance to move
      this.setState({ scrollDistance });
    }
  }

  handleStopScroll () {
    // revert to zero
    this.setState({ scrollDistance: 0 });
  }

  render() {
    // set scroll timing to be relative to disctance
    let scrollTiming = Math.abs(this.state.scrollDistance)/100,
        scrollStyles = {
          position: 'relative',
          // if the timing is less than 1s, default to 1s
          transition: `left ${scrollTiming < 1 ? 1 : scrollTiming}s`,
          left: this.state.scrollDistance,
        };

    return (
      <span
        className='marquee'
        onMouseEnter={() => this.handleScroll()}
        onMouseLeave={() => this.handleStopScroll()}
        ref='marquee'
        style={scrollStyles}
        >
        {this.props.children}
      </span>
    );
  }
}
