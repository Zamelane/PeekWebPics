<?php
include 'functions/functions.php';                                                    // Функции для уменьшения объёма кода

$method = getPost('method', 'noMethod');

switch($method) {
    case 'getFolder': 
        include 'functions/folders.php';
        getFolder();
        break;
    default: returnBody(getBody(false, '1', 'Нет такого метода или он не был передан!')); break;
}
?>