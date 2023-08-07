// function numberPass(defaultNumber) {
//   console.log((isNaN(+this)) ? defaultNumber : +this);
// }

// Инициализация кирпичного JS Grid 'Masonry'
let $grid = $('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth:  '.grid-item',
  fitWidth: true,
  gutter: +$(':root').css('--cards-gap').match(/\d/g),
});

// Обновление макета кирпичного grid'а (перстановка картинок)
function updateGrid() {
  $grid.masonry('layout');
}

// Функции для бокового меню и карточек
let $main = $('main');
// Переключание видимости бокового меню
function toggleSidebar() { 
  $main.toggleClass('sidebar--open');
  $main   .hasClass('sidebar--open') 
  ? localStorage.setItem('showSidebar', 1)
  : localStorage.setItem('showSidebar', 0);

  if(+localStorage.getItem('pinSidebar')) setTimeout(updateGrid, 125);
}
// Переключание закрепления бокового меню
function pinSidebar() { 
  $main.toggleClass('sidebar--pin');
  $main   .hasClass('sidebar--pin') 
  ? ( localStorage.setItem('pinSidebar', 1), $('.pin-sidebar-btn').html('Unpin') )
  : ( localStorage.setItem('pinSidebar', 0), $('.pin-sidebar-btn').html('Pin') );

  setTimeout(updateGrid, 125);
}
// Переключение блюра карточек
function blurCards() {
  if ($main.hasClass('grid-item--blur')) 
  { 
    $main.removeClass('grid-item--blur');
    $main.addClass   ('grid-item--blur-2');
    localStorage.setItem('blurCards', 2);
    $('.blur-cards-btn').html('Unblur');
  } else 
  if ($main.hasClass('grid-item--blur-2')) 
  {
    $main.removeClass('grid-item--blur-2');
    localStorage.setItem('blurCards', 0);
    $('.blur-cards-btn').html('Blur');
  } else 
  {
    $main.addClass('grid-item--blur');
    localStorage.setItem('blurCards', 1);
    $('.blur-cards-btn').html('Blur x2');
  }
}

// Восстановление бокового меню в исходное состояние 
if (+localStorage.getItem( 'pinSidebar') 
&&  +localStorage.getItem('showSidebar')) toggleSidebar();
if (+localStorage.getItem( 'pinSidebar'))    pinSidebar();
// Восстановление блюра карточек в исходное состояние 
if ( localStorage.getItem('blurCards') == 1) { 
  $main.addClass   ('grid-item--blur'  ); 
  $main.removeClass('grid-item--blur-2'); 
  $('.blur-cards-btn').html('Blur x2');
} else 
if ( localStorage.getItem('blurCards') == 2) { 
  $main.addClass   ('grid-item--blur-2'); 
  $main.removeClass('grid-item--blur'  ); 
  $('.blur-cards-btn').html('Unblur');
} else 
if ( localStorage.getItem('blurCards') == 0) {
  $main.removeClass('grid-item--blur'  ); 
  $main.removeClass('grid-item--blur-2'); 
  $('.blur-cards-btn').html('Blur');
} else {
  if ($main.hasClass('grid-item--blur')) {
    $('.blur-cards-btn').html('Blur x2')
  } else
  if ($main.hasClass('grid-item--blur-2')) {
    $('.blur-cards-btn').html('Unblur')
  } else {
    $('.blur-cards-btn').html('Blur')
  }
}


// Если (какое-то?) изображение загрузилось, то обновляется макет кирпичного grid'а
$grid.imagesLoaded().progress(updateGrid);

