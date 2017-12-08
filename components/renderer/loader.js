require('../shared/stringutils');

// - make redux reducer
// - bind the reducer
// - pass as context
// - make provider and wrap the application
// - for each container component make mapDispatchToProps and mapStateToProps
// - call using connect from react-redux
// - add action creators file

import ReactDOM from 'react-dom';
import React from 'react';
import Application from './react/application';
ReactDOM.render(<Application />, document.getElementById('app-container'));
