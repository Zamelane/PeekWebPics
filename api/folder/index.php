<?php
$path = dirname(__DIR__, 1);                                                            // Получаем корневой каталог
$config = json_decode(file_get_contents($path . '\config.json'), true);                       // Загружаем конфиг

if ($_SERVER["REQUEST_METHOD"] == "POST") {                                             // Если запрос является POST'ом
    $folder = $_POST['folder'];                                                         // Загружаем индекс папки

    if (empty($folder)) {                                                               // Если индекс папки небыл передан, то выводим сообщение
        echo json_encode([
            'code'          => '403',
            'error_text'    => 'Каталог не передан',
            'body'          => []
        ], true);
        exit();
    }

    $result_path = '';

    $index_path_check = $path . '\\index\\' . $folder;
    if (file_exists($index_path_check) && !is_dir($index_path_check)) {                 // Если индекс для файла есть (каталог существует)
        $result_path = file_get_contents($index_path_check);                            // Извлекаем путь
    } else if ($folder == 'home') {                                                     // Или если запрашивается корневая дирректория
        $result_path = '';                                                              // То записываем по дефолту
    } else {                                                                            // В ином случае выбрасываем ошибку
        echo json_encode([
            'code'          => '405',
            'error_text'    => 'Каталог не найден',
            'body'          => []
        ], true);
        exit();
    }

    $global_path = $config['path'] . $result_path;
    $directories = scandir($global_path);                                               // Сканируем дирректорию

    $result = [                                                                         // Подгатавливаем каркас ответа
        'code'          => '200',
        'body'          => [
            'dirs'              => [],
            'files'             => [],
            'thisFolder'        => [
                'dirsCount'          => '',
                'filesCount'         => '',
                'dirsReadableCount'  => '',
                'filesReadableCount' => '',
                'path'               => $result_path == '' ? 'home' : $result_path
            ]
        ],
        'debug' => [
            'global_path' => $global_path
        ]
    ];

    $counter_files              = 0;                                                   // Счётчик файлов
    $counter_folders            = 0;                                                   // Счётчик каталогов
    $counter_readable_files     = 0;                                                   // Счётчик читаемых файлов
    $counter_readable_folders   = 0;                                                   // Счётчик читаемых каталогов

    for ($i = 0; $i < count($directories); $i++) {                                      // Перебираем найденные элементы
        $name = $directories[$i];                                                       // Получаем имя элемента
        if ($name != '.' && $name != '..') {                                            // Убираем 'метки' каталога
            $readable = is_readable($global_path . $name);                              // Можно ли прочесть ?
            if (is_dir($global_path . $name)) {                                         // Если имя является каталогом
                $type = 'dirs';                                                         // Добавляем в каталоги
                $counter_folders++;                                                     // Считаем количество найденных элемнтов
                if ($readable) $counter_readable_folders++;                             // Считаем читаемые папки
            } else {                                                                    // Если имя является файлом
                if (exif_imagetype($global_path . $name)) {
                    $type = 'files';                                                        // Добавляем в файлы
                    $counter_files++;                                                       // Считаем количество найденных элемнтов
                    if ($readable) $counter_readable_files++;                               // Считаем читаемые файлы
                }
            }
            array_push($result['body'][$type], [                                        // Добавляем в каталоги
                'name' => $name,
                'read' => $readable
            ]);
        }
    }

    $result['body']['thisFolder']['dirsCount']          = $counter_folders;
    $result['body']['thisFolder']['filesCount']         = $counter_files;
    $result['body']['thisFolder']['dirsReadableCount']  = $counter_readable_folders;
    $result['body']['thisFolder']['filesReadableCount'] = $counter_readable_files;

    echo json_encode($result, true);

} else {
    echo("Ожидается POST запрос, а получен ". $_SERVER["REQUEST_METHOD"] ."!");         // Если запрос !=POST
}
?>