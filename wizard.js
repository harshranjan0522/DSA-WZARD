/* ============================================================
   DSA WIZARD — Shared runtime
   Injects the page shell (background, nav, palette, footer, FABs),
   drives every animation, and renders the data-driven widgets.
   No build step, no CDN, works from file:// as well as a server.
   ============================================================ */
(function () {
    'use strict';

    var D = window.DSA || {};
    var TOPICS = D.topics || [];
    var LS_LANG = 'dsa:lang';
    var LS_PROGRESS = 'dsa:progress';
    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- tiny helpers ---------- */
    function el(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html != null) n.innerHTML = html;
        return n;
    }
    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function store(key, fallback) {
        try { var v = localStorage.getItem(key); return v == null ? fallback : v; }
        catch (e) { return fallback; }
    }
    function save(key, val) { try { localStorage.setItem(key, val); } catch (e) { } }

    var CURRENT = document.body.getAttribute('data-topic') || '';
    var topic = CURRENT ? (D.topicById ? D.topicById(CURRENT) : null) : null;

    /* ========================================================
       1. BACKGROUND — aurora + 3D grid + drifting node network
       ======================================================== */
    function buildBackground() {
        ['bg-aurora', 'bg-grid', 'bg-scan', 'bg-vignette'].forEach(function (c) {
            document.body.appendChild(el('div', 'bg-layer ' + c));
        });

        if (reduceMotion) return;

        var canvas = el('canvas');
        canvas.id = 'bg-canvas';
        document.body.appendChild(canvas);
        var ctx = canvas.getContext('2d');
        var nodes = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
        var mouse = { x: -999, y: -999 };

        function resize() {
            w = canvas.width = Math.floor(window.innerWidth * dpr);
            h = canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            var target = Math.min(58, Math.max(18, Math.floor(window.innerWidth / 26)));
            nodes = [];
            for (var i = 0; i < target; i++) {
                nodes.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.22 * dpr,
                    vy: (Math.random() - 0.5) * 0.22 * dpr,
                    r: (Math.random() * 1.5 + 0.9) * dpr
                });
            }
        }

        var running = true;
        function frame() {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);
            var link = 132 * dpr;

            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > w) n.vx *= -1;
                if (n.y < 0 || n.y > h) n.vy *= -1;

                for (var j = i + 1; j < nodes.length; j++) {
                    var m = nodes[j], dx = n.x - m.x, dy = n.y - m.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < link) {
                        ctx.strokeStyle = 'rgba(0,255,136,' + (0.16 * (1 - dist / link)).toFixed(3) + ')';
                        ctx.lineWidth = 0.6 * dpr;
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
                    }
                }

                var mdx = n.x - mouse.x, mdy = n.y - mouse.y;
                var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                var near = mdist < 170 * dpr;
                ctx.fillStyle = near ? 'rgba(0,255,136,.95)' : 'rgba(0,255,136,.45)';
                ctx.beginPath();
                ctx.arc(n.x, n.y, near ? n.r * 1.7 : n.r, 0, Math.PI * 2);
                ctx.fill();
                if (near) {
                    ctx.strokeStyle = 'rgba(0,255,136,' + (0.35 * (1 - mdist / (170 * dpr))).toFixed(3) + ')';
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
            }
            requestAnimationFrame(frame);
        }

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', function (e) {
            mouse.x = e.clientX * dpr; mouse.y = e.clientY * dpr;
        });
        window.addEventListener('mouseout', function () { mouse.x = mouse.y = -999; });
        document.addEventListener('visibilitychange', function () {
            running = !document.hidden;
            if (running) frame();
        });
        resize();
        frame();
    }

    /* ========================================================
       2. NAVBAR
       ======================================================== */
    function buildNav() {
        document.body.appendChild(el('div')).id = 'scroll-progress';

        var isHome = !CURRENT;
        var custom = document.body.getAttribute('data-sections');
        var sectionLinks = custom
            ? custom.split(',').map(function (s) { return s.split('|'); })
            : (isHome
                ? [['#structures', 'Structures'], ['#roadmap', 'Roadmap'], ['#why', 'Why DSA'], ['#tips', 'Tips']]
                : [['#concept', 'Concept'], ['#playground', 'Playground'], ['#operations', 'Ops'],
                   ['#code', 'Code'], ['#complexity', 'Big-O'], ['#practice', 'Practice']]);

        var nav = el('header', 'site-nav');
        var inner = el('div', 'nav-inner');

        var brand = el('a', 'brand');
        brand.href = 'index.html';
        brand.innerHTML =
            '<span class="mark"><span class="mark-in">' +
            '<i class="mf front">{ }</i><i class="mf back">&lt;/&gt;</i>' +
            '</span></span>' +
            '<span class="brand-text">DSA WIZARD<small>' +
            (topic ? esc(topic.name) : 'learn dsa real quick') + '</small></span>';
        inner.appendChild(brand);

        var ul = el('ul', 'nav-links');
        ul.id = 'nav-links';
        if (!isHome) ul.appendChild(el('li', '', '<a href="index.html">Home</a>'));
        sectionLinks.forEach(function (l) {
            ul.appendChild(el('li', '', '<a href="' + l[0] + '">' + l[1] + '</a>'));
        });

        var drop = el('li', 'nav-drop');
        var panel = TOPICS.map(function (t) {
            return '<a href="' + t.file + '"' + (t.id === CURRENT ? ' class="active"' : '') +
                '><i>' + t.icon + '</i>' + esc(t.name) + '</a>';
        }).join('');
        drop.innerHTML = '<a href="#structures" class="drop-toggle">Topics ▾</a>' +
            '<div class="nav-drop-panel">' + panel + '</div>';
        ul.appendChild(drop);

        if (!/cheatsheet\.html$/.test(window.location.pathname)) {
            ul.appendChild(el('li', '', '<a href="cheatsheet.html">Sheets</a>'));
        }
        inner.appendChild(ul);

        var cmd = el('button', 'cmd-trigger');
        cmd.type = 'button';
        cmd.setAttribute('aria-label', 'Open the command palette');
        cmd.innerHTML = '<span>⌕ Jump to…</span><kbd>' +
            (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl') + ' K</kbd>';
        cmd.addEventListener('click', function () { openPalette(); });
        inner.appendChild(cmd);

        var burger = el('button', 'nav-burger', '<span></span><span></span><span></span>');
        burger.type = 'button';
        burger.setAttribute('aria-label', 'Toggle navigation');
        burger.addEventListener('click', function () {
            burger.classList.toggle('open');
            ul.classList.toggle('open');
        });
        inner.appendChild(burger);

        nav.appendChild(inner);
        document.body.insertBefore(nav, document.body.firstChild);

        /* mobile: tap "Topics" to expand instead of hover */
        $('.drop-toggle', drop).addEventListener('click', function (e) {
            if (window.innerWidth <= 860) { e.preventDefault(); drop.classList.toggle('open'); }
        });

        /* close the mobile sheet after picking a link */
        $$('a', ul).forEach(function (a) {
            a.addEventListener('click', function () {
                if (a.classList.contains('drop-toggle')) return;
                ul.classList.remove('open');
                burger.classList.remove('open');
            });
        });

        /* scroll progress + sticky styling + section spy */
        var bar = $('#scroll-progress');
        var spyTargets = sectionLinks.map(function (l) { return l[0].slice(1); });

        function onScroll() {
            var top = window.pageYOffset || document.documentElement.scrollTop;
            var max = document.documentElement.scrollHeight - window.innerHeight;
            bar.style.width = (max > 0 ? (top / max) * 100 : 0) + '%';
            nav.classList.toggle('scrolled', top > 24);

            var active = '';
            spyTargets.forEach(function (id) {
                var s = document.getElementById(id);
                if (s && s.getBoundingClientRect().top <= 140) active = id;
            });
            $$('a', ul).forEach(function (a) {
                var href = a.getAttribute('href') || '';
                a.classList.toggle('active', active !== '' && href === '#' + active);
            });

            var fab = $('#fab-top');
            if (fab) fab.classList.toggle('show', top > 420);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ========================================================
       3. COMMAND PALETTE
       ======================================================== */
    var paletteItems = [];
    function buildPalette() {
        paletteItems = TOPICS.map(function (t) {
            return { icon: t.icon, label: t.name, meta: t.tag, href: t.file };
        }).concat([
            { icon: '⌂', label: 'Home', meta: 'All structures', href: 'index.html' },
            { icon: '⎘', label: 'Cheat Sheets', meta: 'Printable syntax reference', href: 'cheatsheet.html' }
        ]);

        if (CURRENT) {
            [['#concept', 'Concept'], ['#playground', 'Interactive playground'],
             ['#operations', 'Operations'], ['#code', 'Code in 4 languages'],
             ['#complexity', 'Complexity chart'], ['#practice', 'Practice questions'],
             ['#pitfalls', 'Common pitfalls']].forEach(function (s) {
                paletteItems.push({ icon: '§', label: s[1], meta: 'On this page', href: s[0] });
            });
        }

        var wrap = el('div', 'cmdk');
        wrap.id = 'cmdk';
        wrap.innerHTML =
            '<div class="cmdk-box">' +
            '<input id="cmdk-input" type="text" placeholder="Search structures, sections, cheat sheets…" autocomplete="off" spellcheck="false">' +
            '<div class="cmdk-list" id="cmdk-list"></div>' +
            '<div class="cmdk-foot"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>' +
            '</div>';
        document.body.appendChild(wrap);

        var input = $('#cmdk-input'), list = $('#cmdk-list'), sel = 0, shown = [];

        function render(q) {
            q = (q || '').toLowerCase().trim();
            shown = paletteItems.filter(function (it) {
                return !q || (it.label + ' ' + it.meta).toLowerCase().indexOf(q) > -1;
            });
            sel = 0;
            if (!shown.length) {
                list.innerHTML = '<div class="cmdk-empty">No match for “' + esc(q) + '”</div>';
                return;
            }
            list.innerHTML = shown.map(function (it, i) {
                return '<div class="cmdk-item' + (i === 0 ? ' sel' : '') + '" data-i="' + i + '">' +
                    '<i>' + it.icon + '</i><span>' + esc(it.label) + '</span>' +
                    '<small>' + esc(it.meta) + '</small></div>';
            }).join('');
            $$('.cmdk-item', list).forEach(function (node) {
                node.addEventListener('click', function () { go(shown[+node.dataset.i]); });
            });
        }

        function move(delta) {
            if (!shown.length) return;
            sel = (sel + delta + shown.length) % shown.length;
            $$('.cmdk-item', list).forEach(function (n, i) { n.classList.toggle('sel', i === sel); });
            var active = $('.cmdk-item.sel', list);
            if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' });
        }

        function go(item) {
            if (!item) return;
            closePalette();
            if (item.href.charAt(0) === '#') {
                var target = document.querySelector(item.href);
                if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            } else {
                window.location.href = item.href;
            }
        }

        input.addEventListener('input', function () { render(input.value); });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Enter') { e.preventDefault(); go(shown[sel]); }
            else if (e.key === 'Escape') closePalette();
        });
        wrap.addEventListener('click', function (e) { if (e.target === wrap) closePalette(); });

        window.__cmdkRender = render;
    }

    function openPalette() {
        var w = $('#cmdk');
        if (!w) return;
        w.classList.add('open');
        if (window.__cmdkRender) window.__cmdkRender('');
        var i = $('#cmdk-input');
        i.value = '';
        setTimeout(function () { i.focus(); }, 30);
    }
    function closePalette() {
        var w = $('#cmdk');
        if (w) w.classList.remove('open');
    }

    /* ========================================================
       4. FOOTER + FLOATING BUTTONS + TOAST + LIGHTBOX
       ======================================================== */
    function buildFooter() {
        var half = Math.ceil(TOPICS.length / 2);
        function links(list) {
            return list.map(function (t) {
                return '<li><a href="' + t.file + '">' + t.icon + '  ' + esc(t.name) + '</a></li>';
            }).join('');
        }

        var f = el('footer', 'site-footer');
        f.innerHTML =
            '<div class="footer-grid">' +
            '<div><h5>DSA Wizard</h5><p>One stop for every data structure — concept, interactive playground, ' +
            'code in four languages, complexity charts and curated practice. Built for people who learn by doing.</p>' +
            '<p style="margin-top:1rem" class="mono" style="font-size:.8rem">Press <kbd>Ctrl</kbd>+<kbd>K</kbd> anywhere to jump.</p></div>' +
            '<div><h5>Core Structures</h5><ul>' + links(TOPICS.slice(0, half)) + '</ul></div>' +
            '<div><h5>Deep Dive</h5><ul>' + links(TOPICS.slice(half)) +
            '<li><a href="cheatsheet.html">⎘  Cheat Sheets</a></li></ul></div>' +
            '</div>' +
            '<div class="footer-bottom">Fuel your coding journey with the power of <b>DSA</b> · ' +
            'Queries &amp; suggestions — <a href="mailto:harshranjan1111@gmail.com">harshranjan1111@gmail.com</a></div>';
        document.body.appendChild(f);

        var stack = el('div', 'fab-stack');
        var top = el('button', 'fab', '↑');
        top.id = 'fab-top';
        top.type = 'button';
        top.title = 'Back to top';
        top.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
        stack.appendChild(top);
        document.body.appendChild(stack);

        var t = el('div', 'toast');
        t.id = 'toast';
        document.body.appendChild(t);

        var lb = el('div', 'lightbox', '<img alt="">');
        lb.id = 'lightbox';
        lb.addEventListener('click', function () { lb.classList.remove('open'); });
        document.body.appendChild(lb);
    }

    var toastTimer;
    function toast(msg) {
        var t = $('#toast');
        if (!t) return;
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2000);
    }
    window.dsaToast = toast;

    function wireLightbox() {
        $$('.figure img').forEach(function (img) {
            img.addEventListener('click', function () {
                var lb = $('#lightbox');
                $('img', lb).src = img.src;
                $('img', lb).alt = img.alt || '';
                lb.classList.add('open');
            });
        });
    }

    /* ========================================================
       5. SCROLL REVEAL + 3D TILT
       ======================================================== */
    function wireReveal() {
        var items = $$('[data-reveal]');
        if (!items.length) return;
        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(function (n) { n.classList.add('in'); });
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (!e.isIntersecting) return;
                var delay = +(e.target.getAttribute('data-delay') || 0);
                setTimeout(function () { e.target.classList.add('in'); }, delay);
                io.unobserve(e.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
        items.forEach(function (n) { io.observe(n); });
    }

    function wireTilt() {
        if (reduceMotion) return;
        $$('.tilt').forEach(function (card) {
            if (!$('.glare', card)) card.appendChild(el('div', 'glare'));
            var max = +(card.getAttribute('data-tilt') || 9);

            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width;
                var py = (e.clientY - r.top) / r.height;
                card.style.transform = 'perspective(900px) rotateY(' +
                    ((px - 0.5) * max * 2).toFixed(2) + 'deg) rotateX(' +
                    ((0.5 - py) * max * 2).toFixed(2) + 'deg) translateZ(6px)';
                card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
            });
            card.addEventListener('mouseleave', function () {
                card.style.transition = 'transform .5s cubic-bezier(.2,.9,.3,1)';
                card.style.transform = '';
                setTimeout(function () { card.style.transition = ''; }, 500);
            });
        });
    }

    /* ========================================================
       6. SYNTAX HIGHLIGHTER (self-contained, 4 languages)
       ======================================================== */
    var KEYWORDS = {
        cpp: 'alignas auto bool break case catch char class const constexpr continue default delete do double else enum explicit export extern false float for friend goto if inline int long mutable namespace new noexcept nullptr operator private protected public register return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while',
        java: 'abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient true false null try void volatile while var record yield',
        python: 'and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield match case self',
        javascript: 'async await break case catch class const continue debugger default delete do else export extends false finally for function get if import in instanceof let new null of return set static super switch this throw true try typeof undefined var void while yield NaN Infinity'
    };
    var TYPES = {
        cpp: 'vector string map unordered_map set unordered_set queue stack deque pair priority_queue list size_t cout cin endl npos greater swap sort reverse max min abs',
        java: 'String Integer Character Boolean Double List ArrayList LinkedList Map HashMap TreeMap Set HashSet Queue Deque ArrayDeque PriorityQueue Arrays Collections Math System StringBuilder Comparator Object Entry IllegalStateException Exception',
        python: 'int str float list dict set tuple bool len range enumerate print sorted sum max min abs map filter zip deque defaultdict Counter heapq ord chr any all next isinstance',
        javascript: 'Array Object Map Set String Number Boolean Math JSON Promise console Infinity Symbol WeakMap Error'
    };
    function setOf(str) {
        var o = {};
        str.split(/\s+/).forEach(function (w) { if (w) o[w] = 1; });
        return o;
    }
    var KW = {}, TY = {};
    Object.keys(KEYWORDS).forEach(function (k) { KW[k] = setOf(KEYWORDS[k]); TY[k] = setOf(TYPES[k]); });

    function highlight(code, lang) {
        var kw = KW[lang] || {}, ty = TY[lang] || {};
        var isPy = lang === 'python';
        var patterns = [
            isPy ? '"""[\\s\\S]*?"""' : '/\\*[\\s\\S]*?\\*/',
            isPy ? "'''[\\s\\S]*?'''" : '//[^\\n]*',
            isPy ? '#[^\\n]*' : '^[ \\t]*#[A-Za-z_]+',
            '"(?:\\\\.|[^"\\\\\\n])*"',
            "'(?:\\\\.|[^'\\\\\\n])*'",
            '`(?:\\\\.|[^`\\\\])*`',
            '\\b\\d+(?:\\.\\d+)?\\b',
            '[A-Za-z_$][\\w$]*'
        ];
        var re = new RegExp(patterns.join('|'), 'gm');
        var out = '', last = 0, m;

        while ((m = re.exec(code)) !== null) {
            var tok = m[0];
            out += esc(code.slice(last, m.index));
            last = m.index + tok.length;
            var cls = '';

            if (tok.indexOf('//') === 0 || tok.indexOf('/*') === 0 ||
                (isPy && tok.charAt(0) === '#')) cls = 'tk-com';
            else if (isPy && (tok.indexOf('"""') === 0 || tok.indexOf("'''") === 0)) cls = 'tk-com';
            else if (!isPy && /^[ \t]*#[A-Za-z_]/.test(tok)) cls = 'tk-pre';
            else if (/^["'`]/.test(tok)) cls = 'tk-str';
            else if (/^\d/.test(tok)) cls = 'tk-num';
            else if (kw[tok]) cls = 'tk-key';
            else if (ty[tok]) cls = 'tk-typ';
            else if (code.charAt(last) === '(') cls = 'tk-fn';

            out += cls ? '<span class="' + cls + '">' + esc(tok) + '</span>' : esc(tok);
        }
        out += esc(code.slice(last));
        return out;
    }

    /* ========================================================
       7. TERMINAL WIDGET
       ======================================================== */
    var LANGS = [['cpp', 'C++'], ['java', 'Java'], ['python', 'Python'], ['javascript', 'JavaScript']];

    function buildTerminal(host, topicId) {
        var bundle = (D.code || {})[topicId];
        if (!bundle) return;
        var ops = bundle.ops;
        var lang = store(LS_LANG, 'cpp');
        if (!KW[lang]) lang = 'cpp';
        var opIndex = 0;

        host.className = 'terminal';
        host.innerHTML =
            '<div class="terminal-bar">' +
            '<span class="dots"><i></i><i></i><i></i></span>' +
            '<span class="term-title" data-file></span>' +
            '<select class="term-select" data-op aria-label="Choose an operation">' +
            ops.map(function (o, i) { return '<option value="' + i + '">' + esc(o.name) + '</option>'; }).join('') +
            '</select>' +
            '<span class="lang-tabs">' +
            LANGS.map(function (l) {
                return '<button type="button" class="lang-tab' + (l[0] === lang ? ' active' : '') +
                    '" data-lang="' + l[0] + '">' + l[1] + '</button>';
            }).join('') +
            '</span>' +
            '<button type="button" class="copy-btn" data-copy>⧉ Copy</button>' +
            '</div>' +
            '<div class="term-body"><div class="gutter" data-gutter></div><pre class="code" data-code></pre></div>';

        var pre = $('[data-code]', host), gutter = $('[data-gutter]', host),
            fileLabel = $('[data-file]', host), select = $('[data-op]', host);

        var EXT = { cpp: 'cpp', java: 'java', python: 'py', javascript: 'js' };

        function render() {
            var op = ops[opIndex];
            var src = op[lang] || '// snippet coming soon';
            pre.innerHTML = highlight(src, lang);
            var lines = src.split('\n').length;
            var nums = [];
            for (var i = 1; i <= lines; i++) nums.push(i);
            gutter.textContent = nums.join('\n');
            fileLabel.textContent = topicId.replace(/([a-z])([A-Z])/g, '$1_$2') +
                '_' + op.id + '.' + EXT[lang] + (op.big ? '   ·   ' + op.big : '');
            pre.style.animation = 'none';
            void pre.offsetWidth;
            pre.style.animation = '';
        }

        $$('.lang-tab', host).forEach(function (btn) {
            btn.addEventListener('click', function () {
                lang = btn.getAttribute('data-lang');
                save(LS_LANG, lang);
                $$('.lang-tab', host).forEach(function (b) {
                    b.classList.toggle('active', b === btn);
                });
                render();
            });
        });

        select.addEventListener('change', function () {
            opIndex = +select.value;
            render();
        });

        $('[data-copy]', host).addEventListener('click', function () {
            var btn = this;
            var text = ops[opIndex][lang] || '';
            function done() {
                btn.classList.add('done');
                btn.textContent = '✓ Copied';
                toast('Copied ' + ops[opIndex].name + ' (' + lang + ')');
                setTimeout(function () { btn.classList.remove('done'); btn.textContent = '⧉ Copy'; }, 1800);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done, fallback);
            } else fallback();

            function fallback() {
                var ta = el('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed — select manually'); }
                document.body.removeChild(ta);
            }
        });

        render();
    }

    /* ========================================================
       8. DATA-DRIVEN WIDGETS
       ======================================================== */
    function bigoClass(v) {
        var s = String(v);
        if (/O\(1\)/.test(s)) return 'good';
        if (/log n\)/.test(s) && !/n log n/.test(s)) return 'ok';
        if (/n log n/.test(s)) return 'mid';
        if (/O\(n\^?2\)|O\(n²\)|O\(V\^?2\)|O\(V²\)|O\(n·m\)|O\(V\^?3\)|O\(V³\)/.test(s)) return 'worst';
        if (/O\(n\)|O\(V\+E\)|O\(h\)|O\(k\)|O\(m\)|O\(deg/.test(s)) return 'bad';
        return '';
    }
    function bigoCell(v) {
        var s = String(v);
        if (!/^O\(|^—$|^N\/A/.test(s)) return esc(s);
        if (s === '—') return '<span class="mono" style="color:var(--muted-2)">—</span>';
        return '<span class="bigo ' + bigoClass(s) + '">' + esc(s) + '</span>';
    }

    function widgetComplexity(host, id) {
        var c = (D.complexity || {})[id];
        if (!c) return;
        host.innerHTML =
            '<div class="table-wrap"><table class="dsa"><thead><tr>' +
            c.cols.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') +
            '</tr></thead><tbody>' +
            c.rows.map(function (r) {
                return '<tr>' + r.map(function (cell, i) {
                    return '<td>' + (i === 0 ? esc(cell) : bigoCell(cell)) + '</td>';
                }).join('') + '</tr>';
            }).join('') +
            '</tbody></table></div>' +
            '<p class="cx-note"><b>Note —</b> ' + esc(c.note) + '</p>' +
            '<div class="legend">' +
            [['good', 'O(1) constant'], ['ok', 'O(log n) logarithmic'], ['bad', 'O(n) linear'],
             ['mid', 'O(n log n)'], ['worst', 'O(n²) quadratic']].map(function (l) {
                return '<span class="bigo ' + l[0] + '">' + l[1] + '</span>';
            }).join('') + '</div>';
    }

    function widgetFeatures(host, id) {
        var f = (D.features || {})[id];
        if (!f) return;
        host.className = 'feature-grid';
        host.innerHTML = f.map(function (x, i) {
            return '<div class="feature-card tilt" data-reveal="zoom" data-delay="' + (i * 45) + '" data-tilt="7">' +
                '<span class="f-icon">' + x[0] + '</span>' +
                '<h4>' + esc(x[1]) + '</h4><p>' + esc(x[2]) + '</p></div>';
        }).join('');
    }

    function widgetTypes(host, id) {
        var t = (D.types || {})[id];
        if (!t) return;
        host.className = 'type-grid';
        host.innerHTML = t.map(function (x, i) {
            return '<div class="type-card" data-reveal="flip" data-delay="' + (i * 55) + '">' +
                '<span class="type-num">' + String(i + 1).padStart(2, '0') + '</span>' +
                '<h4>' + esc(x[0]) + '</h4><p>' + esc(x[1]) + '</p>' +
                (x[2] ? '<code class="type-code">' + esc(x[2]) + '</code>' : '') +
                '</div>';
        }).join('');
    }

    function widgetQuestions(host, id) {
        var q = (D.questions || {})[id];
        if (!q) return;
        host.className = 'q-grid';
        host.innerHTML = q.map(function (x, i) {
            return '<a class="q-card" href="' + x.url + '" target="_blank" rel="noopener noreferrer" ' +
                'data-reveal="zoom" data-delay="' + (i * 40) + '">' +
                '<span class="q-lvl ' + x.lvl + '">' + x.lvl + '</span>' +
                '<h4>' + esc(x.n) + '</h4>' +
                '<p><b>Hint:</b> ' + esc(x.hint) + '</p>' +
                '<span class="q-go">Solve it ↗</span></a>';
        }).join('');
    }

    function widgetPitfalls(host, id) {
        var p = (D.pitfalls || {})[id];
        if (!p) return;
        host.className = 'pit-list';
        host.innerHTML = p.map(function (x, i) {
            return '<details class="pit"' + (i === 0 ? ' open' : '') + ' data-reveal="left" data-delay="' + (i * 50) + '">' +
                '<summary><span class="pit-x">⚠</span>' + esc(x[0]) + '</summary>' +
                '<p>' + esc(x[1]) + '</p></details>';
        }).join('');
    }

    function widgetCheatsheet(host, id) {
        var cs = (D.cheatsheet || {})[id];
        if (!cs) return;
        host.className = 'cheat-grid';
        host.innerHTML = cs.map(function (block, i) {
            return '<div class="cheat-card" data-reveal="zoom" data-delay="' + (i * 40) + '">' +
                '<h4>' + esc(block.h) + '</h4>' +
                block.rows.map(function (r) {
                    return '<div class="cheat-row"><span class="ck">' + esc(r[0]) + '</span>' +
                        '<code>' + esc(r[1]) + '</code></div>';
                }).join('') + '</div>';
        }).join('');
    }

    function widgetStats(host, id) {
        var t = D.topicById ? D.topicById(id) : null;
        if (!t) return;
        host.className = 'stat-row';
        host.innerHTML = Object.keys(t.stats).map(function (k) {
            var v = t.stats[k];
            return '<div class="stat"><small>' + esc(k) + '</small>' +
                '<span class="bigo ' + bigoClass(v) + '">' + esc(v) + '</span></div>';
        }).join('');
    }

    function widgetPager(host, id) {
        var i = -1;
        TOPICS.forEach(function (t, k) { if (t.id === id) i = k; });
        if (i < 0) return;
        var prev = TOPICS[(i - 1 + TOPICS.length) % TOPICS.length];
        var next = TOPICS[(i + 1) % TOPICS.length];
        var learned = store(LS_PROGRESS, '').split(',').indexOf(id) > -1;

        host.className = 'pager';
        host.innerHTML =
            '<a class="pager-side" href="' + prev.file + '"><small>◂ Previous</small><b>' + prev.icon + ' ' + esc(prev.name) + '</b></a>' +
            '<button type="button" class="mark-btn' + (learned ? ' done' : '') + '" data-mark>' +
            (learned ? '✓ Mastered' : 'Mark as mastered') + '</button>' +
            '<a class="pager-side right" href="' + next.file + '"><small>Next ▸</small><b>' + esc(next.name) + ' ' + next.icon + '</b></a>';

        $('[data-mark]', host).addEventListener('click', function () {
            var btn = this;
            var list = store(LS_PROGRESS, '').split(',').filter(Boolean);
            var at = list.indexOf(id);
            if (at > -1) { list.splice(at, 1); btn.classList.remove('done'); btn.textContent = 'Mark as mastered'; toast(topic.name + ' unmarked'); }
            else { list.push(id); btn.classList.add('done'); btn.textContent = '✓ Mastered'; toast(topic.name + ' marked as mastered 🎉'); }
            save(LS_PROGRESS, list.join(','));
        });
    }

    var WIDGETS = {
        terminal: buildTerminal,
        complexity: widgetComplexity,
        features: widgetFeatures,
        types: widgetTypes,
        questions: widgetQuestions,
        pitfalls: widgetPitfalls,
        cheatsheet: widgetCheatsheet,
        stats: widgetStats,
        pager: widgetPager
    };

    function mountWidgets() {
        $$('[data-widget]').forEach(function (host) {
            var kind = host.getAttribute('data-widget');
            var id = host.getAttribute('data-for') || CURRENT;
            if (WIDGETS[kind] && id) WIDGETS[kind](host, id);
        });
    }

    /* ========================================================
       9. GLOBAL KEYBOARD SHORTCUTS
       ======================================================== */
    function wireKeys() {
        document.addEventListener('keydown', function (e) {
            var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ''));

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                var open = $('#cmdk') && $('#cmdk').classList.contains('open');
                open ? closePalette() : openPalette();
                return;
            }
            if (e.key === 'Escape') { closePalette(); var lb = $('#lightbox'); if (lb) lb.classList.remove('open'); return; }
            if (typing) return;
            if (e.key === '/') { e.preventDefault(); openPalette(); return; }

            /* [ and ] page between topics */
            if (CURRENT && (e.key === '[' || e.key === ']')) {
                var i = -1;
                TOPICS.forEach(function (t, k) { if (t.id === CURRENT) i = k; });
                if (i < 0) return;
                var to = e.key === ']' ? TOPICS[(i + 1) % TOPICS.length]
                                       : TOPICS[(i - 1 + TOPICS.length) % TOPICS.length];
                window.location.href = to.file;
            }
        });
    }

    /* ========================================================
       10. TYPEWRITER (hero flourish)
       ======================================================== */
    function wireTypewriter() {
        $$('[data-type]').forEach(function (node) {
            var words = (node.getAttribute('data-type') || '').split('|').filter(Boolean);
            if (!words.length) return;
            if (reduceMotion) { node.textContent = words[0]; return; }

            var w = 0, c = 0, deleting = false;
            (function tick() {
                var word = words[w];
                c += deleting ? -1 : 1;
                node.textContent = word.slice(0, c);
                var wait = deleting ? 45 : 85;
                if (!deleting && c === word.length) { deleting = true; wait = 1500; }
                else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; wait = 260; }
                setTimeout(tick, wait);
            })();
        });
    }

    /* ---------- boot ---------- */
    function init() {
        buildBackground();
        buildNav();
        buildPalette();
        buildFooter();
        mountWidgets();
        if (window.DSAViz && CURRENT) window.DSAViz.mount(CURRENT);
        wireReveal();
        wireTilt();
        wireLightbox();
        wireKeys();
        wireTypewriter();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();

    /* exposed for page-level scripts */
    window.DSAUtil = {
        el: el, $: $, $$: $$, esc: esc, toast: toast,
        highlight: highlight, store: store, save: save,
        reduceMotion: reduceMotion, LS_PROGRESS: LS_PROGRESS
    };
})();
