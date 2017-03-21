String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}
String.prototype.bodyShorten = function(){
  const CharIndex = this[19] === ' ' ? 18: 19;
  return (this.length > 130) ? this.substr(0,this.charAt(127) === ' ' ? 127 : 128) + '...' : this.toString();
}
String.prototype.headlineShorten = function(doesStampExist=false){
  const index = doesStampExist ? 11 : 23;
  return (this.length >= index) ? this.substr(0,this.charAt(index-4) === ' ' ? index-4: index-3) + '...' : this.toString();
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
  if (!isNaN(resolution)) return this.replace(resolution.toString(),'250');
  else return this.toString();
}
