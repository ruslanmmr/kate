window.$ = window.jQuery = require('jquery');

import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import device from 'current-device';
import Scrollbar from 'smooth-scrollbar';
window.Lazy = require('jquery-lazy');
window.GreenAudioPlayer = require('green-audio-player');
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Hammer from 'hammerjs';
window.fancybox = require('@fancyapps/fancybox');
import Parallax from 'parallax-js';
import "inputmask/lib/extensions/inputmask.numeric.extensions";
import Inputmask from "inputmask/lib/extensions/inputmask.date.extensions";
gsap.registerPlugin(ScrollToPlugin);

//загрузили dom
document.addEventListener('DOMContentLoaded', function(){
  $scrollArea.init();
  $images.init();
  $animatedElements.init();
  $checkbox.init();
  $mask.init();
  $nav.init();
  $header.init();
  audio.init();

  funcybox();
  scroll();
  parallax();
  toggleblocks();
});
//загрузили все
window.onload = function() {
  $slider.resize();

  preloader.hide({onStart: function() {
    $slider.init();
    onloadTransitions();
  }});

};

//window width
function width() {
  return Math.min(window.innerWidth, document.documentElement.clientWidth);
}
//check device
function ismobile() {
  if($('html').hasClass('desktop')) {
    return false;
  } else {
    return true;
  }
}

