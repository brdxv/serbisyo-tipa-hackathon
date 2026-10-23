<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if ($path === '/api/health' || $path === '/health') {
  echo json_encode(['status'=>'ok','app'=>'SerbisYO PHP API','php'=>PHP_VERSION,'database'=>'demo mode']);
  exit;
}
if ($path === '/api/services' || $path === '/services') {
  echo json_encode(['data'=>[
    ['id'=>1,'name'=>'Morong Community Health Center','category'=>'Clinic / Healthcare','status'=>'Open','average_wait_minutes'=>24,'reliability'=>91,'score'=>87],
    ['id'=>2,'name'=>'Morong Municipal Office','category'=>'Government Service','status'=>'Open','average_wait_minutes'=>24,'reliability'=>91,'score'=>87],
    ['id'=>3,'name'=>'Rizal Family Clinic','category'=>'Clinic / Healthcare','status'=>'Open','average_wait_minutes'=>18,'reliability'=>94,'score'=>90],
    ['id'=>4,'name'=>'URS Registrar','category'=>'Education Service','status'=>'Closes 5 PM','average_wait_minutes'=>32,'reliability'=>82,'score'=>78],
    ['id'=>5,'name'=>'Bayanihan Pharmacy','category'=>'Pharmacy','status'=>'Open','average_wait_minutes'=>12,'reliability'=>96,'score'=>88]
  ],'source'=>'sample data']);
  exit;
}
http_response_code(404);
echo json_encode(['error'=>'Route not found','available'=>['/api/health','/api/services']]);
