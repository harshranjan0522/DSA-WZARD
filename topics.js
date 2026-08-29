/* ============================================================
   DSA WIZARD — Content data layer
   Single source of truth for every page: the topic registry,
   complexity charts, practice sets, cheat sheets and pitfalls.
   Plain global (no ES modules) so the site also runs on file://
   ============================================================ */

window.DSA = window.DSA || {};
var DSA = window.DSA;

/* ---------- 1. TOPIC REGISTRY -------------------------------
   Drives: home cards, navbar dropdown, command palette,
   prev/next pager, cheat-sheet page and progress tracking. */
DSA.topics = [
    {
        id: 'array',
        name: 'Array',
        file: 'array.html',
        icon: '▦',
        tier: 'core',
        tag: 'Contiguous memory · O(1) random access',
        blurb: 'A collection of elements of the same data type stored in contiguous memory locations. Every element is reachable in constant time through its index.',
        stats: { Access: 'O(1)', Search: 'O(n)', Insert: 'O(n)', Delete: 'O(n)' }
    },
    {
        id: 'linkedlist',
        name: 'Linked List',
        file: 'll.html',
        icon: '⛓',
        tier: 'core',
        tag: 'Nodes + pointers · O(1) head insert',
        blurb: 'A linear structure whose order comes from pointers rather than physical placement. Each node stores data plus the address of the next node.',
        stats: { Access: 'O(n)', Search: 'O(n)', Insert: 'O(1)', Delete: 'O(1)' }
    },
    {
        id: 'trees',
        name: 'Trees',
        file: 'trees.html',
        icon: '🌲',
        tier: 'core',
        tag: 'Hierarchical · O(log n) on a balanced BST',
        blurb: 'A hierarchical, non-linear structure of nodes joined by edges, with one root at the top and branches extending down to the leaves.',
        stats: { Access: 'O(log n)', Search: 'O(log n)', Insert: 'O(log n)', Delete: 'O(log n)' }
    },
    {
        id: 'hashtable',
        name: 'Hash Table',
        file: 'hash_table.html',
        icon: '#',
        tier: 'core',
        tag: 'Key → index · O(1) average lookup',
        blurb: 'A structure that runs keys through a hash function to compute an index, giving near-constant-time storage and retrieval of values.',
        stats: { Access: 'N/A', Search: 'O(1)*', Insert: 'O(1)*', Delete: 'O(1)*' }
    },
    {
        id: 'string',
        name: 'String',
        file: 'string.html',
        icon: '“”',
        tier: 'deep',
        tag: 'Character sequence · immutable in many langs',
        blurb: 'A sequence of characters — letters, digits, symbols and spaces — the fundamental way text is represented in a program.',
        stats: { Access: 'O(1)', Search: 'O(n·m)', Insert: 'O(n)', Delete: 'O(n)' }
    },
    {
        id: 'stack',
        name: 'Stack',
        file: 'stack.html',
        icon: '▤',
        tier: 'deep',
        tag: 'LIFO · push/pop in O(1)',
        blurb: 'A linear structure following Last-In First-Out order: the most recently pushed element is the first one popped back out.',
        stats: { Access: 'O(n)', Search: 'O(n)', Insert: 'O(1)', Delete: 'O(1)' }
    },
    {
        id: 'queue',
        name: 'Queue',
        file: 'queue.html',
        icon: '⇉',
        tier: 'deep',
        tag: 'FIFO · enqueue rear, dequeue front',
        blurb: 'A linear structure following First-In First-Out order: elements enter at the rear and leave from the front, exactly like a real queue.',
        stats: { Access: 'O(n)', Search: 'O(n)', Insert: 'O(1)', Delete: 'O(1)' }
    },
    {
        id: 'graphs',
        name: 'Graphs',
        file: 'graphs.html',
        icon: '⬡',
        tier: 'deep',
        tag: 'Vertices + edges · BFS / DFS',
        blurb: 'A non-linear structure of vertices connected by edges, modelling relationships — maps, networks, dependencies and social links.',
        stats: { Access: 'O(1)', Search: 'O(V+E)', Insert: 'O(1)', Delete: 'O(V)' }
    }
];

DSA.topicById = function (id) {
    return DSA.topics.filter(function (t) { return t.id === id; })[0] || null;
};

