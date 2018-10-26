import React from 'react';
import PropTypes from 'prop-types';
import { Subscribe } from 'unstated';
import PostsState from 'state/Posts/';
import ViewerState from 'state/Viewer/';
import classnames from 'classnames';
import styles from './PostList.css';
import Post from '../Post/';

class PostListComponent extends React.PureComponent {

    static propTypes = {
        viewPost: PropTypes.func.isRequired,
        posts: PropTypes.array.isRequired
    };

    render() {
        const { posts } = this.props;
        if (!posts.length) {
            return (
                <div className={classnames(styles.notfound)} />
            );
        }
        else {
            const { viewPost } = this.props;
            return (
                <div className={classnames(styles.wrapper)}>
                    {posts.map((post, index) => (
                        <Post 
                            key={index}
                            index={index}
                            post={post}
                            onClick={viewPost}
                        />
                    ))}
                </div>
            );
        }
    }

}

const PostList = () => (
    <Subscribe to={[ PostsState, ViewerState ]}>
        {(postsState, viewerState) => (
            <PostListComponent 
                posts={postsState.state.posts}
                viewPost={viewerState.setPost}
            />
        )}
    </Subscribe>
);

export { PostList };