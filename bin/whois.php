<?php
/**
 * Helper, perform whois request
 */

//=============================================================================
// simple flood protection
// record ip address to sqlite database and set timeout to 10 seconds

$ip = $_SERVER['REMOTE_ADDR']; // only reliable value, do not get HTTP_X_FORWARDED_FOR or HTTP_CLIENT_IP
$time = time();
$canproceed = true;
$timeout = 10;

try {
	// connect to database 'db/bin.sqlite'
	$db = new PDO('sqlite:db/bin.sqlite');
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// SELECT name FROM sqlite_master WHERE type='table' AND name='table_name';
	$db->exec('CREATE TABLE IF NOT EXISTS request (ip TEXT PRIMARY KEY, time INTEGER)');

	$existsindb = false;
	$dbip = '';
	$dbtime = 0;

	// get client ip from database
	$sql = 'SELECT * FROM request WHERE ip = :ip';
	$q = $db->prepare($sql);
	$q->execute(array('ip' => $ip));
	$q->setFetchMode(PDO::FETCH_ASSOC);
	while ($row = $q->fetch()) {
		$existsindb = true;
		$dbip = $row['ip'];
		$dbtime = $row['time'];
	}

	// if ip exists -> check and update time
	if ($existsindb) {
		$sql = 'UPDATE request SET time = :time WHERE ip = :ip';
		$q = $db->prepare($sql);
		$q->execute(array('ip' => $ip, 'time' => $time));

		// check time
		if ($time < $dbtime + $timeout) {
			$canproceed = false;
		}

	// if not exists -> insert new ip and time
	} else {
		$sql = 'INSERT INTO request (ip, time) VALUES (:ip, :time)';
		$q = $db->prepare($sql);
		$q->execute(array('ip' => $ip, 'time' => $time));
	}

	// close database connection
	$db = NULL;
} catch(PDOException $e) {
	echo 'Exception : ' . $e->getMessage();
	exit();
}

if (!$canproceed) {
	echo 'Error: there is ' . $timeout . ' seconds timeout, repeat request later';
	exit();
}

//=============================================================================

// create nice HTML output
function html($result) {
	$out = '';

	// concatenate result data, stripping miltiple empty rows to one ( \n+ -> \n )
	$lempty = true;
	foreach ($result['rawdata'] as $line) {
		$line = trim($line);

		if ($line == '') {
			if ($lempty) {
				continue;
			} else {
				$lempty = true;
			}
		} else {
			$lempty = false;
		}

		$out .= $line . "\n";
	}

	if ($lempty) {
		$out = trim($out);
	}

	// $out = strip_tags($out);
	$out = htmlentities($out);

	// activate email and www links
	$email_regex = "/([-_\w\.]+)(@)([-_\w\.]+)\b/i";
	$html_regex = "/(?:^|\b)((((http|https|ftp):\/\/)|(www\.))([\w\.]+)([,;:%#&\/?~=\w+\.-]+))(?:\b|$)/is";
	$out = preg_replace($email_regex, '<a href="mailto:$0">$0</a>', $out);
	$out = preg_replace_callback($html_regex, 'href_replace', $out);

	// add ip addresses to ns servers
	if (isset($result['regrinfo']['domain']['nserver'])) {
		$nserver = $result['regrinfo']['domain']['nserver'];
	} else {
		$nserver = false;
	}

	if (isset($result['regrinfo']['network']['nserver'])) {
		$nserver = $result['regrinfo']['network']['nserver'];
	}

	if (is_array($nserver)) {
		reset($nserver);
		while (list($host, $ip) = each($nserver)) {
			$url = $host . ' (' . $ip . ')';
			$out = str_replace($host, $url, $out);
			$out = str_replace(strtoupper($host), $url, $out);
		}
	}

	// beautify a bit
	$out = preg_replace("/(?m)^([-\s\.&;'\w\t\(\)\/]+:)(\S)/", '$1 $2', $out); // past space after ':' if doesn't exist
	$out = preg_replace("/(?m)^([-\s\.&;'\w\t\(\)\/]+:)/", '<b>$1</b>', $out); // add bold field names
	$out = preg_replace("/(?m)^(%.*)/", '<i>$0</i>', $out); // add italics for disclaimer

	return $out;
}

function href_replace($matches) {
	if (substr($matches[0], 0, 4) == 'www.') {
		$web = $matches[0];
		$url = 'http://' . $web;
	} else {
		$web = $matches[0];
		$url = $web;
	}
	return '<a href="' . $url . '" target="_blank">' . $web . '</a>';
}

//=============================================================================

$domain = $_POST['domain'];
$server = $_SERVER['HTTP_HOST'];
$referer = $_SERVER['HTTP_REFERER'];

if ((parse_url($referer, PHP_URL_HOST) == $server) && $domain) {

	include_once(dirname(__FILE__) . '/phpwhois/whois.main.php');

	$whois = new Whois();
	// some servers, absent in phpwhois library
	$whois->UseServer('al', 'whois.ripe.net');
	$whois->UseServer('az', 'whois.ripe.net');
	$whois->UseServer('by', 'whois.cctld.by');
	$whois->UseServer('es', 'whois.nic.es');
	$whois->UseServer('kz', 'whois.nic.kz');
	$whois->UseServer('name', 'whois.nic.name?={query}'); // fix request for .name domains

	$result = $whois->Lookup($domain);
	$winfo = '';

	// create nice raw output
	if (!empty($result['rawdata'])) {
		$winfo = html($result);
	} else {
		if (isset($whois->Query['errstr'])) {
			$winfo = implode($whois->Query['errstr'], "\n");
		} else {
			$winfo = 'Unexpected error';
		}
	}

	echo $winfo;

} else {
	// as if nothing here :)
	// header('HTTP/1.0 404 Not Found');
	header("Status: 404 Not Found");
}

?>