let $grid = $('.grid');
let $body = $('html > body');
let $html = $('html')

// Восстановление темы
if      (localStorage.getItem('setTheme') == 1)  setDarkTheme();
else if (localStorage.getItem('setTheme') == 2) setLightTheme();
else                                           setAutoTheme();
// Восстановление бокового меню в исходное состояние 
if (+localStorage.getItem( 'pinSidebar') 
&&  +localStorage.getItem('showSidebar')) toggleSidebar();
if (+localStorage.getItem( 'pinSidebar'))    pinSidebar();
// Восстановление раскладки/макета карточек-картинок в исходное состояние
if (+localStorage.getItem('horizontalLayout')) setHorizontalLayout();
else                                             setVerticalLayout();
/*
// Восстановление блюра карточек в исходное состояние 
if (localStorage.getItem('blurCards') == 1) { 
  $body.addClass   ('grid-item--blur'  ); 
  $body.removeClass('grid-item--blur-2'); 
  $('.blur-cards-btn').html('Blur x2');
} else 
if (localStorage.getItem('blurCards') == 2) { 
  $body.addClass   ('grid-item--blur-2'); 
  $body.removeClass('grid-item--blur'  ); 
  $('.blur-cards-btn').html('Unblur');
} else 
if (localStorage.getItem('blurCards') == 0) {
  $body.removeClass('grid-item--blur'  ); 
  $body.removeClass('grid-item--blur-2'); 
  $('.blur-cards-btn').html('Blur');
} else {
  if ($body.hasClass('grid-item--blur')) {
    $('.blur-cards-btn').html('Blur x2')
  } else
  if ($body.hasClass('grid-item--blur-2')) {
    $('.blur-cards-btn').html('Unblur')
  } else {
    $('.blur-cards-btn').html('Blur')
  }
}
*/

// Переключание темы
function changeTheme() {
  if      (localStorage.getItem('setTheme') == 0)  setDarkTheme();
  else if (localStorage.getItem('setTheme') == 1) setLightTheme();
  else                                             setAutoTheme();
}
function setDarkTheme() {
  localStorage.setItem('setTheme', 1);
  $html.addClass('dark-theme');
  $('.change-theme-btn').html('Dark')
}
function setLightTheme() {
  localStorage.setItem('setTheme', 2);
  $html.removeClass( 'dark-theme');
  $html   .addClass('light-theme');
  $('.change-theme-btn').html('Light')
}
function setAutoTheme() {
  localStorage.setItem('setTheme', 0);
  $html.removeClass('light-theme');
  $('.change-theme-btn').html('Auto')
}
// Переключание видимости бокового меню
function toggleSidebar() { 
  $body.toggleClass('sidebar--open');
  $body   .hasClass('sidebar--open') 
  ? localStorage.setItem('showSidebar', 1)
  : localStorage.setItem('showSidebar', 0);

  if(+localStorage.getItem('pinSidebar')) setTimeout(updateGrid, 125);
}
// Переключание закрепления бокового меню
function pinSidebar() { 
  $body.toggleClass('sidebar--pin');
  $body   .hasClass('sidebar--pin') 
  ? ( localStorage.setItem('pinSidebar', 1), $('.pin-sidebar-btn').html('Pinned') )
  : ( localStorage.setItem('pinSidebar', 0), $('.pin-sidebar-btn').html('Unpinned') );

  setTimeout(updateGrid, 125);
}

// Переключение раскладки/макета карточек-картинок
function changeLayout() {
  $grid.isotope('destroy');
  $body.hasClass('grid--horizontal') 
  ?   setVerticalLayout()
  : setHorizontalLayout();
}
// Установка горизонтальной раскладки/макета карточек-картинок
function setHorizontalLayout() {
  $body.addClass('grid--horizontal');
  localStorage.setItem('horizontalLayout', 1)
  $('.layout-change-btn').html('Horizontal')
  
  $grid.isotope({
    layoutMode: 'masonryHorizontal',
    itemSelector: '.grid-item',
    masonryHorizontal: {
      gutter: 8,
      rowHeight: '.grid-item',
      // fitHeight: true, —— такое очень хочется иметь,
      //                     но 'masonryHorizontal' походу не имеет...
    }
  });

  let elements = $('.grid-item');
  for (let i = 0; i < elements.length; i++) {
    let i_element = elements[i].getElementsByTagName('img');
    let name = i_element[0].src.split('/');
    i_element[0].src = 'thumbs/h400/' + name[name.length - 1];
  }

  updateGrid();
}
// Установка вертикальной раскладки/макета карточек-картинок
function setVerticalLayout() {
  $body.removeClass('grid--horizontal');
  localStorage.setItem('horizontalLayout', 0)
  $('.layout-change-btn').html('Vertical');

  $grid.isotope({
    itemSelector: '.grid-item',
    masonry: {
      gutter: 8,
      columnWidth: '.grid-item',
      fitWidth: true,
    }
  });

  let elements = $('.grid-item');
  for (let i = 0; i < elements.length; i++) {
    let i_element = elements[i].getElementsByTagName('img');
    let name = i_element[0].src.split('/');
    i_element[0].src = 'thumbs/w400/' + name[name.length - 1];
  }
  
  updateGrid();
}
// Обновление раскладки/макета карточек-картинок
function updateGrid() {
  $grid.isotope('layout');
}
// Если (какое-то?) изображение загрузилось, то обновляется макет кирпичного grid'а
$grid.imagesLoaded().progress(updateGrid);
// Обновление раскладки при изменении размеров
$('.grid_outer').resize(updateGrid);

/*
// Переключение блюра карточек
function blurCards() {
  if ($body.hasClass('grid-item--blur')) 
  { 
    $body.removeClass('grid-item--blur');
    $body.addClass   ('grid-item--blur-2');
    localStorage.setItem('blurCards', 2);
    $('.blur-cards-btn').html('Unblur');
  } else 
  if ($body.hasClass('grid-item--blur-2')) 
  {
    $body.removeClass('grid-item--blur-2');
    localStorage.setItem('blurCards', 0);
    $('.blur-cards-btn').html('Blur');
  } else 
  {
    $body.addClass('grid-item--blur');
    localStorage.setItem('blurCards', 1);
    $('.blur-cards-btn').html('Blur x2');
  }
}
*/


// Горизонтальный скролл, глючит при сильной нагрузки
function horizontalWheel(container) {
  /** Max `scrollLeft` value */
  let scrollWidth;

  /** Desired scroll distance per animation frame */
  let getScrollStep = () => scrollWidth / 2000 /* ADJUST TO YOUR WISH */ ;

  /** Target value for `scrollLeft` */
  let targetLeft;

  function scrollLeft() {
    let beforeLeft = container.scrollLeft;
    let wantDx = getScrollStep();
    let diff = targetLeft - container.scrollLeft;
    let dX = wantDx >= Math.abs(diff) ? diff : Math.sign(diff) * wantDx;

    // Performing horizontal scroll
    container.scrollBy(dX, 0);

    // Break if smaller `diff` instead of `wantDx` was used
    if (dX === diff)
      return;

    // Break if can't scroll anymore or target reached
    if (beforeLeft === container.scrollLeft || container.scrollLeft === targetLeft)
      return;

    requestAnimationFrame(scrollLeft);
  }

  container.addEventListener('wheel', e => {
    // e.preventDefault();

    scrollWidth = container.scrollWidth - container.clientWidth;
    targetLeft = Math.min(scrollWidth, Math.max(0, container.scrollLeft + e.deltaY));

    requestAnimationFrame(scrollLeft);
  });
}
let list = document.querySelector('html');
horizontalWheel(list);
