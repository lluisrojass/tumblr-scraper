import { Container } from 'unstated';

class ViewerState extends Container {
    state = null;
    
    setPost = async (post) => {
        if (!(post instanceof Object)) {
            return false;
        }

        await this.setState({ ...post });
    };

    reset = async () => {
        await this.setState(null);
    }
}

export default ViewerState;