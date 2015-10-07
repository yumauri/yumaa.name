<?php
// for fun :)
header('X-Powered-By: Invisible Pink Unicorn');
header(base64_decode('UXVlc3Q6IFdoYXQgd2FzIHRoZSBsYXN0IHNlbnRlbmNlIG9mIFBldGUncyBiZWxpZWYgdGhhdCBhdCBsZWFzdCBvbmUgZG9vciBtdXN0IGxlYWQgaW50byBzdW1tZXI/'));
?><!DOCTYPE html>
<html>
<head>
 <meta charset="utf-8">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <meta name="author" content="Victor Didenko">
 <meta name="description" content="Victor Didenko, aka yumaa, home page">
 <link rel="shortcut icon" href="img/favicon.ico"/>
 <meta name="quest" content="Your guess is at the right direction, but not right enough, go on!">
 <!-- build:css -->
 <link rel="stylesheet/less" type="text/css" href="css/sh.less">
 <!-- endbuild -->
 <!-- build:js -->
 <script type="text/javascript" src="js/less-1.6.1.min.js"></script>
 <script type="text/javascript" src="js/jquery-1.11.3.min.js"></script>
 <script type="text/javascript" src="js/jquery.cookie.js"></script>
 <script type="text/javascript" src="js/mousetrap.min.js"></script>
 <script type="text/javascript" src="js/mustache.min.js"></script>
 <script type="text/javascript" src="js/i18n.js"></script>
 <script type="text/javascript" src="js/sh.js"></script>
 <script type="text/javascript" src="js/app.js"></script>
 <!-- endbuild -->
 <title>/home/yumaa</title>
</head>
<body>
 <!--! Do you know Kung Fu? -->
 <!--
  bit hacky, needed for Opera extension GMail Notifier (and may be similar ones)
  it has 'DOMContentLoaded' listener and modify all 'mailto:' links to gmail.com 'Compose new mail' page
  and because of that, 'mailto:' links, that created after, remain unchanged
  so I write here a 'mailto:' link and then get changed (or unchanged) address from it and use it
 --><a href="mailto:not@ma.il" id="mailtonotmail" style="display:none"></a>
 <noscript>&nbsp;<br>
  &nbsp;&nbsp;Your browser doesn't support JavaScript or you switched it off. In that case you are a bore.<br>
  &nbsp;&nbsp;And it's sad, because this site created entirely with JavaScript...<br>
  &nbsp;&nbsp;I can tell you, that this is my home page. I'm Victor Didenko, aka <i>yumaa</i>.<br>
  &nbsp;&nbsp;And I don't know what to say more to a man like you. I'm disappointed.<br>
  &nbsp;&nbsp;Get out of your stasis box and welcome to the real world.
 </noscript>
</body>
</html>
