import React from 'react';
import ReactDOM from 'react-dom';

import AlertModule from './AlertModule';

/**
 * Alert
 * 
 * @param {string} [text] - optional alert text
 * @param {string} [title] - optional alert title
 * @param  {[string]} noText - cancel button text
 * @param  {[string]} yesText - confirm button text
 */
export default function Alert (text, title, yesText='OK', noText='Cancel') {
  const alertBox = document.getElementsByClassName('alert-container')[0];
  const confirmAndClose = (resolve, trueOrFalse) => {
    // unmount
    ReactDOM.unmountComponentAtNode(alertBox);
    // return answer
    resolve(trueOrFalse);
  }

  return new Promise((resolve) => {
    AlertModule.render(
      <AlertModule.Alert title={title} text={text}>
        <div className='alert__actions'>
          <button className='button action-button alert-action__button' onClick={() => confirmAndClose(resolve, true)}>{yesText}</button>
          <button className='button action-button alert-action__button' onClick={() => confirmAndClose(resolve, false)}>{noText}</button>
        </div>
      </AlertModule.Alert>
    );
  });
}
