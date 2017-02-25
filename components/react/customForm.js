import React from 'react';

class CustomForm extends React.Component {
  render(){
    return(
      //TODO: workout checked boxes
      <div id='form-wrapper'>
        <form>
          <FormCheckbox name='All Posts' checked={true}/>
          <FormCheckbox name='Photo' />
          <FormCheckbox name='Chat' />
          <FormCheckbox name='Note' />
          <FormCheckbox name='Video' />
          <FormCheckbox name='Text' />
          <FormTextbox name='Blogname' />
          <FormButton />
        </form>
      </div>
    );
  }
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
      <a href='#' type='submit' className='button'>Go</a>
    </div>
  )
}

function FormCheckbox(props){
  return(
    <div className='input-row'>
      <div className='vertical-center-contents'>
        <p className='typename grey indiv-type'>{props.name}</p>
        <label className="switch">
          <input type='checkbox' name={props.name} />
          <div className="slider round"></div>
        </label>
      </div>
    </div>
  );
}

export { CustomForm };
