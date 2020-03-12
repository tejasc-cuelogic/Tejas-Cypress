!function(){
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    callFunctionFromScript();
}
script.src = 'https://maps.googleapis.com/maps/api/js?key='+__SEGMENT_WRITE_KEY__+'&libraries=places';
head.appendChild(script);
}();