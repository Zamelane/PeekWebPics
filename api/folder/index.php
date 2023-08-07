<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {                                             // Если запрос является POST'ом
    $folder = $_POST['folder'];                                                         // Загружаем индекс папки

    if (empty($folder)) { echo "Параметер 'folder' не передан!"; }                      // Если индекс папки небыл передан, то выводим сообщение
} else {
    echo("Ожидается POST запрос, а получен ". $_SERVER["REQUEST_METHOD"] ."!");         // Если запрос !=POST
}
?>