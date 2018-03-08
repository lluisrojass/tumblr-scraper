"use strict";

import React from "react";

class Textbox extends React.PureComponent {

  constructor(props){
    super(props);
  }

  render(){
    const {props} = this;
    return (
      <div className='blog-input-wrapper'>
        <div className='vertical-center-contents'>
          <p>
            {props.name}
          </p>
          <input type='text'
            name={props.name}
            value={props.blogname}
            onChange={(e) => { e.preventDefault(); props.onChange(e.target.value); }}
          />
        </div>
      </div>);
  }
}
export default Textbox;