/* ---------- 2. COMPLEXITY CHARTS ---------------------------- */
DSA.complexity = {
    array: {
        note: 'Static arrays have a fixed capacity; dynamic arrays (vector / ArrayList / list) double their buffer, giving amortised O(1) appends.',
        cols: ['Operation', 'Best', 'Average', 'Worst', 'Space', 'Why'],
        rows: [
            ['Access arr[i]', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Address = base + i × size'],
            ['Linear search', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Every element may need a check'],
            ['Binary search (sorted)', 'O(1)', 'O(log n)', 'O(log n)', 'O(1)', 'Halves the range each step'],
            ['Insert at end', 'O(1)', 'O(1)', 'O(n)', 'O(1)', 'O(n) only when the buffer regrows'],
            ['Insert at begin/middle', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Shift the tail right by one'],
            ['Delete at end', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Just decrement the size'],
            ['Delete at begin/middle', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Shift the tail left by one'],
            ['Sort (comparison)', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(log n)', 'Quicksort degrades on bad pivots']
        ]
    },
    linkedlist: {
        note: 'Singly linked lists walk forward only. A doubly linked list makes tail deletion O(1) at the cost of one extra pointer per node.',
        cols: ['Operation', 'Singly', 'Doubly', 'Circular', 'Space', 'Why'],
        rows: [
            ['Access / index', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'No arithmetic addressing — must walk'],
            ['Search', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'Follow next until match'],
            ['Insert at head', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Re-point head, no shifting'],
            ['Insert at tail', 'O(n)', 'O(1)†', 'O(1)†', 'O(1)', '† with a stored tail pointer'],
            ['Insert at position k', 'O(k)', 'O(k)', 'O(k)', 'O(1)', 'Traverse then relink'],
            ['Delete head', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'head = head.next'],
            ['Delete tail', 'O(n)', 'O(1)†', 'O(1)†', 'O(1)', 'Singly needs the previous node'],
            ['Reverse', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'Three-pointer relink in one pass']
        ]
    },
    trees: {
        note: 'BST bounds assume a reasonably balanced tree. A degenerate (sorted-insert) BST becomes a linked list and every operation drops to O(n) — which is why AVL / Red-Black trees self-balance.',
        cols: ['Operation', 'Balanced BST', 'Skewed BST', 'AVL / RB', 'Space', 'Why'],
        rows: [
            ['Search', 'O(log n)', 'O(n)', 'O(log n)', 'O(1)', 'One comparison per level'],
            ['Insert', 'O(log n)', 'O(n)', 'O(log n)', 'O(1)', 'Descend to a leaf, then attach'],
            ['Delete', 'O(log n)', 'O(n)', 'O(log n)', 'O(1)', 'Find node, splice in successor'],
            ['Find min / max', 'O(log n)', 'O(n)', 'O(log n)', 'O(1)', 'Walk fully left / fully right'],
            ['In-order traversal', 'O(n)', 'O(n)', 'O(n)', 'O(h)', 'Visits every node once'],
            ['Level-order (BFS)', 'O(n)', 'O(n)', 'O(n)', 'O(w)', 'w = widest level'],
            ['Height / depth', 'O(n)', 'O(n)', 'O(n)', 'O(h)', 'Recursion over both subtrees']
        ]
    },
    hashtable: {
        note: 'Average bounds hold while the load factor α = n/buckets stays low (≈0.75) and the hash spreads keys evenly. Worst case is every key colliding into one bucket.',
        cols: ['Operation', 'Best', 'Average', 'Worst', 'Space', 'Why'],
        rows: [
            ['Insert / put', 'O(1)', 'O(1)', 'O(n)', 'O(n)', 'Worst = all keys in one bucket'],
            ['Search / get', 'O(1)', 'O(1)', 'O(n)', 'O(1)', 'Hash, then scan that bucket'],
            ['Delete / remove', 'O(1)', 'O(1)', 'O(n)', 'O(1)', 'Same bucket scan'],
            ['Rehash / resize', 'O(n)', 'O(n)', 'O(n)', 'O(n)', 'Every key re-hashed into a bigger table'],
            ['Iterate all keys', 'O(n+m)', 'O(n+m)', 'O(n+m)', 'O(1)', 'm = bucket count, includes empties'],
            ['Find min / sorted scan', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Hashing destroys ordering']
        ]
    },
    string: {
        note: 'n is the text length, m the pattern length. Strings are immutable in Java/Python/JS — every "edit" allocates a new string, so build with StringBuilder / list-join in loops.',
        cols: ['Operation', 'Best', 'Average', 'Worst', 'Space', 'Why'],
        rows: [
            ['Access s[i]', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Contiguous character buffer'],
            ['Length', 'O(1)', 'O(1)', 'O(n)', 'O(1)', 'O(n) for C-style strlen'],
            ['Concatenate', 'O(m)', 'O(n+m)', 'O(n+m)', 'O(n+m)', 'Immutable ⇒ copy both halves'],
            ['Substring', 'O(1)', 'O(k)', 'O(k)', 'O(k)', 'k = slice length'],
            ['Naive pattern search', 'O(n)', 'O(n·m)', 'O(n·m)', 'O(1)', 'Restart the compare on mismatch'],
            ['KMP pattern search', 'O(n+m)', 'O(n+m)', 'O(n+m)', 'O(m)', 'Prefix table skips re-compares'],
            ['Reverse', 'O(n)', 'O(n)', 'O(n)', 'O(1)/O(n)', 'Two-pointer swap; O(n) if immutable'],
            ['Palindrome check', 'O(1)', 'O(n)', 'O(n)', 'O(1)', 'Compare inwards from both ends'],
            ['Sort characters', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Anagram grouping trick']
        ]
    },
    stack: {
        note: 'All core stack operations are O(1) — the whole point of the structure. An array-backed stack costs one amortised resize; a linked stack never resizes but allocates per node.',
        cols: ['Operation', 'Array-backed', 'Linked', 'Worst', 'Space', 'Why'],
        rows: [
            ['push', 'O(1)*', 'O(1)', 'O(n)*', 'O(1)', '* amortised — O(n) on a resize'],
            ['pop', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Only the top index/pointer moves'],
            ['peek / top', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Read without removing'],
            ['isEmpty / size', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Counter comparison'],
            ['Search a value', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'Must pop or scan through'],
            ['Balanced-bracket scan', 'O(n)', 'O(n)', 'O(n)', 'O(n)', 'One push/pop per character']
        ]
    },
    queue: {
        note: 'A naive array queue that shifts on dequeue is O(n). A circular queue moves the front index instead — that is the whole reason circular queues exist.',
        cols: ['Operation', 'Circular / Linked', 'Naive array', 'Worst', 'Space', 'Why'],
        rows: [
            ['enqueue (rear)', 'O(1)', 'O(1)', 'O(n)', 'O(1)', 'Resize only, on a full array'],
            ['dequeue (front)', 'O(1)', 'O(n)', 'O(1)', 'O(1)', 'Naive version shifts every element'],
            ['peek front / rear', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Index read'],
            ['isEmpty / isFull', 'O(1)', 'O(1)', 'O(1)', 'O(1)', 'Counter comparison'],
            ['Search a value', 'O(n)', 'O(n)', 'O(n)', 'O(1)', 'Linear scan front → rear'],
            ['Priority queue push/pop', 'O(log n)', 'O(n)', 'O(log n)', 'O(n)', 'Binary-heap sift up/down']
        ]
    },
    graphs: {
        note: 'V = vertices, E = edges. Adjacency lists win on sparse graphs (most real ones); adjacency matrices win when you constantly ask "is u adjacent to v?".',
        cols: ['Operation', 'Adjacency list', 'Adjacency matrix', 'Space', 'Notes'],
        rows: [
            ['Store the graph', '—', '—', 'O(V+E) / O(V²)', 'List is far leaner when sparse'],
            ['Add vertex', 'O(1)', 'O(V²)', '—', 'Matrix must be rebuilt'],
            ['Add edge', 'O(1)', 'O(1)', '—', 'Both are cheap'],
            ['Remove edge', 'O(deg V)', 'O(1)', '—', 'List scans the neighbours'],
            ['Check u–v adjacency', 'O(deg V)', 'O(1)', '—', 'Matrix wins outright'],
            ['BFS / DFS traversal', 'O(V+E)', 'O(V²)', 'O(V)', 'Every vertex and edge once'],
            ['Shortest path (Dijkstra + heap)', 'O((V+E) log V)', 'O(V²)', 'O(V)', 'Non-negative weights only'],
            ['Shortest path (unweighted)', 'O(V+E)', 'O(V²)', 'O(V)', 'Plain BFS is enough'],
            ['Cycle detection', 'O(V+E)', 'O(V²)', 'O(V)', 'DFS colours / union-find'],
            ['Topological sort (DAG)', 'O(V+E)', 'O(V²)', 'O(V)', "Kahn's algorithm or DFS finish times"]
        ]
    }
};

/* ---------- 3. PRACTICE SETS (replaces the dead PDF links) --- */
DSA.questions = {
    array: [
        { n: 'Two Sum', lvl: 'easy', url: 'https://leetcode.com/problems/two-sum/', hint: 'Hash map of seen complements' },
        { n: 'Best Time to Buy & Sell Stock', lvl: 'easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', hint: 'Track running minimum' },
        { n: 'Move Zeroes', lvl: 'easy', url: 'https://leetcode.com/problems/move-zeroes/', hint: 'Two pointers, write index' },
        { n: 'Maximum Subarray (Kadane)', lvl: 'medium', url: 'https://leetcode.com/problems/maximum-subarray/', hint: 'Reset the sum when it goes negative' },
        { n: 'Product of Array Except Self', lvl: 'medium', url: 'https://leetcode.com/problems/product-of-array-except-self/', hint: 'Prefix × suffix passes' },
        { n: 'Sort Colors (Dutch flag)', lvl: 'medium', url: 'https://leetcode.com/problems/sort-colors/', hint: 'Three pointers, one pass' },
        { n: 'Merge Intervals', lvl: 'medium', url: 'https://leetcode.com/problems/merge-intervals/', hint: 'Sort by start, extend the end' },
        { n: 'Trapping Rain Water', lvl: 'hard', url: 'https://leetcode.com/problems/trapping-rain-water/', hint: 'Two pointers with max walls' }
    ],
    linkedlist: [
        { n: 'Reverse Linked List', lvl: 'easy', url: 'https://leetcode.com/problems/reverse-linked-list/', hint: 'prev / curr / next relink' },
        { n: 'Merge Two Sorted Lists', lvl: 'easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', hint: 'Dummy head + tail pointer' },
        { n: 'Linked List Cycle', lvl: 'easy', url: 'https://leetcode.com/problems/linked-list-cycle/', hint: "Floyd's slow/fast pointers" },
        { n: 'Middle of the Linked List', lvl: 'easy', url: 'https://leetcode.com/problems/middle-of-the-linked-list/', hint: 'Fast moves two, slow moves one' },
        { n: 'Remove Nth Node From End', lvl: 'medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', hint: 'Gap of n between pointers' },
        { n: 'Add Two Numbers', lvl: 'medium', url: 'https://leetcode.com/problems/add-two-numbers/', hint: 'Carry across nodes' },
        { n: 'Reorder List', lvl: 'medium', url: 'https://leetcode.com/problems/reorder-list/', hint: 'Split, reverse, weave' },
        { n: 'Merge k Sorted Lists', lvl: 'hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', hint: 'Min-heap of list heads' }
    ],
    trees: [
        { n: 'Maximum Depth of Binary Tree', lvl: 'easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', hint: '1 + max(left, right)' },
        { n: 'Invert Binary Tree', lvl: 'easy', url: 'https://leetcode.com/problems/invert-binary-tree/', hint: 'Swap children recursively' },
        { n: 'Same Tree', lvl: 'easy', url: 'https://leetcode.com/problems/same-tree/', hint: 'Compare structure and value' },
        { n: 'Validate Binary Search Tree', lvl: 'medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/', hint: 'Carry (min, max) bounds down' },
        { n: 'Level Order Traversal', lvl: 'medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', hint: 'Queue, one level per loop' },
        { n: 'Lowest Common Ancestor of a BST', lvl: 'medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', hint: 'Walk while both are on one side' },
        { n: 'Kth Smallest Element in a BST', lvl: 'medium', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', hint: 'In-order gives sorted order' },
        { n: 'Binary Tree Maximum Path Sum', lvl: 'hard', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', hint: 'Return gain, track global best' }
    ],
    hashtable: [
        { n: 'Contains Duplicate', lvl: 'easy', url: 'https://leetcode.com/problems/contains-duplicate/', hint: 'Set size vs array length' },
        { n: 'Valid Anagram', lvl: 'easy', url: 'https://leetcode.com/problems/valid-anagram/', hint: '26-slot frequency count' },
        { n: 'Two Sum', lvl: 'easy', url: 'https://leetcode.com/problems/two-sum/', hint: 'Store value → index' },
        { n: 'Group Anagrams', lvl: 'medium', url: 'https://leetcode.com/problems/group-anagrams/', hint: 'Sorted word as the key' },
        { n: 'Top K Frequent Elements', lvl: 'medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/', hint: 'Count map + bucket sort' },
        { n: 'Longest Consecutive Sequence', lvl: 'medium', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', hint: 'Start only where n-1 is absent' },
        { n: 'LRU Cache', lvl: 'medium', url: 'https://leetcode.com/problems/lru-cache/', hint: 'Hash map + doubly linked list' },
        { n: 'Subarray Sum Equals K', lvl: 'medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', hint: 'Prefix-sum frequency map' }
    ],
    string: [
        { n: 'Valid Palindrome', lvl: 'easy', url: 'https://leetcode.com/problems/valid-palindrome/', hint: 'Skip non-alphanumerics, two pointers' },
        { n: 'Reverse String', lvl: 'easy', url: 'https://leetcode.com/problems/reverse-string/', hint: 'Swap i and n-1-i' },
        { n: 'Longest Common Prefix', lvl: 'easy', url: 'https://leetcode.com/problems/longest-common-prefix/', hint: 'Shrink the prefix per word' },
        { n: 'Longest Substring Without Repeating', lvl: 'medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', hint: 'Sliding window + last-seen map' },
        { n: 'Longest Palindromic Substring', lvl: 'medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/', hint: 'Expand around each centre' },
        { n: 'String to Integer (atoi)', lvl: 'medium', url: 'https://leetcode.com/problems/string-to-integer-atoi/', hint: 'Sign, digits, overflow clamp' },
        { n: 'Minimum Window Substring', lvl: 'hard', url: 'https://leetcode.com/problems/minimum-window-substring/', hint: 'Window with a need counter' },
        { n: 'Implement strStr / KMP', lvl: 'medium', url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/', hint: 'Prefix table avoids re-scans' }
    ],
    stack: [
        { n: 'Valid Parentheses', lvl: 'easy', url: 'https://leetcode.com/problems/valid-parentheses/', hint: 'Push openers, match on close' },
        { n: 'Min Stack', lvl: 'medium', url: 'https://leetcode.com/problems/min-stack/', hint: 'Second stack of running minima' },
        { n: 'Evaluate Reverse Polish Notation', lvl: 'medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', hint: 'Pop two, apply, push back' },
        { n: 'Daily Temperatures', lvl: 'medium', url: 'https://leetcode.com/problems/daily-temperatures/', hint: 'Monotonic decreasing stack' },
        { n: 'Next Greater Element I', lvl: 'easy', url: 'https://leetcode.com/problems/next-greater-element-i/', hint: 'Monotonic stack + map' },
        { n: 'Generate Parentheses', lvl: 'medium', url: 'https://leetcode.com/problems/generate-parentheses/', hint: 'Backtracking uses the call stack' },
        { n: 'Largest Rectangle in Histogram', lvl: 'hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', hint: 'Increasing-height stack' },
        { n: 'Implement Queue using Stacks', lvl: 'easy', url: 'https://leetcode.com/problems/implement-queue-using-stacks/', hint: 'In-stack + out-stack' }
    ],
    queue: [
        { n: 'Implement Stack using Queues', lvl: 'easy', url: 'https://leetcode.com/problems/implement-stack-using-queues/', hint: 'Rotate after each push' },
        { n: 'Number of Recent Calls', lvl: 'easy', url: 'https://leetcode.com/problems/number-of-recent-calls/', hint: 'Drop stale timestamps from the front' },
        { n: 'Design Circular Queue', lvl: 'medium', url: 'https://leetcode.com/problems/design-circular-queue/', hint: 'Modulo arithmetic on indices' },
        { n: 'Rotting Oranges', lvl: 'medium', url: 'https://leetcode.com/problems/rotting-oranges/', hint: 'Multi-source BFS by minute' },
        { n: 'Walls and Gates', lvl: 'medium', url: 'https://leetcode.com/problems/walls-and-gates/', hint: 'BFS out from every gate at once' },
        { n: 'Task Scheduler', lvl: 'medium', url: 'https://leetcode.com/problems/task-scheduler/', hint: 'Max-heap + cooldown queue' },
        { n: 'Sliding Window Maximum', lvl: 'hard', url: 'https://leetcode.com/problems/sliding-window-maximum/', hint: 'Monotonic deque of indices' },
        { n: 'Kth Largest Element in a Stream', lvl: 'easy', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', hint: 'Min-heap of size k' }
    ],
    graphs: [
        { n: 'Number of Islands', lvl: 'medium', url: 'https://leetcode.com/problems/number-of-islands/', hint: 'Flood fill each unvisited land cell' },
        { n: 'Clone Graph', lvl: 'medium', url: 'https://leetcode.com/problems/clone-graph/', hint: 'Map original → copy while you DFS' },
        { n: 'Course Schedule', lvl: 'medium', url: 'https://leetcode.com/problems/course-schedule/', hint: 'Cycle detection on a DAG' },
        { n: 'Pacific Atlantic Water Flow', lvl: 'medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', hint: 'DFS inward from both oceans' },
        { n: 'Rotting Oranges', lvl: 'medium', url: 'https://leetcode.com/problems/rotting-oranges/', hint: 'BFS level = one minute' },
        { n: 'Network Delay Time', lvl: 'medium', url: 'https://leetcode.com/problems/network-delay-time/', hint: 'Dijkstra with a min-heap' },
        { n: 'Word Ladder', lvl: 'hard', url: 'https://leetcode.com/problems/word-ladder/', hint: 'BFS over one-letter mutations' },
        { n: 'Alien Dictionary', lvl: 'hard', url: 'https://leetcode.com/problems/alien-dictionary/', hint: 'Topological sort of letters' }
    ]
};

/* ---------- 4. CHEAT SHEETS (printable, in-page) ------------- */
DSA.cheatsheet = {
    array: [
        { h: 'Declare', rows: [['C++', 'int a[5] = {1,2,3,4,5};  vector<int> v{1,2,3};'], ['Java', 'int[] a = {1,2,3};  List<Integer> l = new ArrayList<>();'], ['Python', 'a = [1, 2, 3]'], ['JS', 'const a = [1, 2, 3];']] },
        { h: 'Append', rows: [['C++', 'v.push_back(x);'], ['Java', 'l.add(x);'], ['Python', 'a.append(x)'], ['JS', 'a.push(x)']] },
        { h: 'Insert at i', rows: [['C++', 'v.insert(v.begin()+i, x);'], ['Java', 'l.add(i, x);'], ['Python', 'a.insert(i, x)'], ['JS', 'a.splice(i, 0, x)']] },
        { h: 'Delete at i', rows: [['C++', 'v.erase(v.begin()+i);'], ['Java', 'l.remove(i);'], ['Python', 'del a[i]  /  a.pop(i)'], ['JS', 'a.splice(i, 1)']] },
        { h: 'Sort', rows: [['C++', 'sort(v.begin(), v.end());'], ['Java', 'Arrays.sort(a);'], ['Python', 'a.sort()  /  sorted(a)'], ['JS', 'a.sort((x,y) => x - y)']] },
        { h: 'Search', rows: [['C++', 'find(v.begin(), v.end(), x);  binary_search(...)'], ['Java', 'Arrays.binarySearch(a, x);'], ['Python', 'x in a  /  bisect.bisect_left(a, x)'], ['JS', 'a.indexOf(x)  /  a.includes(x)']] },
        { h: 'Reverse', rows: [['C++', 'reverse(v.begin(), v.end());'], ['Java', 'Collections.reverse(l);'], ['Python', 'a.reverse()  /  a[::-1]'], ['JS', 'a.reverse()']] },
        { h: 'Two-pointer template', rows: [['Pattern', 'i = 0, j = n-1; while (i < j) { ...; i++ or j--; }'], ['Use for', 'pair sums on sorted data, palindromes, partitioning']] },
        { h: 'Sliding window', rows: [['Pattern', 'for r in 0..n-1: add(r); while invalid: remove(l++); best = max(best, r-l+1)'], ['Use for', 'longest/shortest subarray under a constraint']] }
    ],
    linkedlist: [
        { h: 'Node', rows: [['C++', 'struct Node { int data; Node* next; };'], ['Java', 'class Node { int data; Node next; }'], ['Python', 'class Node: __init__(self, d): self.data, self.next = d, None'], ['JS', 'class Node { constructor(d){ this.data = d; this.next = null; } }']] },
        { h: 'Insert head', rows: [['Steps', 'n.next = head; head = n;'], ['Cost', 'O(1) — never shifts anything']] },
        { h: 'Insert tail', rows: [['Steps', 'walk to last (next == null), then last.next = n'], ['Cost', 'O(n), or O(1) with a tail pointer']] },
        { h: 'Delete a node', rows: [['Steps', 'prev.next = cur.next; free(cur);'], ['Trap', 'always keep prev, and null-check cur']] },
        { h: 'Reverse (iterative)', rows: [['Steps', 'prev=null; while(cur){ nxt=cur.next; cur.next=prev; prev=cur; cur=nxt; } head=prev;'], ['Cost', 'O(n) time · O(1) space']] },
        { h: 'Cycle detect (Floyd)', rows: [['Steps', 'slow=slow.next; fast=fast.next.next; cycle ⟺ slow == fast'], ['Cost', 'O(n) time · O(1) space']] },
        { h: 'Middle node', rows: [['Steps', 'fast two steps, slow one — slow lands on the middle']] },
        { h: 'Dummy-head trick', rows: [['Pattern', 'dummy = Node(0); tail = dummy; ... return dummy.next;'], ['Use for', 'merges and deletions — removes head special-casing']] }
    ],
    trees: [
        { h: 'Node', rows: [['C++', 'struct Node { int val; Node *left, *right; };'], ['Python', 'class Node: self.val, self.left, self.right']] },
        { h: 'BST insert', rows: [['Rule', 'val < node ⇒ go left, else go right; attach at the first empty slot'], ['Cost', 'O(h) — O(log n) balanced, O(n) skewed']] },
        { h: 'BST search', rows: [['Rule', 'compare, then discard half the tree each step'], ['Cost', 'O(h)']] },
        { h: 'Traversals', rows: [['In-order', 'left → node → right  ⇒ sorted output for a BST'], ['Pre-order', 'node → left → right  ⇒ copy / serialise a tree'], ['Post-order', 'left → right → node  ⇒ delete / evaluate bottom-up'], ['Level-order', 'queue-driven BFS, one level per iteration']] },
        { h: 'Height', rows: [['Recurrence', 'h(node) = 1 + max(h(left), h(right)), h(null) = -1'], ['Cost', 'O(n)']] },
        { h: 'Min / Max in a BST', rows: [['Min', 'keep going left'], ['Max', 'keep going right']] },
        { h: 'Delete (3 cases)', rows: [['Leaf', 'just detach it'], ['One child', 'link the parent straight to that child'], ['Two children', 'copy the in-order successor, then delete the successor']] },
        { h: 'Key terms', rows: [['Root / Leaf', 'topmost node · node with no children'], ['Height vs Depth', 'height = down to the deepest leaf · depth = up to the root'], ['Complete vs Full', 'all levels filled left-to-right · every node has 0 or 2 children']] }
    ],
    hashtable: [
        { h: 'Built-in maps', rows: [['C++', 'unordered_map<string,int> m;  m["a"] = 1;'], ['Java', 'Map<String,Integer> m = new HashMap<>();  m.put("a", 1);'], ['Python', 'm = {}  /  m = defaultdict(int)  /  Counter(list)'], ['JS', 'const m = new Map();  m.set("a", 1);  // or {}']] },
        { h: 'Lookup safely', rows: [['C++', 'if (m.count(k)) ...   // [] inserts a default!'], ['Java', 'm.getOrDefault(k, 0)'], ['Python', 'm.get(k, 0)'], ['JS', 'm.has(k) ? m.get(k) : 0']] },
        { h: 'Hash function', rows: [['Division', 'index = hash(key) % tableSize  (prime size spreads better)'], ['Rule', 'same key ⇒ same index, always; spread keys evenly']] },
        { h: 'Collision handling', rows: [['Chaining', 'each bucket holds a list — simple, degrades gracefully'], ['Linear probing', 'try i+1, i+2 … — cache-friendly, suffers clustering'], ['Quadratic probing', 'try i+1², i+2² … — fewer clusters'], ['Double hashing', 'step size from a second hash — best spread']] },
        { h: 'Load factor', rows: [['α', 'α = entries / buckets'], ['Resize', 'when α > 0.75, double the table and rehash everything']] },
        { h: 'Frequency-count template', rows: [['Pattern', 'for x in data: freq[x] = freq.get(x, 0) + 1'], ['Use for', 'anagrams, duplicates, top-k, first unique']] }
    ],
    string: [
        { h: 'Length / access', rows: [['C++', 's.size();  s[i]'], ['Java', 's.length();  s.charAt(i)'], ['Python', 'len(s);  s[i]'], ['JS', 's.length;  s[i]']] },
        { h: 'Build in a loop', rows: [['C++', 's += c;   // std::string is mutable'], ['Java', 'StringBuilder sb; sb.append(c); sb.toString();'], ['Python', 'parts = []; parts.append(c); "".join(parts)'], ['JS', 'const parts = []; parts.push(c); parts.join("")']] },
        { h: 'Reverse', rows: [['C++', 'reverse(s.begin(), s.end());'], ['Java', 'new StringBuilder(s).reverse().toString();'], ['Python', 's[::-1]'], ['JS', 's.split("").reverse().join("")']] },
        { h: 'Split / join', rows: [['Python', 's.split(" ")  ·  " ".join(list)'], ['Java', 's.split(" ")  ·  String.join(" ", list)'], ['JS', 's.split(" ")  ·  arr.join(" ")']] },
        { h: 'Case & trim', rows: [['Python', 's.lower()  s.upper()  s.strip()'], ['Java', 's.toLowerCase()  s.trim()'], ['JS', 's.toLowerCase()  s.trim()']] },
        { h: 'Palindrome', rows: [['Pattern', 'i=0, j=n-1; while(i<j) if(s[i++] != s[j--]) return false;'], ['Cost', 'O(n) time · O(1) space']] },
        { h: 'Char frequency', rows: [['Pattern', 'int freq[26]; freq[c - "a"]++;'], ['Use for', 'anagram checks, first unique character']] },
        { h: 'Immutability', rows: [['Java / Python / JS', 'strings are immutable — every edit allocates a new one'], ['C++', 'std::string is mutable in place']] }
    ],
    stack: [
        { h: 'Built-in stacks', rows: [['C++', 'stack<int> st;  st.push(x); st.pop(); st.top();'], ['Java', 'Deque<Integer> st = new ArrayDeque<>();  st.push(x); st.pop(); st.peek();'], ['Python', 'st = []  ·  st.append(x)  ·  st.pop()  ·  st[-1]'], ['JS', 'const st = [];  st.push(x);  st.pop();  st.at(-1)']] },
        { h: 'Core operations', rows: [['push(x)', 'add on top — O(1)'], ['pop()', 'remove and return the top — O(1)'], ['peek()', 'read the top without removing — O(1)'], ['isEmpty()', 'top == -1 (array) or size == 0 — O(1)']] },
        { h: 'Array implementation', rows: [['State', 'arr[capacity], top = -1'], ['push', 'if (top == cap-1) overflow; else arr[++top] = x;'], ['pop', 'if (top == -1) underflow; else return arr[top--];']] },
        { h: 'Balanced brackets', rows: [['Pattern', 'opener ⇒ push; closer ⇒ stack empty or mismatch ⇒ false; end ⇒ stack must be empty']] },
        { h: 'Monotonic stack', rows: [['Pattern', 'while (st && arr[st.top()] < arr[i]) resolve(st.pop()); st.push(i);'], ['Use for', 'next greater element, daily temperatures, histogram area']] },
        { h: 'Where stacks already run', rows: [['Call stack', 'every function call and return, and all recursion'], ['Undo / Redo', 'two stacks, one per direction'], ['Back button', 'browser history'], ['Expression eval', 'infix → postfix, then evaluate']] }
    ],
    queue: [
        { h: 'Built-in queues', rows: [['C++', 'queue<int> q;  q.push(x); q.pop(); q.front();'], ['Java', 'Queue<Integer> q = new LinkedList<>();  q.offer(x); q.poll(); q.peek();'], ['Python', 'from collections import deque; q = deque(); q.append(x); q.popleft()'], ['JS', 'const q = [];  q.push(x);  q.shift();   // O(n) shift — use an index instead']] },
        { h: 'Core operations', rows: [['enqueue(x)', 'add at the rear — O(1)'], ['dequeue()', 'remove from the front — O(1)'], ['front() / rear()', 'peek at either end — O(1)'], ['isEmpty / isFull', 'counter comparison — O(1)']] },
        { h: 'Circular queue', rows: [['Advance', 'rear = (rear + 1) % capacity'], ['Full', 'size == capacity  (or (rear+1) % cap == front)'], ['Why', 'reuses freed front slots — no O(n) shifting']] },
        { h: 'Variants', rows: [['Circular queue', 'fixed ring buffer, wraps with modulo'], ['Deque', 'insert and remove at both ends'], ['Priority queue', 'highest priority leaves first — heap, O(log n)'], ['Blocking queue', 'producer/consumer hand-off across threads']] },
        { h: 'BFS template', rows: [['Pattern', 'q = [start]; seen = {start}; while q: u = q.popleft(); for v in adj[u]: if v not seen: seen.add(v); q.append(v)'], ['Guarantee', 'first time you reach a node = shortest unweighted path']] },
        { h: 'Where queues already run', rows: [['CPU scheduling', 'round-robin ready queues'], ['Print spooler', 'jobs served in arrival order'], ['Message brokers', 'Kafka / RabbitMQ pipelines'], ['BFS', 'shortest paths and level-order traversal']] }
    ],
    graphs: [
        { h: 'Representations', rows: [['Adjacency list', 'vector<int> adj[V]  ·  {u: [v, w]}  — O(V+E) space'], ['Adjacency matrix', 'int g[V][V]  — O(V²) space, O(1) adjacency test'], ['Edge list', '[(u, v, w), …] — great for Kruskal / union-find']] },
        { h: 'BFS', rows: [['Uses', 'queue + visited set'], ['Gives', 'shortest path in an unweighted graph'], ['Cost', 'O(V+E) time · O(V) space']] },
        { h: 'DFS', rows: [['Uses', 'recursion or an explicit stack'], ['Gives', 'connectivity, cycles, topological order, components'], ['Cost', 'O(V+E) time · O(V) space']] },
        { h: 'Dijkstra', rows: [['Uses', 'min-heap of (dist, node)'], ['Needs', 'non-negative weights'], ['Cost', 'O((V+E) log V)']] },
        { h: 'Other classics', rows: [['Bellman-Ford', 'handles negative edges, detects negative cycles — O(V·E)'], ['Floyd-Warshall', 'all-pairs shortest paths — O(V³)'], ['Kruskal / Prim', 'minimum spanning tree — O(E log E)'], ['Kahn', 'topological sort of a DAG — O(V+E)']] },
        { h: 'Terminology', rows: [['Degree', 'edges touching a vertex (in-degree / out-degree if directed)'], ['Path / Cycle', 'walk with no repeats · path that returns to its start'], ['Connected', 'a route exists between every pair of vertices'], ['DAG', 'directed acyclic graph — the shape dependencies form'], ['Dense vs Sparse', 'E ≈ V² ⇒ matrix · E ≈ V ⇒ list']] },
        { h: 'Grid-as-graph', rows: [['Neighbours', 'dirs = [(1,0),(-1,0),(0,1),(0,-1)]'], ['Guard', '0 <= nr < rows and 0 <= nc < cols and not seen[nr][nc]']] }
    ]
};

/* ---------- 5. PITFALLS / INTERVIEW NOTES ------------------- */
DSA.pitfalls = {
    array: [
        ['Off-by-one on the last index', 'Valid indices are 0 … n-1. Looping to <= n reads memory you do not own.'],
        ['Forgetting the shift cost', 'Inserting or deleting anywhere but the end is O(n) — a loop of those is quietly O(n²).'],
        ['Binary search on unsorted data', 'Binary search is only valid once the array is sorted; otherwise it silently returns wrong answers.'],
        ['Mutating while iterating', 'Removing elements inside a forward loop skips the next element. Iterate backwards or build a new array.'],
        ['Overflow in mid calculation', 'Use mid = low + (high - low) / 2 instead of (low + high) / 2 in fixed-width languages.']
    ],
    linkedlist: [
        ['Losing the rest of the list', 'Save cur.next before you overwrite it, or everything after the current node leaks away.'],
        ['Null dereference on the tail', 'Check cur != null and cur.next != null before following two links (fast-pointer loops especially).'],
        ['Head special-casing', 'Deleting or inserting at the head changes head itself. A dummy node removes the whole branch.'],
        ['Assuming random access', 'list[k] does not exist — reaching index k costs O(k) of walking.'],
        ['Leaking removed nodes', 'In C/C++, free/delete the unlinked node after relinking around it.']
    ],
    trees: [
        ['Sorted inserts create a stick', 'Inserting already-sorted keys into a plain BST yields a linked list — O(n) per operation. Balance it.'],
        ['Checking only the parent in BST validation', 'A node must beat the whole ancestor range, not just its parent. Pass (min, max) bounds down.'],
        ['Unbounded recursion depth', 'A deep or skewed tree overflows the call stack — iterate with an explicit stack when depth can be large.'],
        ['Height vs depth confusion', 'Height counts downward to the deepest leaf; depth counts upward to the root.'],
        ['Deleting a two-child node wrongly', 'Replace it with its in-order successor (or predecessor), then delete that node instead.']
    ],
    hashtable: [
        ['C++ operator[] inserts', 'm[k] on a missing key creates it with a default value. Use m.count(k) or m.find(k) to test.'],
        ['Mutable keys', 'Mutating a key after insertion changes its hash — the entry becomes unreachable.'],
        ['Expecting an order', 'Hash tables have no ordering. Sort the keys, or use a tree/ordered map when order matters.'],
        ['Bad hash ⇒ O(n)', 'If every key lands in one bucket the table degrades to a linked list. Use a prime table size and a good mix.'],
        ['Iterating during resize', 'Inserting while iterating can rehash the table and invalidate iterators.']
    ],
    string: [
        ['Concatenating in a loop', 'Immutable strings copy on every +=, making the loop O(n²). Use StringBuilder / join.'],
        ['Assuming 1 char = 1 byte', 'Unicode and emoji are multi-byte; index arithmetic on raw bytes cuts characters in half.'],
        ['== vs .equals in Java', '== compares references. Always use .equals() for string content.'],
        ['Forgetting the null terminator', 'A C-style char[n] holding n characters has no room for the trailing \\0.'],
        ['Case and whitespace', 'Normalise with lower() and trim() before comparing user input.']
    ],
    stack: [
        ['Popping an empty stack', 'Always test isEmpty() first — underflow is the classic crash.'],
        ['Overflowing a fixed array', 'A static stack must check top == capacity - 1 before pushing.'],
        ['Unbounded recursion', 'Deep recursion overflows the real call stack; convert to an explicit stack loop.'],
        ['Peek vs pop', 'peek() reads, pop() removes. Mixing them up eats data you still needed.'],
        ['Wrong tool for FIFO', 'If you need first-in-first-out order, that is a queue — a stack reverses it.']
    ],
    queue: [
        ['Shifting an array on dequeue', 'Removing the front by shifting is O(n). Use a circular buffer or a deque.'],
        ['Array.shift() in JS', 'shift() is O(n). For large queues, keep a head index or use a linked deque.'],
        ['Wrap-around off-by-one', 'Always advance with (i + 1) % capacity, and track size to tell full from empty.'],
        ['Full vs empty ambiguity', 'front == rear can mean both in a ring buffer — keep an explicit size counter.'],
        ['Forgetting the visited set in BFS', 'Without it, cycles re-enqueue nodes forever.']
    ],
    graphs: [
        ['No visited set', 'Any cycle turns BFS/DFS into an infinite loop.'],
        ['Marking visited too late', 'Mark on enqueue, not on dequeue, or duplicates pile into the queue.'],
        ['Directed vs undirected', 'An undirected edge must be added both ways: adj[u].add(v) and adj[v].add(u).'],
        ['Dijkstra with negative weights', 'It is invalid there — use Bellman-Ford instead.'],
        ['Assuming one component', 'Loop every vertex as a possible start; the graph may be disconnected.'],
        ['Recursive DFS on huge graphs', 'Stack depth is O(V) — switch to an iterative stack.']
    ]
};

/* ---------- 6. FEATURE HIGHLIGHTS --------------------------- */
DSA.features = {
    array: [
        ['◈', 'Homogeneous', 'Every element shares one data type, so every slot is the same width.'],
        ['⇥', 'Index addressed', 'Position i lives at base + i × sizeof(type) — pure arithmetic.'],
        ['⚡', 'O(1) random access', 'Reaching the 1st or the 10,000th element costs the same.'],
        ['▣', 'Contiguous memory', 'One unbroken block, which is why arrays are so cache-friendly.'],
        ['🔒', 'Fixed size (static)', 'A static array cannot grow; dynamic arrays reallocate and copy.'],
        ['↻', 'Loop friendly', 'A single counter walks the whole structure.'],
        ['⇅', 'Sort & search ready', 'The base for binary search, two-pointer and sliding-window patterns.'],
        ['⊞', 'Multi-dimensional', 'Matrices and grids are just arrays of arrays.']
    ],
    linkedlist: [
        ['⛓', 'Pointer ordered', 'Logical order comes from links, not from memory layout.'],
        ['↔', 'Dynamic size', 'Grows and shrinks node by node with no reallocation.'],
        ['⚡', 'O(1) head insert', 'No shifting — just re-point the head.'],
        ['◌', 'Non-contiguous', 'Nodes live anywhere in the heap; no big contiguous block needed.'],
        ['⇢', 'Sequential access', 'Index k costs O(k) of walking — no random access.'],
        ['＋', 'Pointer overhead', 'Every node pays for its data plus one or two addresses.'],
        ['⟳', 'Circular variants', 'The tail can point back to the head for round-robin traversal.'],
        ['🧩', 'Builds other structures', 'Backs stacks, queues, adjacency lists and hash-table chains.']
    ],
    trees: [
        ['🌲', 'Hierarchical', 'One root, parent-child edges, no cycles.'],
        ['⑂', 'Recursive by nature', 'Every subtree is itself a tree, so recursion fits perfectly.'],
        ['🔎', 'O(log n) when balanced', 'Each comparison discards half the remaining nodes.'],
        ['↕', 'Height driven cost', 'Every operation is O(h) — balance is everything.'],
        ['⇄', 'Ordered output', 'In-order traversal of a BST emits sorted keys for free.'],
        ['⚖', 'Self-balancing kinds', 'AVL and Red-Black trees rotate to keep h ≈ log n.'],
        ['🗂', 'Models real hierarchies', 'File systems, the DOM, org charts, decision trees.'],
        ['∅', 'No cycles', 'n nodes always have exactly n-1 edges.']
    ],
    hashtable: [
        ['#', 'Hash addressed', 'A hash function turns a key straight into a bucket index.'],
        ['⚡', 'O(1) average ops', 'Insert, search and delete are near constant time.'],
        ['🔑', 'Unique keys', 'One value per key; re-inserting a key overwrites it.'],
        ['💥', 'Collision handling', 'Chaining or open addressing resolves shared indices.'],
        ['📊', 'Load factor bound', 'Past α ≈ 0.75 the table resizes and rehashes.'],
        ['🎲', 'Unordered', 'Iteration order is arbitrary — sort if you need order.'],
        ['🧠', 'Space for speed', 'Extra empty buckets are the price of constant-time lookup.'],
        ['🔁', 'Deterministic hash', 'The same key must always hash to the same index.']
    ],
    string: [
        ['“”', 'Character sequence', 'An ordered run of characters with an index per position.'],
        ['⇥', 'Index addressed', 's[0] is the first character, s[n-1] the last.'],
        ['🔒', 'Immutable (most langs)', 'Java, Python and JS allocate a new string on every edit.'],
        ['∅', 'Null terminated in C', "A C string ends at '\\0', which needs its own slot."],
        ['🧰', 'Rich standard library', 'split, join, replace, find, slice, case conversion.'],
        ['🔍', 'Pattern matching', 'Naive scan is O(n·m); KMP and Rabin-Karp do better.'],
        ['🔤', 'Fixed alphabet', 'A 26-slot count array beats a hash map for a-z problems.'],
        ['🌐', 'Unicode aware', 'One visible character can span several code units.']
    ],
    stack: [
        ['▤', 'LIFO order', 'The last element pushed is the first one popped.'],
        ['⚡', 'O(1) push & pop', 'Only the top pointer moves.'],
        ['👆', 'One open end', 'All access happens at the top — no peeking into the middle.'],
        ['🧮', 'Backs recursion', 'The call stack is literally this structure.'],
        ['↩', 'Natural undo', 'Reverse-order history: undo, redo, back button.'],
        ['⚠', 'Overflow / underflow', 'Push on a full array, or pop on an empty stack.'],
        ['🔀', 'Two implementations', 'Array-backed (fast, fixed) or linked (elastic).'],
        ['🧾', 'Expression engine', 'Infix→postfix conversion, evaluation, bracket matching.']
    ],
    queue: [
        ['⇉', 'FIFO order', 'First element in is the first element out.'],
        ['⚡', 'O(1) enqueue & dequeue', 'When implemented circularly or as a linked list.'],
        ['↔', 'Two open ends', 'Rear for insertion, front for removal.'],
        ['⟳', 'Circular buffer', 'Modulo arithmetic reuses the slots freed at the front.'],
        ['🎚', 'Priority variant', 'A heap serves the highest priority first in O(log n).'],
        ['↹', 'Deque variant', 'Insert and remove at both ends.'],
        ['🌐', 'Powers BFS', 'Level-order traversal and shortest paths in unweighted graphs.'],
        ['🖥', 'Systems workhorse', 'CPU scheduling, print spoolers, message brokers.']
    ],
    graphs: [
        ['⬡', 'Vertices + edges', 'Entities and the relationships between them.'],
        ['↔', 'Directed or undirected', 'One-way streets versus mutual friendships.'],
        ['⚖', 'Weighted edges', 'Distance, cost, capacity or time on each connection.'],
        ['⟳', 'Cycles allowed', 'Unlike trees, a route can return to where it started.'],
        ['🧩', 'Two representations', 'Adjacency list for sparse, matrix for dense.'],
        ['🌊', 'BFS & DFS', 'The two traversals every graph algorithm builds on.'],
        ['🛣', 'Shortest paths', 'Dijkstra, Bellman-Ford, Floyd-Warshall.'],
        ['🔗', 'Components', 'A graph can be several disconnected islands.']
    ]
};

/* ---------- 7. TYPE BREAKDOWNS ------------------------------ */
DSA.types = {
    linkedlist: [
        ['Singly Linked List', 'Each node points only to the next one. Lightest on memory, forward traversal only.', 'data | next → data | next → NULL'],
        ['Doubly Linked List', 'Each node keeps next and prev, so you can walk both ways and delete the tail in O(1).', 'NULL ← prev | data | next ⇄ prev | data | next → NULL'],
        ['Circular Linked List', "The tail links back to the head, so traversal never hits NULL — ideal for round-robin.", 'A → B → C → back to A'],
        ['Circular Doubly List', 'Both ends joined in both directions. Backs LRU caches and playlist navigation.', 'A ⇄ B ⇄ C ⇄ back to A']
    ],
    trees: [
        ['General Tree', 'A node may have any number of children. File systems and org charts look like this.', ''],
        ['Binary Tree', 'Every node has at most two children — left and right.', ''],
        ['Binary Search Tree (BST)', 'Left subtree < node < right subtree, which is what makes O(log n) search possible.', ''],
        ['Balanced BST (AVL / Red-Black)', 'Rotates on insert and delete to keep the height around log n.', ''],
        ['Complete Binary Tree', 'Every level filled left to right except possibly the last — the array-friendly shape a heap uses.', ''],
        ['Full Binary Tree', 'Every node has either 0 or exactly 2 children.', ''],
        ['Heap (Min / Max)', 'A complete tree where the parent always beats its children. Backs priority queues.', ''],
        ['Trie (Prefix Tree)', 'Each edge is a character; shared prefixes share a path. Autocomplete and spell-check.', '']
    ],
    stack: [
        ['Array-backed Stack', 'Fixed capacity, one contiguous block, extremely cache-friendly. Must check for overflow.', 'arr[++top] = x'],
        ['Dynamic Stack', 'Array-backed but doubles its capacity when full — amortised O(1) push.', 'vector / ArrayList / list'],
        ['Linked Stack', 'A node per element, so there is no capacity limit; costs one pointer per element.', 'push = insert at head'],
        ['Min / Max Stack', 'Carries a second stack of running extremes so min() stays O(1).', 'mainStack + minStack']
    ],
    queue: [
        ['Simple Queue', 'Plain FIFO. Naive array versions waste the slots freed at the front.', 'enqueue rear · dequeue front'],
        ['Circular Queue', 'Indices wrap with modulo so freed front slots get reused — the fix for the naive version.', 'rear = (rear + 1) % cap'],
        ['Deque (Double-ended)', 'Insert and remove at both ends. Backs sliding-window maximum.', 'pushFront/pushBack · popFront/popBack'],
        ['Priority Queue', 'Order is by priority, not arrival. A binary heap gives O(log n) push and pop.', 'heappush · heappop'],
        ['Blocking Queue', 'Thread-safe hand-off: consumers wait when empty, producers wait when full.', 'producer / consumer']
    ],
    graphs: [
        ['Undirected Graph', 'Edges work both ways — friendship, roads with two-way traffic.', 'A — B'],
        ['Directed Graph (Digraph)', 'Edges have direction — followers, one-way streets, task dependencies.', 'A → B'],
        ['Weighted Graph', 'Each edge carries a cost: distance, latency, price, capacity.', 'A —5→ B'],
        ['Cyclic vs Acyclic', 'A cycle returns to its start. Acyclic directed graphs (DAGs) are what schedulers sort.', 'A → B → C → A'],
        ['Connected / Disconnected', 'Connected means a route exists between every pair; otherwise you have components.', ''],
        ['Complete Graph', 'Every vertex joins every other — V(V-1)/2 edges undirected.', ''],
        ['Tree (special graph)', 'A connected acyclic graph: V vertices, exactly V-1 edges.', ''],
        ['Bipartite Graph', 'Vertices split into two sets with edges only across — matching problems.', '']
    ],
    hashtable: [
        ['Separate Chaining', 'Each bucket holds a linked list (or tree) of entries that hashed there. Simple and forgiving.', 'bucket[i] → (k,v) → (k,v)'],
        ['Linear Probing', 'On a collision, step forward one slot at a time. Cache-friendly but forms clusters.', 'i, i+1, i+2 …'],
        ['Quadratic Probing', 'Steps grow quadratically, which breaks up the clustering of linear probing.', 'i+1², i+2², i+3² …'],
        ['Double Hashing', 'A second hash decides the step size, giving the most even spread.', 'i + j × h2(key)'],
        ['Robin Hood / Cuckoo', 'Entries can displace one another to bound the worst-case probe length.', '']
    ],
    string: [
        ['C-style string', 'A char array terminated by \\0. Mutable, and length costs O(n) to compute.', 'char s[] = "HELLO";'],
        ['std::string (C++)', 'Growable, mutable, O(1) size, rich member functions.', 'string s = "HELLO";'],
        ['Immutable string (Java / Python / JS)', 'Every edit allocates a new object — safe to share, costly in loops.', 's = s + "x" allocates'],
        ['StringBuilder / list-join', 'The mutable buffer you build with inside loops to avoid O(n²).', 'sb.append(c)']
    ],
    array: [
        ['1-D Array', 'A single row of elements — the plain list case.', 'int a[5];'],
        ['2-D Array / Matrix', 'Rows and columns; a grid is just an array of arrays.', 'int g[3][4];'],
        ['Static Array', 'Capacity fixed at compile time, allocated on the stack.', 'int a[100];'],
        ['Dynamic Array', 'Heap-allocated and resizable — doubles its buffer, giving amortised O(1) appends.', 'vector / ArrayList / list'],
        ['Jagged Array', 'An array of arrays whose rows have different lengths.', 'int** rows;']
    ]
};
