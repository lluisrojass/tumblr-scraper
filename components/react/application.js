import React from 'react';
import ReactDOM from 'react-dom';
const archive = require('../archive');
const post = require('../post');

function exactMatch(r,str){
  const match = str.match(r);
  return match != null && str == match[0];
}

class Application extends React.Component {

  constructor(props){
    super(props);
    this.archive = new archive();
    this.state = {
      scrapedData:[],
      currentPost:{
        date:'',
        media:[],
        headline:'',
        articleBody:'',
      }
      //TODO: implement analytics
    }
  }


  onSubmit = (event) => {
    const tumblrTypes = ['is_photo','is_chat','is_note','is_video','is_regular'];
    const blogname = event.target[6].value;
    if(!event.target[0].checked){
      for(var i = 1 ; i <= 5 ;i++){
        if(!event.target[i].checked){
          tumblrTypes.splice(i-1,1);
        }
      }
      // if none checked
      if(translations.length === 5){
        alert('please choose at least one post type');
      }
    }
    // validate blogname
    if(exactMatch(/([0-9]|[a-z]|[A-Z])+(\-*([0-9]|[a-z]|[A-Z]))*/,blogname)){
      this.archive.go(blogname,tumblrTypes);
    }
    // submit and start the loop.
    event.preventDefault();
  }

  onPostClick = (data) => {
    this.state.currentPost = {
      /*TODO: implement current post viewer*/
    };
    this.setState(this.state);
  }

  componentDidMount(){
    // adding all event handlers
    this.archive.on('nextPage',(path) => {
      this.state.analytics.lastRequest = path;
      this.setState(this.state);
    });

    this.archive.on('post',(postData) => {
      post(postData,(err,data) => {
        if (err !== null){
          // TODO: handle error
          return;
        }
        // TODO: destructuring assignment, it's a mess down there
        this.state.scrapedData.push({
          type:'post',
          // post content
          date: data.postData.datePublished ? data.postData.datePublished : 'No Date',
          body: data.postData.articleBody ? data.postData.articleBody : 'N/A' ,
          headline: data.postData.headline ? data.postData.headline : `${data.type} Post`,
          images: data.postData.image ? typeof data.postData.image === 'object' ?  data.postData.image : [data.postData.image] : [],
          url: data.postData.url ? data.postData.url : ''
        });

        this.setState(this.state);
      });
    });

    this.archive.on('date',(dateString) => {
      this.state.scrapedData.push({
        type:'date',
        date:dateString
      });
      this.setState(this.state);
    });

    //TODO: implement errors and end

    this.archive.on('requestError',(url) => {  });
    this.archive.on('responseError',(url) => { });
    this.archive.on('end',(url) => { });

  }

  render(){
    return(
      <div id='wrapper'>
        <Config />
        <Posts />
      </div>
    )
  }
}

function Config(props){
  return(
    <div id='config-section'>
     <div className='left-panel'>

       <div className='title-wrapper'>
         <h1>Config</h1>
       </div>

       <div id='config-wrapper'>
         <CustomForm />
       </div>

       <Analytics />

     </div>
   </div>
  )
}

class CustomForm extends React.Component {
  render(){
    return(
      <div className='form-wrapper'>
        <form>
          <FormCheckbox name='All Posts' />
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

function FormCheckbox(props){
  return(
    <div className='input-row'>
      <div>
        <p className='typename grey indiv-type'>{props.name}</p>
        <label className="switch">
          <input type='checkbox' name={props.name} />
          <div className="slider round"></div>
        </label>
      </div>
    </div>
  );
}

function FormTextbox(props){
  return(
    <div className='blog-input-wrapper'>
      <div>{props.name}<input name={props.name} type='text' /></div>
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

function Analytics(props){
  return(
    <div className='analytics'>

    </div>
  )
}

function Posts(props){
  return(
    <div id='posts'>
    <div className='mid-panel scroll-box'>
      <div className='date-wrapper'>
        <h1>December 2016</h1>
      </div>

      <div className='post'>
        <div className='image-wrapper'><img src='public/img/quote_default.png' className=
        'post-image'/></div>

        <div className='post-content'>
          <div className='post-headline'>
            <h1 className='post-title'>Hello Arigato Mr R...</h1>

            <h1 className='post-date'>2016-12-29</h1>
          </div>

          <p className='post-body'>Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard dummy text
          ever Lorem Ipsum has been the industry's standard dummy text ever</p>
        </div>
      </div>
    </div>

    <div className='right-panel'></div>
  </div>
  );
}

ReactDOM.render(<Application />,document.getElementById('app-container'));
