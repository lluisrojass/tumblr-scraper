/* add string utils to process */
require('../shared/stringutils');

import React from 'react';
import {render} from 'react-dom';
import {Provider} from "react-redux";
import {createStore} from "redux";
import {reducer} from "./react/reducers/index";
import Application from './react/application';

let store = createStore(reducer);

render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('app-container')
); 
