const $html = $( 'html');
const $grid = $('.grid');
const $body = $('html > body');

const debouncedUpdateGrid = debounce(updateGrid, 125);
const throttledUpdateGrid = throttle(updateGrid, 125);

// Если было вызвано повторно через "delay" мс,
// то откладывает вызов функции "func" на "delay" мс 
function debounce(func, delay) {
  return function perform(...args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();

    if (previousCall && this.lastCall - previousCall <= delay) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => func(...args), delay);
  }
}
// Если было вызвано повторно через "delay" мс,
// то не принимает вызов в течении  "delay" мс 
function throttle(func, delay) {
  let timer = null
  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      func(...args);

      clearTimeout(timer);
      timer = null;
    }, delay);
  }
}


// Восстановление бокового меню в исходное состояние
if (+localStorage.getItem('pinSidebar')) {
  pinSidebar();
  if (+localStorage.getItem('showSidebar')) toggleSidebar();
}
// Восстановление темы в исходное состояние
if      (localStorage.getItem('setTheme') == 1)  setDarkTheme();
else if (localStorage.getItem('setTheme') == 2) setLightTheme();
else                                             setAutoTheme();
// Восстановление раскладки/макета карточек-картинок в исходное состояние
if (+localStorage.getItem('horizontalLayout')) setHorizontalLayout();
else                                             setVerticalLayout();


// Переключание видимости бокового меню
function toggleSidebar() {
  $body.toggleClass('sidebar--open');
  localStorage.setItem('showSidebar', ( $body.hasClass('sidebar--open') ? 1 : 0 ));

  if(+localStorage.getItem('pinSidebar')) setTimeout(updateGrid, 125);
}
// Переключание закрепления бокового меню
function pinSidebar() {
  $body.toggleClass('sidebar--pin');
  $body   .hasClass('sidebar--pin')
  ? ( localStorage.setItem('pinSidebar', 1), $('.pin-sidebar-btn').html('Pinned'  ) )
  : ( localStorage.setItem('pinSidebar', 0), $('.pin-sidebar-btn').html('Unpinned') );

  setTimeout(updateGrid, 125);
}

// Переключание темы
function changeTheme() {
  if      (localStorage.getItem('setTheme') == 0)  setDarkTheme();
  else if (localStorage.getItem('setTheme') == 1) setLightTheme();
  else                                             setAutoTheme();
}
function setDarkTheme() {
  $('head').append('<meta name="theme-color" content="#000">');
  localStorage.setItem('setTheme', 1);
  $html.addClass('dark-theme');
  $('.change-theme-btn').html('Dark');
}
function setLightTheme() {
  $('[name="theme-color"]').remove();
  $('head').append('<meta name="theme-color" content="#fff">');
  localStorage.setItem('setTheme', 2);
  $html.removeClass( 'dark-theme');
  $html   .addClass('light-theme');
  $('.change-theme-btn').html('Light');
}
function setAutoTheme() {
  $('[name="theme-color"]').remove();
  $('head').append('<meta name="theme-color" content="#fff" media="(prefers-color-scheme: light)">');
  $('head').append('<meta name="theme-color" content="#000" media="(prefers-color-scheme:  dark)">');
  localStorage.setItem('setTheme', 0);
  $html.removeClass('light-theme');
  $('.change-theme-btn').html('Auto');
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
  $('.change-layout-btn').html('Horizontal');

  $grid.isotope({
    layoutMode: 'masonryHorizontal',
    itemSelector: '.grid-item',
    masonryHorizontal: {
      gutter: 8,
      rowHeight: '.grid-item',
      // fitHeight: true, —— такое очень хочется иметь,
      //        но 'masonryHorizontal' походу не имеет...
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
  localStorage.setItem('horizontalLayout', 0);
  $('.change-layout-btn').html('Vertical');

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

// Обновление макета/раскладки карточек-картинок
function updateGrid() {
  console.log('Do updateGrid()');
  $grid.isotope('layout');
}

// Событие на конец загрузки на каждое изображение для обновление макета карточек
$grid.imagesLoaded().progress(() => {
  console.log('Image loaded. Need updateGrid()');
  throttledUpdateGrid();
});

// Событие на изменение размеров места макета для обновления макета карточек
$('.grid_outer').resize(() => {
  console.log('Grid resized. Need updateGrid()');
  throttledUpdateGrid();
});

const resizer = document.querySelector('.resizer');
const html    = document.querySelector(':root'   );
// События на вызов контекстного меню и перетаскивание бара 
// для изменения размеров бокового меню и обновления макета карточек
resizer.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation(); 
  event.stopImmediatePropagation();
  return false;
};
resizer.addEventListener('pointerdown', (event) => {
  $body.addClass('sidebar--resize-active');
  document.addEventListener('pointermove', resize, false);
  document.addEventListener('pointerup', () => {
    $body.removeClass('sidebar--resize-active');
    document.removeEventListener('pointermove', resize, false);
  }, false);
});
function resize(e) {
  html.style.setProperty('--sidebar-width', e.x + 8 +'px');
  debouncedUpdateGrid();
}


// Горизонтальный скролл
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
    //e.preventDefault();
    scrollWidth = container.scrollWidth - container.clientWidth;
    targetLeft = Math.min(scrollWidth, Math.max(0, container.scrollLeft + e.deltaY));

    requestAnimationFrame(scrollLeft);
  }, {passive: true});
}
let grid_outer = document.querySelector('.grid_outer');
horizontalWheel(grid_outer);
