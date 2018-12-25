import { Container } from 'unstated';

class BlognameState extends Container {
    constructor() {
        super();
        Object.defineProperty(this, '_state', {
            enumerable: false, /* hide */
            writable: false,
            value: {
                blogname: ''
            }
        });

        this.state = this._state;
    }

    setBlogname = async ( text ) => {
        await this.setState({
            blogname: text
        });
    };

    reset = async () => {
        this.setState(this._state);
    };
}

export default BlognameState;