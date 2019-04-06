<?php
/**
 * Helper, get user ip address
 */
	// for fun :)
	header('Answer: 42');

	$ip = (
		isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : (
		isset($_SERVER["HTTP_X_FORWARDED_FOR"]) ? $_SERVER["HTTP_X_FORWARDED_FOR"] : (
		isset($_SERVER["HTTP_CLIENT_IP"]) ? $_SERVER["HTTP_CLIENT_IP"] : ''
	)));
	echo $ip;
?>