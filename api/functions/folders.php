<?php
    /* ============================= *\
    |   ВОЗВРАЩАЕТ СПИСОК КАТАЛОГОВ    |
    |   ПО УКАЗАНОМУ ИНДЕКСУ ПУТИ И    | => Created by Zamelane =)
    |          ФАЙЛОВ В НЁМ            |
    \* ============================= */
function getFolder() {
    $config             = getConfig();                                                                 //| Загружаем конфиг
    $path               = dirname(__DIR__, 1);                                                        // | Получаем корневой каталог
    $indexPath          = getPost('indexPath', 'home');                                              //  | Получаем $_POST['indexPath']
    $index_path_check   = $path . '\\index\\' . $folder;                                            //   | Путь до индекса с запрашиваемым каталогом
    $result_path        = checkIndex($index_path_check);                                           //    | Если индекс существует, то записываем
    $global_path        = $config['path'] . $result_path;                                         //     | Итоговый путь для сканирования
}

function checkIndex($checkIndex) {
    if (file_exists($checkIndex) && !is_dir($checkIndex)) {                             // Если индекс для файла есть (каталог существует)
        return file_get_contents($checkIndex);                                          // Извлекаем путь
    } else if ($folder == 'home') {                                                     // Или если запрашивается корневая дирректория
        return '';                                                                      // То записываем по дефолту
    } else {                                                                            // В ином случае выбрасываем ошибку
        returnBody(getBody(false, '2', 'Указанный индекс не найден!'));
        exit();
    }
}
?>