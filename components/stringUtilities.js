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
