<?php
    /* ============================= *\
    |   ВОЗВРАЩАЕТ СПИСОК КАТАЛОГОВ    |
    |   ПО УКАЗАНОМУ ИНДЕКСУ ПУТИ И    | => Created by Zamelane =)
    |          ФАЙЛОВ В НЁМ            |
    \* ============================= */
function getFolder() {
    $config             = getConfig();                                                                 //| Загружаем конфиг
    $path               = dirname(__DIR__, 1);                                                        // | Получаем корневой каталог
    $folder             = getPost('folder', 'home');                                                 //  | Индекс папки
    $index_path_check   = $path . '\\index\\' . $folder;                                            //   | Путь до индекса с запрашиваемым каталогом
    $result_path        = checkIndex($index_path_check, $folder);                                  //    | Если индекс существует, то записываем
    $global_path        = $config['path'];                                                        //     | Итоговый путь для сканирования
    $include_files      = getPost('includeFiles', 'no') == 'yes' ? true : false;                 //      | Включать ли в выдаче файлы ?
    $directories        = scandir($global_path . '\\' . $result_path);                          //       | Сканируем дирректорию
    $return             = getBody(true);                                                       //        | Подготавливаем шаблон успешного ответа
    $page               = getPost('page', '1');                                               //         | Номер страницы для отображения
    $elementsOfPage     = getPost('elementsOfPage', $config['elementsOfPage']);              //          | Количество элементов на странице
    $visibleElements    = 0;                                                                //           | Количество отображённых элементов

                        $return['data']['folders'] = [];
    if ($include_files) $return['data'][ 'files' ] = [];

    foreach($directories as $index => $value) {
        $this_folder_path = $global_path . '\\' . $result_path . '\\' . $value;                     // Итоговый путь до папки
        if ($value != '.' && $value != '..') {                                               // Исключаем точки сканирования...
            if (is_dir($this_folder_path)) {                                                 // Проверяем существование папки
                $this_index = md5($this_folder_path);
                $index_path = $path . '\\index\\' . $this_index;                             // Проверяем, существует ли индекс
                if (!file_exists($index_path)) {                                             // Если нет, то создаём
                    file_put_contents($index_path, $result_path . '\\' . $value);
                }
                array_push($return['data']['folders'], [                                     // Записываем в выдачу
                    'name'  => $value,
                    'path'  => $result_path . '\\' . $value,
                    'index' => $this_index
                ]);
            } else if ($include_files) {
                if (exif_imagetype($this_folder_path)) {
                    $visibleElements++;
                    if (($page - 1) * $elementsOfPage < $visibleElements && $visibleElements <= $page * $elementsOfPage)
                    array_push($return['data']['files'], [
                        'name'      => $value,
                        'path'      => $this_folder_path,
                        'imageType' => exif_imagetype($this_folder_path)
                    ]);
                }
            }
        }
    }
    returnBody($return);
}

function checkIndex($checkIndex, $folder) {
    if (file_exists($checkIndex) && !is_dir($checkIndex)) {                             // Если индекс для файла есть (каталог существует)
        return file_get_contents($checkIndex);                                          // Извлекаем путь
    } else if ($folder == 'home') {                                                     // Или если запрашивается корневая дирректория
        return '';                                                                    // То записываем по дефолту
    } else {                                                                            // В ином случае выбрасываем ошибку
        returnBody(getBody(false, '2', 'Указанный индекс не найден!'));
        exit();
    }
}
?>