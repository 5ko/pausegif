 /**
  PauseGIFs: Deanimate animated GIFs for PmWiki
  Written by (c) Petko Yotov 2020-2023   www.pmwiki.org/support

  This text is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published
  by the Free Software Foundation; either version 3 of the License, or
  (at your option) any later version. See licence for full details
  and lack of warranty.
*/

var currentScript = document.currentScript;
// console.log(currentScript);

document.addEventListener('DOMContentLoaded', function(){
  function toggleGif(e){
    e.preventDefault();
    e.stopPropagation();
    var src = this.dataset.altscr;
    this.dataset.altscr = this.src;
    this.src = src;
  }
  function replaceGif(img) {
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var radius = 40;
    
    var w = c.width = img.width;
    var h = c.height = img.height;
    ctx.clearRect(0,0,w,h); 
    
    ctx.drawImage(img, 0, 0, w, h);
    ctx.beginPath();
    ctx.arc(w/2, h/2, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(0,0,0,.3)';
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(w/2+radius*.7, h/2);
    ctx.lineTo(w/2-radius*.45, h/2-radius*.6);
    ctx.lineTo(w/2-radius*.45, h/2+radius*.6);
    
    ctx.fillStyle = 'white';// 'rgba(0,0,0,.7)';
    ctx.fill();
    img.dataset.altscr = img.src;
    img.src = c.toDataURL("image/png");
    img.addEventListener('click', toggleGif);
    img.style.cursor = "pointer";
  }
  function imageLoaded(i) {
    if (!i.complete) return false;
    if (typeof i.naturalWidth != "undefined" && i.naturalWidth == 0) {
      return false;
    }
    return true;
  }
  function loadGif(e){
    this.removeEventListener('load', loadGif);
    replaceGif(this);
  }
  
  function deanimateGifs() {
    var ext = currentScript.dataset.ext;
    
    var x = document.querySelectorAll('img[src$="'+ext+'"]');
    
    console.log({ext, imgs: x});
    
    for(var i=0; i<x.length; i++) {
      var img = x[i];
      if(img.closest('[contenteditable]')) continue;
      var url = new URL(img.src);
      if(url.host != location.host) continue; 

      if(imageLoaded(img)) replaceGif(img);
      else img.addEventListener('load', loadGif);
    }
  }
  console.log("will deanimateGifs");
  deanimateGifs();
});

