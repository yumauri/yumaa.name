<?php
/**
 * Helper, perform dns request
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
	echo json_encode(array(
		'error' => 'Exception : ' . $e->getMessage()
	));
    exit();
}

if (!$canproceed) {
	echo json_encode(array(
		'error' => 'Error: there is ' . $timeout . ' seconds timeout, please wait'
	));
    exit();
}

//=============================================================================

$domain = $_POST['domain'];
$type = $_POST['type'];
$server = $_SERVER['HTTP_HOST'];
$referer = $_SERVER['HTTP_REFERER'];

if ((parse_url($referer, PHP_URL_HOST) == $server) && $domain && $type) {
	$type = trim(strtoupper($type));
	$types = array(
		'ANY' => DNS_ANY,
		'A' => DNS_A,
		'MX' => DNS_MX,
		'CNAME' => DNS_CNAME,
		'NS' => DNS_NS,
		'PTR' => DNS_PTR,
		'TXT' => DNS_TXT,
		'HINFO' => DNS_HINFO,
		'SOA' => DNS_SOA,
		'AAAA' => DNS_AAAA,
		'A6' => DNS_A6,
		'SRV' => DNS_SRV,
		'NAPTR' => DNS_NAPTR
	);
	if (!array_key_exists($type, $types)) {
		$type = 'A';
	}

	$domain_regex = '/^[a-z\d][a-z\-\d\.]+\.[a-z\-\d\.]+[a-z\d]\.?$/i';
	$ip_regex = '/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/';

	// user want to get ptr record -> change ip to 'in-addr.arpa' notation
	if (preg_match($ip_regex, $domain, $matches)) {
		$domain = $matches[4] . '.' . $matches[3] . '.' . $matches[2] . '.' . $matches[1] . '.in-addr.arpa';
		$type = 'PTR';
	}

	//
	if (preg_match($domain_regex, $domain)) {
		$answer = @dns_get_record($domain, $types[$type], $authns, $addtl);
		echo json_encode(array(
			'question' => array(
				'host' => $domain,
				'class' => 'IN',
				'type' => $type
			),
			'answer' => $answer,
			'authns' => $authns,
			'addtl' => $addtl
		));
	} else {
		echo json_encode(array(
			'error' => 'Domain invalid'
		));
	}

} else {
    // as if nothing here :)
    // header('HTTP/1.0 404 Not Found');
    header("Status: 404 Not Found");
}

?>