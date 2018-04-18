/**
 * some JavaScript code for this blog theme
 */
/* jshint asi:true */

/////////////////////////header////////////////////////////
/**
 * clickMenu
 */
(function() {
  if (window.innerWidth <= 770) {
    var menuBtn = document.querySelector('#headerMenu')
    var nav = document.querySelector('#headerNav')
    menuBtn.onclick = function(e) {
      e.stopPropagation()
      if (menuBtn.classList.contains('active')) {
        menuBtn.classList.remove('active')
        nav.classList.remove('nav-show')
      } else {
        nav.classList.add('nav-show')
        menuBtn.classList.add('active')
      }
    }
    $('body').on('click, touchstart', function(evt) {
      if (evt.target.id === 'headerMenu') {
        return;
      }
      nav.classList.remove('nav-show')
      menuBtn.classList.remove('active')
    })
  }
}());

//////////////////////////back to top////////////////////////////
(function() {
  var backToTop = document.querySelector('.back-to-top')
  var backToTopA = document.querySelector('.back-to-top a')
  // console.log(backToTop);
  window.addEventListener('scroll', function() {

    // 页面顶部滚进去的距离
    var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)

    if (scrollTop > 200) {
      backToTop.classList.add('back-to-top-show')
    } else {
      backToTop.classList.remove('back-to-top-show')
    }
  })

  // backToTopA.addEventListener('click',function (e) {
  //     e.preventDefault()
  //     window.scrollTo(0,0)
  // })
}());

(function() {

  // progress bar
  var $w = $(window);
  var $prog2 = $('.progress-indicator');
  var wh = $w.height();
  var h = $('body').height();
  var sHeight = h - wh;
  $w.on('scroll', function() {
      window.requestAnimationFrame(function(){
      var perc = Math.max(0, Math.min(1, $w.scrollTop() / sHeight));
      updateProgress(perc);
      });
  });

  function updateProgress(perc) {
      $prog2.css({width: perc * 100 + '%'});
  }
}());

/**
 * 外链地址都在新页面打开
 */
(function() {
  var aTags = $('a')
  var origin = location.origin;
  for (var i = 0; i < aTags.length; i++) {
    var href = aTags[i].getAttribute('href');
    var notLocal = href.startsWith('http') && !href.startsWith(origin);
    if (notLocal) {
      aTags[i].setAttribute('target', '_blank')
    }
  }
}());

// 注册 service worker
if (navigator.serviceWorker) {
  // 加时间戳每次加载最新文件
  navigator.serviceWorker.register('/service-worker.js?t=', {scope: '/'})
}
