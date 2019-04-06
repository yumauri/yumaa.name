<html><head>
<script type="text/javascript">document.cookie='authorized=0';</script>
<?php
	$authorized = $_COOKIE['authorized'];

	if (isset($authorized) && ($authorized == 'yes' || $authorized == '1')):
?>
</head><body>
Who in the world am I? Ah, that's the great puzzle!
<? else: ?>
<style type="text/css">
html, body { width: 95%; height: 95%; }
body { background: url('/img/sadpanda.jpg') no-repeat fixed center; }
</style></head><body>
<!--
 hope you don't know where this sad panda from ^///^
 but if you do - this is just a hint, not a direction
-->
<? endif; ?>
</body></html>