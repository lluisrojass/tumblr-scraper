"use strict";

class Throttle {
    
    constructor(){
        var progress = 0;
        var total = 0;
        var percentDifference = 0;
        const THROTTLE_TIME = 5000; // ms

        this.onLoad = () => {
            progress += 1;
            percentDifference = progress ? (total - progress) / ((total + progress) / 2) : .01;
            return percentDifference;
        }

        this.onDiscovery = () => total += 1;
        
        this.reset = () => (progress = 0, total = 0, percentDifference = 0, true);
        this.getMSTimeout = () => THROTTLE_TIME * percentDifference;
    }
}

module.exports = new Throttle();