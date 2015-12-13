$(document).ready(function($) {
    "use strict";

  var svg = Snap("#intro");
  var debug = svg.g();

  var height = svg.parent().node.offsetHeight;
  var width = svg.parent().node.offsetWidth;
  var wrapperWidth = $('#wrapper').outerWidth();

  svg.attr({
    width: width,
    height: height
  });

  var pathHeight = 30;
  var greenWavePoints = [0, 155, 479, 937, 1231, 1611, width];
  var yellowWavePoints = [0, 210, 618, 1050, 1408, width];
  var blueWavePoints = [0, 273, 616, 952, 1424, width];
  var count = 0;
  var dx = width / 6;

  function buildPath(points) {
    var SVGString = 'M ' + points[0].x + ' ' + points[0].y;
    debug.clear();

    var cp0 = {
      x: (points[1].x - points[0].x) / 2,
      y: (points[1].y - points[0].y) + points[0].y + (points[1].y - points[0].y)
    };

    SVGString += ' C ' + cp0.x + ' ' + cp0.y + ' ' + cp0.x + ' ' + cp0.y + ' ' + points[1].x + ' ' + points[1].y;

    var prevCp = cp0;
    var inverted = -1;

    for (var i = 1; i < points.length-1; i++) {
      var cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
      var cp1 = {
        x: (points[i].x - prevCp.x) + points[i].x,
        y: (points[i].y - prevCp.y) + points[i].y
      };

      SVGString += ' C ' + cp1.x + ' ' + cp1.y + ' ' + cp1.x + ' ' + cp1.y + ' ' + points[i+1].x + ' ' + points[i+1].y;
      prevCp = cp1;
      inverted = -inverted;
    };

    SVGString += ' L ' + width + ' ' + height;
    SVGString += ' L 0 ' + height + ' Z';
    return SVGString;
  }

  function drawDebugDot(cx, cy, r, color) {
    var dot = svg.circle(cx, cy, r);
    dot.attr({
      fill: color
    });
    debug.add(dot);
  }

  function buildWave(wave) {
    var SVGString = 'M ' + wave.start.x + ' ' + wave.start.y;

    wave.segments.forEach(function(segment, index) {
      SVGString += ' C ' + segment.x1 + ' ' + segment.y1 + ', ' + segment.x2 + ' ' + segment.y2 + ', ' + segment.x + ' ' + segment.y;
    });

    SVGString += 'L '+ wave.end.x + ' ' + wave.end.y + ' L 0 ' + wave.end.y + ' Z';

    return SVGString;
  }

  function calculateWavePoints(factor, wave) {
    var calculatedWave = {
      start: { x: wave.start.x, y: wave.start.y * factor },
      end: { x: wave.end.x, y: wave.end.y * factor },
      segments: []
    };

    calculatedWave.segments = wave.segments.map(function(segment, i) {
      var sinSeed = factor*2 + (i + i % 10) * 300;
      var sinHeight = Math.sin(sinSeed / 300) * pathHeight;
      var yPos = Math.sin(sinSeed / 100) * sinHeight + factor;
      return {
        x: segment.x,
        y: segment.y * factor,
        x1: segment.x1,
        y1: segment.y1 * factor,
        x2: segment.x2,
        y2: segment.y2 * factor
      }
    });

    return calculatedWave;
  }

  function computePoints(points, a, speed) {
    var pathPoints = [];

    for (var i = 1; i < points.length+1; i++) {
      var sinSeed = a*speed + (i + i % 10) * 300;
      var sinHeight = Math.sin(sinSeed / 300) * pathHeight;
      var yPos = Math.sin(sinSeed / 100) * sinHeight + a;

      pathPoints.push({ x: points[i-1], y: yPos });
    }

    return pathPoints;
  }

  var introText = $('#intro-text');
  var unLogo = $('#un-logo');

  function animatePages(callback) {
    var introPages = $('#intro-pages');
    var pages = introPages.find('img');
    var callback = callback || function() {};
    var iteration = pages.length;

    pages.each(function(index) {
      var page = $(this);

      setTimeout(function() {
        page.animate({ left: 30+(index*5) + '%', opacity: 1 }, {
          duration: 250,
          complete: function() {
            setTimeout(function() {
              page.animate({ left: 110 + '%', opacity: 0 }, 250);
            }, 2000 + 200*iteration);
          }
        });
      }, 200*iteration);
      iteration--;
    });
  }

  var lerp = function( a, b, percent ) {
    return a + percent * ( b - a );
  };

  function animatePeople(backwards) {
    var peopleIcons = $('#intro-people .people-icon');
    var backwards = backwards || false;
    var callback = callback || function() {};
    var opacity = (!backwards) ? 1: 0;

    peopleIcons.animate({ opacity: opacity }, {
      duration: 500,
      step: function(val, fx) {
        var icon = $(this);
        var pos = fx.pos;
        if (!backwards) {
          var scale = (pos <= 0.6) ? lerp(0.2, 1.3, pos/0.6) : lerp(1.3, 1, 1 - ((1 - pos) / 0.4));
        } else {
          var scale = (pos <= 0.4) ? lerp(1, 1.3, pos/0.4) : lerp(1.3, 0.2, 1 - ((1 - pos) / 0.6));
        }
        icon.css({
          transform: 'scale('+scale+', '+scale+')'
        });
      }
    });
  }

  function setPeopleCircle() {
    var peopleIconsContainer = $('#intro-people');
    var peopleIcons = $('#intro-people .people-icon');
    var cx = width / 2 - 30;
    var cy = height / 2 + 10;

    peopleIconsContainer.addClass('people-circle');
    peopleIcons.removeClass('bounceOut bounceIn');

    peopleIcons.each(function(index) {
      var radius = (width <= 480) ? 120 : 200;
      var iconWidth = (width <= 480) ? 50 : 'auto';
      var a = (360/10*index) * (Math.PI/180);
      var x = cx + (radius) * Math.cos(a);
      var y = cy + (radius) * Math.sin(a);
      var icon = $(this);

      icon.css({ left: x, top: y, width: iconWidth });

      setTimeout(function() {
        icon.animate({ opacity: 1 }, {
          duration: 500,
          step: function(val, fx) {
            var icon = $(this);
            var pos = fx.pos;
            var scale = (pos <= 0.6) ? lerp(0.2, 1.3, pos/0.6) : lerp(1.3, 1, 1 - ((1 - pos) / 0.4));

            icon.css({
              transform: 'scale('+scale+', '+scale+')'
            });
          }
        });
      }, 100*index);
    });
  }

  function recalcuateIconPositions() {
    var peopleIconsContainer = $('#intro-people');
    var peopleIcons = $('#intro-people .people-icon');
    var cx = width / 2 - 30;
    var cy = height / 2 + 10;
    if (peopleIconsContainer.hasClass('people-circle')) {
      peopleIcons.each(function(index) {
        var radius = (width <= 480) ? 120 : 200;
        var iconWidth = (width <= 480) ? 50 : 'auto';
        var a = (360/10*index) * (Math.PI/180);
        var x = cx + (radius) * Math.cos(a);
        var y = cy + (radius) * Math.sin(a);
        var icon = $(this);

        icon.css({ left: x, top: y, width: iconWidth });
      });
    } else {

    }
  }

  function recalculateIntroTextPosition() {
    if (introText.hasClass('ended')) {
      // Mobile breakpoint
      if (wrapperWidth <= 768) {
        introText.css({ left: 10, top: 80 });
      } else {
        introText.css({left: 40, top: 40 });
      }
    }
  }

  ////////////////
  // Animations //
  ////////////////
  Snap.animate(height, 150, function(val) {
    var wavePath = buildPath(computePoints(greenWavePoints, val, 2));

    svg.select("#wave-1").attr('d', wavePath);
  }, 2000, mina.linear, function() {
    svg.select("#wave-1").animate({
      'd': 'M 0 366 C 0 366 31 335 155 359 C 279 382 340 385 479 313 C 617 240 761 204 937 244 C 1113 284 1177 219 1231 153 C 1287 85 1445 22 1611 12 C 1776 3 ' + width + ' 0 ' + width + ' 0 L ' + width + ' 1200 L 0 1200 Z'
    }, 350);
  });

  Snap.animate(height, 450, function(val) {
    var wavePath = buildPath(computePoints(yellowWavePoints, val, 2));

    svg.select("#wave-2").attr('d', wavePath);
  }, 2000, mina.linear, function() {
    svg.select("#wave-2").animate({
      'd': 'M 0 454 C 0 454 75 491 210 488 C 346 486 493 423 618 366 C 735 309 930 345 1050 392 C 1171 438 1249 476 1408 570 C 1581 663 ' + width + ' 633 ' + width + ' 633 L ' + width + ' 1200 L 0 1200 Z'
    }, 350);

  });

  Snap.animate(height+200, 900, function(val) {
    var wavePath = buildPath(computePoints(blueWavePoints, val, 3));

    svg.select("#wave-3").attr('d', wavePath);
  }, 2000, mina.linear, function() {
    svg.select("#wave-3").animate({
      'd': 'M 0 643 C 0 643 74 603 273 612 C 473 607 528 681 616 745 C 690 809 726 888 952 883 C 1178 892 1315 932 1424 1004 C 1533 1077 1663 1091 ' + width + ' 1073 L ' + width + ' 1200 L 0 1200 Z'
    }, 350);

    animatePeople(false);

    setTimeout(animatePages, 250);

    introText.css({
      left: width/2 - introText.width()/2,
      top: height/2 - introText.height()/2,
    });

    setTimeout(function() {
      introText.animate({ opacity: 1 }, 1000);
    }, 4300);

    setTimeout(function() {
      var pos = ((wrapperWidth && wrapperWidth <= 768) || (width <= 768)) ? { left: 10, top: 80 } : { left: 40, top: 40 };

      introText.animate(pos, {
        step: function(now, fx) {
          var val = 1 - 0.5 * fx.pos;
          introText.css({ transform: 'scale('+ val +', ' + val + ')'});
        },
        duration: 1000,
        complete: function() {
          introText.addClass('ended');
        }
      });
      unLogo.animate({ opacity: 1 }, 1000);
    }, 4700);
    setTimeout(animatePeople.bind(this, true), 6000);
    setTimeout(setPeopleCircle, 6500);
  });

  window.resizeIntroAnimation = function resizeIntroAnimation() {
    setTimeout(function() {
      height = svg.parent().node.offsetHeight;
      width = svg.parent().node.offsetWidth;
      wrapperWidth = $('#wrapper').outerWidth();

      svg.attr({
        width: width,
        height: height
      });

      recalcuateIconPositions();
      recalculateIntroTextPosition();
    }, 100);
  }

});
