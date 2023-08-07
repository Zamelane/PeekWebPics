<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $folder = $_POST['folder'];

    if (empty($folder)) { echo "Параметер 'folder' не передан!"; }
} else {
    echo("Ожидается POST запрос, а получен ". $_SERVER["REQUEST_METHOD"] ."!");
}
?>