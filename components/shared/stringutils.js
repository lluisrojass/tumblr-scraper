'use strict';

String.prototype.dateShorten = function(){
  return this.replace(/(\w|-|:)*/,function(txt) {
      return txt.substr(0,txt.indexOf('T'));
  });
}

String.prototype.exactMatch = function(regex) {
  const match = this.match(regex);
  return match != null && this == match[0];
}

String.prototype.bodyShorten = function() {
  return (this.length > 130) ? this.substr(0,this.charAt(127) === ' ' ? 127 : 128) + '...' : this.toString();
}

String.prototype.headlineShorten = function(doesStampExist=false){
  const index = doesStampExist ? 11 : 23;
  return (this.length >= index) ? this.substr(0,this.charAt(index-4) === ' ' ? index-4: index-3) + '...' : this.toString();
}

String.prototype.rmvMore = function(){
  return this.replace(/\[\[MORE\]\]/g, () => {return ''});
}

String.prototype.capitalizeEach = function() {
    return this.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

String.prototype.downsizeResolution = function() {
  if (this.substring(this.length - 8).exactMatch(/1280\..{3,4}/))
    return this.slice(0, this.length-8)+'250'+this.slice(this.length-4);
  else return this.toString();
}

String.prototype.tumblrTypeTranslate = function() {
  return this.includes('regular') ? 'text' : this.replace('is_','');
}
