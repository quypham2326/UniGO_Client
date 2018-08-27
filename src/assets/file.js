window.randomize = function() {
  $('.radial-progress').each(function() {
    var transform_styles = ['-webkit-transform', '-ms-transform', 'transform'];
    $(this).find('span').fadeTo('slow', 1);
    var score = $(this).data('score');
    var deg = ((score) / 100) * 180;
    var rotation = deg;
    var fill_rotation = rotation;
    var fix_rotation = rotation * 2;
    for(i in transform_styles) {
      $(this).find('.circle .fill, .circle .mask.full').css(transform_styles[i], 'rotate(' + fill_rotation + 'deg)');
      $(this).find('.circle .fill.fix').css(transform_styles[i], 'rotate(' + fix_rotation + 'deg)');
    }
  });
};
setTimeout(window.randomize, 200);

getFB = (function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id) && window.FB) {
    window.FB.XFBML.parse();
  }
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v2.10&appId=1947926578821346';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
setTimeout(getFB, 200);
