<?php
include 'functions/functions.php';                                                    // Функции для уменьшения объёма кода

$method = getPost('method', 'noMethod');

switch($method) {
    case 'getFolder': 
        include 'functions/folders.php';
        getFolder();
        break;
    case 'getResolutions':
        $response = getBody(true);
        $config   = getConfig();                                                      // Загружаем конфиг
        $response['data']['resolutions'] = [];                                        // Обявляем ответ

        foreach($config['resolutions'] as $index => $value) {
            $response['data']['resolutions'][$index] = $value;
        }

        returnBody($response);
    break;
    default: returnBody(getBody(false, '1', 'Нет такого метода или он не был передан!')); break;
}
?>