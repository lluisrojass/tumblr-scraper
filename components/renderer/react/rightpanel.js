'use strict';

import React from 'react';
import Viewer from './viewer';

function RightPanel(props){
  return (
    <div id='right-panel-wrapper'>
      <Viewer
        post={props.currentPost}
        openInBrowser={props.openInBrowser}
        isViewing={props.isViewing}
        onLoadViewer={props.onLoadViewer}
        {...props.viewerMeta}
      />
    </div>
  )
}

export default RightPanel;