//preloader
let preloader = {
  element: $('.preloader'),
  delay: 1,
  hide: function(callbacks) {
    setTimeout(()=>{
    
      if (typeof callbacks === 'object') {
        callbacks.onStart();
      }

      let animation = gsap.timeline({onComplete:function(){preloader.element.remove()}})
        .to(preloader.element, {duration:0.75,autoAlpha:0,ease:'power2.out'})

    },preloader.delay*1000)
  }
}
let $animatedElements = {
  init: function() {
    $(document).on('mouseenter mouseleave touchstart touchend mousedown mouseup', '.js-animated', function(event) {
      let $target = $(this);
  
      if(event.type=='touchstart' && !$('html').hasClass('desktop')) {
        $target.addClass('touch');
      } else if(event.type=='mouseenter' && $('html').hasClass('desktop')) {
        $target.addClass('hover');
      } else if(event.type=='mousedown' && $('html').hasClass('desktop')) {
        $target.addClass('focus');
      } else if(event.type=='mouseup' && $('html').hasClass('desktop')) {
        $target.removeClass('focus');
      } else {
        $target.removeClass('touch');
        $target.removeClass('hover');
        $target.removeClass('focus');
      }
    })

    //плавный переход
    let link = $('a.js-change-page');
    link.on('click', function(event) {
      event.preventDefault();
      link.removeClass('active');
      $('.page-wrapper').css('pointer-events', 'none');
      $(this).addClass('active');
      let href = $(this).attr('href');
      let animation = gsap.timeline({
        onComplete:function(){
          document.location.href = href;
        }
      })
      .to('.wrapper', {duration:0.5, autoAlpha:0, ease:'power2.in'})
    })

  }
}
let $checkbox = {
  element: $('.checkbox, .radio'),
  init: function() {
    $checkbox.check();
    $(document).on('click', '.checkbox', function() {
      $checkbox.check();
    })
    $(document).on('click', '.radio', function() {
      $checkbox.check();
    })
  },
  check: function() {
    $checkbox.element.each(function() {
      let input = $(this).find('input');
      if(input.prop('disabled')) {
        $(this).addClass('disabled');
      } else {
        $(this).removeClass('disabled');
      }
      if(input.prop('checked')) {
        $(this).addClass('checked');
      } else {
        $(this).removeClass('checked');
      }
    })
    if($('.c-total-price').length>0) {
      totalPrice()
    }
  }
}
let $header = {
  el: $('.header'),
  init: function() {
    let scroll = $(window).scrollTop(),
        scroll_last = $(window).scrollTop(),
        flag;

    $header.animation = gsap.timeline({paused:true})
      .fromTo($header.el, {yPercent:-100}, {immediateRender:false,duration:0.5,yPercent:0,ease:'power2.out'})
    
    if(scroll>100) {
      flag=false;
      $header.show();
    }

    $(window).scroll(function(event) {
      scroll = $(this).scrollTop();
      //bottom
      if (scroll>scroll_last && scroll>100 && !flag){
        flag=true;
        $header.hide();
      }
      //top
      else if(scroll<scroll_last && flag==true) {
        flag=false;
        $header.show();
      }
      //overscroll
      else if(scroll<=0) {
        $header.el.addClass('static');
        $header.state=false;
      }
      scroll_last = scroll;
    });
  },
  show: function() {
    $header.el.removeClass('static');
    $header.state=true;
    $header.animation.play();
  },
  hide: function() {
    if($header.state==false) {
      $header.animation.reverse(-1);
    } else {
      $header.animation.reverse();
    }
    $header.animation.eventCallback("onReverseComplete", function() {
      $header.el.addClass('static');
    });
  }
}
let $nav = {
  trigger: $('.nav-toggle'),
  el: $('.nav'),
  overlay: $('.overlay'),
  state: false,
  flag: true,
  open: function() {
    $('html').addClass('nav-opened');
    $nav.state = true;
    $nav.trigger.addClass('active');
    disablePageScroll();
    $nav.animation.play();
  },
  close: function() {
    $('html').removeClass('nav-opened');
    $nav.state = false;
    $nav.animation.reverse();
    $nav.animation.eventCallback("onReverseComplete", function() {
      $nav.trigger.removeClass('active');
      enablePageScroll();
    })
  },
  init: function() {
    $nav.animation = gsap.timeline({paused:true})
      .to($nav.trigger.find('span:first-child'), {duration:0.5, y:9, ease:'power2.in'})
      .to($nav.trigger.find('span:last-child'), {duration:0.5, y:-9, ease:'power2.in'}, '-=0.5')
      .to($nav.trigger.find('span:nth-child(2)'), {duration:0,autoAlpha:0})
      .to($nav.trigger.find('span:first-child'), {duration:0.5, rotation:45, ease:'power2.out'})
      .to($nav.trigger.find('span:last-child'), {duration:0.5, rotation:135, ease:'power2.out'}, '-=0.5')
      .to($nav.el, {duration:0.5, xPercent:-100, ease:'power2.inOut'},'-=1')
      .fromTo('.js-nav-item', {autoAlpha:0}, {autoAlpha:1,ease:'power2.inOut',duration:0.5, stagger:{amount: 0.25}}, '-=0.75')
      .fromTo('.js-nav-item', {y:40}, {y:0,ease:'power2.out',duration:0.5,stagger:{amount:0.25}}, '-=0.75')
    
    $(document).on('click touchstart mousedown', function(event){
      let btn = $(event.target).closest($nav.trigger),
          header = $(event.target).closest('.header'),
          nav = $(event.target).closest($nav.el);

      if(btn.length>0 && $nav.state==false && event.type=='click') {
        $nav.open();
      } else if(btn.length>0 && $nav.state==true && event.type=='click') {
        $nav.close();
      } else if(header.length==0 && nav.length==0 && (event.type=='touchstart' || event.type=='mousedown')) {
        $nav.close();
      }

    })
    
    $(window).resize(function () {
      if(width()>1200 && $nav.state==true) {
        $nav.close();
      } 
    })

  }
}
let $mask = {
  el: document.querySelectorAll('.masked'),
  init: function() {
    if($mask.el!==null) {
      Inputmask({
        mask: "+7 999 999-9999",
        clearIncomplete: true
      }).mask($mask.el);
    }
  }
}
let audio = {
  el: '.audio',
  init: function() {
    GreenAudioPlayer.init({
      selector: audio.el,
      stopOthersOnPlay: true
    });
    setTimeout(function() {
      $('.play-pause-btn').addClass('js-animated');
      $('.pin.progress__pin').addClass('js-animated');
    },1000)
  }
}
let $scrollArea = {
  init: function() {
    this.elms = document.querySelectorAll('.scroll-container');

    for (let elm of this.elms) {
      let scroll = Scrollbar.init(elm, {
        damping: 0.1,
        alwaysShowTracks: true,
        thumbMinSize: 100
      });
      setInterval(()=>{
        //scroll.update();
      }, 500)
    }
  }
}
let $images = {
  init: function() {
    $(window).resize(function(){
      $images.loaded = $('.lazy.loaded');
      $images.resize($images.loaded);
    })
    $images.load();
  },
  load: function() {
    $images.el = $('.lazy').not('.loaded');
    if($images.el.length>0) {
      $images.el.Lazy({
        effectTime: 0,
        threshold: 500,
        imageBase: false,
        defaultImage: false,
        visibleOnly: false,
        afterLoad: function(element) {
          $(element).addClass('loaded');
          $images.resize($(element));
        }
      });
    }
  },
  resize: function(element) {
    element.each(function() {
      let $this = $(this),
          box = $this.parent();
      if(!box.hasClass('cover-box_size-auto')) {
        let boxH = box.innerHeight(),
            boxW = box.innerWidth();
        setTimeout(function() {
          let imgH = $this.innerHeight(),
              imgW = $this.innerWidth();
          if ((boxW / boxH) >= (imgW / imgH)) {
            $this.addClass('ww').removeClass('wh');
          } else {
            $this.addClass('wh').removeClass('ww');
          }
          $this.addClass('visible');
        }, 300)
      } else {
        $this.addClass('visible');
      }
    })
  }
}
let $slider = {
  $parent: $('.slider'),
  $container: $('.slider__container'),
  slide: $('.slide'),
  $pagination: $('.slider-pagination'),
  $pagitem: $('.slider-pagination__trigger'),
  initialized: false,
  available: false,
  intervalDuration: 4000,
  index: 0,
  init: function() {
    if($slider.$parent.length>0) {

      this.show();

      $(window).resize(function () {
        $slider.resize();
      })
      //click
      this.$pagitem.on('click', function(){
        if($slider.available==true) {
          $slider.available=false;
          $slider.index = $(this).index();
          $slider.show();
        }
      })
      //next
      this.$parent.on('next', function() {
        $slider.available=false;
        $slider.index++;
        if($slider.index==$slider.slide.length) {
          $slider.index=0;
        }
        $slider.show();
      })
      //prev
      this.$parent.on('prev', function() {
        $slider.available=false;
        $slider.index--;
        if($slider.index<0) {
          $slider.index=$slider.slide.length-1;
        }
        $slider.show();
      })
      //swipe
      let area = document.querySelector('.slider'),
        manager = new Hammer.Manager(area, {
        touchAction: 'auto',
        inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
        recognizers: [
          [Hammer.Swipe, {
            direction: Hammer.DIRECTION_ALL
          }]
        ]
      });
      manager.on("swipe", function(event) {
        if(event.offsetDirection=='2' && $slider.available==true) {
          $slider.$parent.trigger('next');
        } else if(event.offsetDirection=='4' && $slider.available==true) {
          $slider.$parent.trigger('prev');
        }
      });

      //interval
      this.interval = setInterval(()=>{
        if(!$slider.paused && $slider.available==true) {
          $slider.$parent.trigger('next');
        }
      },this.intervalDuration)
      if(ismobile()) {
        this.paused=true;
      } else {
        $slider.$parent.on('mouseenter mousemove mouseleave', function(event) {
          if(event.type=='mouseenter' || event.type=='mousemove') {
            $slider.paused=true;
          } else {
            $slider.paused=false;
          }
        })
      }

    }
  },
  show: function() {
    this.$new = this.slide.eq($slider.index);
    this.$pagitem.removeClass('active');
    this.$pagitem.eq($slider.index).addClass('active');
    
    let $newitems = $slider.$new.find('.slide__item'),
        $olditems = $slider.$old!==undefined ? $slider.$old.find('.slide__item') : 'undefined';

    if(this.initialized==false) {
      this.initialized=true;
      //first animation
      let animation = gsap.timeline({onComplete:function(){$slider.available=true}})
        .to($slider.$new, {duration:0,autoAlpha:1},'+=0.25')
        .fromTo($slider.$pagitem, {autoAlpha:0}, {duration:0.8,autoAlpha:1,ease:'power2.inOut',stagger:{amount:0.2}})
        .fromTo($newitems, {autoAlpha:0}, {duration:0.8,autoAlpha:1,ease:'power2.inOut',stagger:{amount:0.2}}, '-=1')
        .fromTo($newitems, {x:-10,y:45}, {duration:0.8,y:0,x:0,ease:'power2.out',stagger:{amount:0.2}}, '-=1')
    } 
    else {
      //else animations
      let animation = gsap.timeline({onComplete:function(){$slider.available=true}})
        .to($slider.$new, {duration:0,autoAlpha:1})
        .to($olditems, {duration:0.45,x:10,y:-45,autoAlpha:0,ease:'power3.in',stagger:{amount:0.05}})
        .to($slider.$old, {duration:0,autoAlpha:0})
        .fromTo($newitems, {autoAlpha:0}, {duration:0.8,autoAlpha:1,ease:'power2.inOut',stagger:{amount:0.2}})
        .fromTo($newitems, {x:-10,y:45}, {duration:0.8,y:0,x:0,ease:'power2.out',stagger:{amount:0.2}}, '-=1')
    }

    this.$old = this.$new;
  },
  resize: function() {
    if($slider.$parent.length>0) {
      let h = 0;
  
      this.slide.each(function(){
        h = $(this).height()>h ? $(this).height() : h;
      })
      
      this.$container.height(h)
    }
  }
}
function onloadTransitions() {
  let title = $('.page-title'),
      brd_item = $('.breadcrumbs__item');

  let animation = gsap.timeline()
    .fromTo(title, {autoAlpha:0}, {duration:0.8,autoAlpha:1,ease:'power2.inOut'},'+=0.25')
    .fromTo(title, {x:-10,y:45}, {duration:0.8,y:0,x:0,ease:'power2.out'}, '-=0.8')
    .fromTo(brd_item, {autoAlpha:0}, {duration:0.8,autoAlpha:1,ease:'power2.inOut',stagger:{amount:0.2}},'-=0.75')
    .fromTo(brd_item, {x:-10,y:45}, {duration:0.8,y:0,x:0,ease:'power2.out',stagger:{amount:0.2}}, '-=1')

  if($('.stage-item').length>0) {
    let icon = $('.stage-item__icon'),
        text = $('.stage-item__text, .stage-item__title'),
        index = $('.stage-item__index'),
        decor = $('.stage-item__decoration');

    let animation = gsap.timeline()
      .fromTo(icon, {autoAlpha:0,scale:0.5}, {duration:1,scale:1,autoAlpha:1,ease:'power2.out',stagger:{amount:1}})
      .fromTo(text, {autoAlpha:0,y:20}, {duration:1,y:0,autoAlpha:1,ease:'power2.out',stagger:{amount:1}},'-=1.75')
      .fromTo(index, {autoAlpha:0,scale:0.5,xPercent:50}, {duration:1,scale:1,xPercent:0,autoAlpha:1,ease:'power2.out',stagger:{amount:1}},'-=1')
      .fromTo(decor, {autoAlpha:0,scale:0.5}, {duration:1,scale:1,autoAlpha:1,ease:'power2.out',stagger:{amount:1}},'-=1.25')
  }
}
function funcybox() {
  $.fancybox.defaults.btnTpl.close = '<button data-fancybox-close class="fancybox-button js-animated fancybox-button--close" title="{{CLOSE}}">' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.6 13.6"><path d="M6.8 5.4L1.4 0 0 1.4l5.4 5.4L0 12.2l1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4L12.2 0z"></path></svg>' +
  "</button>";
  $.fancybox.defaults.btnTpl.arrowLeft = '<button data-fancybox-prev class="fancybox-button js-animated fancybox-button--arrow_left" title="{{PREV}}">' +
  '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10.14"><path d="M6.28 8.77l-1.34 1.37L0 5.07 4.94 0l1.34 1.38L3.6 4.1H14v1.94H3.6z"></path></svg></div>' +
  "</button>";
  $.fancybox.defaults.btnTpl.arrowRight = '<button data-fancybox-prev class="fancybox-button js-animated fancybox-button--arrow_right" title="{{PREV}}">' +
  '<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10.14"><path d="M10.4 6.04L7.72 8.76l1.34 1.38L14 5.07 9.06 0 7.72 1.38 10.4 4.1H0v1.94z"></path></svg></div>' +
  "</button>";
  $.fancybox.defaults.btnTpl.zoom = '<button data-fancybox-zoom class="fancybox-button js-animated fancybox-button--zoom" title="{{ZOOM}}">' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.056 14.096"> <path d="M13.756 12.356l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zm-10.6-3.5a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"></path> </svg>' +
  "</button>";
  $.fancybox.defaults.btnTpl.download = '<a download data-fancybox-download class="fancybox-button js-animated fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;">' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.24 14"> <path d="M13.24 12.09V14H0v-1.91zm-2.97-6.96l1.35 1.32-5 4.87-5-4.87 1.36-1.32 2.68 2.64V0h1.92v7.77z"></path> </svg>' +
  "</a>";
  $.fancybox.defaults.btnTpl.slideShow = '<button data-fancybox-play class="fancybox-button js-animated fancybox-button--play" title="{{PLAY_START}}">' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 13.2"> <path d="M0 0v13.2l11-6.6z"></path></svg>' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.35 12.5" id="slideshow"><path d="M0 0h2.2v12.5H0zm5.15 0h2.2v12.5h-2.2z"></path></svg>' +
  "</button>";
  $.fancybox.defaults.btnTpl.smallBtn = '<button type="button" data-fancybox-close class="fancybox-button js-animated fancybox-close-small" title="{{CLOSE}}">' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.6 13.6"><path d="M6.8 5.4L1.4 0 0 1.4l5.4 5.4L0 12.2l1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4L12.2 0z"></path></svg>' +
  "</button>";
  $.fancybox.defaults.btnTpl.thumbs = '<button data-fancybox-thumbs class="fancybox-button js-animated fancybox-button--thumbs" title="{{THUMBS}}">' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.7 12.7" id="slideshow"><path d="M8.94 8.94h3.76v3.76H8.94zm-4.47 0h3.76v3.76H4.47zM0 8.94h3.76v3.76H0zm8.94-4.47h3.76v3.76H8.94zm-4.47 0h3.76v3.76H4.47zM0 4.47h3.76v3.76H0zM8.94 0h3.76v3.76H8.94zM4.47 0h3.76v3.76H4.47zM0 0h3.76v3.76H0z"></path></svg>' +
  "</button>";
  $.fancybox.defaults.animationDuration = '500'
  $.fancybox.defaults.i18n.ru = {
    CLOSE       : 'Закрыть',
    NEXT        : 'Следующий слайд',
    PREV        : 'Предидущий слайд',
    ERROR       : 'Ошибка загрузки, попробуйте позже.',
    PLAY_START  : 'Запустить слайд-шоу',
    PLAY_STOP   : 'Остановить слайд-шоу',
    FULL_SCREEN : 'Полноэкранный режим',
    THUMBS      : 'Миниатюры',
    DOWNLOAD    : 'Загрузить',
    SHARE       : 'Поделиться',
    ZOOM        : 'Увеличить'
  };
  $.fancybox.defaults.lang = 'ru';
  $.fancybox.defaults.loop = true;
  $.fancybox.defaults.autoFocus = false;
  $.fancybox.defaults.animationEffect = 'fade'
  $.fancybox.defaults.backFocus = 'false'
  
  $(".modal-link").fancybox({
    autoFocus: false,
    smallBtn: true,
    touch: false
  });

}
function scroll() {
  let $btn = $('.scrollTo');
  $btn.on('click', function(event) {
    event.preventDefault();
    let $block = $(this).attr('href');
    let animation = gsap.to(window, {duration: 1, scrollTo: $block, ease:'power2.inOut'});
  })
}
function parallax() {
  let scene = $('.scene');
  scene.each(function() {
    let parallaxInstance = new Parallax(this, {
      limitY: '0',
      limitX: '60'
    });
  })
}
function priceCorrecting(number, decimals) {
  let i, j, kw, kd, km;
  i = parseInt(number = (+number || 0).toFixed(decimals)) + '';
  ((j = i.length) > 3) ? (j = j % 3) : (j = 0)
  km = j ? i.substr(0, j) + ' ' : '';
  kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ' ');
  kd = (decimals ? '.' + Math.abs(number - i).toFixed(decimals).replace(/-/, '0').slice(2) : '');
  return (km+kw+kd).replace(/(0+)$/, '').replace(/[^0-9]$/, '');
}
function totalPrice() {
  let totalVal = 0,
      $totalVal = $('.c-total-price span'),
      $item = $('.f-check-item');

  $item.each(function() {
    if($(this).find('input').prop('checked') ) {
      totalVal = totalVal+(+$(this).find('input').data('price'));
    }
  })
  priceCorrecting(totalVal,2)
  $totalVal.text(priceCorrecting(totalVal,2)+' ');
}
//toggle
function toggleblocks() {
  $(document).on('click', '.toggle-button', function(event) {
    event.preventDefault();

    let $container = $(this).closest('.toggle-group');
    let $content = $container.find('.toggle-content').eq(0);
    let $btns = $container.find('.toggle-button').not($content.find('.toggle-button'));


    if($container.hasClass('active')) {
      $container.removeClass('active');
      $content.removeClass('active');
      $btns.each(function() {
        $(this).removeClass('active');
        if($(this).data('show-text')!==undefined) {
          if($(this).find('span').length>0) {
            $(this).find('span').text($(this).data('show-text'))
          } else {
            $(this).text($(this).data('show-text'))
          }
        }
      })
    } else {
      $container.addClass('active');
      $content.addClass('active');
      $btns.each(function() {
        $(this).addClass('active');
        if($(this).data('hide-text')!==undefined) {
          if($(this).find('span').length>0) {
            $(this).find('span').text($(this).data('hide-text'))
            console.log('2')
          } else {
            $(this).text($(this).data('hide-text'))
          }  
        }
      })
    }


  })
}