import React from 'react';

class Config extends React.Component {
  constructor(props){
    super(props);
    this.defaultTypes = ['is_photo','is_chat','is_note','is_video','is_regular'];
    this.typeMap = {
      photo:'is_photo',
      chat:'is_chat',
      note:'is_note',
      video:'is_video',
      text:'is_regular'
    };
    this.state = {
      buttonText:'GO',
      blogname:'',
      returnTypes:this.defaultTypes,
      sliders:{
        all:{
          isChecked:true,
          foreground:true
        },
        photo:{
          isChecked:false,
          foreground:false,
        },
        chat:{
          isChecked:false,
          foreground:false,
        },
        note:{
          isChecked:false,
          foreground:false,
        },
        video:{
          isChecked:false,
          foreground:false,
        },
        text:{
          isChecked:false,
          foreground:false,
        }
      }
    };
  }

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.props.isRunning){
      this.props.stopRunning();
    } else {
      this.props.startRunning(this.state.blogname,this.state.returnTypes);
    }
  }

  handleCheckboxChange = (name, event) => {
    const isChecked = event.target.checked;
    switch(name){
      case 'all':
        if (isChecked) { /* all */
          this.state.returnTypes = this.defaultTypes;
          for (var e in this.state.sliders) {
            if (e === 'all') {
              this.state.sliders[e] = {
                isChecked: !0,
                foreground: true
              }
            } else {
              this.state.sliders[e] = {
                isChecked: !1,
                foreground: false
              }
            }
          }
        } else { /* none */
          this.state.returnTypes = [];
          for (var s in this.state.sliders){
            this.state.sliders[s] = {
              isChecked: !1,
              foreground: true
            }
          }
        }
        break;

      default:
        if (this.state.sliders.all.isChecked && isChecked) { /* behavior */
          event.preventDefault();
          return;
        }
        if (isChecked) { /* add type */
          this.state.sliders[name].isChecked = !0;
          this.state.returnTypes.push(this.typeMap[name]);
        } else { /* delete type */
          this.state.sliders[name].isChecked = !1;
          this.state.returnTypes.splice(this.state.returnTypes.indexOf(this.typeMap[name]),1);
        }
    }
    this.setState(this.state);
  }

  addChar = event => { this.setState({blogname:event.target.value}) }

  render(){
    return(
      <div className='height100width100' id='form-wrapper'>
        <form id='customform' action='' onSubmit={this.handleFormSubmit}>
          {Object.keys(this.state.sliders).map((s,i) => {
              return (<Slider
                            key={i}
                            name={s}
                            {...this.state.sliders[s]}
                            handleChange={this.handleCheckboxChange}
                     />)
            })
          }
          <Textbox
                  name='blogname'
                  addChar={this.addChar}
                  blogname={this.state.blogname}
          />
          <button>{this.props.isRunning ? 'STOP':'GO'}</button>
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
      <div className='vertical-center-contents'>{props.name}
        <input type='text' name={props.name} value={props.blogname} onChange={props.addChar} />
      </div>
    </div>
  );
}

function FormButton(props){
  return(
    <div className='button-wrapper'>
      <a href='#' onClick={function(){ document.getElementById("customform").submit() }} type='submit' className='button'>Go</a>
    </div>
  )
}

export { Config };
