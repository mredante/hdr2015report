/*jshint jquery:true */
/*jshint unused:false */

//after
//<path d="m441.55 483.38h176.37c34.434-79.74 34.434-173.49 0-253.24h-176.37c42.21 64.42 39.676 183.23 0 253.24" fill="#f1b234" id="path22"/>
//<path d="m201.65 230.15h-176.38c-34.43 79.74-34.429 173.49 0 253.24h176.38c-44.34-78.02-39.69-183.23 0-253.24" fill="#33ade3" id="path26"/>
//before
//22: m 441.55,230.32275 176.37,0 c 34.434,-0.0575 34.434,-0.1252 0,-0.18275 l -176.37,0 c 42.21,0.0465 39.676,0.13223 0,0.18275
//26: m 201.65,483.20725 -176.38,0 c -34.43,0.0575 -34.429,0.1252 0,0.18275 l 176.38,0 c -44.34,-0.0563 -39.69,-0.13223 0,-0.18275
$(document).ready(function($) {
    "use strict";
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var browserSafari = false;
    var browser = {};
    var os = {};
    var device = {};
    var ua = navigator.userAgent;
    var webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
    var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
    var wp8 = ua.match(/Trident\/([\d.]+)/) && ua.match(/IEMobile\/([\d.]+)/);
    var safari = webkit && ua.match(/Safari\//) && !chrome && !wp8;
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    if (safari && (ua.match(/Safari/) || !!os.ios)) browserSafari = true;

    if ($(window).outerWidth() < 1281 && iOS) {
        $('#text68').attr('font-size', '25');
        $('#tspan1074').attr('x', '328');
        $('#tspan1076').attr('x', '315');
    }
    if ($(window).outerWidth() > 1281 && browserSafari) {
        $('#tspan1074').attr('x', '325');
        $('#tspan1076').attr('x', '311');
    }

    var chapter1 = {
        setup: function () {
            this.snap = Snap('#animated-svg-chapter-1 #svg1');
            if (!this.snap) return;
            this.boxRight = this.snap.select('#path22');
            this.boxLeft = this.snap.select('#path26');
            this.arrowTop = this.snap.select('#path30');
            this.arrowBottom = this.snap.select('#path34');
            this.arrowTopBBox = this.arrowTop.getBBox();
            this.arrowBottomBBox = this.arrowBottom.getBBox();
            this.textsGroup = this.snap.select('#texts-group');
            this.textBottom = this.snap.select('#g3398').attr({'fill-opacity': 0});
            this.textTop = this.snap.select('#text36').attr({'fill-opacity': 0});
            this.textMiddle = this.snap.select('#text68').attr({'fill-opacity': 0});
            this.textRight = this.snap.select('#text40-7');
            this.textLeft = this.snap.select('#text40');
            this.snapBBox = this.snap.getBBox();

            this.topMask = this.snap.rect(0, 0, this.snapBBox.w, this.snapBBox.h/2.8);
            this.bottomMask = this.snap.rect(0, this.snapBBox.h - this.snapBBox.h/3.95, this.snapBBox.w, this.snapBBox.h/2.8);
            this.masksTopGroup = this.snap.group(this.topMask);
            this.masksBottomGroup = this.snap.group(this.bottomMask);

            this.arrowTopOrigin = this.arrowTopBBox.cx + "," + (this.snapBBox.cy);
            this.arrowBottomOrigin = this.arrowBottomBBox.cx + "," + (this.snapBBox.cy);

            this.masksTopGroup.attr({
                fill: '#fff'
            });
            this.masksBottomGroup.attr({
                fill: '#fff'
            });
            this.arrowTopGroup = this.snap.group(this.arrowTop);
            this.arrowTopGroup.attr({
                mask: this.masksTopGroup
            });
            this.arrowBottomGroup = this.snap.group(this.arrowBottom);
            this.arrowBottomGroup.attr({
                mask: this.masksBottomGroup
            });
            this.arrowTop.attr({
                transform: "r180," + this.arrowTopOrigin
            });
            this.arrowBottom.attr({
                transform: "r180," + this.arrowBottomOrigin
            });
        },
        animation: function () {
            this.textsGroup.appendTo(this.snap);
            this.fadeInTexts();
            setTimeout(this.boxLeftAnimation.bind(this), 10);
            setTimeout(this.topArrowAnimation.bind(this), 500);
            setTimeout(this.boxRightAnimation.bind(this), 1300);
            setTimeout(this.bottomArrowAnimation.bind(this), 1700);
            setTimeout(this.bothArrowsAnimation.bind(this), 2200);
            setTimeout(this.bindTooltips.bind(this), 5500);
        },
        fadeInTexts: function () {
            var delay = 200;
            this.textLeft.selectAll('tspan').forEach(function (span, index) {
                setTimeout(function () {
                    span.animate({
                        'fill-opacity': 1
                    }, 500, mina.ease);
                }.bind(this), delay * (index+1));
            }.bind(this));
            setTimeout(function () {
                this.textRight.selectAll('tspan').forEach(function (span, index) {
                    setTimeout(function () {
                        span.animate({
                            'fill-opacity': 1
                        }, 500, mina.ease);
                    }.bind(this), delay * (index+1));
                }.bind(this));
            }.bind(this), 1400);
                // this.textLeft.animate(
                //     {'fill-opacity': 1
                // }, 500, mina.ease);
            // setTimeout(function () {this.textRight.animate({'fill-opacity': 1}, 500, mina.ease);}.bind(this), 1400);
            setTimeout(function () {this.textTop.animate({'fill-opacity': 1}, 500, mina.ease);}.bind(this), 3500);
            setTimeout(function () {this.textBottom.animate({'fill-opacity': 1}, 500, mina.ease);}.bind(this), 3500);
            setTimeout(function () {this.textMiddle.animate({'fill-opacity': 1}, 500, mina.ease);}.bind(this), 4000);
        },
        boxRightAnimation: function () {
            this.boxRight.animate({
                d: 'm441.55 483.38h176.37c34.434-79.74 34.434-173.49 0-253.24h-176.37c42.21 64.42 39.676 183.23 0 253.24',
                opacity: '1'
            }, 400, mina.ease );
        },
        boxLeftAnimation: function () {
            this.boxLeft.animate({
                d: 'm201.65 230.15h-176.38c-34.43 79.74-34.429 173.49 0 253.24h176.38c-44.34-78.02-39.69-183.23 0-253.24',
                opacity: '1'
            }, 400, mina.ease );
        },
        topArrowAnimation: function () {
            this.arrowTop.animate({
                transform: "r360," + this.arrowTopOrigin
            }, 1200, function (n) {
                return (--n)*n*n+1;
            } );
        },
        bottomArrowAnimation: function () {
            this.arrowBottom.animate({
                transform: "r720," + this.arrowBottomOrigin
            }, 4200, function (n) {
                return (--n)*n*n+1;
            } );
        },
        bothArrowsAnimation: function () {
            this.masksTopGroup = this.snap.group(this.topMask, this.bottomMask);
            this.masksBottomGroup = this.snap.group(this.topMask.clone(), this.bottomMask.clone());
            this.masksTopGroup.attr({
                fill: '#fff'
            });
            this.masksBottomGroup.attr({
                fill: '#fff'
            });
            this.arrowTopGroup.attr({
                mask: this.masksTopGroup
            });
            this.arrowBottomGroup.attr({
                mask: this.masksBottomGroup
            });
            this.arrowTop.animate({
                transform: "r720," + this.arrowTopOrigin
            }, 3700, function (n) {
                return (--n)*n*n+1;
            } );
        },
        bindTooltips: function () {
            this.topGroupHover = this.snap.rect(0, 0, this.snapBBox.w, this.snapBBox.h/2.8);
            this.bottomGroupHover = this.snap.rect(0, this.snapBBox.h - this.snapBBox.h/4, this.snapBBox.w, this.snapBBox.h/2.8);
            this.selectorId = '';

            this.topGroupHover.attr({
                opacity: 0,
                class: 'has-tooltip',
                'data-id': $(this.arrowTop.node).attr('id')
            });
            this.bottomGroupHover.attr({
                opacity: 0,
                class: 'has-tooltip',
                'data-id': $(this.arrowBottom.node).attr('id')
            });
            this.boxRight.attr({
                class: 'has-tooltip'
            });
            this.boxLeft.attr({
                class: 'has-tooltip'
            });

            this.showTooltip = function (path, e) {
                this.selectorId = $(path).attr('id') || $(path).data('id');
                this.tooltip = section.find('[data-target="#' + this.selectorId + '"]');
                this.tooltip.fadeIn(200);
                this.updateTooltip(e);
            };

            this.hideTooltip = function () {
                var tooltip = section.find('[data-target]');
                tooltip.hide();
                this.selectorId = '';
            };

            this.updateTooltip = function (e) {
                var top = e.clientY;
                var left = e.clientX;
                var offsetTop = top + this.tooltip.outerHeight() - $(window).outerHeight();
                if (offsetTop > 0) {
                    top = top - offsetTop;
                }
                var offsetLeft = left + this.tooltip.outerWidth() - $(window).outerWidth();
                if (offsetLeft > 0) {
                    left = left - offsetLeft;
                }
                if (top < 65) {
                    top = 65;
                }
                this.tooltip.css({
                    top: top,
                    left: left
                });
            };

            var section = $(this.snap.node).closest('section');
            var paths = section.find('.has-tooltip');
            paths.each(function (key, path) {
                var event = 'click';
                if ($(window).outerWidth() > 1280) {
                    event = 'mousemove';
                    $(path).on('mouseleave', this.hideTooltip.bind(this));
                }
                $(path).on(event, function (e) {
                    var tooltipId = ($(path).attr('id') || $(path).data('id'));
                    if (this.selectorId !== tooltipId) {
                        this.hideTooltip();
                        this.showTooltip(path, e);
                    } else {
                        if ($(window).outerWidth() > 769) {
                            this.updateTooltip(e);
                        }
                    }
                }.bind(this));
            }.bind(this));

            // $(window).on('scroll', this.hideTooltip.bind(this));

            if ($(window).outerWidth() > 1281) {
                $('svg').on('mouseleave', this.hideTooltip.bind(this));
            }
            if ($(window).outerWidth() < 1281) {
                $('.svg-tooltips h3').on('click', this.hideTooltip.bind(this));
                $('.svg-tooltips div').on('click touchstart touchmove scroll', function (e) {
                    e.stopPropagation();
                });
            }

        }
    };
    var chapter6 = {
        setup: function () {
            this.snap =  Snap('#animated-svg-chapter-6 #svg2');
            if (!this.snap) return;
            this.elements = {
                gCircle1: this.snap.select('#path498'),
                gCircle2: this.snap.select('#path454'),
                gCircle3: this.snap.select('#path410'),
                oCircle1: this.snap.select('#path366'),
                oCircle2: this.snap.select('#path322'),
                oCircle3: this.snap.select('#path278'),
                pCircle1: this.snap.select('#path234'),
                pCircle2: this.snap.select('#path190'),
                pCircle3: this.snap.select('#path146'),
                bCircle1: this.snap.select('#path1088'),
                bCircle2: this.snap.select('#path62'),
            };
            this.arcs = {
                gArc: this.snap.select('#path574'),
                oArc: this.snap.select('#path586'),
                pArc: this.snap.select('#path578'),
                bArc: this.snap.select('#path582')
            };
            this.groups = [
                this.snap.select('#g4462'),
                this.snap.select('#g4571'),
                this.snap.select('#g4676'),
                this.snap.select('#g4765')
            ];
            $.each(this.elements, function (key, element) {
                element.attr({transform: 's0.8,0.8', opacity: 0});
            });
            $.each(this.arcs, function (key, arc) {
                arc.attr({transform: 's0.8,0.8', opacity: 0});
            });
            this.texts = {
                gText1: this.snap.select('#text500-8'),
                gText2: this.snap.select('#text500-1'),
                gText3: this.snap.select('#text500-5'),
                gArcText: this.snap.select('#g9981'),
                oText1: this.snap.select('#text500-63'),
                oText2: this.snap.select('#text500-68'),
                oText3: this.snap.select('#text500-6'),
                oArcText: this.snap.select('#g10139'),
                pText1: this.snap.select('#text500-9'),
                pText2: this.snap.select('#text500-3'),
                pText3: this.snap.select('#text500'),
                pArcText: this.snap.select('#g10175'),
                bText1: this.snap.select('#text1090'),
                bText2: this.snap.select('#text500-0'),
                bArcText: this.snap.select('#g10061'),
                mainText: this.snap.select('#text1072')
            };
            $.each(this.texts, function (key, element) {
                element.attr({opacity: 0});
            });
            this.dots = this.snap.select('#g10231');
            this.dotsBBox = this.dots.getBBox();
            this.dots.attr({
                opacity: 0
            });
            this.pulseElements = [];
            $.each(this.elements, function (key, element) {
                var clone = element.clone();
                var bbox = clone.getBBox();
                clone.attr({
                    'data-id': $(element.node).attr('id')
                });
                this.pulseElements.push(clone);
            }.bind(this));
            this.pulseArcs = [];
            $.each(this.arcs, function (key, arc) {
                var clone = arc.clone();
                var bbox = clone.getBBox();
                clone.attr({
                    'data-id': $(arc.node).attr('id')
                });
                this.pulseArcs.push(clone);
            }.bind(this));
        },
        animation: function () {
            var pulseDelay = 2000;
            if ($(window).outerWidth() < 1281) {
                pulseDelay = 6000;
            }
            setTimeout(this.fadeInElements.bind(this), 100);
            setTimeout(this.fadeInArcs.bind(this), 500);
            setTimeout(this.fadeInTexts.bind(this), 1000);
            setTimeout(this.fadeInDots.bind(this), 2500);
            setTimeout(this.pulse.bind(this), pulseDelay);
            setTimeout(this.bindHover.bind(this), 3500);
        },
        fadeInElements: function () {
            var delay = 250;
            var index = 1;
            $.each(this.elements, function (key, element) {
                setTimeout(function () {
                    var bbox = element.getBBox();
                    element.attr({
                        opacity: 0,
                        transform: "s1,1," + bbox.cx + "," + bbox.cy
                        // transform: "s0.9,0.9," + bbox.cx + "," + bbox.cy
                    });
                    element.animate({
                        opacity: 1
                        // transform: "s1,1," + bbox.cx + "," + bbox.cy
                    }, 800, mina.elastic);
                }, delay * index);
                index++;
            });
        },
        fadeInArcs: function () {
            var delay = 600;
            var index = 1;
            $.each(this.arcs, function (key, arc) {
                setTimeout(function () {
                    var bbox = arc.getBBox();
                    arc.attr({
                        opacity: 0,
                        // transform: "s0.9,0.9," + bbox.cx + "," + bbox.cy
                        transform: "s1,1," + bbox.cx + "," + bbox.cy
                    });
                    arc.animate({
                        opacity: 1,
                        // transform: "s1,1," + bbox.cx + "," + bbox.cy
                    }, 1000, mina.elastic);
                }, delay * index);
                index++;
            });
        },
        fadeInTexts: function () {
            var delay = 150;
            var index = 1;
            $.each(this.texts, function (key, text) {
                setTimeout(function () {
                    text.animate({
                        opacity: 1
                    }, 500, mina.elastic);
                }, delay * index);
                index++;
            });
        },
        fadeInDots: function () {
            this.dots.animate({
                opacity: 1
            //     transform: "r90," + this.dotsBBox.cx + ',' + this.dotsBBox.cy + "s1.05,1.05," + this.dotsBBox.cx + "," + this.dotsBBox.cy
            }, 1000);
        },
        pulse: function () {
            var delay = 500;
            var index = 1;
            $.each(this.pulseElements, function (key, element) {
                var bbox = element.getBBox();
                element.timeout = setTimeout(function () {
                    element.attr({
                        opacity: 1,
                        transform: "s1,1," + bbox.cx + "," + bbox.cy
                    });
                    element.animate({
                        opacity: 0,
                        transform: "s1.3,1.3," + bbox.cx + "," + bbox.cy
                    }, 500, mina.linear);
                }, delay * index);
                if (index%3===0 || index === this.pulseElements.length) {
                    var arcIndex = parseInt(index/3)-1;
                    if (index === this.pulseElements.length) {
                        arcIndex = this.pulseArcs.length-1;
                    }
                    var arc = this.pulseArcs[arcIndex];
                    arc.timeout = setTimeout(function () {
                        var bbox = arc.getBBox();
                        arc.attr({
                            opacity: 1,
                            transform: "s1,1," + bbox.cx + "," + bbox.cy
                        });
                        arc.animate({
                            opacity: 0,
                            transform: "s1.1,1.1," + bbox.cx + "," + bbox.cy
                        }, 500, mina.linear);
                    }.bind(this), (delay * index) + 350);
                }
                index++;
            }.bind(this));
            this.pulseInterval = setTimeout(this.pulse.bind(this), delay * index + 3000);
        },
        bindHover: function () {
            var section = $(this.snap.node).closest('section');
            var allElements = $.extend({}, this.elements, this.arcs);

            this.showTooltip = function (element, e) {
                this.hideTooltip();
                this.tooltipId = $(element).data('id') || $(element).attr('id');
                this.tooltip = section.find('[data-target="#' + this.tooltipId + '"]');
                this.positionTooltip(e);
                this.tooltip.fadeIn(200);
            };

            this.positionTooltip = function (e) {
                var top = e.clientY;
                var left = e.clientX;
                var offsetTop = top + this.tooltip.outerHeight() - $(window).outerHeight();
                if (offsetTop > 0) {
                    top = top - offsetTop;
                }
                var offsetLeft = left + this.tooltip.outerWidth() - $(window).outerWidth();
                if (offsetLeft > 0) {
                    left = left - offsetLeft;
                }
                this.tooltip.css({
                    top: top + 10,
                    left: left + 10
                });
            };

            this.hideTooltip = function () {
                this.tooltipId = '';
                var tooltips = section.find('[data-target]');
                tooltips.hide();
            };
            this.getTooltip = function (group, hoverBox, e) {
                hoverBox.unmousemove();
                var active = false;
                var x = e.clientX - this.snap.node.getBoundingClientRect().left;
                var y = e.clientY - this.snap.node.getBoundingClientRect().top;
                $.each(allElements, function (key, element) {
                    if (active) return;
                    var transformedPath = Snap.path.map(element.realPath, group.matrix);
                    if (Snap.path.isPointInside(transformedPath, x, y)) {
                        active = true;
                        var newTooltipId = $(element.node).data('id') || $(element.node).attr('id');
                        if (this.tooltipId !== newTooltipId) {
                            this.hideTooltip();
                            this.showTooltip(element.node, e);
                        } else {
                            this.positionTooltip(e);
                        }
                        return;
                    }
                }.bind(this));
                if (!active) {
                    this.hideTooltip();
                }
                hoverBox.mousemove(this.getTooltip.bind(this, group, hoverBox));
            };

            $(window).on('scroll', this.hideTooltip.bind(this));
            if ($(window).outerWidth() < 1281) {
                // hoverBox.touchstart(this.getTooltip.bind(this, group, hoverBox));
                $('.svg-tooltips h3').on('click', this.hideTooltip.bind(this));
                $.each(allElements, function (key, element) {
                    $(element.node).on('click', function (e) {
                        this.showTooltip(element.node, e);
                    }.bind(this));
                }.bind(this));
                $.each(this.pulseElements, function (key, element) {
                    $(element.node).on('click', function (e) {
                        this.showTooltip(element.node, e);
                    }.bind(this));
                }.bind(this));
                $.each(this.pulseArcs, function (key, element) {
                    $(element.node).on('click', function (e) {
                        this.showTooltip(element.node, e);
                    }.bind(this));
                }.bind(this));
                return;
            }

            this.groups.forEach(function (group) {
                var groupBBox = group.getBBox();
                if (groupBBox.x < 200 && groupBBox.w > 300) {
                    groupBBox.w = 300;
                }
                if (groupBBox.x > 200 && groupBBox.y > 200 && groupBBox.h > 400) {
                    groupBBox.y = groupBBox.y + 200;
                    groupBBox.h = 200;
                }
                var hoverBox = this.snap.rect(groupBBox.x,groupBBox.y,groupBBox.w,groupBBox.h);
                hoverBox.attr({
                    opacity: 0
                });
                // if ($(window).outerWidth() < 769) {
                //     $('.svg-tooltips h3').on('click', this.hideTooltip.bind(this));
                //     hoverBox.ontouchstart(this.getTooltip.bind(this, group, hoverBox));
                //     // hoverBox.mouseout(this.hideTooltip.bind(this));
                //     return;
                // }

                $(hoverBox.node).on('mouseenter', function (e) {
                    // $(hoverBox.node).appendTo(this.snap.node);
                    // $(group.node).before(hoverBox.node);
                    clearInterval(this.pulseInterval);
                    $.each(this.pulseElements, function (key, element) {
                        clearTimeout(element.timeout);
                    });
                    $.each(this.pulseArcs, function (key, arc) {
                        clearTimeout(arc.timeout);
                    });
                    group.animate({
                        transform: 's1.05,1.05,'+ group.cx + ',' + group.cy
                    }, 200, mina.ease);
                    hoverBox.animate({
                        transform: 's1.05,1.05,'+ group.cx + ',' + group.cy
                    }, 200, mina.ease, function () {
                        hoverBox.unmousemove();
                        hoverBox.mousemove(this.getTooltip.bind(this, group, hoverBox));
                        hoverBox.mouseout(this.hideTooltip.bind(this));
                    }.bind(this));
                    this.groups.forEach(function (otherGroup) {
                        if (otherGroup == group) return;
                        otherGroup.attr({opacity: 0.5});
                        this.dots.attr({opacity: 0.2});
                    }.bind(this));
                }.bind(this));
                $(hoverBox.node).on('mouseleave', function () {
                    group.animate({
                        transform: 's1.0,1.0,'+ group.cx + ',' + group.cy
                    }, 200, mina.ease);
                    this.groups.forEach(function (otherGroup) {
                        otherGroup.attr({opacity: 1});
                    });
                    this.dots.attr({opacity: 1});
                    this.pulse();
                    hoverBox.unmousemove();
                    hoverBox.unmouseout();
                }.bind(this));

            }.bind(this));

            if ($(window).outerWidth() > 1281) {
                $('svg').on('mouseleave', this.hideTooltip.bind(this));
            }
        }
    };

    chapter1.setup();
    chapter6.setup();
    var chapters = [chapter1, chapter6];

    $(window).on('scroll', onScroll);
    $(window).on('load', onScroll);

    function onScroll() {
        chapters.forEach(function (chapter) {
            if (!chapter.snap) return;
            if ($(chapter.snap.node).offset().top < $(window).scrollTop() + 0.7*$(window).outerHeight()) {
                chapter.animation();
                chapter.animation = function(){};
            }
        });
    }

}(jQuery));
