/* ============================================================
   DSA WIZARD — Interactive visualizers
   One animated, steppable playground per data structure.
   Mounted automatically by wizard.js on any [data-viz] element.
   ============================================================ */
(function () {
    'use strict';

    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------- animation engine ---------------- */
    function Engine(host) {
        this.host = host;
        this.token = 0;
        this.speed = 1;
    }
    Engine.prototype.begin = function () { return ++this.token; };
    Engine.prototype.alive = function (t) { return t === this.token; };
    Engine.prototype.wait = function (ms) {
        var self = this;
        return new Promise(function (res) {
            setTimeout(res, reduce ? 0 : ms / self.speed);
        });
    };

    /* ---------------- DOM helpers ---------------- */
    function h(tag, cls, html) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        if (html != null) n.innerHTML = html;
        return n;
    }
    function frame(host, controlsHTML) {
        host.classList.add('viz');
        host.innerHTML =
            '<div class="viz-controls">' + controlsHTML + '</div>' +
            '<div class="viz-stage" data-stage></div>' +
            '<div class="viz-log" data-log>Ready. Try the controls above.</div>';
        return {
            stage: host.querySelector('[data-stage]'),
            log: host.querySelector('[data-log]'),
            btn: function (sel) { return host.querySelector(sel); },
            all: function (sel) { return Array.prototype.slice.call(host.querySelectorAll(sel)); }
        };
    }
    function btn(id, label, kind) {
        return '<button type="button" class="btn btn-sm ' + (kind || 'btn-ghost') + '" data-a="' + id + '">' + label + '</button>';
    }
    function num(id, ph, val) {
        return '<input class="viz-input" data-i="' + id + '" placeholder="' + ph + '"' +
            (val != null ? ' value="' + val + '"' : '') + '>';
    }
    function speedCtl() {
        return '<label class="viz-speed">speed' +
            '<input type="range" data-i="speed" min="0.5" max="3" step="0.5" value="1"></label>';
    }
    function on(host, id, fn) {
        var b = host.querySelector('[data-a="' + id + '"]');
        if (b) b.addEventListener('click', fn);
    }
    function val(host, id) {
        var i = host.querySelector('[data-i="' + id + '"]');
        return i ? i.value.trim() : '';
    }
    function intVal(host, id, fallback) {
        var v = parseInt(val(host, id), 10);
        return isNaN(v) ? fallback : v;
    }
    function wireSpeed(host, eng) {
        var s = host.querySelector('[data-i="speed"]');
        if (s) s.addEventListener('input', function () { eng.speed = +s.value || 1; });
    }

    /* ============================================================
       ARRAY — insert, delete, linear + binary search, bubble sort
       ============================================================ */
    function arrayViz(host) {
        var eng = new Engine(host);
        var data = [12, 25, 34, 47, 58];

        var ui = frame(host,
            num('val', 'value', 7) + num('pos', 'index', 2) +
            btn('insBegin', '⤒ Insert front') +
            btn('insPos', '⤓ Insert at index') +
            btn('insEnd', '＋ Push back', 'btn') +
            btn('del', '− Delete at index') +
            btn('linear', '⌕ Linear search') +
            btn('binary', '⌕ Binary search') +
            btn('sort', '⇅ Bubble sort') +
            btn('reset', '↻ Reset') + speedCtl());

        function draw() {
            ui.stage.innerHTML = data.length
                ? data.map(function (v, i) {
                    return '<div class="cell" data-k="' + i + '">' + v +
                        '<span class="idx">[' + i + ']</span></div>';
                }).join('')
                : '<span class="tag-null">empty array — size 0</span>';
        }
        function say(msg) { ui.log.innerHTML = msg; }
        function cell(i) { return ui.stage.querySelector('[data-k="' + i + '"]'); }

        draw();
        wireSpeed(host, eng);

        on(host, 'insBegin', function () {
            eng.begin();
            var v = intVal(host, 'val', 0);
            data.unshift(v);
            draw();
            say('Inserted <b>' + v + '</b> at index 0 — every other element shifted right. <b>O(n)</b>');
        });

        on(host, 'insPos', function () {
            eng.begin();
            var v = intVal(host, 'val', 0), p = intVal(host, 'pos', 0);
            if (p < 0 || p > data.length) return say('Index <b>' + p + '</b> is out of range (0…' + data.length + ').');
            data.splice(p, 0, v);
            draw();
            say('Inserted <b>' + v + '</b> at index <b>' + p + '</b> — the tail shifted right by one. <b>O(n)</b>');
        });

        on(host, 'insEnd', function () {
            eng.begin();
            var v = intVal(host, 'val', 0);
            data.push(v);
            draw();
            say('Pushed <b>' + v + '</b> at the end — nothing had to move. <b>O(1)</b> amortised');
        });

        on(host, 'del', function () {
            eng.begin();
            var p = intVal(host, 'pos', 0);
            if (!data.length) return say('Array is already empty.');
            if (p < 0 || p >= data.length) return say('Index <b>' + p + '</b> is out of range (0…' + (data.length - 1) + ').');
            var c = cell(p);
            var removed = data[p];
            if (c) c.classList.add('dead');
            setTimeout(function () {
                data.splice(p, 1);
                draw();
                say('Deleted <b>' + removed + '</b> from index <b>' + p + '</b> — the tail shifted left. <b>O(n)</b>');
            }, reduce ? 0 : 320);
        });

        on(host, 'linear', function () {
            var t = eng.begin();
            var key = intVal(host, 'val', 0);
            draw();
            (async function () {
                for (var i = 0; i < data.length; i++) {
                    if (!eng.alive(t)) return;
                    ui.stage.querySelectorAll('.cell').forEach(function (c) { c.classList.remove('hit'); });
                    var c = cell(i);
                    if (c) c.classList.add('hit');
                    say('Linear search — comparing index <b>' + i + '</b> (' + data[i] + ') with <b>' + key + '</b>… ' + (i + 1) + ' comparison(s) so far');
                    await eng.wait(520);
                    if (data[i] === key) {
                        if (!eng.alive(t)) return;
                        c.classList.remove('hit');
                        c.classList.add('found');
                        return say('Found <b>' + key + '</b> at index <b>' + i + '</b> after <b>' + (i + 1) + '</b> comparisons. Worst case <b>O(n)</b>');
                    }
                }
                if (eng.alive(t)) say('<b>' + key + '</b> is not in the array — all <b>' + data.length + '</b> elements were checked. <b>O(n)</b>');
            })();
        });

        on(host, 'binary', function () {
            var t = eng.begin();
            var key = intVal(host, 'val', 0);
            var sorted = data.every(function (v, i) { return i === 0 || data[i - 1] <= v; });
            if (!sorted) return say('⚠ Binary search needs a <b>sorted</b> array. Run bubble sort first — that is the whole precondition.');
            draw();
            (async function () {
                var lo = 0, hi = data.length - 1, steps = 0;
                while (lo <= hi) {
                    if (!eng.alive(t)) return;
                    var mid = Math.floor(lo + (hi - lo) / 2);
                    steps++;
                    ui.stage.querySelectorAll('.cell').forEach(function (c, i) {
                        c.classList.remove('hit');
                        c.classList.toggle('dim', i < lo || i > hi);
                    });
                    var c = cell(mid);
                    if (c) c.classList.add('hit');
                    say('Step <b>' + steps + '</b> — range [' + lo + '…' + hi + '], mid = <b>' + mid + '</b> (' + data[mid] + ') vs <b>' + key + '</b>');
                    await eng.wait(700);
                    if (!eng.alive(t)) return;
                    if (data[mid] === key) {
                        c.classList.remove('hit');
                        c.classList.add('found');
                        return say('Found <b>' + key + '</b> at index <b>' + mid + '</b> in only <b>' + steps + '</b> steps — that is <b>O(log n)</b>');
                    }
                    if (data[mid] < key) lo = mid + 1; else hi = mid - 1;
                }
                if (eng.alive(t)) say('<b>' + key + '</b> is absent — the range collapsed after <b>' + steps + '</b> halvings. <b>O(log n)</b>');
            })();
        });

        on(host, 'sort', function () {
            var t = eng.begin();
            (async function () {
                var swaps = 0, comps = 0;
                for (var i = 0; i < data.length - 1; i++) {
                    var swapped = false;
                    for (var j = 0; j < data.length - 1 - i; j++) {
                        if (!eng.alive(t)) return;
                        comps++;
                        draw();
                        var a = cell(j), b = cell(j + 1);
                        if (a) a.classList.add('hit');
                        if (b) b.classList.add('hit');
                        say('Comparing <b>' + data[j] + '</b> and <b>' + data[j + 1] + '</b> — ' + comps + ' comparisons, ' + swaps + ' swaps');
                        await eng.wait(300);
                        if (data[j] > data[j + 1]) {
                            var tmp = data[j]; data[j] = data[j + 1]; data[j + 1] = tmp;
                            swaps++; swapped = true;
                            draw();
                            await eng.wait(180);
                        }
                    }
                    if (!swapped) break;
                }
                if (eng.alive(t)) {
                    draw();
                    say('Sorted in <b>' + comps + '</b> comparisons and <b>' + swaps + '</b> swaps — bubble sort is <b>O(n²)</b>. Binary search is unlocked now.');
                }
            })();
        });

        on(host, 'reset', function () {
            eng.begin();
            data = [12, 25, 34, 47, 58];
            draw();
            say('Reset to a sorted 5-element array.');
        });
    }

    /* ============================================================
       STACK — push / pop / peek, LIFO made visible
       ============================================================ */
    function stackViz(host) {
        var eng = new Engine(host);
        var CAP = 6;
        var data = ['A', 'B', 'C'];

        var ui = frame(host,
            num('val', 'value', 'D') +
            btn('push', '↓ Push', 'btn') +
            btn('pop', '↑ Pop') +
            btn('peek', '👁 Peek') +
            btn('clear', '↻ Clear') +
            '<span class="chip">capacity <b>' + CAP + '</b></span>' + speedCtl());

        function draw(flash) {
            if (!data.length) {
                ui.stage.innerHTML = '<div class="stack-col"><span class="tag-null">stack empty · top = -1</span></div>';
                return;
            }
            var rows = data.slice().reverse().map(function (v, i) {
                var realIndex = data.length - 1 - i;
                var isTop = i === 0;
                return '<div class="cell stack-cell' + (isTop ? ' is-top' : '') +
                    (flash === realIndex ? ' found' : '') + '" data-k="' + realIndex + '">' + v +
                    '<span class="stack-tag">' + (isTop ? '← TOP  [' + realIndex + ']' : '[' + realIndex + ']') + '</span></div>';
            }).join('');
            ui.stage.innerHTML = '<div class="stack-col">' + rows +
                '<div class="stack-base">BASE · bottom of stack</div></div>';
        }
        function say(m) { ui.log.innerHTML = m; }

        draw();
        wireSpeed(host, eng);

        on(host, 'push', function () {
            eng.begin();
            var v = val(host, 'val') || String.fromCharCode(65 + data.length);
            if (data.length >= CAP) return say('⚠ <b>STACK OVERFLOW</b> — capacity ' + CAP + ' is full. A real implementation must check <code>isFull()</code> before pushing.');
            data.push(v);
            draw(data.length - 1);
            say('Pushed <b>' + v + '</b> — it becomes the new top at index <b>' + (data.length - 1) + '</b>. <b>O(1)</b>');
        });

        on(host, 'pop', function () {
            eng.begin();
            if (!data.length) return say('⚠ <b>STACK UNDERFLOW</b> — nothing to pop. Always guard with <code>isEmpty()</code> first.');
            var top = ui.stage.querySelector('.is-top');
            if (top) top.classList.add('dead');
            var v = data.pop();
            setTimeout(function () {
                draw();
                say('Popped <b>' + v + '</b> — the last value pushed is the first one out (LIFO). <b>O(1)</b>');
            }, reduce ? 0 : 280);
        });

        on(host, 'peek', function () {
            eng.begin();
            if (!data.length) return say('Stack is empty — <code>peek()</code> has nothing to return.');
            draw(data.length - 1);
            say('Top of stack is <b>' + data[data.length - 1] + '</b> — <code>peek()</code> reads it without removing. <b>O(1)</b>');
        });

        on(host, 'clear', function () {
            eng.begin();
            data = [];
            draw();
            say('Stack cleared — top reset to -1.');
        });
    }

    /* ============================================================
       QUEUE — FIFO, with a circular-buffer mode
       ============================================================ */
    function queueViz(host) {
        var eng = new Engine(host);
        var CAP = 6;
        var circular = true;
        var slots = new Array(CAP).fill(null);
        var front = 0, rear = -1, count = 0;
        var seed = ['P1', 'P2', 'P3'];

        var ui = frame(host,
            num('val', 'value', 'P4') +
            btn('enq', '→ Enqueue', 'btn') +
            btn('deq', 'Dequeue →') +
            btn('peek', '👁 Peek front') +
            btn('mode', '⟳ Mode: circular') +
            btn('clear', '↻ Clear') + speedCtl());

        function reset() {
            slots = new Array(CAP).fill(null);
            front = 0; rear = -1; count = 0;
            seed.forEach(function (v) { rear = (rear + 1) % CAP; slots[rear] = v; count++; });
        }

        function draw(flash) {
            var cells = slots.map(function (v, i) {
                var active = count > 0 && (circular
                    ? (i - front + CAP) % CAP < count
                    : (i >= front && i <= rear));
                var tags = [];
                if (active && i === front) tags.push('FRONT');
                if (active && i === rear) tags.push('REAR');
                return '<div class="cell queue-cell' + (active ? '' : ' empty-slot') +
                    (flash === i ? ' found' : '') + '" data-k="' + i + '">' +
                    (active ? v : '·') +
                    '<span class="idx">' + i + (tags.length ? ' ' + tags.join('/') : '') + '</span></div>';
            }).join('<span class="arrow">›</span>');

            ui.stage.innerHTML = '<div class="queue-row">' + cells + '</div>' +
                '<div class="queue-meta mono">front = ' + front + ' · rear = ' + rear +
                ' · size = ' + count + '/' + CAP + (circular ? ' · rear = (rear + 1) % ' + CAP : ' · linear') + '</div>';
        }
        function say(m) { ui.log.innerHTML = m; }

        reset();
        draw();
        wireSpeed(host, eng);

        on(host, 'enq', function () {
            eng.begin();
            var v = val(host, 'val') || 'P' + (count + 1);
            if (count === CAP) return say('⚠ <b>QUEUE FULL</b> — size ' + CAP + '. Check <code>isFull()</code> before enqueueing.');
            if (!circular && rear === CAP - 1) return say('⚠ In a <b>linear</b> array queue the rear has hit the wall even though slots at the front are free — that wasted space is exactly why circular queues exist. Switch modes.');
            rear = circular ? (rear + 1) % CAP : rear + 1;
            slots[rear] = v;
            count++;
            draw(rear);
            say('Enqueued <b>' + v + '</b> at the <b>rear</b> (index ' + rear + '). <b>O(1)</b>');
        });

        on(host, 'deq', function () {
            eng.begin();
            if (!count) return say('⚠ <b>QUEUE EMPTY</b> — nothing to dequeue.');
            var v = slots[front];
            var c = ui.stage.querySelector('[data-k="' + front + '"]');
            if (c) c.classList.add('dead');
            setTimeout(function () {
                slots[front] = null;
                front = circular ? (front + 1) % CAP : front + 1;
                count--;
                if (!count && circular) { front = 0; rear = -1; }
                draw();
                say('Dequeued <b>' + v + '</b> from the <b>front</b> — first in, first out. ' +
                    (circular ? 'The index moved, no data shifted: <b>O(1)</b>'
                              : 'A naive array would shift every element left: <b>O(n)</b>'));
            }, reduce ? 0 : 280);
        });

        on(host, 'peek', function () {
            eng.begin();
            if (!count) return say('Queue is empty — <code>front()</code> has nothing to return.');
            draw(front);
            say('Front is <b>' + slots[front] + '</b> (index ' + front + ') — it will leave next. <b>O(1)</b>');
        });

        on(host, 'mode', function () {
            eng.begin();
            circular = !circular;
            this.textContent = '⟳ Mode: ' + (circular ? 'circular' : 'linear');
            reset();
            draw();
            say(circular
                ? 'Circular mode — indices wrap with <code>(i + 1) % ' + CAP + '</code>, so freed front slots get reused.'
                : 'Linear mode — the rear can never come back, so dequeued slots at the front are wasted. Fill it up and see.');
        });

        on(host, 'clear', function () {
            eng.begin();
            slots = new Array(CAP).fill(null);
            front = 0; rear = -1; count = 0;
            draw();
            say('Queue cleared.');
        });
    }

    /* ============================================================
       STRING — reverse, palindrome, frequency, naive pattern search
       ============================================================ */
    function stringViz(host) {
        var eng = new Engine(host);
        var text = 'RACECAR';

        var ui = frame(host,
            '<input class="viz-input" style="width:180px" data-i="text" placeholder="text" value="RACECAR">' +
            num('pat', 'pattern', 'CEC') +
            btn('reverse', '⇄ Reverse') +
            btn('pal', '⇔ Palindrome check') +
            btn('freq', '📊 Char frequency') +
            btn('find', '⌕ Find pattern') +
            btn('reset', '↻ Reset') + speedCtl());

        function draw(marks) {
            marks = marks || {};
            ui.stage.innerHTML = '<div class="str-row">' + text.split('').map(function (ch, i) {
                var cls = marks[i] ? ' ' + marks[i] : '';
                return '<div class="cell str-cell' + cls + '" data-k="' + i + '">' + ch +
                    '<span class="idx">' + i + '</span></div>';
            }).join('') + '</div>';
        }
        function say(m) { ui.log.innerHTML = m; }
        function sync() {
            var v = val(host, 'text');
            if (v) text = v.toUpperCase();
        }

        draw();
        wireSpeed(host, eng);
        host.querySelector('[data-i="text"]').addEventListener('input', function () {
            eng.begin(); sync(); draw(); say('Length is <b>' + text.length + '</b> — indices run 0 … ' + (text.length - 1) + '.');
        });

        on(host, 'reverse', function () {
            var t = eng.begin();
            sync();
            (async function () {
                var a = text.split('');
                var i = 0, j = a.length - 1, swaps = 0;
                while (i < j) {
                    if (!eng.alive(t)) return;
                    var marks = {}; marks[i] = 'hit'; marks[j] = 'hit';
                    text = a.join('');
                    draw(marks);
                    say('Two-pointer reverse — swapping index <b>' + i + '</b> (' + a[i] + ') with <b>' + j + '</b> (' + a[j] + ')');
                    await eng.wait(480);
                    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
                    swaps++; i++; j--;
                    text = a.join('');
                    draw();
                    await eng.wait(180);
                }
                if (eng.alive(t)) {
                    text = a.join('');
                    draw();
                    host.querySelector('[data-i="text"]').value = text;
                    say('Reversed in <b>' + swaps + '</b> swaps — <b>O(n)</b> time, <b>O(1)</b> extra space when the buffer is mutable.');
                }
            })();
        });

        on(host, 'pal', function () {
            var t = eng.begin();
            sync();
            (async function () {
                var i = 0, j = text.length - 1, ok = true, steps = 0;
                while (i < j) {
                    if (!eng.alive(t)) return;
                    steps++;
                    var same = text[i] === text[j];
                    var marks = {};
                    marks[i] = same ? 'found' : 'dead';
                    marks[j] = same ? 'found' : 'dead';
                    draw(marks);
                    say('Comparing <b>' + text[i] + '</b> (index ' + i + ') with <b>' + text[j] + '</b> (index ' + j + ') → ' +
                        (same ? '<b>match</b>' : '<b>mismatch</b>'));
                    await eng.wait(620);
                    if (!same) { ok = false; break; }
                    i++; j--;
                }
                if (eng.alive(t)) {
                    draw();
                    say(ok
                        ? '✓ <b>' + text + '</b> IS a palindrome — verified in <b>' + steps + '</b> comparisons, <b>O(n)</b> time and <b>O(1)</b> space.'
                        : '✗ <b>' + text + '</b> is NOT a palindrome — the two-pointer scan can bail out on the first mismatch.');
                }
            })();
        });

        on(host, 'freq', function () {
            eng.begin();
            sync();
            var freq = {};
            text.split('').forEach(function (c) { freq[c] = (freq[c] || 0) + 1; });
            var keys = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a] || a.localeCompare(b); });
            var max = freq[keys[0]] || 1;
            ui.stage.innerHTML = '<div class="freq-row">' + keys.map(function (k) {
                return '<div class="freq-bar"><span class="freq-fill" style="height:' +
                    Math.max(10, (freq[k] / max) * 100) + '%"><b>' + freq[k] + '</b></span>' +
                    '<span class="freq-ch">' + (k === ' ' ? '␣' : k) + '</span></div>';
            }).join('') + '</div>';
            var uniq = keys.filter(function (k) { return freq[k] === 1; });
            say('Counted in one pass — <b>' + keys.length + '</b> distinct characters. First unique: <b>' +
                (uniq.length ? uniq[0] : 'none') + '</b>. A 26-slot array does this in <b>O(n)</b> time, <b>O(1)</b> space.');
        });

        on(host, 'find', function () {
            var t = eng.begin();
            sync();
            var pat = (val(host, 'pat') || '').toUpperCase();
            if (!pat) return say('Type a pattern to search for.');
            (async function () {
                var comps = 0;
                for (var i = 0; i + pat.length <= text.length; i++) {
                    var j = 0;
                    for (; j < pat.length; j++) {
                        if (!eng.alive(t)) return;
                        comps++;
                        var marks = {};
                        for (var k = 0; k < j; k++) marks[i + k] = 'found';
                        marks[i + j] = text[i + j] === pat[j] ? 'found' : 'dead';
                        draw(marks);
                        say('Naive search — window at index <b>' + i + '</b>, comparing <b>' + text[i + j] + '</b> with <b>' + pat[j] +
                            '</b> · ' + comps + ' comparisons so far');
                        await eng.wait(330);
                        if (text[i + j] !== pat[j]) break;
                    }
                    if (j === pat.length) {
                        if (!eng.alive(t)) return;
                        var found = {};
                        for (var m = 0; m < pat.length; m++) found[i + m] = 'found';
                        draw(found);
                        return say('Found "<b>' + pat + '</b>" at index <b>' + i + '</b> after <b>' + comps +
                            '</b> comparisons. Naive is <b>O(n·m)</b>; KMP would need at most <b>' + (text.length + pat.length) + '</b>.');
                    }
                }
                if (eng.alive(t)) { draw(); say('"<b>' + pat + '</b>" is not present — <b>' + comps + '</b> comparisons spent. This restart-on-mismatch waste is what KMP removes.'); }
            })();
        });

        on(host, 'reset', function () {
            eng.begin();
            text = 'RACECAR';
            host.querySelector('[data-i="text"]').value = text;
            draw();
            say('Reset.');
        });
    }

    window.DSAVizBuilders = { array: arrayViz, stack: stackViz, queue: queueViz, string: stringViz };
})();

