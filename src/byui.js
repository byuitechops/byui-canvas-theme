function _toConsumableArray(a) {
    if (Array.isArray(a)) {
        for (var b = 0, c = Array(a.length); b < a.length; b++)
            c[b] = a[b];
        return c
    }
    return Array.from(a)
}
(function () {
    function a(a) {
        function b() {
            console.log('loading jQuery');
            var b = document.createElement('script');
            b.href = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
                b.onload = a,
                document.head.appendChild(b)
        }
        try {
            if ('undefined' == typeof $ || 'undefined' == typeof $().jquery)
                b();
            else {
                for (var c = ['1', '7', '0'], d = $().jquery.split('.'), e = !0, f = 0; f < c.length && !(d[f] > c[f]); f++)
                    if (d < c) {
                        e = !1;
                        break
                    }
                if (!e)
                    return void b();
                a()
            }
        } catch (a) {
            console.error(a)
        }
    }
    function b(b) {
        a(function () {
            try {
                if ($().accordion === void 0) {
                    var a = document.createElement('script');
                    a.addEventListener('load', function () {
                        b()
                    }),
                        a.src = 'https://content.byui.edu/file/525e5166-d654-4340-b9b5-d15945a85d4a/1/jquery.ui.1.8.21.accordion.min.js',
                        document.head.appendChild(a)
                }
            } catch (a) {
                console.error(a)
            }
        })
    }
    window.addEventListener('load', function () {
        try {
            if ('undefined' == typeof tinyMCE)
                return;
            var a = [/byui\.css$/, /online\.css$/, /common[\w-]*\.css$/, /variables[\w-]*\.css$/, /campus\.css$/, /pathway\.css$/]
                , b = [].concat(_toConsumableArray(document.querySelectorAll('link[rel=stylesheet]'))).reduce(function (b, c) {
                    var d = c.getAttribute('href');
                    return a.some(function (a) {
                        return null !== d.match(a)
                    }) && b.push(d),
                        b
                }, []);
            tinyMCE.editors.forEach(function (a) {
                b.forEach(function (b) {
                    a.dom.styleSheetLoader.load(b)
                })
            })
        } catch (a) {
            console.error(a)
        }
    }),
        document.addEventListener('DOMContentLoaded', function () {
            var c = document.location.pathname.split('/')[2];
            (function () {
                try {
                    document.querySelector('.byui div.accordion') && a(function (a) {
                        if (a)
                            throw a;
                        b(function () {
                            $('.byui div.accordion').accordion({
                                autoHeight: false,
                                heightStyle: 'content',
                                collapsible: !0,
                                active: !1
                            })
                        })
                    })
                } catch (a) {
                    console.error(a)
                }
            }
            )(),
                function () {
                    try {
                        document.querySelector('.byui div.dialog') && a(function (a) {
                            if (a)
                                throw a;
                            document.querySelectorAll('.byui .Button[id^=\'link_\']').forEach(function (a) {
                                var b = /link_(\d+)/i.exec(a.id)[1]
                                    , c = $('.byui #dialog_for_link_' + b);
                                c.dialog({
                                    autoOpen: !1
                                }),
                                    a.addEventListener('click', function (a) {
                                        a.preventDefault(),
                                            c.dialog('open')
                                    })
                            })
                        })
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    try {
                        a(function (a) {
                            if (a)
                                throw a;
                            $('.byui #styleguide-tabs-demo-minimal').tabs()
                        })
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    try {
                        for (var a = document.querySelectorAll('.byui-video'), b = 0; b < a.length; b++)
                            'youtube' == a[b].dataset.source ? a[b].innerHTML = '<iframe width="' + a[b].dataset.width + 'px" height="' + a[b].dataset.height + 'px" src="https://www.youtube.com/embed/' + a[b].dataset.vidid + '" frameborder="0" allowfullscreen></iframe>' : 'kaltura' == a[b].dataset.source && (a[b].innerHTML = '<iframe width="' + a[b].dataset.width + 'px" height="' + a[b].dataset.height + 'px" src="https://cdnapisec.kaltura.com/p/1157612/sp/115761200/embedIframeJs/uiconf_id/29018071/partner_id/1157612?iframeembed=true&amp;playerId=kaltura_player_1485805514&amp;entry_id=' + a[b].dataset.vidid + '&amp;flashvars[streamerType]=auto" frameborder="0" allowfullscreen></iframe>')
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    function b(a) {
                        try {
                            var b = a.find(function (a) {
                                return /student\s*resources/i.test(a.name)
                            })
                                , d = document.querySelector('.byui #start')
                                , e = document.querySelector('.byui #tutorial')
                                , f = document.querySelector('.byui #resources')
                                , g = document.querySelector('.byui #instructor');
                            d && (d.href = '/courses/' + c + '/modules#module_' + a[0].id),
                                e && (e.href = 'http://byu-idaho.screenstepslive.com/s/16998/m/76692/l/865828-canvas-student-orientation'),
                                f && b && (f.href = '/courses/' + c + '/modules#module_' + b.id),
                                $.get('https://byui.instructure.com/api/v1/courses/' + c + '/enrollments?type%5B%5D=TeacherEnrollment&per_page=50', function (a) {
                                    a = a.filter(function (a, b, c) {
                                        return c.findIndex(function (b) {
                                            return b.user_id == a.user_id
                                        }) == b
                                    }),
                                        1 < a.length ? console.log('Multiple teachers are enrolled in this course. Please add "Your Instructor" link manually.') : 0 === a.length ? console.log('Unable to find teacher enrollment.') : g.href = '/courses/' + c + '/users/' + a[0].user_id
                                })
                        } catch (a) {
                            console.error(a)
                        }
                    }
                    function d(a) {
                        try {
                            function f(a, d) {
                                d++ ,
                                    10 > d && (d = '0' + d),
                                    document.querySelector(b).insertAdjacentHTML('beforeend', '<a href=\'/courses/' + c + '/modules#module_' + a + '\' style=\'width: calc(100% / ' + e + ' - 20px);\'>' + d + '</a>')
                            }
                            var b = '.byui #navigation .lessons';
                            if ([].concat(_toConsumableArray(document.querySelector('.byui #navigation .lessons').classList)).includes('generate')) {
                                document.querySelector('.byui #navigation .lessons').innerHTML = '';
                                var d = a.filter(function (a) {
                                    return /(Week|Lesson|Unit)\s*(1[0-9]|0?\d(\D|$))/gi.test(a.name)
                                })
                                    , e = 7 < d.length ? 7 : d.length;
                                d.forEach(function (a, b) {
                                    f(a.id, b)
                                })
                            }
                        } catch (a) {
                            console.error(a)
                        }
                    }
                    try {
                        var e = 0 < document.querySelectorAll('.byui #navigation .steps').length
                            , f = 0 < document.querySelectorAll('.byui #navigation .lessons').length;
                        if (!e && !f)
                            return;
                        a(function (a) {
                            if (a)
                                throw a;
                            $.get('/api/v1/courses/' + c + '/modules?per_page=30', function (a) {
                                e && b(a),
                                    f && d(a)
                            })
                        })
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    try {
                        4 === document.querySelectorAll('#breadcrumbs li').length && /\.com\/courses\/\d+\/(?!groups)/i.test(window.location.href) && (document.querySelectorAll('#breadcrumbs li:nth-child(3) span')[0].innerHTML = 'Modules',
                            document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href = document.querySelectorAll('#breadcrumbs li:nth-child(3) a')[0].href.replace(/\/\w+$/i, '/modules'))
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    try {
                        var a = document.querySelector('pre code');
                        if (null == a)
                            return;
                        var b = document.createElement('script')
                            , c = document.createElement('link');
                        b.src = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.js',
                            c.href = 'https://content.byui.edu/integ/gen/a40c34d7-9f6f-4a18-a41d-2f40e2b2a18e/0/codeHighlighter.css',
                            c.rel = 'stylesheet',
                            document.head.appendChild(b),
                            document.head.appendChild(c)
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    try {
                        var a = document.getElementById('content');
                        if (a)
                            document.querySelector('p.copyright') || document.querySelector('p#byui-copyright') || a.insertAdjacentHTML('beforeend', '<p id=\'byui-copyright\'>Copyright ' + new Date().getFullYear() + ' Brigham Young University-Idaho</p>');
                        else
                            throw new Error('unable to add copyright footer to page')
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    try {
                        var a = 'black';
                        if (window.location.href.includes('settings'))
                            document.head.insertAdjacentHTML('beforeend', '<div id="byui-quizzes-next-tooltip" style="display: none;">Please review <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">these FAQs</a> to see the benefits and cautions before using Quizzes.Next</div>'),
                                a = 'red';
                        else if (window.location.href.includes('assignments'))
                            document.head.insertAdjacentHTML('beforeend', '<div id="byui-quizzes-next-tooltip" style="display: none;">Be sure to periodically review the <a href="http://byu-idaho.screenstepslive.com/s/14177/m/73336/l/970385-quizzes-next-faq-s" target="_blank">Quizzes.Next FAQs</a> to keep updated on new features</div>');
                        else
                            return;
                        var b = '<style>.tippy-tooltip.byui-theme {border: 2px solid ' + a + ';background-color: white;color: black;max-width: 200px;}.tippy-backdrop {background: white;}</style>';
                        document.head.insertAdjacentHTML('beforeend', b);
                        var c = document.createElement('script');
                        c.type = 'text/javascript',
                            c.async = !0,
                            c.src = 'https://content.byui.edu/integ/gen/a422cccd-35b7-4087-9329-20698cf169b0/0/tippy.all.min.js',
                            c.onload = function () {
                                tippy('.quizzes_next, .new_quiz_lti_wrapper', {
                                    html: '#byui-quizzes-next-tooltip',
                                    interactive: !0,
                                    placement: 'bottom-end',
                                    theme: 'byui',
                                    size: 'large'
                                })
                            }
                            ,
                            document.head.appendChild(c)
                    } catch (a) {
                        console.error(a)
                    }
                }(),
                function () {
                    try {
                        if (0 === document.querySelectorAll('.byui .carousel').length)
                            return;
                        var b = document.createElement('script');
                        b.src = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js',
                            b.onload = function () {
                                a(function (a) {
                                    if (a)
                                        throw a;
                                    $('.byui .carousel').slick({
                                        dots: !0
                                    })
                                })
                            }
                            ,
                            document.head.appendChild(b);
                        var c = document.createElement('link');
                        c.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css',
                            c.rel = 'stylesheet',
                            document.head.appendChild(c);
                        var d = document.createElement('link');
                        d.href = 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.css',
                            d.rel = 'stylesheet',
                            document.head.appendChild(d)
                    } catch (a) {
                        console.error(a)
                    }
                }()
        })
}
)();
//# sourceMappingURL=byui.js.map
