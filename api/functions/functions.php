<?php
function getPost($name, $alternative) {
    $name = $_POST[$name];
    if (empty($name)) return $alternative;
    return $name;
}

function getBody($succ, $errCode = 0, $errText = 'Error') {
    $arr = [];
    if (!$succ){
        $arr['error'] = [
            'code' => $errCode,
            'text' => $errText
        ];
    } else $arr['data'] = [];
    return $arr;
}

function returnBody($arr) {
    echo json_encode($arr, true);
}

function getConfig() {
    $config = json_decode(file_get_contents($path . '\config.json'), true);                 // Загружаем конфиг
    return $config;
}
?>