/* ============================================================
   DSA WIZARD — Visualizers, part 2
   Linked list · BST · Hash table · Graph  +  the mount bridge
   ============================================================ */
(function () {
    'use strict';

    var reduce = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function Engine(host) { this.token = 0; this.speed = 1; }
    Engine.prototype.begin = function () { return ++this.token; };
    Engine.prototype.alive = function (t) { return t === this.token; };
    Engine.prototype.wait = function (ms) {
        var self = this;
        return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms / self.speed); });
    };

    function frame(host, controlsHTML) {
        host.classList.add('viz');
        host.innerHTML =
            '<div class="viz-controls">' + controlsHTML + '</div>' +
            '<div class="viz-stage" data-stage></div>' +
            '<div class="viz-log" data-log>Ready. Try the controls above.</div>';
        return {
            stage: host.querySelector('[data-stage]'),
            log: host.querySelector('[data-log]')
        };
    }
    function btn(id, label, kind) {
        return '<button type="button" class="btn btn-sm ' + (kind || 'btn-ghost') + '" data-a="' + id + '">' + label + '</button>';
    }
    function num(id, ph, v) {
        return '<input class="viz-input" data-i="' + id + '" placeholder="' + ph + '"' + (v != null ? ' value="' + v + '"' : '') + '>';
    }
    function speedCtl() {
        return '<label class="viz-speed">speed<input type="range" data-i="speed" min="0.5" max="3" step="0.5" value="1"></label>';
    }
    function on(host, id, fn) {
        var b = host.querySelector('[data-a="' + id + '"]');
        if (b) b.addEventListener('click', fn);
    }
    function val(host, id) {
        var i = host.querySelector('[data-i="' + id + '"]');
        return i ? i.value.trim() : '';
    }
    function intVal(host, id, d) {
        var v = parseInt(val(host, id), 10);
        return isNaN(v) ? d : v;
    }
    function wireSpeed(host, eng) {
        var s = host.querySelector('[data-i="speed"]');
        if (s) s.addEventListener('input', function () { eng.speed = +s.value || 1; });
    }

    /* ============================================================
       LINKED LIST — insert, delete, traverse, reverse
       ============================================================ */
    function linkedViz(host) {
        var eng = new Engine(host);
        var list = [10, 20, 30];

        var ui = frame(host,
            num('val', 'value', 40) + num('pos', 'position', 1) +
            btn('head', '⤒ Insert head', 'btn') +
            btn('tail', '⤓ Insert tail') +
            btn('at', '＋ Insert at pos') +
            btn('del', '− Delete value') +
            btn('search', '⌕ Traverse & search') +
            btn('reverse', '⇄ Reverse') +
            btn('reset', '↻ Reset') + speedCtl());

        function draw(marks) {
            marks = marks || {};
            if (!list.length) {
                ui.stage.innerHTML = '<span class="tag-null">head → NULL  (empty list)</span>';
                return;
            }
            var html = '<div class="ll-row"><span class="ll-label">head</span><span class="arrow">→</span>';
            list.forEach(function (v, i) {
                html += '<div class="ll-node ' + (marks[i] || '') + '" data-k="' + i + '">' +
                    '<span class="ll-data">' + v + '</span>' +
                    '<span class="ll-next">next</span>' +
                    '<span class="idx">' + (i === 0 ? 'head' : (i === list.length - 1 ? 'tail' : 'node ' + i)) + '</span>' +
                    '</div>';
                html += '<span class="arrow">→</span>';
            });
            html += '<span class="tag-null">NULL</span></div>';
            ui.stage.innerHTML = html;
        }
        function say(m) { ui.log.innerHTML = m; }

        draw();
        wireSpeed(host, eng);

        on(host, 'head', function () {
            eng.begin();
            var v = intVal(host, 'val', 0);
            list.unshift(v);
            draw({ 0: 'found' });
            say('Inserted <b>' + v + '</b> at the head — only two pointers changed, nothing shifted. <b>O(1)</b>');
        });

        on(host, 'tail', function () {
            var t = eng.begin();
            var v = intVal(host, 'val', 0);
            (async function () {
                for (var i = 0; i < list.length; i++) {
                    if (!eng.alive(t)) return;
                    var m = {}; m[i] = 'hit';
                    draw(m);
                    say('Walking to the tail — at node <b>' + i + '</b> (' + list[i] + '). This walk is why tail insert is <b>O(n)</b> without a tail pointer.');
                    await eng.wait(400);
                }
                if (!eng.alive(t)) return;
                list.push(v);
                draw({ [list.length - 1]: 'found' });
                say('Inserted <b>' + v + '</b> as the new tail after traversing <b>' + (list.length - 1) + '</b> nodes. <b>O(n)</b> — or <b>O(1)</b> if you keep a tail pointer.');
            })();
        });

        on(host, 'at', function () {
            eng.begin();
            var v = intVal(host, 'val', 0), p = intVal(host, 'pos', 0);
            if (p < 0 || p > list.length) return say('Position <b>' + p + '</b> is out of range (0…' + list.length + ').');
            list.splice(p, 0, v);
            draw({ [p]: 'found' });
            say('Inserted <b>' + v + '</b> at position <b>' + p + '</b> — relink order matters: <code>new.next = prev.next</code> first, then <code>prev.next = new</code>. <b>O(pos)</b>');
        });

        on(host, 'del', function () {
            var t = eng.begin();
            var v = intVal(host, 'val', 0);
            (async function () {
                for (var i = 0; i < list.length; i++) {
                    if (!eng.alive(t)) return;
                    var m = {}; m[i] = 'hit';
                    draw(m);
                    say('Looking for <b>' + v + '</b> — checking node <b>' + i + '</b> (' + list[i] + ')');
                    await eng.wait(420);
                    if (list[i] === v) {
                        if (!eng.alive(t)) return;
                        var d = {}; d[i] = 'dead';
                        draw(d);
                        say('Found <b>' + v + '</b> — linking the previous node around it…');
                        await eng.wait(520);
                        if (!eng.alive(t)) return;
                        list.splice(i, 1);
                        draw();
                        return say('Deleted <b>' + v + '</b>. The relink itself is <b>O(1)</b>; finding the node was <b>O(n)</b>.');
                    }
                }
                if (eng.alive(t)) { draw(); say('<b>' + v + '</b> is not in the list — every node was visited. <b>O(n)</b>'); }
            })();
        });

        on(host, 'search', function () {
            var t = eng.begin();
            var v = intVal(host, 'val', 0);
            (async function () {
                for (var i = 0; i < list.length; i++) {
                    if (!eng.alive(t)) return;
                    var m = {}; m[i] = 'hit';
                    draw(m);
                    say('Traversing — node <b>' + i + '</b> holds <b>' + list[i] + '</b>. No random access here: reaching index k costs k hops.');
                    await eng.wait(430);
                    if (list[i] === v) {
                        if (!eng.alive(t)) return;
                        var f = {}; f[i] = 'found';
                        draw(f);
                        return say('Found <b>' + v + '</b> at position <b>' + i + '</b> after <b>' + (i + 1) + '</b> hops. <b>O(n)</b>');
                    }
                }
                if (eng.alive(t)) { draw(); say('<b>' + v + '</b> not found after <b>' + list.length + '</b> hops. <b>O(n)</b>'); }
            })();
        });

        on(host, 'reverse', function () {
            var t = eng.begin();
            (async function () {
                var done = [];
                var rest = list.slice();
                while (rest.length) {
                    if (!eng.alive(t)) return;
                    var node = rest.shift();
                    done.unshift(node);
                    list = done.concat(rest);
                    var m = {}; m[done.length - 1] = 'hit';
                    draw(m);
                    say('Three-pointer reverse — <code>nxt = cur.next</code>, <code>cur.next = prev</code>, then advance. <b>' +
                        done.length + '</b> of <b>' + (done.length + rest.length) + '</b> links flipped.');
                    await eng.wait(520);
                }
                if (eng.alive(t)) {
                    draw();
                    say('Reversed in one pass — <b>O(n)</b> time and <b>O(1)</b> space. <code>prev</code> is the new head.');
                }
            })();
        });

        on(host, 'reset', function () {
            eng.begin();
            list = [10, 20, 30];
            draw();
            say('Reset to a 3-node list.');
        });
    }

    /* ============================================================
       BINARY SEARCH TREE — insert, search, traversals
       ============================================================ */
    function treeViz(host) {
        var eng = new Engine(host);
        var root = null;

        var ui = frame(host,
            num('val', 'value', 45) +
            btn('insert', '＋ Insert', 'btn') +
            btn('search', '⌕ Search path') +
            btn('in', 'In-order') +
            btn('pre', 'Pre-order') +
            btn('post', 'Post-order') +
            btn('level', 'Level-order') +
            btn('random', '🎲 Random tree') +
            btn('clear', '↻ Clear') + speedCtl());

        function insert(node, v) {
            if (!node) return { v: v, l: null, r: null };
            if (v < node.v) node.l = insert(node.l, v);
            else if (v > node.v) node.r = insert(node.r, v);
            return node;
        }
        function height(n) { return n ? 1 + Math.max(height(n.l), height(n.r)) : 0; }
        function count(n) { return n ? 1 + count(n.l) + count(n.r) : 0; }

        function layout() {
            var nodes = [], edges = [], x = 0;
            (function walk(n, depth) {
                if (!n) return;
                walk(n.l, depth + 1);
                n._x = x++;
                n._y = depth;
                nodes.push(n);
                walk(n.r, depth + 1);
            })(root, 0);
            nodes.forEach(function (n) {
                if (n.l) edges.push([n, n.l]);
                if (n.r) edges.push([n, n.r]);
            });
            return { nodes: nodes, edges: edges };
        }

        function draw(marks, note) {
            marks = marks || {};
            if (!root) {
                ui.stage.innerHTML = '<span class="tag-null">empty tree — root = NULL</span>';
                return;
            }
            var g = layout();
            var cols = g.nodes.length, rows = height(root);
            var W = Math.max(360, cols * 68), H = rows * 82 + 40;
            var px = function (n) { return 34 + n._x * ((W - 68) / Math.max(1, cols - 1)); };
            var py = function (n) { return 30 + n._y * ((H - 60) / Math.max(1, rows - 1)); };

            var svg = '<svg class="tree-svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">';
            g.edges.forEach(function (e) {
                svg += '<line x1="' + px(e[0]) + '" y1="' + py(e[0]) + '" x2="' + px(e[1]) + '" y2="' + py(e[1]) +
                    '" class="tree-edge"/>';
            });
            g.nodes.forEach(function (n) {
                var cls = 'tree-node ' + (marks[n.v] || '');
                svg += '<g class="' + cls + '">' +
                    '<circle cx="' + px(n) + '" cy="' + py(n) + '" r="19"/>' +
                    '<text x="' + px(n) + '" y="' + (py(n) + 5) + '" text-anchor="middle">' + n.v + '</text></g>';
            });
            svg += '</svg>';
            ui.stage.innerHTML = svg +
                '<div class="tree-meta mono">nodes = ' + count(root) + ' · height = ' + (height(root) - 1) +
                ' · balanced height would be ' + Math.floor(Math.log2(count(root))) + (note ? ' · ' + note : '') + '</div>';
        }
        function say(m) { ui.log.innerHTML = m; }

        function seed(values) {
            root = null;
            values.forEach(function (v) { root = insert(root, v); });
        }
        seed([50, 30, 70, 20, 40, 60, 80]);
        draw();
        wireSpeed(host, eng);

        on(host, 'insert', function () {
            var t = eng.begin();
            var v = intVal(host, 'val', 0);
            (async function () {
                var path = [], cur = root;
                while (cur) {
                    path.push(cur.v);
                    if (v === cur.v) break;
                    cur = v < cur.v ? cur.l : cur.r;
                }
                for (var i = 0; i < path.length; i++) {
                    if (!eng.alive(t)) return;
                    var m = {}; m[path[i]] = 'hit';
                    draw(m);
                    say('Descending — at <b>' + path[i] + '</b>, ' + (v < path[i] ? '<b>' + v + ' &lt; ' + path[i] + '</b> so go LEFT' :
                        (v > path[i] ? '<b>' + v + ' &gt; ' + path[i] + '</b> so go RIGHT' : 'value already present, BSTs ignore duplicates')));
                    await eng.wait(560);
                }
                if (!eng.alive(t)) return;
                root = insert(root, v);
                var f = {}; f[v] = 'found';
                draw(f);
                say('Inserted <b>' + v + '</b> after <b>' + path.length + '</b> comparisons — one per level, so insert is <b>O(h)</b>.');
            })();
        });

        on(host, 'search', function () {
            var t = eng.begin();
            var v = intVal(host, 'val', 0);
            (async function () {
                var cur = root, steps = 0;
                while (cur) {
                    if (!eng.alive(t)) return;
                    steps++;
                    var m = {}; m[cur.v] = cur.v === v ? 'found' : 'hit';
                    draw(m);
                    if (cur.v === v) return say('Found <b>' + v + '</b> in <b>' + steps + '</b> comparisons. Every step threw away a whole subtree — <b>O(h)</b>, i.e. O(log n) when balanced.');
                    say('At <b>' + cur.v + '</b> — ' + (v < cur.v ? 'target is smaller, discard the entire RIGHT subtree' : 'target is larger, discard the entire LEFT subtree'));
                    await eng.wait(620);
                    cur = v < cur.v ? cur.l : cur.r;
                }
                if (eng.alive(t)) { draw(); say('<b>' + v + '</b> is absent — the walk hit a NULL child after <b>' + steps + '</b> comparisons.'); }
            })();
        });

        function animateOrder(order, label, explain) {
            var t = eng.begin();
            (async function () {
                var marks = {}, seen = [];
                for (var i = 0; i < order.length; i++) {
                    if (!eng.alive(t)) return;
                    marks[order[i]] = 'found';
                    seen.push(order[i]);
                    draw(marks);
                    say('<b>' + label + '</b> — visited: <b>' + seen.join(' → ') + '</b>');
                    await eng.wait(430);
                }
                if (eng.alive(t)) say('<b>' + label + '</b> complete: <b>' + seen.join(' → ') + '</b><br>' + explain);
            })();
        }

        function inOrder(n, out) { if (!n) return out; inOrder(n.l, out); out.push(n.v); inOrder(n.r, out); return out; }
        function preOrder(n, out) { if (!n) return out; out.push(n.v); preOrder(n.l, out); preOrder(n.r, out); return out; }
        function postOrder(n, out) { if (!n) return out; postOrder(n.l, out); postOrder(n.r, out); out.push(n.v); return out; }
        function levelOrder(n) {
            var out = [], q = n ? [n] : [];
            while (q.length) {
                var c = q.shift();
                out.push(c.v);
                if (c.l) q.push(c.l);
                if (c.r) q.push(c.r);
            }
            return out;
        }

        on(host, 'in', function () {
            animateOrder(inOrder(root, []), 'In-order (left → node → right)',
                'On a BST this always comes out <b>sorted</b> — that is the free lunch a BST gives you.');
        });
        on(host, 'pre', function () {
            animateOrder(preOrder(root, []), 'Pre-order (node → left → right)',
                'Root first, so this is what you use to <b>copy or serialise</b> a tree.');
        });
        on(host, 'post', function () {
            animateOrder(postOrder(root, []), 'Post-order (left → right → node)',
                'Children before the parent — the order for <b>deleting</b> a tree or evaluating an expression bottom-up.');
        });
        on(host, 'level', function () {
            animateOrder(levelOrder(root), 'Level-order / BFS',
                'Driven by a <b>queue</b>, not recursion — it sweeps the tree one depth at a time.');
        });

        on(host, 'random', function () {
            eng.begin();
            var vals = [];
            while (vals.length < 7) {
                var v = 10 + Math.floor(Math.random() * 89);
                if (vals.indexOf(v) < 0) vals.push(v);
            }
            seed(vals);
            draw();
            say('Random tree from <b>' + vals.join(', ') + '</b>. Insert sorted values instead and watch it degenerate into a linked list — height n, every operation O(n).');
        });

        on(host, 'clear', function () {
            eng.begin();
            root = null;
            draw();
            say('Tree cleared. Insert a few values to rebuild it.');
        });
    }

    /* ============================================================
       HASH TABLE — hashing, chaining, collisions, load factor
       ============================================================ */
    function hashViz(host) {
        var eng = new Engine(host);
        var SIZE = 7;
        var buckets = [];
        function reset() { buckets = []; for (var i = 0; i < SIZE; i++) buckets.push([]); }

        var ui = frame(host,
            '<input class="viz-input" data-i="key" placeholder="key" value="cat">' +
            num('value', 'value', 9) +
            btn('put', '＋ Put', 'btn') +
            btn('get', '⌕ Get') +
            btn('del', '− Delete') +
            btn('collide', '💥 Force a collision') +
            btn('clear', '↻ Clear') + speedCtl());

        function hash(key) {
            var hv = 0;
            for (var i = 0; i < key.length; i++) hv = (hv * 31 + key.charCodeAt(i)) % SIZE;
            return hv;
        }
        function hashSteps(key) {
            var hv = 0, steps = [];
            for (var i = 0; i < key.length; i++) {
                hv = (hv * 31 + key.charCodeAt(i)) % SIZE;
                steps.push('(' + (i ? 'h' : '0') + ' × 31 + ' + key.charCodeAt(i) + ') % ' + SIZE + ' = ' + hv);
            }
            return { index: hv, steps: steps };
        }
        function entries() { return buckets.reduce(function (n, b) { return n + b.length; }, 0); }

        function draw(marks) {
            marks = marks || {};
            var lf = (entries() / SIZE).toFixed(2);
            ui.stage.innerHTML =
                '<div class="hash-table">' + buckets.map(function (chain, i) {
                    var cls = 'hash-bucket' + (marks.bucket === i ? ' hit' : '') +
                        (chain.length > 1 ? ' collided' : '');
                    return '<div class="' + cls + '">' +
                        '<span class="hb-idx">' + i + '</span>' +
                        (chain.length
                            ? chain.map(function (e) {
                                return '<span class="hb-entry' + (marks.key === e[0] ? ' found' : '') + '">' +
                                    e[0] + ' : ' + e[1] + '</span>';
                            }).join('<span class="arrow">→</span>')
                            : '<span class="hb-empty">empty</span>') +
                        '</div>';
                }).join('') + '</div>' +
                '<div class="hash-meta mono">buckets = ' + SIZE + ' · entries = ' + entries() +
                ' · load factor α = ' + lf + (lf > 0.75 ? ' ⚠ resize time' : '') + '</div>';
        }
        function say(m) { ui.log.innerHTML = m; }

        reset();
        [['cat', 9], ['dog', 4]].forEach(function (e) { buckets[hash(e[0])].push([e[0], e[1]]); });
        draw();
        wireSpeed(host, eng);

        on(host, 'put', function () {
            var t = eng.begin();
            var key = val(host, 'key') || 'key';
            var value = val(host, 'value') || '1';
            (async function () {
                var hs = hashSteps(key);
                for (var i = 0; i < hs.steps.length; i++) {
                    if (!eng.alive(t)) return;
                    say('Hashing "<b>' + key + '</b>" — char <b>' + key[i] + '</b>: ' + hs.steps[i]);
                    await eng.wait(430);
                }
                if (!eng.alive(t)) return;
                var idx = hs.index;
                draw({ bucket: idx });
                say('hash("<b>' + key + '</b>") = <b>' + idx + '</b> — jumping straight to that bucket, no scanning. <b>O(1)</b>');
                await eng.wait(560);
                if (!eng.alive(t)) return;

                var chain = buckets[idx];
                var existing = -1;
                chain.forEach(function (e, i) { if (e[0] === key) existing = i; });

                if (existing > -1) {
                    chain[existing][1] = value;
                    draw({ bucket: idx, key: key });
                    say('Key "<b>' + key + '</b>" already existed in bucket <b>' + idx + '</b> — its value was overwritten with <b>' + value + '</b>. One value per key, always.');
                } else {
                    var collided = chain.length > 0;
                    chain.push([key, value]);
                    draw({ bucket: idx, key: key });
                    say(collided
                        ? '💥 <b>Collision</b> in bucket <b>' + idx + '</b> — separate chaining appends "<b>' + key + '</b>" to the list. Lookups in this bucket now cost a short scan.'
                        : 'Stored "<b>' + key + '</b>" : <b>' + value + '</b> in bucket <b>' + idx + '</b>. <b>O(1)</b> average');
                }
            })();
        });

        on(host, 'get', function () {
            var t = eng.begin();
            var key = val(host, 'key') || 'key';
            (async function () {
                var idx = hash(key);
                draw({ bucket: idx });
                say('hash("<b>' + key + '</b>") = <b>' + idx + '</b> — only bucket ' + idx + ' can hold it, so nothing else is even looked at.');
                await eng.wait(620);
                if (!eng.alive(t)) return;
                var chain = buckets[idx];
                for (var i = 0; i < chain.length; i++) {
                    if (!eng.alive(t)) return;
                    say('Scanning the chain in bucket <b>' + idx + '</b> — comparing "<b>' + chain[i][0] + '</b>" with "<b>' + key + '</b>"');
                    await eng.wait(430);
                    if (chain[i][0] === key) {
                        draw({ bucket: idx, key: key });
                        return say('Found <b>' + key + '</b> = <b>' + chain[i][1] + '</b> in <b>' + (i + 1) + '</b> comparison(s). <b>O(1)</b> average, <b>O(n)</b> if every key collided.');
                    }
                }
                if (eng.alive(t)) say('"<b>' + key + '</b>" is not in bucket <b>' + idx + '</b>, so it is not in the table at all. That is the whole trick.');
            })();
        });

        on(host, 'del', function () {
            eng.begin();
            var key = val(host, 'key') || 'key';
            var idx = hash(key);
            var before = buckets[idx].length;
            buckets[idx] = buckets[idx].filter(function (e) { return e[0] !== key; });
            draw({ bucket: idx });
            say(before === buckets[idx].length
                ? '"<b>' + key + '</b>" was not in bucket <b>' + idx + '</b> — nothing to delete.'
                : 'Deleted "<b>' + key + '</b>" from bucket <b>' + idx + '</b>. <b>O(1)</b> average');
        });

        on(host, 'collide', function () {
            eng.begin();
            var target = hash(val(host, 'key') || 'cat');
            var found = null;
            var alphabet = 'abcdefghijklmnopqrstuvwxyz';
            for (var i = 0; i < alphabet.length && !found; i++) {
                for (var j = 0; j < alphabet.length && !found; j++) {
                    var cand = alphabet[i] + alphabet[j] + 'x';
                    if (hash(cand) === target && !buckets[target].some(function (e) { return e[0] === cand; })) found = cand;
                }
            }
            if (!found) return say('Could not synthesise a colliding key this time — try another key.');
            buckets[target].push([found, Math.floor(Math.random() * 90 + 10)]);
            draw({ bucket: target, key: found });
            say('💥 "<b>' + found + '</b>" hashes to <b>' + target + '</b> as well — two different keys, one bucket. ' +
                'Chaining keeps both in a list; open addressing would probe forward to the next free slot instead.');
        });

        on(host, 'clear', function () {
            eng.begin();
            reset();
            draw();
            say('Table cleared — all ' + SIZE + ' buckets empty, α = 0.');
        });
    }

    /* ============================================================
       GRAPH — BFS / DFS with a live queue / stack readout
       ============================================================ */
    function graphViz(host) {
        var eng = new Engine(host);

        var NODES = [
            { id: 'A', x: 60, y: 40 }, { id: 'B', x: 190, y: 30 }, { id: 'C', x: 320, y: 55 },
            { id: 'D', x: 105, y: 150 }, { id: 'E', x: 240, y: 145 }, { id: 'F', x: 370, y: 165 },
            { id: 'G', x: 175, y: 245 }
        ];
        var EDGES = [['A', 'B'], ['A', 'D'], ['B', 'C'], ['B', 'E'], ['C', 'F'], ['D', 'E'], ['D', 'G'], ['E', 'F'], ['E', 'G']];

        var adj = {};
        NODES.forEach(function (n) { adj[n.id] = []; });
        EDGES.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
        Object.keys(adj).forEach(function (k) { adj[k].sort(); });

        var ui = frame(host,
            '<input class="viz-input" data-i="start" placeholder="start" value="A">' +
            btn('bfs', '🌊 BFS traversal', 'btn') +
            btn('dfs', '🔽 DFS traversal') +
            btn('path', '🛣 Shortest path to G') +
            btn('reset', '↻ Reset') + speedCtl());

        function draw(state) {
            state = state || {};
            var visited = state.visited || {}, active = state.active, frontier = state.frontier || [];
            var svg = '<svg class="graph-svg" viewBox="0 0 430 290" preserveAspectRatio="xMidYMid meet">';
            EDGES.forEach(function (e) {
                var a = NODES.filter(function (n) { return n.id === e[0]; })[0];
                var b = NODES.filter(function (n) { return n.id === e[1]; })[0];
                var used = state.tree && state.tree.some(function (t) {
                    return (t[0] === e[0] && t[1] === e[1]) || (t[0] === e[1] && t[1] === e[0]);
                });
                svg += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y +
                    '" class="graph-edge' + (used ? ' used' : '') + '"/>';
            });
            NODES.forEach(function (n) {
                var cls = 'graph-node';
                if (n.id === active) cls += ' active';
                else if (visited[n.id]) cls += ' visited';
                else if (frontier.indexOf(n.id) > -1) cls += ' queued';
                svg += '<g class="' + cls + '">' +
                    '<circle cx="' + n.x + '" cy="' + n.y + '" r="21"/>' +
                    '<text x="' + n.x + '" y="' + (n.y + 5) + '" text-anchor="middle">' + n.id + '</text></g>';
            });
            svg += '</svg>';

            ui.stage.innerHTML = svg +
                '<div class="graph-side">' +
                '<div class="gs-box"><h5>' + (state.structure || 'Structure') + '</h5><div class="gs-items mono">' +
                (frontier.length ? frontier.map(function (x) { return '<span>' + x + '</span>'; }).join('') : '<em>empty</em>') +
                '</div></div>' +
                '<div class="gs-box"><h5>Visit order</h5><div class="gs-items mono">' +
                ((state.order && state.order.length) ? state.order.map(function (x) { return '<span class="done">' + x + '</span>'; }).join('') : '<em>none yet</em>') +
                '</div></div>' +
                '<div class="gs-box"><h5>Adjacency list</h5><div class="gs-adj mono">' +
                Object.keys(adj).map(function (k) { return k + ' → ' + adj[k].join(', '); }).join('<br>') +
                '</div></div></div>';
        }
        function say(m) { ui.log.innerHTML = m; }

        draw();
        wireSpeed(host, eng);

        function startNode() {
            var s = (val(host, 'start') || 'A').toUpperCase();
            return adj[s] ? s : 'A';
        }

        on(host, 'bfs', function () {
            var t = eng.begin();
            var start = startNode();
            (async function () {
                var visited = {}, queue = [start], order = [], tree = [];
                visited[start] = true;
                draw({ visited: {}, frontier: queue.slice(), order: order, structure: 'Queue (FIFO)', tree: tree });
                say('BFS starts by enqueueing <b>' + start + '</b> and marking it visited <em>on enqueue</em> — mark late and duplicates pile up.');
                await eng.wait(760);

                while (queue.length) {
                    if (!eng.alive(t)) return;
                    var node = queue.shift();
                    order.push(node);
                    draw({ visited: visited, active: node, frontier: queue.slice(), order: order, structure: 'Queue (FIFO)', tree: tree });
                    say('Dequeued <b>' + node + '</b> from the front — BFS always takes the <b>oldest</b> waiting node, which is what makes it explore level by level.');
                    await eng.wait(700);

                    for (var i = 0; i < adj[node].length; i++) {
                        if (!eng.alive(t)) return;
                        var nb = adj[node][i];
                        if (!visited[nb]) {
                            visited[nb] = true;
                            queue.push(nb);
                            tree.push([node, nb]);
                            draw({ visited: visited, active: node, frontier: queue.slice(), order: order, structure: 'Queue (FIFO)', tree: tree });
                            say('Neighbour <b>' + nb + '</b> is new → mark visited and enqueue at the rear. Queue: <b>[' + queue.join(', ') + ']</b>');
                            await eng.wait(500);
                        }
                    }
                }
                if (eng.alive(t)) {
                    draw({ visited: visited, order: order, structure: 'Queue (FIFO)', tree: tree });
                    say('BFS order: <b>' + order.join(' → ') + '</b> · every vertex once, every edge once → <b>O(V+E)</b>. The highlighted edges form the BFS tree, and each path in it is a <b>shortest</b> path.');
                }
            })();
        });

        on(host, 'dfs', function () {
            var t = eng.begin();
            var start = startNode();
            (async function () {
                var visited = {}, stack = [start], order = [], tree = [], parent = {};
                draw({ visited: {}, frontier: stack.slice(), order: order, structure: 'Stack (LIFO)', tree: tree });
                say('DFS pushes <b>' + start + '</b> onto a stack. Swap the queue for a stack and breadth-first becomes depth-first — that is the only difference.');
                await eng.wait(760);

                while (stack.length) {
                    if (!eng.alive(t)) return;
                    var node = stack.pop();
                    if (visited[node]) continue;
                    visited[node] = true;
                    order.push(node);
                    if (parent[node]) tree.push([parent[node], node]);
                    draw({ visited: visited, active: node, frontier: stack.slice(), order: order, structure: 'Stack (LIFO)', tree: tree });
                    say('Popped <b>' + node + '</b> from the top — DFS always takes the <b>newest</b> node, so it dives deep before backtracking.');
                    await eng.wait(700);

                    var nbrs = adj[node].slice().reverse();
                    for (var i = 0; i < nbrs.length; i++) {
                        if (!eng.alive(t)) return;
                        if (!visited[nbrs[i]]) {
                            stack.push(nbrs[i]);
                            parent[nbrs[i]] = node;
                            draw({ visited: visited, active: node, frontier: stack.slice(), order: order, structure: 'Stack (LIFO)', tree: tree });
                            say('Pushed neighbour <b>' + nbrs[i] + '</b>. Stack: <b>[' + stack.join(', ') + ']</b> — the last one pushed is explored first.');
                            await eng.wait(430);
                        }
                    }
                }
                if (eng.alive(t)) {
                    draw({ visited: visited, order: order, structure: 'Stack (LIFO)', tree: tree });
                    say('DFS order: <b>' + order.join(' → ') + '</b> · also <b>O(V+E)</b>, but the paths it finds are <em>not</em> shortest. DFS is for connectivity, cycles and topological order.');
                }
            })();
        });

        on(host, 'path', function () {
            var t = eng.begin();
            var start = startNode(), goal = 'G';
            (async function () {
                var prev = {}, dist = {}, queue = [start];
                dist[start] = 0;
                while (queue.length) {
                    var u = queue.shift();
                    for (var i = 0; i < adj[u].length; i++) {
                        var v = adj[u][i];
                        if (!(v in dist)) { dist[v] = dist[u] + 1; prev[v] = u; queue.push(v); }
                    }
                }
                if (!(goal in dist)) return say('<b>' + goal + '</b> is unreachable from <b>' + start + '</b>.');

                var path = [goal];
                while (path[0] !== start) path.unshift(prev[path[0]]);

                var visited = {}, tree = [], order = [];
                for (var k = 0; k < path.length; k++) {
                    if (!eng.alive(t)) return;
                    visited[path[k]] = true;
                    order.push(path[k]);
                    if (k) tree.push([path[k - 1], path[k]]);
                    draw({ visited: visited, active: path[k], order: order, frontier: path.slice(k + 1), structure: 'Remaining path', tree: tree });
                    say('Walking the BFS shortest path — step <b>' + (k + 1) + '</b> of <b>' + path.length + '</b>: at <b>' + path[k] + '</b>');
                    await eng.wait(620);
                }
                if (eng.alive(t)) say('Shortest path <b>' + start + ' → ' + goal + '</b> is <b>' + path.join(' → ') +
                    '</b> — <b>' + dist[goal] + '</b> edges. BFS guarantees this on an <em>unweighted</em> graph; add weights and you need Dijkstra.');
            })();
        });

        on(host, 'reset', function () {
            eng.begin();
            draw();
            say('Reset. Change the start vertex and compare how BFS and DFS spread out.');
        });
    }

    /* ---------------- mount bridge ---------------- */
    var builders = window.DSAVizBuilders || {};
    builders.linkedlist = linkedViz;
    builders.trees = treeViz;
    builders.hashtable = hashViz;
    builders.graphs = graphViz;
    window.DSAVizBuilders = builders;

    window.DSAViz = {
        mount: function (topicId) {
            var hosts = Array.prototype.slice.call(document.querySelectorAll('[data-viz]'));
            hosts.forEach(function (host) {
                var kind = host.getAttribute('data-viz') || topicId;
                var build = builders[kind];
                if (build) {
                    try { build(host); }
                    catch (e) {
                        host.innerHTML = '<p class="mono" style="color:var(--o-mid)">Playground failed to start: ' + e.message + '</p>';
                    }
                } else {
                    host.innerHTML = '<p class="mono" style="color:var(--muted)">No playground for “' + kind + '”.</p>';
                }
            });
        }
    };
})();
