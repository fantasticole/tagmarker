import React from 'react';

import Alert from './Alert';

/**
 * AlertBox
 * 
 * @param {string} [text] - optional alert text
 * @param {string} [title] - optional alert title
 * @param  {[string]} buttonText - confirm button text
 */
export default function AlertBox (text, title, buttonText="OK") {
  return new Promise((resolve) => {
    Alert.render(
      <Alert.Alert title={title} text={text}>
        <div className='alert__actions'>
          <button className="button action-button alert-action__button" onClick={() => resolve(true)}>{buttonText}</button>
          <button className="button action-button alert-action__button" onClick={() => resolve(false)}>Cancel</button>
        </div>
      </Alert.Alert>
    );
  });
}
