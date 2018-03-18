"use strict";

class Throttle {
    constructor() {
        const THROTTLE_TIME = 5000;
        var rendered = 0;
        var totalLoad = 0;

        this.onLoad = () => (rendered += 1, true); 
        this.onDiscovery = () => (totalLoad +=1, true);
        this.reset = () => (totalLoad = rendered = 0, true);
        
        this.getMSTimeout = () => {
            let currPercentIncrease = totalLoad == 0 ? 0 : (totalLoad - rendered) / totalLoad;
            return THROTTLE_TIME * currPercentIncrease;
        } 
    }
}

module.exports = new Throttle();