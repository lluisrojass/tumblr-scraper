import { Container } from 'unstated';

class PostsState extends Container {
    constructor() {
        super();
        Object.defineProperty(this, '_state', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                posts: []
            }
        });

        this.state = this._state;
    }

    addPost = async (post) => {
        if (!post) {
            return false;
        }

        const { posts } = this.state;
        await this.setState({
            posts: posts.push(post)
        });
    };

    reset = async () => {
        await this.setState(this._state);
    };
}

export default PostsState;