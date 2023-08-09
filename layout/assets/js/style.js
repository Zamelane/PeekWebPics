let $grid = $('.grid');
let $main = $( 'main');

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
// Переключение раскладки карточек
function changeLayout() {
  $main.hasClass('grid--horizontal') 
  ?   setVerticalLayout()
  : setHorizontalLayout();
}
function setHorizontalLayout() {
  console.log('Hor')
  $main.addClass('grid--horizontal');
  localStorage.setItem('horizontalLayout', 1)
  $('.layout-change-btn').html('Vertical')
  
  $grid.isotope('destroy');
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

  let elements = document.getElementsByClassName('grid-item')
  for (let i = 0; i < elements.length; i++) {
    let i_element = elements[i].getElementsByTagName('img')
    let name = i_element[0].src.split('/')
    i_element[0].src = 'thumbs/w400/' + name[name.length - 1]
  }

  updateGrid();
}
function setVerticalLayout() {
  console.log('Vert')
  $main.removeClass('grid--horizontal');
  localStorage.setItem('horizontalLayout', 0)
  $('.layout-change-btn').html('Horizontal');

  $grid.isotope('destroy');
  $grid.isotope({
    itemSelector: '.grid-item',
    masonry: {
      gutter: 8,
      columnWidth: '.grid-item',
      fitWidth: true,
    }
  });

  let elements = document.getElementsByClassName('grid-item')
  for (let i = 0; i < elements.length; i++) {
    let i_element = elements[i].getElementsByTagName('img')
    let name = i_element[0].src.split('/')
    i_element[0].src = 'thumbs/h400/' + name[name.length - 1]
  }
  
  updateGrid();
}
function updateGrid() {
  $grid.isotope('layout');
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
// Восстановление раскладки карточек в исходное состояние
if (+localStorage.getItem('horizontalLayout')) setHorizontalLayout();
else                                             setVerticalLayout();
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

// Обновление раскладки при изменении размеров окна
$('window').resize(updateGrid);


// Горизонтальный скролл, глючит при сильной нагрузки
function horizontalWheel(container) {
  /** Max `scrollLeft` value */
  let scrollWidth;

  /** Desired scroll distance per animation frame */
  let getScrollStep = () => scrollWidth / 500 /* ADJUST TO YOUR WISH */ ;

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
