import { Container } from 'unstated';

class ViewerState extends Container {
    static state = {}
    
    setPost = async (post) => {
        if (!(post instanceof Object)) {
            return false;
        }

        await this.setState({ ...post });
    };

    reset = async () => {
        await this.setState({});
    }
};

export default ViewerState;