import React from 'react';

String.prototype.capitalizeEach = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

class CustomForm extends React.Component {
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
      blogname:'',
      returnTypes:this.defaultTypes,
      sliders:{
        all:{
          isChecked:!0,
          foreground:true,
        },
        photo:{
          isChecked:!1,
          foreground:false,
        },
        chat:{
          isChecked:!1,
          foreground:false,
        },
        note:{
          isChecked:!1,
          foreground:false,
        },
        video:{
          isChecked:!1,
          foreground:false,
        },
        text:{
          isChecked:!1,
          foreground:false,
        }
      }
    };
  }

  submitForm = e => {
    e.preventDefault();
    console.log('submit triggered, passing upstream',this.state.returnTypes);
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
          //this.setState(this.state);
        } else { /* none */
          this.state.returnTypes = [];
          for (var s in this.state.sliders){
            this.state.sliders[s] = {
              isChecked: !1,
              foreground: true
            }
          }
          //this.setState(this.state);
        }
        break;

      default:
        if (this.state.sliders.all.isChecked && isChecked) { /* behavior */
          event.preventDefault();
          return;
        }
        if (isChecked) { /* add */
          this.state.sliders[name].isChecked = !0;
          this.state.returnTypes.push(this.typeMap[name]);
          //this.setState(this.state);
        } else {
          this.state.sliders[name].isChecked = !1;
          this.state.returnTypes.splice(this.state.returnTypes.indexOf(name),1);
          //this.setState(this.state);
        }
    }
    this.setState(this.state);
  }

  render(){
    return(
      <div id='form-wrapper'>
        <form id='customform' action='' onSubmit={this.submitForm}>
          {Object.keys(this.state.sliders).map((s,i) => {
              return (
                <Slider key={i} name={s} data={this.state.sliders[s]} onChange={this.handleCheckboxChange} />
              )
            })}
          <FormTextbox name='blogname' />
          <button>go!</button>
        </form>
      </div>
    );
  }
}


function Slider(props){
  return(
    <div className='input-row'>
      <div className='vertical-center-contents'>
        <p className={`typename ${props.data.foreground ? '': 'grey' }`}>{props.name.capitalizeEach()}</p>
        <label className='switch'>
          <input type='checkbox' onChange={function(e){ props.onChange(props.name,e) }.bind(this)} checked={props.data.isChecked} name={props.name} />
          <div className='slider round'></div>
        </label>
      </div>
    </div>
  )
}




function FormTextbox(props){
  return(
    <div className='blog-input-wrapper'>
      <div>{props.name}<input name={props.name} type='text'/></div>
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

export { CustomForm };
