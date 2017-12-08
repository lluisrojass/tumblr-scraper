'use strict';

import React from 'react';

class Config extends React.Component {
  constructor(props){
    super(props);
    this.defaultTypes = ['is_photo','is_chat','is_note','is_video','is_regular'];
    this.typeMap = {
      photo: 'is_photo',
      chat: 'is_chat',
      ask: 'is_note',
      video: 'is_video',
      text: 'is_regular'
    };
    this.state = {
      blogname: '',
      returnTypes: this.defaultTypes.slice(0) /* shallow copy */,
      sliders: {
        all: {
          isChecked: true,
          foreground: true
        },
        photo: {
          isChecked: false,
          foreground: false,
        },
        chat: {
          isChecked: false,
          foreground: false,
        },
        ask: {
          isChecked: false,
          foreground: false,
        },
        video: {
          isChecked: false,
          foreground: false,
        },
        text: {
          isChecked: false,
          foreground: false,
        }
      }
    };
  }
  handleFormSubmit = e => {
    e.preventDefault();
    if (this.props.isRunning) this.props.stopRunning();
    else this.props.startRunning(this.state.blogname, this.state.returnTypes);
  }
  handleCheckboxChange = (name, event) => {

    const isChecked = event.target.checked;
    const { sliders } = this.state;
    var { returnTypes } = this.state;

    switch(name){
      case 'all':
        if (isChecked) { /* select all */
          returnTypes = this.defaultTypes.slice(0); /* shallow copy */
          sliders.all.isChecked = true;
          for (var e in sliders) {
            if (e !== 'all') {
              sliders[e] = {
                isChecked: false,
                foreground: true
              }
            }
          }
        } else { /* select none */
          returnTypes = [];
          for (var s in sliders){
            sliders[s] = {
              isChecked: false,
              foreground: true
            }
          }
        }
        break;
      default:
        if (sliders.all.isChecked && isChecked) { /* behavior */
          event.preventDefault();
          return;
        }
        else if (isChecked) { /* add type */
          sliders[name].isChecked = true;
          returnTypes.push(this.typeMap[name]);
        } else { /* delete type */
          sliders[name].isChecked = false;
          returnTypes.splice(this.state.returnTypes.indexOf(this.typeMap[name]), 1);
        }
    }
    this.setState({
      sliders: sliders,
      returnTypes: returnTypes
    });
  }
  addChar = event => {
    this.setState({ blogname: event.target.value });
  }
  render(){
    return(
      <div className='height100width100' id='form-wrapper'>
        <form id='customform' action='' onSubmit={this.handleFormSubmit}>
          {Object.keys(this.state.sliders).map((s,i) => {
              return (
                <Slider
                  key={i}
                  name={s}
                  {...this.state.sliders[s]}
                  handleChange={this.handleCheckboxChange}
                />
              )
            })
          }
          <Textbox
            name='Blog Name'
            addChar={this.addChar}
            blogname={this.state.blogname}
          />
          <div className='button-wrapper'>
            {
              this.props.isRunning ?
                <button className='stop-button vertical-center-contents'>PAUSE</button>
              :
                <button className='go-button vertical-center-contents'>START</button>
            }
            {
              !this.props.isRunning && !this.props.atStart &&
                <button onClick={this.props.continueRunning} className='resume-button fbutton vertical-center-contents'>
                      RESUME
                </button>
            }
          </div>
        </form>
      </div>
    );
  }
}

function Slider(props){
  return(
    <div className='input-row'>
      <div className='vertical-center-contents'>
        <p className={`typename ${props.foreground ? '': 'grey' }`}>{props.name.capitalizeEach()}</p>
        <label className='switch'>
          <input
            type='checkbox'
            onChange={function(e){props.handleChange(props.name,e)}}
            checked={props.isChecked}
            name={props.name}
          />
          <div className='slider round'></div>
        </label>
      </div>
    </div>
  )
}

function Textbox(props){
  return(
    <div className='blog-input-wrapper'>
      <div className='vertical-center-contents'>
        <p>
          {props.name}
        </p>
        <input type='text' name={props.name} value={props.blogname} onChange={props.addChar} />
      </div>
    </div>
  );
}

export default Config;
