export function getStr() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 7; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export function htmlEncode(htmlString) {
  return htmlString.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
