"use strict";

require('../shared/stringutils');

import React from 'react';
import {render} from 'react-dom';
import {Provider} from "react-redux";
import {createStore} from "redux";
import {reducer} from "./react/reducers/index";
import VisibleApplication from './react/container/visible-app';
let store = createStore(reducer);

render(
  <Provider store={store}>
    <VisibleApplication />
  </Provider>,
  document.getElementById('app-container')
); 
