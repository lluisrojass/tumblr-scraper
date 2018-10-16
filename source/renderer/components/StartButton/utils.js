function sliderTumblrTypeMap(sliders, types) {
    const obj = {};
    for (let key in sliders) {
        const type = types[key];
        if (!type) continue;
        Object.defineProperty(obj, sliders[key], { 
            value: type, 
            writable: false, 
            enumerable: true  
        });
    }
    
    return obj;
}

export { sliderTumblrTypeMap };