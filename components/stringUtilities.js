String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}
String.prototype.bodyShorten = function(){
  const CharIndex = this[19] === ' ' ? 18: 19;
  return (this.length > 196) ? this.substr(0,this.charAt(193) === ' ' ? 192 : 193) + '...' : this.toString();
}
String.prototype.headlineShorten = function(){
  return (this.length >= 26) ? this.substr(0,this.charAt(23) === ' ' ? 22: 23) + '...' : this.toString();
}
String.prototype.errorShorten = function(){
  return (this.length >= 34) ? this.substr(0,31) + '...' : this.toString();
}
String.prototype.capitalizeEach = function(){
    return this.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
String.prototype.downsizeImageResolution = function(){
  const resolution = Number(((this.substring(this.length - 8,this.length-4))));
  if (!isNaN(resolution)){
    return this.replace(resolution.toString(),'250');
    console.log(this.replace(resolution.toString(),'500'));
  } else {
    return this.toString();
  }
}
