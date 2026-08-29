/* ============================================================
   DSA WIZARD — Runnable code library
   Every topic × every core operation × C++ / Java / Python / JS.
   Rendered by the terminal widget in wizard.js.
   ============================================================ */

window.DSA = window.DSA || {};
var DSA = window.DSA;

DSA.code = {

/* ================= ARRAY ================= */
array: { label: 'array.cpp', ops: [
{ id: 'declare', name: 'Declare & Traverse', big: 'O(n)',
cpp: `// Declare, initialise and traverse an array
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int arr[5] = {1, 2, 3, 4, 5};   // static: fixed size
    vector<int> v = {1, 2, 3};      // dynamic: grows on demand

    // arr[i] lives at base + i * sizeof(int)  ->  O(1)
    for (int i = 0; i < 5; i++)
        cout << arr[i] << " ";      // 1 2 3 4 5

    v.push_back(4);                 // amortised O(1)
    cout << "\\nsize = " << v.size();
    return 0;
}`,
java: `// Declare, initialise and traverse an array
import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};          // fixed length
        List<Integer> list = new ArrayList<>(); // dynamic

        for (int i = 0; i < arr.length; i++)
            System.out.print(arr[i] + " ");   // 1 2 3 4 5

        for (int x : arr) System.out.print(x); // for-each

        list.add(4);                           // amortised O(1)
        System.out.println("\\nsize = " + list.size());
    }
}`,
python: `# Python lists ARE dynamic arrays
arr = [1, 2, 3, 4, 5]

for x in arr:                 # value only
    print(x, end=" ")         # 1 2 3 4 5

for i, x in enumerate(arr):   # index + value
    print(i, x)

arr.append(6)                 # amortised O(1)
print(len(arr), arr[-1])      # 6 6  (negative index = from the end)`,
javascript: `// JS arrays are dynamic and can hold mixed types
const arr = [1, 2, 3, 4, 5];

for (let i = 0; i < arr.length; i++) console.log(arr[i]);
arr.forEach((x, i) => console.log(i, x));
for (const x of arr) console.log(x);

arr.push(6);            // add at end      O(1)
console.log(arr.length, arr.at(-1)); // 6 6` },

{ id: 'insert', name: 'Insertion (3 cases)', big: 'O(n)',
cpp: `// Insert at beginning / position / end
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5};

    v.insert(v.begin(), 6);        // at begin  -> shifts all  O(n)
    v.insert(v.begin() + 3, 9);    // at pos 3  -> shifts tail O(n)
    v.push_back(7);                // at end    -> O(1) amortised

    for (int x : v) cout << x << " ";   // 6 1 2 9 3 4 5 7
}

// Manual shift on a raw array (what the library does for you)
void insertAt(int arr[], int &n, int pos, int val) {
    for (int i = n; i > pos; i--) arr[i] = arr[i - 1]; // slide right
    arr[pos] = val;
    n++;
}`,
java: `// Insert at beginning / position / end
import java.util.*;

public class Main {
    // Manual shift on a fixed array
    static int insertAt(int[] a, int n, int pos, int val) {
        for (int i = n; i > pos; i--) a[i] = a[i - 1]; // slide right
        a[pos] = val;
        return n + 1;                                  // new length
    }

    public static void main(String[] args) {
        List<Integer> l = new ArrayList<>(List.of(1, 2, 3, 4, 5));
        l.add(0, 6);      // at begin    O(n)
        l.add(3, 9);      // at index 3  O(n)
        l.add(7);         // at end      O(1) amortised
        System.out.println(l);   // [6, 1, 2, 9, 3, 4, 5, 7]
    }
}`,
python: `arr = [1, 2, 3, 4, 5]

arr.insert(0, 6)     # at beginning -> shifts everything  O(n)
arr.insert(3, 9)     # at index 3   -> shifts the tail    O(n)
arr.append(7)        # at end       -> amortised O(1)

print(arr)           # [6, 1, 2, 9, 3, 4, 5, 7]

# What insert() actually does, written out
def insert_at(a, pos, val):
    a.append(None)                     # make room
    for i in range(len(a) - 1, pos, -1):
        a[i] = a[i - 1]                # slide right
    a[pos] = val
    return a`,
javascript: `const arr = [1, 2, 3, 4, 5];

arr.unshift(6);            // at beginning   O(n)
arr.splice(3, 0, 9);       // at index 3     O(n)  (0 = delete none)
arr.push(7);               // at end         O(1)

console.log(arr);          // [6, 1, 2, 9, 3, 4, 5, 7]

// The shift, spelled out
function insertAt(a, pos, val) {
  for (let i = a.length; i > pos; i--) a[i] = a[i - 1];
  a[pos] = val;
  return a;
}` },

{ id: 'delete', name: 'Deletion (3 cases)', big: 'O(n)',
cpp: `// Delete from beginning / position / end
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5};

    v.erase(v.begin());          // from begin -> shifts all  O(n)
    v.erase(v.begin() + 1);      // from pos 1 -> shifts tail O(n)
    v.pop_back();                // from end   -> O(1)

    for (int x : v) cout << x << " ";   // 2 4
}

// Manual shift-left on a raw array
void deleteAt(int arr[], int &n, int pos) {
    for (int i = pos; i < n - 1; i++) arr[i] = arr[i + 1]; // slide left
    n--;                                                    // shrink
}`,
java: `import java.util.*;

public class Main {
    static int deleteAt(int[] a, int n, int pos) {
        for (int i = pos; i < n - 1; i++) a[i] = a[i + 1]; // slide left
        return n - 1;
    }

    public static void main(String[] args) {
        List<Integer> l = new ArrayList<>(List.of(1, 2, 3, 4, 5));
        l.remove(0);                       // from beginning  O(n)
        l.remove(1);                       // by INDEX        O(n)
        l.remove(Integer.valueOf(5));      // by VALUE (note the cast!)
        System.out.println(l);             // [2, 4]
    }
}`,
python: `arr = [1, 2, 3, 4, 5]

arr.pop(0)        # from beginning  O(n)
del arr[1]        # by index        O(n)
arr.pop()         # from end        O(1)
arr.remove(4)     # by VALUE (first match only)

print(arr)        # [2]

# Delete every match without breaking the loop
arr = [x for x in [1, 2, 2, 3] if x != 2]   # [1, 3]`,
javascript: `const arr = [1, 2, 3, 4, 5];

arr.shift();            // from beginning  O(n)
arr.splice(1, 1);       // 1 item at index 1
arr.pop();              // from end        O(1)

console.log(arr);       // [2]

// Delete by value — filter never mutates while iterating
const cleaned = [1, 2, 2, 3].filter(x => x !== 2);  // [1, 3]` },

{ id: 'search', name: 'Linear & Binary Search', big: 'O(n) / O(log n)',
cpp: `// Linear search O(n) vs binary search O(log n)
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int linearSearch(vector<int>& a, int key) {
    for (int i = 0; i < a.size(); i++)
        if (a[i] == key) return i;      // first match
    return -1;
}

int binarySearch(vector<int>& a, int key) {   // a MUST be sorted
    int lo = 0, hi = a.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;         // overflow-safe
        if (a[mid] == key) return mid;
        if (a[mid] < key) lo = mid + 1;       // drop the left half
        else              hi = mid - 1;       // drop the right half
    }
    return -1;
}

int main() {
    vector<int> a = {10, 20, 30, 40, 50};
    cout << linearSearch(a, 30) << " " << binarySearch(a, 30); // 2 2
}`,
java: `public class Main {
    static int linearSearch(int[] a, int key) {
        for (int i = 0; i < a.length; i++)
            if (a[i] == key) return i;
        return -1;
    }

    static int binarySearch(int[] a, int key) {  // sorted input only
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;        // overflow-safe
            if (a[mid] == key) return mid;
            if (a[mid] < key) lo = mid + 1;
            else              hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] a = {10, 20, 30, 40, 50};
        System.out.println(linearSearch(a, 30) + " " + binarySearch(a, 30));
    }
}`,
python: `def linear_search(a, key):
    for i, x in enumerate(a):
        if x == key:
            return i
    return -1

def binary_search(a, key):        # a must be sorted
    lo, hi = 0, len(a) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == key:
            return mid
        if a[mid] < key:
            lo = mid + 1          # discard the left half
        else:
            hi = mid - 1          # discard the right half
    return -1

a = [10, 20, 30, 40, 50]
print(linear_search(a, 30), binary_search(a, 30))   # 2 2

import bisect
print(bisect.bisect_left(a, 30))   # 2 — stdlib binary search`,
javascript: `function linearSearch(a, key) {
  for (let i = 0; i < a.length; i++) if (a[i] === key) return i;
  return -1;
}

function binarySearch(a, key) {        // sorted input only
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;        // fast floor-divide by 2
    if (a[mid] === key) return mid;
    if (a[mid] < key) lo = mid + 1;
    else              hi = mid - 1;
  }
  return -1;
}

const a = [10, 20, 30, 40, 50];
console.log(linearSearch(a, 30), binarySearch(a, 30), a.indexOf(30));` },

{ id: 'sort', name: 'Sorting', big: 'O(n log n)',
cpp: `// Bubble sort (teaching) vs std::sort (production)
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void bubbleSort(vector<int>& a) {          // O(n^2)
    for (int i = 0; i < a.size() - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < a.size() - 1 - i; j++)
            if (a[j] > a[j + 1]) { swap(a[j], a[j + 1]); swapped = true; }
        if (!swapped) break;               // already sorted -> O(n) best
    }
}

int main() {
    vector<int> a = {5, 2, 9, 1, 7};
    bubbleSort(a);
    sort(a.begin(), a.end());                  // O(n log n)
    sort(a.begin(), a.end(), greater<int>());  // descending
    for (int x : a) cout << x << " ";          // 9 7 5 2 1
}`,
java: `import java.util.*;

public class Main {
    static void bubbleSort(int[] a) {           // O(n^2)
        for (int i = 0; i < a.length - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < a.length - 1 - i; j++)
                if (a[j] > a[j + 1]) {
                    int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                    swapped = true;
                }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 2, 9, 1, 7};
        Arrays.sort(a);                          // dual-pivot quicksort
        System.out.println(Arrays.toString(a));  // [1, 2, 5, 7, 9]

        Integer[] b = {5, 2, 9};
        Arrays.sort(b, Collections.reverseOrder());  // descending
    }
}`,
python: `def bubble_sort(a):                 # O(n^2) — for understanding
    n = len(a)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
                swapped = True
        if not swapped:
            break                       # already sorted
    return a

a = [5, 2, 9, 1, 7]
a.sort()                                # in place,  O(n log n) Timsort
b = sorted(a, reverse=True)             # new list, descending
words = sorted(["pear", "fig"], key=len)  # sort by a custom key
print(a, b, words)`,
javascript: `function bubbleSort(a) {                 // O(n^2)
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++)
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swapped = true; }
    if (!swapped) break;
  }
  return a;
}

const a = [5, 2, 9, 1, 7];
a.sort((x, y) => x - y);   // ALWAYS pass a comparator for numbers!
                           // a.sort() alone sorts as strings: 1,2,5,7,9 by luck
console.log(a);            // [1, 2, 5, 7, 9]
console.log([...a].sort((x, y) => y - x));  // descending copy` }
]},

/* ================= LINKED LIST ================= */
linkedlist: { label: 'linked_list.cpp', ops: [
{ id: 'build', name: 'Node & Traversal', big: 'O(n)',
cpp: `// Build a singly linked list and walk it
#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

void printList(Node* head) {
    for (Node* cur = head; cur; cur = cur->next)
        cout << cur->data << " -> ";
    cout << "NULL";
}

int main() {
    Node* head = new Node(1);
    head->next = new Node(2);
    head->next->next = new Node(3);

    printList(head);        // 1 -> 2 -> 3 -> NULL
    return 0;
}`,
java: `public class Main {
    static class Node {
        int data;
        Node next;
        Node(int d) { data = d; }     // next defaults to null
    }

    static void printList(Node head) {
        for (Node cur = head; cur != null; cur = cur.next)
            System.out.print(cur.data + " -> ");
        System.out.println("null");
    }

    public static void main(String[] args) {
        Node head = new Node(1);
        head.next = new Node(2);
        head.next.next = new Node(3);
        printList(head);              // 1 -> 2 -> 3 -> null
    }
}`,
python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

def print_list(head):
    cur = head
    while cur:
        print(cur.data, end=" -> ")
        cur = cur.next
    print("None")

head = Node(1)
head.next = Node(2)
head.next.next = Node(3)
print_list(head)          # 1 -> 2 -> 3 -> None`,
javascript: `class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

function printList(head) {
  const out = [];
  for (let cur = head; cur; cur = cur.next) out.push(cur.data);
  console.log(out.join(" -> ") + " -> null");
}

const head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);
printList(head);        // 1 -> 2 -> 3 -> null` },

{ id: 'insert', name: 'Insertion (head / pos / tail)', big: 'O(1) / O(n)',
cpp: `// Insert at head, at a position, and at the tail
Node* insertHead(Node* head, int val) {     // O(1)
    Node* n = new Node(val);
    n->next = head;                          // link forward first
    return n;                                // n is the new head
}

Node* insertTail(Node* head, int val) {     // O(n)
    Node* n = new Node(val);
    if (!head) return n;
    Node* cur = head;
    while (cur->next) cur = cur->next;       // walk to the last node
    cur->next = n;
    return head;
}

Node* insertAt(Node* head, int pos, int val) {   // O(pos)
    if (pos == 0) return insertHead(head, val);
    Node* cur = head;
    for (int i = 0; cur && i < pos - 1; i++) cur = cur->next;
    if (!cur) return head;                   // position out of range
    Node* n = new Node(val);
    n->next = cur->next;                     // 1. point the new node on
    cur->next = n;                           // 2. then relink the prev
    return head;
}`,
java: `// Insert at head, at a position, and at the tail
static Node insertHead(Node head, int val) {   // O(1)
    Node n = new Node(val);
    n.next = head;
    return n;                                   // new head
}

static Node insertTail(Node head, int val) {   // O(n)
    Node n = new Node(val);
    if (head == null) return n;
    Node cur = head;
    while (cur.next != null) cur = cur.next;
    cur.next = n;
    return head;
}

static Node insertAt(Node head, int pos, int val) {  // O(pos)
    if (pos == 0) return insertHead(head, val);
    Node cur = head;
    for (int i = 0; cur != null && i < pos - 1; i++) cur = cur.next;
    if (cur == null) return head;               // out of range
    Node n = new Node(val);
    n.next = cur.next;                          // order matters!
    cur.next = n;
    return head;
}`,
python: `def insert_head(head, val):        # O(1)
    n = Node(val)
    n.next = head
    return n                       # new head

def insert_tail(head, val):        # O(n)
    n = Node(val)
    if not head:
        return n
    cur = head
    while cur.next:                # walk to the last node
        cur = cur.next
    cur.next = n
    return head

def insert_at(head, pos, val):     # O(pos)
    if pos == 0:
        return insert_head(head, val)
    cur = head
    for _ in range(pos - 1):
        if not cur:
            return head            # out of range
        cur = cur.next
    n = Node(val)
    n.next = cur.next              # 1. forward link
    cur.next = n                   # 2. backward link
    return head`,
javascript: `function insertHead(head, val) {       // O(1)
  const n = new Node(val);
  n.next = head;
  return n;                            // new head
}

function insertTail(head, val) {       // O(n)
  const n = new Node(val);
  if (!head) return n;
  let cur = head;
  while (cur.next) cur = cur.next;
  cur.next = n;
  return head;
}

function insertAt(head, pos, val) {    // O(pos)
  if (pos === 0) return insertHead(head, val);
  let cur = head;
  for (let i = 0; cur && i < pos - 1; i++) cur = cur.next;
  if (!cur) return head;               // out of range
  const n = new Node(val);
  n.next = cur.next;                   // link forward BEFORE backward
  cur.next = n;
  return head;
}` },

{ id: 'delete', name: 'Deletion', big: 'O(1) / O(n)',
cpp: `// Delete head, by value, and the tail
Node* deleteHead(Node* head) {              // O(1)
    if (!head) return nullptr;
    Node* old = head;
    head = head->next;
    delete old;                              // free the unlinked node
    return head;
}

Node* deleteValue(Node* head, int val) {    // O(n)
    if (!head) return nullptr;
    if (head->data == val) return deleteHead(head);

    Node* prev = head;
    while (prev->next && prev->next->data != val) prev = prev->next;
    if (prev->next) {                        // found it
        Node* target = prev->next;
        prev->next = target->next;           // link around
        delete target;
    }
    return head;
}

Node* deleteTail(Node* head) {              // O(n)
    if (!head || !head->next) { delete head; return nullptr; }
    Node* prev = head;
    while (prev->next->next) prev = prev->next;   // stop one early
    delete prev->next;
    prev->next = nullptr;
    return head;
}`,
java: `static Node deleteHead(Node head) {            // O(1)
    return head == null ? null : head.next;     // GC frees the old node
}

static Node deleteValue(Node head, int val) {  // O(n)
    if (head == null) return null;
    if (head.data == val) return head.next;

    Node prev = head;
    while (prev.next != null && prev.next.data != val) prev = prev.next;
    if (prev.next != null) prev.next = prev.next.next;  // link around
    return head;
}

static Node deleteTail(Node head) {            // O(n)
    if (head == null || head.next == null) return null;
    Node prev = head;
    while (prev.next.next != null) prev = prev.next;    // stop one early
    prev.next = null;
    return head;
}`,
python: `def delete_head(head):              # O(1)
    return head.next if head else None

def delete_value(head, val):        # O(n)
    if not head:
        return None
    if head.data == val:
        return head.next

    prev = head
    while prev.next and prev.next.data != val:
        prev = prev.next
    if prev.next:                   # found
        prev.next = prev.next.next  # link around the target
    return head

def delete_tail(head):              # O(n)
    if not head or not head.next:
        return None
    prev = head
    while prev.next.next:           # stop one before the end
        prev = prev.next
    prev.next = None
    return head`,
javascript: `function deleteHead(head) {              // O(1)
  return head ? head.next : null;
}

function deleteValue(head, val) {        // O(n)
  if (!head) return null;
  if (head.data === val) return head.next;

  let prev = head;
  while (prev.next && prev.next.data !== val) prev = prev.next;
  if (prev.next) prev.next = prev.next.next;   // link around
  return head;
}

function deleteTail(head) {              // O(n)
  if (!head || !head.next) return null;
  let prev = head;
  while (prev.next.next) prev = prev.next;     // stop one early
  prev.next = null;
  return head;
}` },

{ id: 'reverse', name: 'Reverse (3 pointers)', big: 'O(n)',
cpp: `// Reverse a singly linked list in one pass — the classic
Node* reverse(Node* head) {
    Node* prev = nullptr;
    Node* cur  = head;
    while (cur) {
        Node* nxt = cur->next;   // 1. save the rest of the list
        cur->next = prev;        // 2. flip this link backwards
        prev = cur;              // 3. advance prev
        cur  = nxt;              // 4. advance cur
    }
    return prev;                 // prev is the new head
}
// Time O(n) · Space O(1)

// Recursive variant — O(n) space from the call stack
Node* reverseRec(Node* head) {
    if (!head || !head->next) return head;
    Node* newHead = reverseRec(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}`,
java: `// Reverse a singly linked list in one pass
static Node reverse(Node head) {
    Node prev = null, cur = head;
    while (cur != null) {
        Node nxt = cur.next;   // save the rest
        cur.next = prev;       // flip the link
        prev = cur;            // advance prev
        cur  = nxt;            // advance cur
    }
    return prev;               // new head
}
// Time O(n) · Space O(1)

static Node reverseRec(Node head) {
    if (head == null || head.next == null) return head;
    Node newHead = reverseRec(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}`,
python: `def reverse(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next     # 1. save the rest of the list
        cur.next = prev    # 2. flip this link
        prev, cur = cur, nxt   # 3. advance both
    return prev            # new head
# Time O(n) · Space O(1)

def reverse_rec(head):
    if not head or not head.next:
        return head
    new_head = reverse_rec(head.next)
    head.next.next = head
    head.next = None
    return new_head`,
javascript: `function reverse(head) {
  let prev = null, cur = head;
  while (cur) {
    const nxt = cur.next;   // 1. save the rest
    cur.next = prev;        // 2. flip the link
    prev = cur;             // 3. advance prev
    cur = nxt;              // 4. advance cur
  }
  return prev;              // new head
}
// Time O(n) · Space O(1)

function reverseRec(head) {
  if (!head || !head.next) return head;
  const newHead = reverseRec(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}` },

{ id: 'cycle', name: 'Search · Middle · Cycle', big: 'O(n)',
cpp: `// Search, find the middle, detect a cycle (Floyd)
bool search(Node* head, int key) {           // O(n)
    for (Node* cur = head; cur; cur = cur->next)
        if (cur->data == key) return true;
    return false;
}

Node* middle(Node* head) {                   // O(n), one pass
    Node* slow = head; Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;                   // +1
        fast = fast->next->next;             // +2
    }
    return slow;                             // lands on the middle
}

bool hasCycle(Node* head) {                  // Floyd's tortoise & hare
    Node* slow = head; Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;       // they meet -> cycle
    }
    return false;                            // hit NULL  -> no cycle
}`,
java: `static boolean search(Node head, int key) {      // O(n)
    for (Node cur = head; cur != null; cur = cur.next)
        if (cur.data == key) return true;
    return false;
}

static Node middle(Node head) {                  // one pass
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;          // +1
        fast = fast.next.next;     // +2
    }
    return slow;
}

static boolean hasCycle(Node head) {             // Floyd
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
python: `def search(head, key):            # O(n)
    cur = head
    while cur:
        if cur.data == key:
            return True
        cur = cur.next
    return False

def middle(head):                 # one pass, O(1) space
    slow = fast = head
    while fast and fast.next:
        slow = slow.next          # +1
        fast = fast.next.next     # +2
    return slow

def has_cycle(head):              # Floyd's tortoise and hare
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:          # they met -> cycle
            return True
    return False`,
javascript: `function search(head, key) {           // O(n)
  for (let cur = head; cur; cur = cur.next)
    if (cur.data === key) return true;
  return false;
}

function middle(head) {                // one pass
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;                  // +1
    fast = fast.next.next;             // +2
  }
  return slow;
}

function hasCycle(head) {              // Floyd
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}` }
]},

/* ================= TREES ================= */
trees: { label: 'binary_tree.cpp', ops: [
{ id: 'insert', name: 'Node & BST Insert', big: 'O(h)',
cpp: `// A BST node and insertion
#include <iostream>
using namespace std;

struct Node {
    int val;
    Node *left, *right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

Node* insert(Node* root, int val) {      // O(h) — h = height
    if (!root) return new Node(val);     // empty slot found
    if (val < root->val)
        root->left  = insert(root->left, val);   // smaller -> go left
    else if (val > root->val)
        root->right = insert(root->right, val);  // bigger  -> go right
    return root;                          // duplicates ignored
}

int main() {
    Node* root = nullptr;
    for (int v : {50, 30, 70, 20, 40, 60, 80}) root = insert(root, v);
    cout << root->val;    // 50
}`,
java: `public class Main {
    static class Node {
        int val; Node left, right;
        Node(int v) { val = v; }
    }

    static Node insert(Node root, int val) {       // O(h)
        if (root == null) return new Node(val);
        if (val < root.val)      root.left  = insert(root.left, val);
        else if (val > root.val) root.right = insert(root.right, val);
        return root;
    }

    public static void main(String[] args) {
        Node root = null;
        for (int v : new int[]{50, 30, 70, 20, 40, 60, 80})
            root = insert(root, v);
        System.out.println(root.val);   // 50
    }
}`,
python: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):            # O(h)
    if root is None:
        return Node(val)          # empty slot -> plant here
    if val < root.val:
        root.left = insert(root.left, val)     # smaller -> left
    elif val > root.val:
        root.right = insert(root.right, val)   # bigger  -> right
    return root                   # duplicates ignored

root = None
for v in [50, 30, 70, 20, 40, 60, 80]:
    root = insert(root, v)
print(root.val)                   # 50`,
javascript: `class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function insert(root, val) {            // O(h)
  if (!root) return new Node(val);      // empty slot
  if (val < root.val)      root.left  = insert(root.left, val);
  else if (val > root.val) root.right = insert(root.right, val);
  return root;
}

let root = null;
for (const v of [50, 30, 70, 20, 40, 60, 80]) root = insert(root, v);
console.log(root.val);   // 50` },

{ id: 'traverse', name: 'All 4 Traversals', big: 'O(n)',
cpp: `// In / Pre / Post order (DFS) + Level order (BFS)
#include <queue>

void inorder(Node* n)   { if (!n) return; inorder(n->left);  cout << n->val << " "; inorder(n->right); }   // sorted for a BST
void preorder(Node* n)  { if (!n) return; cout << n->val << " "; preorder(n->left);  preorder(n->right); } // copy / serialise
void postorder(Node* n) { if (!n) return; postorder(n->left); postorder(n->right); cout << n->val << " "; } // delete / evaluate

void levelOrder(Node* root) {            // BFS with a queue
    if (!root) return;
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        int levelSize = q.size();        // one full level per loop
        while (levelSize--) {
            Node* cur = q.front(); q.pop();
            cout << cur->val << " ";
            if (cur->left)  q.push(cur->left);
            if (cur->right) q.push(cur->right);
        }
        cout << "| ";                    // level break
    }
}`,
java: `import java.util.*;

static void inorder(Node n)   { if (n == null) return; inorder(n.left);  System.out.print(n.val + " "); inorder(n.right); }
static void preorder(Node n)  { if (n == null) return; System.out.print(n.val + " "); preorder(n.left);  preorder(n.right); }
static void postorder(Node n) { if (n == null) return; postorder(n.left); postorder(n.right); System.out.print(n.val + " "); }

static void levelOrder(Node root) {          // BFS
    if (root == null) return;
    Queue<Node> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int levelSize = q.size();            // snapshot this level
        for (int i = 0; i < levelSize; i++) {
            Node cur = q.poll();
            System.out.print(cur.val + " ");
            if (cur.left  != null) q.offer(cur.left);
            if (cur.right != null) q.offer(cur.right);
        }
        System.out.print("| ");
    }
}`,
python: `from collections import deque

def inorder(n):    # left, node, right  -> sorted for a BST
    return inorder(n.left) + [n.val] + inorder(n.right) if n else []

def preorder(n):   # node, left, right  -> copy / serialise
    return [n.val] + preorder(n.left) + preorder(n.right) if n else []

def postorder(n):  # left, right, node  -> delete / evaluate
    return postorder(n.left) + postorder(n.right) + [n.val] if n else []

def level_order(root):            # BFS, grouped by level
    if not root:
        return []
    out, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):   # exactly one level per iteration
            n = q.popleft()
            level.append(n.val)
            if n.left:  q.append(n.left)
            if n.right: q.append(n.right)
        out.append(level)
    return out`,
javascript: `const inorder   = n => n ? [...inorder(n.left), n.val, ...inorder(n.right)] : [];
const preorder  = n => n ? [n.val, ...preorder(n.left), ...preorder(n.right)] : [];
const postorder = n => n ? [...postorder(n.left), ...postorder(n.right), n.val] : [];

function levelOrder(root) {              // BFS, grouped by level
  if (!root) return [];
  const out = [], q = [root];
  while (q.length) {
    const level = [], size = q.length;   // snapshot the level
    for (let i = 0; i < size; i++) {
      const n = q.shift();
      level.push(n.val);
      if (n.left)  q.push(n.left);
      if (n.right) q.push(n.right);
    }
    out.push(level);
  }
  return out;
}` },

{ id: 'search', name: 'Search · Min · Max', big: 'O(h)',
cpp: `// BST search discards half the tree per comparison
bool search(Node* root, int key) {          // O(h)
    while (root) {
        if (root->val == key) return true;
        root = (key < root->val) ? root->left : root->right;
    }
    return false;
}

Node* findMin(Node* root) {                 // leftmost node
    while (root && root->left) root = root->left;
    return root;
}

Node* findMax(Node* root) {                 // rightmost node
    while (root && root->right) root = root->right;
    return root;
}

// In a plain binary tree (no ordering) you must check everything: O(n)
bool searchAny(Node* n, int key) {
    if (!n) return false;
    return n->val == key || searchAny(n->left, key) || searchAny(n->right, key);
}`,
java: `static boolean search(Node root, int key) {      // O(h)
    while (root != null) {
        if (root.val == key) return true;
        root = key < root.val ? root.left : root.right;
    }
    return false;
}

static Node findMin(Node root) {                 // leftmost
    while (root != null && root.left != null) root = root.left;
    return root;
}

static Node findMax(Node root) {                 // rightmost
    while (root != null && root.right != null) root = root.right;
    return root;
}

// Unordered binary tree -> full scan, O(n)
static boolean searchAny(Node n, int key) {
    if (n == null) return false;
    return n.val == key || searchAny(n.left, key) || searchAny(n.right, key);
}`,
python: `def search(root, key):            # O(h) — halves the tree each step
    while root:
        if root.val == key:
            return True
        root = root.left if key < root.val else root.right
    return False

def find_min(root):               # keep going left
    while root and root.left:
        root = root.left
    return root

def find_max(root):               # keep going right
    while root and root.right:
        root = root.right
    return root

def search_any(n, key):           # plain binary tree -> O(n)
    if not n:
        return False
    return n.val == key or search_any(n.left, key) or search_any(n.right, key)`,
javascript: `function search(root, key) {            // O(h)
  while (root) {
    if (root.val === key) return true;
    root = key < root.val ? root.left : root.right;
  }
  return false;
}

const findMin = root => { while (root?.left)  root = root.left;  return root; };
const findMax = root => { while (root?.right) root = root.right; return root; };

// Unordered binary tree -> must check every node, O(n)
function searchAny(n, key) {
  if (!n) return false;
  return n.val === key || searchAny(n.left, key) || searchAny(n.right, key);
}` },

{ id: 'height', name: 'Height · Count · Delete', big: 'O(n)',
cpp: `// Height, node count, and BST deletion (the 3 cases)
int height(Node* n) {                        // edges to the deepest leaf
    if (!n) return -1;                       // use 0 to count nodes instead
    return 1 + max(height(n->left), height(n->right));
}

int countNodes(Node* n) {
    return n ? 1 + countNodes(n->left) + countNodes(n->right) : 0;
}

Node* deleteNode(Node* root, int key) {      // O(h)
    if (!root) return nullptr;
    if (key < root->val)      root->left  = deleteNode(root->left, key);
    else if (key > root->val) root->right = deleteNode(root->right, key);
    else {
        // CASE 1 & 2: zero or one child -> splice the child in
        if (!root->left)  { Node* r = root->right; delete root; return r; }
        if (!root->right) { Node* l = root->left;  delete root; return l; }
        // CASE 3: two children -> copy the in-order successor
        Node* succ = findMin(root->right);
        root->val = succ->val;
        root->right = deleteNode(root->right, succ->val);
    }
    return root;
}`,
java: `static int height(Node n) {                     // -1 for an empty tree
    if (n == null) return -1;
    return 1 + Math.max(height(n.left), height(n.right));
}

static int countNodes(Node n) {
    return n == null ? 0 : 1 + countNodes(n.left) + countNodes(n.right);
}

static Node deleteNode(Node root, int key) {   // O(h)
    if (root == null) return null;
    if (key < root.val)      root.left  = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
        if (root.left  == null) return root.right;   // 0 or 1 child
        if (root.right == null) return root.left;
        Node succ = findMin(root.right);             // 2 children
        root.val = succ.val;
        root.right = deleteNode(root.right, succ.val);
    }
    return root;
}`,
python: `def height(n):                    # edges down to the deepest leaf
    if n is None:
        return -1                 # return 0 here to count levels instead
    return 1 + max(height(n.left), height(n.right))

def count_nodes(n):
    return 0 if n is None else 1 + count_nodes(n.left) + count_nodes(n.right)

def delete_node(root, key):       # O(h)
    if root is None:
        return None
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        if root.left is None:     # case 1/2: 0 or 1 child
            return root.right
        if root.right is None:
            return root.left
        succ = find_min(root.right)   # case 3: in-order successor
        root.val = succ.val
        root.right = delete_node(root.right, succ.val)
    return root`,
javascript: `function height(n) {                     // -1 for empty
  if (!n) return -1;
  return 1 + Math.max(height(n.left), height(n.right));
}

const countNodes = n => n ? 1 + countNodes(n.left) + countNodes(n.right) : 0;

function deleteNode(root, key) {         // O(h)
  if (!root) return null;
  if (key < root.val)      root.left  = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left)  return root.right;  // 0 or 1 child
    if (!root.right) return root.left;
    const succ = findMin(root.right);    // 2 children -> successor
    root.val = succ.val;
    root.right = deleteNode(root.right, succ.val);
  }
  return root;
}` }
]},

/* ================= HASH TABLE ================= */
hashtable: { label: 'hash_table.cpp', ops: [
{ id: 'builtin', name: 'Built-in Maps', big: 'O(1)*',
cpp: `// unordered_map = hash table · map = balanced BST (ordered)
#include <iostream>
#include <unordered_map>
using namespace std;

int main() {
    unordered_map<string, int> ages;

    ages["harsh"] = 21;                  // insert / overwrite
    ages.insert({"aditi", 22});
    ages["harsh"]++;                     // update in place

    // WARNING: ages["ghost"] would CREATE the key with value 0
    if (ages.count("harsh"))             // safe existence test
        cout << ages["harsh"] << "\\n";  // 22

    auto it = ages.find("aditi");        // iterator, no insertion
    if (it != ages.end()) cout << it->second << "\\n";

    ages.erase("aditi");                 // delete

    for (auto& [name, age] : ages)       // order is NOT guaranteed
        cout << name << " = " << age << "\\n";
}`,
java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> ages = new HashMap<>();

        ages.put("harsh", 21);                    // insert / overwrite
        ages.merge("harsh", 1, Integer::sum);     // 21 + 1 = 22
        ages.putIfAbsent("aditi", 22);

        System.out.println(ages.getOrDefault("ghost", 0));  // 0, no insert
        System.out.println(ages.containsKey("harsh"));      // true

        ages.remove("aditi");

        for (Map.Entry<String, Integer> e : ages.entrySet())
            System.out.println(e.getKey() + " = " + e.getValue());

        // Need sorted keys? TreeMap is a red-black tree, O(log n).
        Map<String, Integer> sorted = new TreeMap<>(ages);
    }
}`,
python: `# dict IS a hash table
ages = {"harsh": 21}

ages["aditi"] = 22             # insert
ages["harsh"] += 1             # update
print(ages.get("ghost", 0))    # 0 — no KeyError, no insertion
print("harsh" in ages)         # True — O(1) membership
del ages["aditi"]              # delete

for name, age in ages.items():
    print(name, age)

# Counting idioms
from collections import Counter, defaultdict
print(Counter("mississippi"))              # {'i': 4, 's': 4, ...}
freq = defaultdict(int)
for ch in "hello":
    freq[ch] += 1                          # no key checks needed`,
javascript: `// Map keeps insertion order and accepts ANY key type
const ages = new Map();

ages.set("harsh", 21);              // insert
ages.set("harsh", ages.get("harsh") + 1);   // update -> 22
console.log(ages.get("ghost") ?? 0);        // 0, nothing inserted
console.log(ages.has("harsh"));             // true
ages.delete("aditi");

for (const [name, age] of ages) console.log(name, age);
console.log(ages.size);

// Plain objects work for string keys only
const obj = { harsh: 21 };
console.log("harsh" in obj, Object.keys(obj));

// Set = hash table without values — perfect for de-duping
const unique = new Set([1, 2, 2, 3]);   // Set(3) {1, 2, 3}` },

{ id: 'chaining', name: 'Build One (Chaining)', big: 'O(1)*',
cpp: `// Hash table from scratch — separate chaining
#include <iostream>
#include <list>
#include <vector>
#include <string>
using namespace std;

class HashTable {
    static const int SIZE = 11;                  // prime spreads better
    vector<list<pair<string, int>>> buckets;

    int hash(const string& key) {                // key -> bucket index
        long h = 0;
        for (char c : key) h = (h * 31 + c) % SIZE;   // 31 = classic mult
        return (int)h;
    }
public:
    HashTable() : buckets(SIZE) {}

    void put(const string& key, int val) {       // O(1) average
        auto& chain = buckets[hash(key)];
        for (auto& kv : chain)
            if (kv.first == key) { kv.second = val; return; }  // update
        chain.push_back({key, val});             // new entry
    }

    int get(const string& key) {                 // -1 when absent
        for (auto& kv : buckets[hash(key)])
            if (kv.first == key) return kv.second;
        return -1;
    }

    void remove(const string& key) {
        buckets[hash(key)].remove_if(
            [&](const pair<string,int>& kv){ return kv.first == key; });
    }
};`,
java: `// Hash table from scratch — separate chaining
import java.util.*;

class HashTable {
    private static final int SIZE = 11;          // prime bucket count
    private final List<Entry>[] buckets;

    static class Entry {
        String key; int val;
        Entry(String k, int v) { key = k; val = v; }
    }

    @SuppressWarnings("unchecked")
    HashTable() {
        buckets = new List[SIZE];
        for (int i = 0; i < SIZE; i++) buckets[i] = new LinkedList<>();
    }

    private int hash(String key) {                // key -> index
        long h = 0;
        for (char c : key.toCharArray()) h = (h * 31 + c) % SIZE;
        return (int) h;
    }

    void put(String key, int val) {               // O(1) average
        for (Entry e : buckets[hash(key)])
            if (e.key.equals(key)) { e.val = val; return; }   // update
        buckets[hash(key)].add(new Entry(key, val));
    }

    int get(String key) {
        for (Entry e : buckets[hash(key)])
            if (e.key.equals(key)) return e.val;
        return -1;                                 // absent
    }

    void remove(String key) {
        buckets[hash(key)].removeIf(e -> e.key.equals(key));
    }
}`,
python: `# Hash table from scratch — separate chaining
class HashTable:
    def __init__(self, size=11):        # prime size spreads keys better
        self.size = size
        self.buckets = [[] for _ in range(size)]

    def _hash(self, key):               # key -> bucket index
        h = 0
        for ch in str(key):
            h = (h * 31 + ord(ch)) % self.size
        return h

    def put(self, key, val):            # O(1) average
        chain = self.buckets[self._hash(key)]
        for i, (k, _) in enumerate(chain):
            if k == key:
                chain[i] = (key, val)   # update in place
                return
        chain.append((key, val))        # new entry

    def get(self, key, default=None):
        for k, v in self.buckets[self._hash(key)]:
            if k == key:
                return v
        return default

    def remove(self, key):
        idx = self._hash(key)
        self.buckets[idx] = [(k, v) for k, v in self.buckets[idx] if k != key]

    def load_factor(self):              # resize when this passes ~0.75
        return sum(len(b) for b in self.buckets) / self.size`,
javascript: `// Hash table from scratch — separate chaining
class HashTable {
  constructor(size = 11) {          // prime bucket count
    this.size = size;
    this.buckets = Array.from({ length: size }, () => []);
  }

  _hash(key) {                      // key -> bucket index
    let h = 0;
    for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) % this.size;
    return h;
  }

  put(key, val) {                   // O(1) average
    const chain = this.buckets[this._hash(key)];
    const hit = chain.find(e => e[0] === key);
    if (hit) hit[1] = val;          // update
    else chain.push([key, val]);    // insert
  }

  get(key, fallback = null) {
    const hit = this.buckets[this._hash(key)].find(e => e[0] === key);
    return hit ? hit[1] : fallback;
  }

  remove(key) {
    const i = this._hash(key);
    this.buckets[i] = this.buckets[i].filter(e => e[0] !== key);
  }

  get loadFactor() {                // resize past ~0.75
    return this.buckets.reduce((n, b) => n + b.length, 0) / this.size;
  }
}` },

{ id: 'probing', name: 'Open Addressing', big: 'O(1)*',
cpp: `// Linear probing — collisions walk forward to the next free slot
#include <vector>
#include <string>
using namespace std;

class ProbingTable {
    static const int SIZE = 13;
    vector<string> keys;   vector<int> vals;   vector<bool> used;

    int hash(const string& k) {
        long h = 0;
        for (char c : k) h = (h * 31 + c) % SIZE;
        return (int)h;
    }
public:
    ProbingTable() : keys(SIZE), vals(SIZE), used(SIZE, false) {}

    void put(const string& key, int val) {
        int i = hash(key);
        while (used[i] && keys[i] != key)
            i = (i + 1) % SIZE;          // <-- probe the next slot
        keys[i] = key; vals[i] = val; used[i] = true;
    }

    int get(const string& key) {
        int i = hash(key), start = i;
        while (used[i]) {
            if (keys[i] == key) return vals[i];
            i = (i + 1) % SIZE;
            if (i == start) break;       // wrapped the whole table
        }
        return -1;
    }
};
// Quadratic probing: i = (start + j*j) % SIZE
// Double hashing:    i = (start + j * h2(key)) % SIZE`,
java: `// Linear probing — collisions step to the next free slot
class ProbingTable {
    private static final int SIZE = 13;
    private final String[] keys = new String[SIZE];
    private final int[] vals = new int[SIZE];

    private int hash(String k) {
        long h = 0;
        for (char c : k.toCharArray()) h = (h * 31 + c) % SIZE;
        return (int) h;
    }

    void put(String key, int val) {
        int i = hash(key);
        while (keys[i] != null && !keys[i].equals(key))
            i = (i + 1) % SIZE;              // probe forward
        keys[i] = key; vals[i] = val;
    }

    int get(String key) {
        int i = hash(key), start = i;
        while (keys[i] != null) {
            if (keys[i].equals(key)) return vals[i];
            i = (i + 1) % SIZE;
            if (i == start) break;           // full wrap -> absent
        }
        return -1;
    }
}
// Quadratic: i = (start + j*j) % SIZE   ·   Double: i = (start + j*h2(k)) % SIZE`,
python: `# Linear probing — collisions step to the next free slot
class ProbingTable:
    def __init__(self, size=13):
        self.size = size
        self.slots = [None] * size          # (key, value) tuples

    def _hash(self, key):
        h = 0
        for ch in str(key):
            h = (h * 31 + ord(ch)) % self.size
        return h

    def put(self, key, val):
        i = self._hash(key)
        while self.slots[i] and self.slots[i][0] != key:
            i = (i + 1) % self.size         # <-- probe forward
        self.slots[i] = (key, val)

    def get(self, key, default=None):
        i = start = self._hash(key)
        while self.slots[i]:
            if self.slots[i][0] == key:
                return self.slots[i][1]
            i = (i + 1) % self.size
            if i == start:                  # wrapped the whole table
                break
        return default

# Quadratic probing: i = (start + j*j) % size
# Double hashing:    i = (start + j * h2(key)) % size`,
javascript: `// Linear probing — collisions step to the next free slot
class ProbingTable {
  constructor(size = 13) {
    this.size = size;
    this.slots = new Array(size).fill(null);   // [key, value]
  }

  _hash(key) {
    let h = 0;
    for (const ch of String(key)) h = (h * 31 + ch.charCodeAt(0)) % this.size;
    return h;
  }

  put(key, val) {
    let i = this._hash(key);
    while (this.slots[i] && this.slots[i][0] !== key)
      i = (i + 1) % this.size;               // probe forward
    this.slots[i] = [key, val];
  }

  get(key, fallback = null) {
    let i = this._hash(key);
    const start = i;
    while (this.slots[i]) {
      if (this.slots[i][0] === key) return this.slots[i][1];
      i = (i + 1) % this.size;
      if (i === start) break;                // wrapped -> absent
    }
    return fallback;
  }
}` },

{ id: 'patterns', name: 'Interview Patterns', big: 'O(n)',
cpp: `// The three hash-map patterns that solve most interview questions
#include <unordered_map>
#include <unordered_set>
#include <vector>
using namespace std;

// 1. Frequency count — anagrams, duplicates, top-k
unordered_map<char, int> freq(const string& s) {
    unordered_map<char, int> f;
    for (char c : s) f[c]++;
    return f;
}

// 2. Seen-before map — Two Sum in one pass, O(n)
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;              // value -> index
    for (int i = 0; i < nums.size(); i++) {
        int need = target - nums[i];
        if (seen.count(need)) return {seen[need], i};
        seen[nums[i]] = i;
    }
    return {};
}

// 3. Set for O(1) membership — de-dupe / cycle guard
bool hasDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums)
        if (!seen.insert(x).second) return true;   // insert failed = dup
    return false;
}`,
java: `import java.util.*;

// 1. Frequency count
static Map<Character, Integer> freq(String s) {
    Map<Character, Integer> f = new HashMap<>();
    for (char c : s.toCharArray()) f.merge(c, 1, Integer::sum);
    return f;
}

// 2. Seen-before map — Two Sum in one pass
static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();     // value -> index
    for (int i = 0; i < nums.length; i++) {
        Integer j = seen.get(target - nums[i]);
        if (j != null) return new int[]{j, i};
        seen.put(nums[i], i);
    }
    return new int[0];
}

// 3. Set membership
static boolean hasDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) if (!seen.add(x)) return true;  // add failed = dup
    return false;
}`,
python: `from collections import Counter

# 1. Frequency count — anagrams, duplicates, top-k
def is_anagram(a, b):
    return Counter(a) == Counter(b)            # O(n)

# 2. Seen-before map — Two Sum in one pass
def two_sum(nums, target):
    seen = {}                                  # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []

# 3. Set for O(1) membership
def has_duplicate(nums):
    return len(set(nums)) != len(nums)

# 4. Group by a computed key — Group Anagrams
def group_anagrams(words):
    groups = {}
    for w in words:
        key = "".join(sorted(w))               # same letters -> same key
        groups.setdefault(key, []).append(w)
    return list(groups.values())`,
javascript: `// 1. Frequency count
function freq(str) {
  const f = new Map();
  for (const ch of str) f.set(ch, (f.get(ch) ?? 0) + 1);
  return f;
}

// 2. Seen-before map — Two Sum in one pass, O(n)
function twoSum(nums, target) {
  const seen = new Map();                 // value -> index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}

// 3. Set membership
const hasDuplicate = nums => new Set(nums).size !== nums.length;

// 4. Group by a computed key
function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join("");    // same letters -> same key
    groups.set(key, [...(groups.get(key) ?? []), w]);
  }
  return [...groups.values()];
}` }
]}
};

/* ===== part 2: string · stack · queue · graphs ===== */
Object.assign(DSA.code, {

/* ================= STRING ================= */
string: { label: 'string.cpp', ops: [
{ id: 'basics', name: 'Basics & Building', big: 'O(n)',
cpp: `// std::string is MUTABLE and knows its own length in O(1)
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s = "HELLO";

    cout << s.length() << "\\n";      // 5
    cout << s[0] << s.back() << "\\n"; // H O
    cout << s.substr(1, 3) << "\\n";  // ELL  (start, count)

    s += " WORLD";                    // in-place append, cheap
    s.push_back('!');

    cout << s.find("WORLD") << "\\n"; // 6, or string::npos if absent
    for (char c : s) cout << c;

    // C-style string: needs room for the trailing '\\0'
    char c_str[6] = "HELLO";          // 5 chars + terminator
    cout << "\\n" << strlen(c_str);   // O(n) — it counts to the '\\0'
}`,
java: `// Java strings are IMMUTABLE — build with StringBuilder
public class Main {
    public static void main(String[] args) {
        String s = "HELLO";

        System.out.println(s.length());        // 5
        System.out.println(s.charAt(0));       // H
        System.out.println(s.substring(1, 4)); // ELL  (from, toExclusive)
        System.out.println(s.indexOf("LL"));   // 2, or -1

        // WRONG in a loop — allocates a new String every time: O(n^2)
        String bad = "";
        for (int i = 0; i < 5; i++) bad += i;

        // RIGHT — one mutable buffer: O(n)
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) sb.append(i);
        System.out.println(sb.toString());     // 01234

        // == compares REFERENCES, .equals() compares content
        System.out.println("ab".equals("a" + "b"));  // true
    }
}`,
python: `s = "HELLO"

print(len(s))          # 5
print(s[0], s[-1])     # H O   (negative = from the end)
print(s[1:4])          # ELL   (start:stop, stop excluded)
print(s.find("LL"))    # 2, or -1 when absent
print("LL" in s)       # True

# Strings are IMMUTABLE — s[0] = "h" raises TypeError
# WRONG in a loop: quadratic, a new string every iteration
bad = ""
for i in range(5):
    bad += str(i)

# RIGHT: build a list, join once — O(n)
parts = [str(i) for i in range(5)]
print("".join(parts))         # 01234

print(s.lower(), s.upper(), "  hi  ".strip())
print("a,b,c".split(","))     # ['a', 'b', 'c']`,
javascript: `let s = "HELLO";

console.log(s.length);         // 5
console.log(s[0], s.at(-1));   // H O
console.log(s.slice(1, 4));    // ELL  (start, endExclusive)
console.log(s.indexOf("LL"));  // 2, or -1
console.log(s.includes("LL")); // true

// Strings are IMMUTABLE — s[0] = "h" silently does nothing
// WRONG in a hot loop: allocates each time
let bad = "";
for (let i = 0; i < 5; i++) bad += i;

// RIGHT: collect then join once
const parts = [];
for (let i = 0; i < 5; i++) parts.push(i);
console.log(parts.join(""));   // 01234

console.log(s.toLowerCase(), "  hi  ".trim(), "a,b".split(","));` },

{ id: 'reverse', name: 'Reverse & Palindrome', big: 'O(n)',
cpp: `// Two-pointer reverse and palindrome check
#include <string>
#include <algorithm>
using namespace std;

string reverseStr(string s) {          // O(n) time, in-place
    int i = 0, j = s.size() - 1;
    while (i < j) swap(s[i++], s[j--]);   // walk inwards
    return s;
}
// or simply: reverse(s.begin(), s.end());

bool isPalindrome(const string& s) {   // O(n) time, O(1) space
    int i = 0, j = s.size() - 1;
    while (i < j) {
        while (i < j && !isalnum(s[i])) i++;      // skip punctuation
        while (i < j && !isalnum(s[j])) j--;
        if (tolower(s[i]) != tolower(s[j])) return false;
        i++; j--;
    }
    return true;
}

// "A man, a plan, a canal: Panama" -> true`,
java: `// Two-pointer reverse and palindrome check
static String reverseStr(String s) {
    char[] a = s.toCharArray();               // strings are immutable
    int i = 0, j = a.length - 1;
    while (i < j) {
        char t = a[i]; a[i++] = a[j]; a[j--] = t;
    }
    return new String(a);
}
// or: new StringBuilder(s).reverse().toString();

static boolean isPalindrome(String s) {       // O(n) time, O(1) space
    int i = 0, j = s.length() - 1;
    while (i < j) {
        while (i < j && !Character.isLetterOrDigit(s.charAt(i))) i++;
        while (i < j && !Character.isLetterOrDigit(s.charAt(j))) j--;
        if (Character.toLowerCase(s.charAt(i)) !=
            Character.toLowerCase(s.charAt(j))) return false;
        i++; j--;
    }
    return true;
}`,
python: `def reverse_str(s):
    return s[::-1]                       # slicing, the Pythonic way

def reverse_manual(s):                   # the two-pointer version
    a = list(s)                          # strings are immutable
    i, j = 0, len(a) - 1
    while i < j:
        a[i], a[j] = a[j], a[i]
        i += 1
        j -= 1
    return "".join(a)

def is_palindrome(s):                    # O(n) time, O(1) space
    i, j = 0, len(s) - 1
    while i < j:
        while i < j and not s[i].isalnum():   # skip punctuation
            i += 1
        while i < j and not s[j].isalnum():
            j -= 1
        if s[i].lower() != s[j].lower():
            return False
        i, j = i + 1, j - 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))   # True`,
javascript: `const reverseStr = s => [...s].reverse().join("");   // handles emoji too

function reverseManual(s) {                 // two pointers
  const a = [...s];
  let i = 0, j = a.length - 1;
  while (i < j) { [a[i], a[j]] = [a[j], a[i]]; i++; j--; }
  return a.join("");
}

function isPalindrome(s) {                  // O(n) time, O(1) space
  let i = 0, j = s.length - 1;
  const ok = c => /[a-z0-9]/i.test(c);
  while (i < j) {
    while (i < j && !ok(s[i])) i++;         // skip punctuation
    while (i < j && !ok(s[j])) j--;
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    i++; j--;
  }
  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));  // true` },

{ id: 'freq', name: 'Frequency & Anagrams', big: 'O(n)',
cpp: `// A 26-slot array beats a hash map for plain a-z problems
#include <string>
#include <unordered_map>
using namespace std;

bool isAnagram(const string& a, const string& b) {   // O(n)
    if (a.size() != b.size()) return false;
    int freq[26] = {0};
    for (char c : a) freq[c - 'a']++;      // count up
    for (char c : b) freq[c - 'a']--;      // count down
    for (int f : freq) if (f) return false; // all zero <=> anagram
    return true;
}

char firstUnique(const string& s) {        // two passes
    int freq[26] = {0};
    for (char c : s) freq[c - 'a']++;
    for (char c : s) if (freq[c - 'a'] == 1) return c;
    return '?';
}

int longestUniqueSubstr(const string& s) { // sliding window, O(n)
    unordered_map<char, int> last;
    int best = 0, start = 0;
    for (int i = 0; i < s.size(); i++) {
        if (last.count(s[i]) && last[s[i]] >= start)
            start = last[s[i]] + 1;        // shrink past the repeat
        last[s[i]] = i;
        best = max(best, i - start + 1);
    }
    return best;
}`,
java: `import java.util.*;

static boolean isAnagram(String a, String b) {    // O(n)
    if (a.length() != b.length()) return false;
    int[] freq = new int[26];
    for (char c : a.toCharArray()) freq[c - 'a']++;
    for (char c : b.toCharArray()) freq[c - 'a']--;
    for (int f : freq) if (f != 0) return false;
    return true;
}

static char firstUnique(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    for (char c : s.toCharArray()) if (freq[c - 'a'] == 1) return c;
    return '?';
}

static int longestUniqueSubstr(String s) {        // sliding window
    Map<Character, Integer> last = new HashMap<>();
    int best = 0, start = 0;
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (last.containsKey(c) && last.get(c) >= start)
            start = last.get(c) + 1;              // shrink the window
        last.put(c, i);
        best = Math.max(best, i - start + 1);
    }
    return best;
}`,
python: `from collections import Counter

def is_anagram(a, b):                 # O(n)
    return Counter(a) == Counter(b)

def is_anagram_manual(a, b):          # 26-slot count, O(1) space
    if len(a) != len(b):
        return False
    freq = [0] * 26
    for ch in a:
        freq[ord(ch) - 97] += 1
    for ch in b:
        freq[ord(ch) - 97] -= 1
    return all(f == 0 for f in freq)

def first_unique(s):
    freq = Counter(s)
    return next((ch for ch in s if freq[ch] == 1), "?")

def longest_unique_substr(s):         # sliding window, O(n)
    last, best, start = {}, 0, 0
    for i, ch in enumerate(s):
        if ch in last and last[ch] >= start:
            start = last[ch] + 1      # jump past the repeat
        last[ch] = i
        best = max(best, i - start + 1)
    return best

print(longest_unique_substr("abcabcbb"))   # 3`,
javascript: `function isAnagram(a, b) {                    // O(n)
  if (a.length !== b.length) return false;
  const freq = new Array(26).fill(0);
  for (const c of a) freq[c.charCodeAt(0) - 97]++;
  for (const c of b) freq[c.charCodeAt(0) - 97]--;
  return freq.every(f => f === 0);
}

function firstUnique(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) ?? 0) + 1);
  return [...s].find(c => freq.get(c) === 1) ?? "?";
}

function longestUniqueSubstr(s) {             // sliding window, O(n)
  const last = new Map();
  let best = 0, start = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (last.has(c) && last.get(c) >= start) start = last.get(c) + 1;
    last.set(c, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}

console.log(longestUniqueSubstr("abcabcbb"));  // 3` },

{ id: 'search', name: 'Pattern Search (KMP)', big: 'O(n+m)',
cpp: `// Naive O(n*m) vs KMP O(n+m)
#include <string>
#include <vector>
using namespace std;

int naiveSearch(const string& text, const string& pat) {
    int n = text.size(), m = pat.size();
    for (int i = 0; i + m <= n; i++) {
        int j = 0;
        while (j < m && text[i + j] == pat[j]) j++;
        if (j == m) return i;          // full match
    }
    return -1;                          // worst case: n*m compares
}

vector<int> buildLPS(const string& pat) {   // longest proper prefix-suffix
    vector<int> lps(pat.size(), 0);
    for (int i = 1, len = 0; i < pat.size(); ) {
        if (pat[i] == pat[len])      lps[i++] = ++len;
        else if (len)                len = lps[len - 1];   // fall back
        else                         lps[i++] = 0;
    }
    return lps;
}

int kmpSearch(const string& text, const string& pat) {
    vector<int> lps = buildLPS(pat);
    for (int i = 0, j = 0; i < text.size(); ) {
        if (text[i] == pat[j]) { i++; j++; if (j == pat.size()) return i - j; }
        else if (j)  j = lps[j - 1];   // reuse what already matched
        else         i++;
    }
    return -1;
}`,
java: `// Naive O(n*m) vs KMP O(n+m)
static int naiveSearch(String text, String pat) {
    int n = text.length(), m = pat.length();
    for (int i = 0; i + m <= n; i++) {
        int j = 0;
        while (j < m && text.charAt(i + j) == pat.charAt(j)) j++;
        if (j == m) return i;
    }
    return -1;
}

static int[] buildLPS(String pat) {          // prefix-function table
    int[] lps = new int[pat.length()];
    for (int i = 1, len = 0; i < pat.length(); ) {
        if (pat.charAt(i) == pat.charAt(len)) lps[i++] = ++len;
        else if (len > 0) len = lps[len - 1]; // fall back, do not restart
        else lps[i++] = 0;
    }
    return lps;
}

static int kmpSearch(String text, String pat) {
    int[] lps = buildLPS(pat);
    for (int i = 0, j = 0; i < text.length(); ) {
        if (text.charAt(i) == pat.charAt(j)) {
            i++; j++;
            if (j == pat.length()) return i - j;
        } else if (j > 0) j = lps[j - 1];
        else i++;
    }
    return -1;
}`,
python: `def naive_search(text, pat):          # O(n*m) worst case
    n, m = len(text), len(pat)
    for i in range(n - m + 1):
        if text[i:i + m] == pat:
            return i
    return -1

def build_lps(pat):                   # longest proper prefix = suffix
    lps = [0] * len(pat)
    length = 0
    i = 1
    while i < len(pat):
        if pat[i] == pat[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]  # fall back instead of restarting
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pat):            # O(n + m)
    lps = build_lps(pat)
    i = j = 0
    while i < len(text):
        if text[i] == pat[j]:
            i, j = i + 1, j + 1
            if j == len(pat):
                return i - j
        elif j:
            j = lps[j - 1]            # reuse the matched prefix
        else:
            i += 1
    return -1

print(kmp_search("ababcabcabababd", "ababd"))   # 10`,
javascript: `function naiveSearch(text, pat) {          // O(n*m)
  for (let i = 0; i + pat.length <= text.length; i++) {
    let j = 0;
    while (j < pat.length && text[i + j] === pat[j]) j++;
    if (j === pat.length) return i;
  }
  return -1;
}

function buildLPS(pat) {                   // prefix table
  const lps = new Array(pat.length).fill(0);
  let len = 0;
  for (let i = 1; i < pat.length; ) {
    if (pat[i] === pat[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];      // fall back
    else lps[i++] = 0;
  }
  return lps;
}

function kmpSearch(text, pat) {            // O(n + m)
  const lps = buildLPS(pat);
  let i = 0, j = 0;
  while (i < text.length) {
    if (text[i] === pat[j]) {
      i++; j++;
      if (j === pat.length) return i - j;
    } else if (j) j = lps[j - 1];
    else i++;
  }
  return -1;
}

console.log(kmpSearch("ababcabcabababd", "ababd"));  // 10` }
]},

/* ================= STACK ================= */
stack: { label: 'stack.cpp', ops: [
{ id: 'builtin', name: 'Built-in Stack', big: 'O(1)',
cpp: `// std::stack — LIFO, every operation O(1)
#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> st;

    st.push(10);            // [10]
    st.push(20);            // [10, 20]
    st.push(30);            // [10, 20, 30]  <- 30 is on top

    cout << st.top() << "\\n";   // 30  (peek, does not remove)
    st.pop();                     // removes 30, returns nothing
    cout << st.top() << "\\n";   // 20

    cout << st.size() << "\\n";  // 2
    cout << st.empty() << "\\n"; // 0 (false)

    // ALWAYS guard before popping — pop() on empty is undefined behaviour
    while (!st.empty()) { cout << st.top() << " "; st.pop(); }  // 20 10
}`,
java: `// ArrayDeque is the recommended stack (Stack class is legacy/synchronised)
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Deque<Integer> st = new ArrayDeque<>();

        st.push(10);                       // [10]
        st.push(20);
        st.push(30);                       // 30 on top

        System.out.println(st.peek());     // 30 — look, do not remove
        System.out.println(st.pop());      // 30 — remove and return
        System.out.println(st.peek());     // 20

        System.out.println(st.size());     // 2
        System.out.println(st.isEmpty());  // false

        while (!st.isEmpty())              // guard against underflow
            System.out.print(st.pop() + " ");   // 20 10
    }
}`,
python: `# A plain list IS a stack — append/pop work at the end in O(1)
st = []

st.append(10)          # push  -> [10]
st.append(20)
st.append(30)          # 30 on top

print(st[-1])          # 30  peek
print(st.pop())        # 30  pop
print(st[-1])          # 20

print(len(st), not st) # 2 False

while st:              # guard: pop() on an empty list raises IndexError
    print(st.pop(), end=" ")     # 20 10

# For heavy use across threads: from queue import LifoQueue`,
javascript: `// A JS array is a stack: push/pop both operate at the end, O(1)
const st = [];

st.push(10);            // [10]
st.push(20);
st.push(30);            // 30 on top

console.log(st.at(-1)); // 30  peek
console.log(st.pop());  // 30  pop
console.log(st.at(-1)); // 20

console.log(st.length, st.length === 0);  // 2 false

while (st.length)       // guard — pop() on empty returns undefined
  console.log(st.pop());   // 20, 10

// Note: use push/pop (end of array), never unshift/shift — those are O(n)` },

{ id: 'scratch', name: 'Build One (Array)', big: 'O(1)',
cpp: `// Fixed-capacity stack from scratch — overflow/underflow guarded
#include <iostream>
using namespace std;

class Stack {
    static const int CAP = 100;
    int arr[CAP];
    int topIdx = -1;               // -1 means empty
public:
    bool isEmpty() { return topIdx == -1; }
    bool isFull()  { return topIdx == CAP - 1; }

    void push(int x) {
        if (isFull()) { cout << "OVERFLOW\\n"; return; }
        arr[++topIdx] = x;         // move top, then write   O(1)
    }

    int pop() {
        if (isEmpty()) { cout << "UNDERFLOW\\n"; return -1; }
        return arr[topIdx--];      // read, then move top    O(1)
    }

    int peek() { return isEmpty() ? -1 : arr[topIdx]; }
    int size() { return topIdx + 1; }
};

int main() {
    Stack s;
    s.push(1); s.push(2); s.push(3);
    cout << s.pop() << s.peek() << s.size();   // 3 2 2
}`,
java: `// Fixed-capacity stack from scratch
class MyStack {
    private final int[] arr;
    private int topIdx = -1;            // -1 == empty

    MyStack(int capacity) { arr = new int[capacity]; }

    boolean isEmpty() { return topIdx == -1; }
    boolean isFull()  { return topIdx == arr.length - 1; }

    void push(int x) {
        if (isFull()) throw new IllegalStateException("Stack overflow");
        arr[++topIdx] = x;              // O(1)
    }

    int pop() {
        if (isEmpty()) throw new IllegalStateException("Stack underflow");
        return arr[topIdx--];           // O(1)
    }

    int peek() {
        if (isEmpty()) throw new IllegalStateException("Stack is empty");
        return arr[topIdx];
    }

    int size() { return topIdx + 1; }
}`,
python: `# Stack from scratch, with explicit capacity guards
class Stack:
    def __init__(self, capacity=100):
        self.arr = [None] * capacity
        self.top = -1                    # -1 means empty

    def is_empty(self):
        return self.top == -1

    def is_full(self):
        return self.top == len(self.arr) - 1

    def push(self, x):
        if self.is_full():
            raise OverflowError("Stack overflow")
        self.top += 1
        self.arr[self.top] = x           # O(1)

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack underflow")
        x = self.arr[self.top]
        self.top -= 1                    # O(1)
        return x

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.arr[self.top]

    def size(self):
        return self.top + 1

s = Stack()
s.push(1); s.push(2)
print(s.pop(), s.peek(), s.size())       # 2 1 1`,
javascript: `// Stack from scratch — linked version, so there is no capacity limit
class Stack {
  #top = null;
  #size = 0;

  push(value) {                          // O(1)
    this.#top = { value, next: this.#top };   // new node becomes the top
    this.#size++;
    return this;
  }

  pop() {                                // O(1)
    if (!this.#top) throw new Error("Stack underflow");
    const { value } = this.#top;
    this.#top = this.#top.next;
    this.#size--;
    return value;
  }

  peek()      { return this.#top ? this.#top.value : undefined; }
  get size()  { return this.#size; }
  get isEmpty() { return this.#size === 0; }
}

const s = new Stack();
s.push(1).push(2);
console.log(s.pop(), s.peek(), s.size);   // 2 1 1` },

{ id: 'brackets', name: 'Balanced Brackets', big: 'O(n)',
cpp: `// The canonical stack problem: is every bracket matched?
#include <iostream>
#include <stack>
#include <string>
using namespace std;

bool isBalanced(const string& s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);                     // opener -> remember it
        } else if (c == ')' || c == ']' || c == '}') {
            if (st.empty()) return false;   // closer with nothing open
            char open = st.top(); st.pop();
            if ((c == ')' && open != '(') ||
                (c == ']' && open != '[') ||
                (c == '}' && open != '{')) return false;   // mismatch
        }
    }
    return st.empty();                      // leftovers = unclosed
}

int main() {
    cout << isBalanced("{[()]}") << "\\n";  // 1
    cout << isBalanced("{[(])}") << "\\n";  // 0
}`,
java: `import java.util.*;

static boolean isBalanced(String s) {
    Deque<Character> st = new ArrayDeque<>();
    Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');

    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);                            // opener
        } else if (pairs.containsKey(c)) {
            if (st.isEmpty() || st.pop() != pairs.get(c))
                return false;                      // mismatch or nothing open
        }
    }
    return st.isEmpty();                           // leftovers = unclosed
}

// isBalanced("{[()]}") -> true
// isBalanced("{[(])}") -> false`,
python: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []

    for ch in s:
        if ch in "([{":
            stack.append(ch)              # opener -> remember it
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False              # mismatch, or nothing was open
    return not stack                      # leftovers means unclosed

print(is_balanced("{[()]}"))              # True
print(is_balanced("{[(])}"))              # False

# Same engine drives: HTML tag validation, JSON parsing,
# code editors' bracket highlighting, and expression evaluation.`,
javascript: `function isBalanced(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];

  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);                       // opener
    } else if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;  // mismatch / empty
    }
  }
  return stack.length === 0;                // leftovers = unclosed
}

console.log(isBalanced("{[()]}"));   // true
console.log(isBalanced("{[(])}"));   // false` },

{ id: 'monotonic', name: 'Monotonic Stack', big: 'O(n)',
cpp: `// Monotonic stack: "next greater element" in ONE pass
#include <vector>
#include <stack>
using namespace std;

vector<int> nextGreater(vector<int>& a) {
    vector<int> res(a.size(), -1);
    stack<int> st;                       // holds INDICES, values decreasing

    for (int i = 0; i < a.size(); i++) {
        // everything smaller than a[i] has just found its answer
        while (!st.empty() && a[st.top()] < a[i]) {
            res[st.top()] = a[i];
            st.pop();
        }
        st.push(i);                      // wait for a bigger value
    }
    return res;                          // -1 means nothing bigger exists
}
// [2,1,2,4,3] -> [4,2,4,-1,-1]     O(n): each index pushed and popped once

// Same shape solves: Daily Temperatures, Stock Span,
// Largest Rectangle in Histogram, Trapping Rain Water.`,
java: `import java.util.*;

static int[] nextGreater(int[] a) {
    int[] res = new int[a.length];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>();   // indices, values decreasing

    for (int i = 0; i < a.length; i++) {
        while (!st.isEmpty() && a[st.peek()] < a[i])
            res[st.pop()] = a[i];             // resolved by a[i]
        st.push(i);
    }
    return res;
}
// [2,1,2,4,3] -> [4,2,4,-1,-1]

// Reverse the comparison for "next smaller"; iterate backwards for
// "previous greater". Every element is pushed and popped once -> O(n).`,
python: `def next_greater(a):
    res = [-1] * len(a)
    stack = []                       # holds INDICES, values decreasing

    for i, x in enumerate(a):
        # every pending index smaller than x just found its answer
        while stack and a[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)              # wait for something bigger
    return res

print(next_greater([2, 1, 2, 4, 3]))   # [4, 2, 4, -1, -1]

def daily_temperatures(temps):        # days to wait for a warmer day
    res = [0] * len(temps)
    stack = []
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            res[j] = i - j            # distance, not value
        stack.append(i)
    return res

print(daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]))`,
javascript: `function nextGreater(a) {
  const res = new Array(a.length).fill(-1);
  const st = [];                     // indices, values decreasing

  for (let i = 0; i < a.length; i++) {
    while (st.length && a[st.at(-1)] < a[i])
      res[st.pop()] = a[i];          // resolved by a[i]
    st.push(i);
  }
  return res;
}
console.log(nextGreater([2, 1, 2, 4, 3]));   // [4, 2, 4, -1, -1]

function dailyTemperatures(t) {      // how many days until it warms up
  const res = new Array(t.length).fill(0);
  const st = [];
  for (let i = 0; i < t.length; i++) {
    while (st.length && t[st.at(-1)] < t[i]) {
      const j = st.pop();
      res[j] = i - j;                // distance, not value
    }
    st.push(i);
  }
  return res;
}` }
]},

/* ================= QUEUE ================= */
queue: { label: 'queue.cpp', ops: [
{ id: 'builtin', name: 'Built-in Queue', big: 'O(1)',
cpp: `// std::queue — FIFO, every core operation O(1)
#include <iostream>
#include <queue>
#include <deque>
using namespace std;

int main() {
    queue<int> q;

    q.push(10);              // enqueue at the REAR   [10]
    q.push(20);              // [10, 20]
    q.push(30);              // [10, 20, 30]

    cout << q.front() << "\\n";  // 10  — the oldest element
    cout << q.back()  << "\\n";  // 30  — the newest
    q.pop();                      // dequeue from the FRONT (removes 10)
    cout << q.front() << "\\n";  // 20

    cout << q.size() << q.empty() << "\\n";

    // Both ends open? Use a deque.
    deque<int> dq;
    dq.push_front(1); dq.push_back(2);
    dq.pop_front();   dq.pop_back();

    // Priority order instead of arrival order? A heap.
    priority_queue<int> maxHeap;                        // largest first
    priority_queue<int, vector<int>, greater<int>> minHeap;  // smallest first
}`,
java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Queue<Integer> q = new LinkedList<>();   // or ArrayDeque

        q.offer(10);                    // enqueue at the rear (add() throws)
        q.offer(20);
        q.offer(30);

        System.out.println(q.peek());   // 10 — oldest, not removed
        System.out.println(q.poll());   // 10 — removed and returned
        System.out.println(q.peek());   // 20
        System.out.println(q.size());   // 2

        // Both ends
        Deque<Integer> dq = new ArrayDeque<>();
        dq.offerFirst(1); dq.offerLast(2);
        dq.pollFirst();   dq.pollLast();

        // Priority order — a binary heap, O(log n) per operation
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        PriorityQueue<Integer> maxHeap =
            new PriorityQueue<>(Comparator.reverseOrder());
    }
}`,
python: `from collections import deque

q = deque()

q.append(10)          # enqueue at the rear
q.append(20)
q.append(30)

print(q[0])           # 10  front, not removed
print(q[-1])          # 30  rear
print(q.popleft())    # 10  dequeue — O(1), unlike list.pop(0)
print(len(q))         # 2

# Both ends: deque already does it
q.appendleft(5)       # push front
q.pop()               # pop rear

# NEVER use a plain list as a queue:
#   lst.pop(0) is O(n) because every element shifts left.

# Priority order instead of arrival order
import heapq
h = []
heapq.heappush(h, 5)          # min-heap
heapq.heappush(h, 1)
print(heapq.heappop(h))       # 1
# max-heap trick: push negated values`,
javascript: `// Array as a queue: push() is O(1) but shift() is O(n) — fine for small n
const q = [];
q.push(10);            // enqueue rear
q.push(20);
console.log(q[0]);     // 10 front
console.log(q.shift());// 10 dequeue  — O(n)!

// O(1) queue: keep a head index and never shift
class Queue {
  #items = [];
  #head = 0;

  enqueue(x) { this.#items.push(x); return this; }        // O(1)

  dequeue() {                                            // O(1)
    if (this.isEmpty) return undefined;
    const x = this.#items[this.#head];
    this.#items[this.#head++] = undefined;               // release the ref
    if (this.#head > 64 && this.#head * 2 > this.#items.length) {
      this.#items = this.#items.slice(this.#head);       // compact rarely
      this.#head = 0;
    }
    return x;
  }

  get front()   { return this.#items[this.#head]; }
  get size()    { return this.#items.length - this.#head; }
  get isEmpty() { return this.size === 0; }
}` },

{ id: 'circular', name: 'Circular Queue', big: 'O(1)',
cpp: `// Circular queue — modulo wrap reuses the freed front slots
#include <iostream>
using namespace std;

class CircularQueue {
    static const int CAP = 5;
    int arr[CAP];
    int front = 0, rear = -1, count = 0;
public:
    bool isEmpty() { return count == 0; }
    bool isFull()  { return count == CAP; }

    void enqueue(int x) {
        if (isFull()) { cout << "QUEUE FULL\\n"; return; }
        rear = (rear + 1) % CAP;       // <-- the wrap that makes it circular
        arr[rear] = x;
        count++;
    }

    int dequeue() {
        if (isEmpty()) { cout << "QUEUE EMPTY\\n"; return -1; }
        int x = arr[front];
        front = (front + 1) % CAP;     // no shifting — just move the index
        count--;
        return x;
    }

    int peek() { return isEmpty() ? -1 : arr[front]; }
    int size() { return count; }
};
// Without the modulo you would waste every slot you dequeued.`,
java: `// Circular queue — modulo wrap, no shifting
class CircularQueue {
    private final int[] arr;
    private int front = 0, rear = -1, count = 0;

    CircularQueue(int capacity) { arr = new int[capacity]; }

    boolean isEmpty() { return count == 0; }
    boolean isFull()  { return count == arr.length; }

    void enqueue(int x) {
        if (isFull()) throw new IllegalStateException("Queue is full");
        rear = (rear + 1) % arr.length;      // wrap around
        arr[rear] = x;
        count++;
    }

    int dequeue() {
        if (isEmpty()) throw new IllegalStateException("Queue is empty");
        int x = arr[front];
        front = (front + 1) % arr.length;    // move the index, do not shift
        count--;
        return x;
    }

    int peek() { return isEmpty() ? -1 : arr[front]; }
    int size() { return count; }
}`,
python: `# Circular queue — modulo wrap reuses freed front slots
class CircularQueue:
    def __init__(self, capacity=5):
        self.cap = capacity
        self.arr = [None] * capacity
        self.front = 0
        self.rear = -1
        self.count = 0

    def is_empty(self):
        return self.count == 0

    def is_full(self):
        return self.count == self.cap

    def enqueue(self, x):
        if self.is_full():
            raise OverflowError("Queue is full")
        self.rear = (self.rear + 1) % self.cap    # <-- the wrap
        self.arr[self.rear] = x
        self.count += 1

    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        x = self.arr[self.front]
        self.arr[self.front] = None
        self.front = (self.front + 1) % self.cap  # move index, no shifting
        self.count -= 1
        return x

    def peek(self):
        return None if self.is_empty() else self.arr[self.front]

q = CircularQueue(3)
q.enqueue(1); q.enqueue(2); q.dequeue(); q.enqueue(3)   # slot 0 reused`,
javascript: `// Circular queue — a fixed ring buffer
class CircularQueue {
  constructor(capacity = 5) {
    this.cap = capacity;
    this.arr = new Array(capacity).fill(null);
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }

  get isEmpty() { return this.count === 0; }
  get isFull()  { return this.count === this.cap; }

  enqueue(x) {
    if (this.isFull) throw new Error("Queue is full");
    this.rear = (this.rear + 1) % this.cap;    // wrap around
    this.arr[this.rear] = x;
    this.count++;
    return this;
  }

  dequeue() {
    if (this.isEmpty) throw new Error("Queue is empty");
    const x = this.arr[this.front];
    this.arr[this.front] = null;
    this.front = (this.front + 1) % this.cap;  // index moves, data does not
    this.count--;
    return x;
  }

  peek() { return this.isEmpty ? undefined : this.arr[this.front]; }
}` },

{ id: 'scratch', name: 'Linked Queue', big: 'O(1)',
cpp: `// Linked queue — unbounded, O(1) at both ends via a tail pointer
#include <iostream>
using namespace std;

class LinkedQueue {
    struct Node { int data; Node* next; Node(int d) : data(d), next(nullptr) {} };
    Node* front = nullptr;
    Node* rear  = nullptr;
    int count = 0;
public:
    void enqueue(int x) {                 // O(1) thanks to rear
        Node* n = new Node(x);
        if (!rear) front = rear = n;      // first element
        else { rear->next = n; rear = n; }
        count++;
    }

    int dequeue() {                       // O(1)
        if (!front) { cout << "EMPTY\\n"; return -1; }
        Node* old = front;
        int x = old->data;
        front = front->next;
        if (!front) rear = nullptr;       // queue drained — reset rear too
        delete old;
        count--;
        return x;
    }

    int peek() { return front ? front->data : -1; }
    bool empty() { return count == 0; }
    ~LinkedQueue() { while (!empty()) dequeue(); }
};`,
java: `// Linked queue — unbounded, O(1) at both ends
class LinkedQueue {
    private static class Node {
        int data; Node next;
        Node(int d) { data = d; }
    }

    private Node front, rear;
    private int count;

    void enqueue(int x) {                  // O(1)
        Node n = new Node(x);
        if (rear == null) front = rear = n;    // first element
        else { rear.next = n; rear = n; }
        count++;
    }

    int dequeue() {                        // O(1)
        if (front == null) throw new IllegalStateException("Queue is empty");
        int x = front.data;
        front = front.next;
        if (front == null) rear = null;        // drained — reset rear
        count--;
        return x;
    }

    int peek()   { return front == null ? -1 : front.data; }
    int size()   { return count; }
    boolean isEmpty() { return count == 0; }
}`,
python: `# Linked queue — unbounded, O(1) at both ends
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedQueue:
    def __init__(self):
        self.front = None
        self.rear = None
        self.count = 0

    def enqueue(self, x):              # O(1) because we keep rear
        n = Node(x)
        if self.rear is None:
            self.front = self.rear = n  # first element
        else:
            self.rear.next = n
            self.rear = n
        self.count += 1

    def dequeue(self):                 # O(1)
        if self.front is None:
            raise IndexError("Queue is empty")
        x = self.front.data
        self.front = self.front.next
        if self.front is None:
            self.rear = None           # drained — reset rear as well
        self.count -= 1
        return x

    def peek(self):
        return self.front.data if self.front else None

    def __len__(self):
        return self.count`,
javascript: `// Linked queue — unbounded, O(1) at both ends
class LinkedQueue {
  #front = null;
  #rear = null;
  #count = 0;

  enqueue(value) {                       // O(1)
    const node = { value, next: null };
    if (!this.#rear) this.#front = this.#rear = node;   // first element
    else { this.#rear.next = node; this.#rear = node; }
    this.#count++;
    return this;
  }

  dequeue() {                            // O(1)
    if (!this.#front) throw new Error("Queue is empty");
    const { value } = this.#front;
    this.#front = this.#front.next;
    if (!this.#front) this.#rear = null;  // drained — reset rear
    this.#count--;
    return value;
  }

  peek()        { return this.#front?.value; }
  get size()    { return this.#count; }
  get isEmpty() { return this.#count === 0; }
}` },

{ id: 'bfs', name: 'BFS — Queues at Work', big: 'O(V+E)',
cpp: `// The queue's killer app: breadth-first search
#include <iostream>
#include <queue>
#include <vector>
#include <unordered_set>
using namespace std;

// Shortest path length in an UNWEIGHTED graph
int bfsDistance(vector<vector<int>>& adj, int start, int target) {
    queue<pair<int,int>> q;                 // (node, distance)
    unordered_set<int> seen;

    q.push({start, 0});
    seen.insert(start);                     // mark on ENQUEUE, not dequeue

    while (!q.empty()) {
        auto [node, dist] = q.front(); q.pop();
        if (node == target) return dist;    // first arrival == shortest

        for (int nb : adj[node])
            if (!seen.count(nb)) {
                seen.insert(nb);
                q.push({nb, dist + 1});
            }
    }
    return -1;                              // unreachable
}
// Every vertex enters the queue once, every edge is inspected once: O(V+E)`,
java: `import java.util.*;

// Shortest path length in an unweighted graph
static int bfsDistance(List<List<Integer>> adj, int start, int target) {
    Queue<int[]> q = new LinkedList<>();     // {node, distance}
    boolean[] seen = new boolean[adj.size()];

    q.offer(new int[]{start, 0});
    seen[start] = true;                      // mark on ENQUEUE

    while (!q.isEmpty()) {
        int[] cur = q.poll();
        if (cur[0] == target) return cur[1]; // first arrival is shortest

        for (int nb : adj.get(cur[0]))
            if (!seen[nb]) {
                seen[nb] = true;
                q.offer(new int[]{nb, cur[1] + 1});
            }
    }
    return -1;                               // unreachable
}`,
python: `from collections import deque

def bfs_distance(adj, start, target):     # unweighted shortest path
    q = deque([(start, 0)])               # (node, distance)
    seen = {start}                        # mark on ENQUEUE, not on dequeue

    while q:
        node, dist = q.popleft()
        if node == target:
            return dist                   # first arrival == shortest
        for nb in adj[node]:
            if nb not in seen:
                seen.add(nb)
                q.append((nb, dist + 1))
    return -1                             # unreachable

def rotting_oranges(grid):                # multi-source BFS by "minute"
    rows, cols = len(grid), len(grid[0])
    q = deque((r, c) for r in range(rows) for c in range(cols) if grid[r][c] == 2)
    fresh = sum(row.count(1) for row in grid)
    minutes = 0

    while q and fresh:
        for _ in range(len(q)):           # one whole level = one minute
            r, c = q.popleft()
            for dr, dc in ((1,0), (-1,0), (0,1), (0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    q.append((nr, nc))
        minutes += 1
    return -1 if fresh else minutes`,
javascript: `// BFS — the queue's killer app
function bfsDistance(adj, start, target) {
  const q = [[start, 0]];            // (node, distance)
  const seen = new Set([start]);     // mark on ENQUEUE
  let head = 0;                      // index instead of shift() -> O(1)

  while (head < q.length) {
    const [node, dist] = q[head++];
    if (node === target) return dist;      // first arrival is shortest

    for (const nb of adj[node] ?? [])
      if (!seen.has(nb)) {
        seen.add(nb);
        q.push([nb, dist + 1]);
      }
  }
  return -1;                          // unreachable
}

// Level-by-level variant — "how many steps/minutes did it take?"
function bfsLevels(adj, start) {
  let level = [start];
  const seen = new Set(level);
  const out = [];
  while (level.length) {
    out.push([...level]);
    const next = [];
    for (const n of level)
      for (const nb of adj[n] ?? [])
        if (!seen.has(nb)) { seen.add(nb); next.push(nb); }
    level = next;
  }
  return out;                         // out[k] = every node k steps away
}` }
]},

/* ================= GRAPHS ================= */
graphs: { label: 'graph.cpp', ops: [
{ id: 'represent', name: 'Representation', big: 'O(V+E)',
cpp: `// Adjacency list (sparse) vs adjacency matrix (dense)
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int V = 5;

    // 1. ADJACENCY LIST — O(V+E) space, the usual choice
    vector<vector<int>> adj(V);
    auto addEdge = [&](int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u);        // drop this line for a DIRECTED graph
    };
    addEdge(0, 1); addEdge(0, 4); addEdge(1, 2); addEdge(3, 4);

    for (int u = 0; u < V; u++) {
        cout << u << " -> ";
        for (int v : adj[u]) cout << v << " ";
        cout << "\\n";
    }

    // 2. ADJACENCY MATRIX — O(V^2) space, O(1) adjacency test
    vector<vector<int>> mat(V, vector<int>(V, 0));
    mat[0][1] = mat[1][0] = 1;
    cout << "0-1 adjacent? " << mat[0][1] << "\\n";

    // 3. WEIGHTED list: store (neighbour, weight)
    vector<vector<pair<int,int>>> wadj(V);
    wadj[0].push_back({1, 5});      // edge 0 -> 1 costing 5
}`,
java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        int V = 5;

        // 1. ADJACENCY LIST — O(V+E) space
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < V; i++) adj.add(new ArrayList<>());

        // undirected: add both directions
        adj.get(0).add(1); adj.get(1).add(0);
        adj.get(0).add(4); adj.get(4).add(0);
        adj.get(1).add(2); adj.get(2).add(1);

        for (int u = 0; u < V; u++)
            System.out.println(u + " -> " + adj.get(u));

        // 2. ADJACENCY MATRIX — O(V^2) space, O(1) adjacency test
        int[][] mat = new int[V][V];
        mat[0][1] = mat[1][0] = 1;

        // 3. WEIGHTED list
        List<List<int[]>> weighted = new ArrayList<>();
        for (int i = 0; i < V; i++) weighted.add(new ArrayList<>());
        weighted.get(0).add(new int[]{1, 5});   // 0 -> 1, cost 5
    }
}`,
python: `from collections import defaultdict

# 1. ADJACENCY LIST — the default choice, O(V+E) space
adj = defaultdict(list)

def add_edge(u, v, directed=False):
    adj[u].append(v)
    if not directed:
        adj[v].append(u)          # undirected -> both directions

add_edge(0, 1); add_edge(0, 4); add_edge(1, 2); add_edge(3, 4)
for u in adj:
    print(u, "->", adj[u])

# 2. ADJACENCY MATRIX — O(V^2) space, O(1) "is u next to v?"
V = 5
mat = [[0] * V for _ in range(V)]
mat[0][1] = mat[1][0] = 1

# 3. WEIGHTED graph — store (neighbour, weight)
wadj = defaultdict(list)
wadj[0].append((1, 5))            # edge 0 -> 1 costing 5

# 4. A GRID is already a graph: neighbours are the 4 directions
DIRS = [(1, 0), (-1, 0), (0, 1), (0, -1)]
def neighbours(r, c, rows, cols):
    return [(r + dr, c + dc) for dr, dc in DIRS
            if 0 <= r + dr < rows and 0 <= c + dc < cols]`,
javascript: `// 1. ADJACENCY LIST via Map — O(V+E) space
const adj = new Map();

function addEdge(u, v, directed = false) {
  if (!adj.has(u)) adj.set(u, []);
  if (!adj.has(v)) adj.set(v, []);
  adj.get(u).push(v);
  if (!directed) adj.get(v).push(u);   // undirected -> both ways
}

addEdge(0, 1); addEdge(0, 4); addEdge(1, 2); addEdge(3, 4);
for (const [u, nbrs] of adj) console.log(u, "->", nbrs);

// 2. ADJACENCY MATRIX — O(V^2) space, O(1) adjacency test
const V = 5;
const mat = Array.from({ length: V }, () => new Array(V).fill(0));
mat[0][1] = mat[1][0] = 1;

// 3. WEIGHTED: store [neighbour, weight]
const wadj = new Map([[0, [[1, 5]]]]);   // 0 -> 1 costing 5

// 4. A grid IS a graph
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];` },

{ id: 'bfs', name: 'BFS Traversal', big: 'O(V+E)',
cpp: `// BFS — explore level by level with a queue
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

void bfs(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    queue<int> q;

    visited[start] = true;        // mark on ENQUEUE, or duplicates pile up
    q.push(start);

    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";

        for (int nb : adj[node])
            if (!visited[nb]) {
                visited[nb] = true;
                q.push(nb);
            }
    }
}

// Shortest hop count from start to every vertex
vector<int> shortestPaths(vector<vector<int>>& adj, int start) {
    vector<int> dist(adj.size(), -1);
    queue<int> q;
    dist[start] = 0; q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u])
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
    return dist;      // -1 = unreachable
}`,
java: `import java.util.*;

static void bfs(List<List<Integer>> adj, int start) {
    boolean[] visited = new boolean[adj.size()];
    Queue<Integer> q = new LinkedList<>();

    visited[start] = true;          // mark on ENQUEUE
    q.offer(start);

    while (!q.isEmpty()) {
        int node = q.poll();
        System.out.print(node + " ");

        for (int nb : adj.get(node))
            if (!visited[nb]) {
                visited[nb] = true;
                q.offer(nb);
            }
    }
}

// Shortest hop count to every vertex
static int[] shortestPaths(List<List<Integer>> adj, int start) {
    int[] dist = new int[adj.size()];
    Arrays.fill(dist, -1);
    Queue<Integer> q = new LinkedList<>();
    dist[start] = 0; q.offer(start);
    while (!q.isEmpty()) {
        int u = q.poll();
        for (int v : adj.get(u))
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q.offer(v); }
    }
    return dist;
}`,
python: `from collections import deque

def bfs(adj, start):                  # level-by-level traversal
    visited = {start}                 # mark on ENQUEUE, not on dequeue
    q = deque([start])
    order = []

    while q:
        node = q.popleft()
        order.append(node)
        for nb in adj[node]:
            if nb not in visited:
                visited.add(nb)
                q.append(nb)
    return order

def shortest_paths(adj, start):       # hops from start to everything
    dist = {start: 0}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in adj[u]:
            if v not in dist:
                dist[v] = dist[u] + 1    # first arrival = shortest
                q.append(v)
    return dist

# Time O(V+E) · Space O(V)
# BFS gives the shortest path only when every edge has the same weight.`,
javascript: `function bfs(adj, start) {                 // level-by-level
  const visited = new Set([start]);        // mark on ENQUEUE
  const q = [start];
  const order = [];
  let head = 0;                            // index beats shift() — O(1)

  while (head < q.length) {
    const node = q[head++];
    order.push(node);
    for (const nb of adj.get(node) ?? [])
      if (!visited.has(nb)) {
        visited.add(nb);
        q.push(nb);
      }
  }
  return order;
}

function shortestPaths(adj, start) {       // hop counts
  const dist = new Map([[start, 0]]);
  const q = [start];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    for (const v of adj.get(u) ?? [])
      if (!dist.has(v)) { dist.set(v, dist.get(u) + 1); q.push(v); }
  }
  return dist;
}
// Time O(V+E) · Space O(V)` },

{ id: 'dfs', name: 'DFS Traversal', big: 'O(V+E)',
cpp: `// DFS — go deep first, then backtrack
#include <iostream>
#include <stack>
#include <vector>
using namespace std;

// Recursive: the call stack does the bookkeeping
void dfs(vector<vector<int>>& adj, int node, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";

    for (int nb : adj[node])
        if (!visited[nb]) dfs(adj, nb, visited);
}

// Iterative: an explicit stack — safe on huge graphs
void dfsIterative(vector<vector<int>>& adj, int start) {
    vector<bool> visited(adj.size(), false);
    stack<int> st;
    st.push(start);

    while (!st.empty()) {
        int node = st.top(); st.pop();
        if (visited[node]) continue;      // may be pushed more than once
        visited[node] = true;
        cout << node << " ";

        for (int nb : adj[node])
            if (!visited[nb]) st.push(nb);
    }
}

// Count connected components — the classic DFS use
int components(vector<vector<int>>& adj) {
    vector<bool> visited(adj.size(), false);
    int count = 0;
    for (int i = 0; i < adj.size(); i++)
        if (!visited[i]) { dfs(adj, i, visited); count++; }
    return count;
}`,
java: `import java.util.*;

// Recursive DFS
static void dfs(List<List<Integer>> adj, int node, boolean[] visited) {
    visited[node] = true;
    System.out.print(node + " ");
    for (int nb : adj.get(node))
        if (!visited[nb]) dfs(adj, nb, visited);
}

// Iterative DFS — no stack-overflow risk
static void dfsIterative(List<List<Integer>> adj, int start) {
    boolean[] visited = new boolean[adj.size()];
    Deque<Integer> st = new ArrayDeque<>();
    st.push(start);

    while (!st.isEmpty()) {
        int node = st.pop();
        if (visited[node]) continue;
        visited[node] = true;
        System.out.print(node + " ");
        for (int nb : adj.get(node))
            if (!visited[nb]) st.push(nb);
    }
}

// Connected components
static int components(List<List<Integer>> adj) {
    boolean[] visited = new boolean[adj.size()];
    int count = 0;
    for (int i = 0; i < adj.size(); i++)
        if (!visited[i]) { dfs(adj, i, visited); count++; }
    return count;
}`,
python: `def dfs(adj, node, visited=None, order=None):    # recursive
    visited = set() if visited is None else visited
    order = [] if order is None else order

    visited.add(node)
    order.append(node)
    for nb in adj[node]:
        if nb not in visited:
            dfs(adj, nb, visited, order)         # go deep, then backtrack
    return order

def dfs_iterative(adj, start):                   # explicit stack
    visited, st, order = set(), [start], []
    while st:
        node = st.pop()
        if node in visited:
            continue                             # may be pushed twice
        visited.add(node)
        order.append(node)
        st.extend(reversed(adj[node]))           # reversed = same order as recursion
    return order

def components(adj, nodes):                      # disconnected graphs
    visited, count = set(), 0
    for n in nodes:
        if n not in visited:
            dfs(adj, n, visited)
            count += 1
    return count

def has_cycle_undirected(adj, start):            # parent-tracking DFS
    visited = set()
    def go(node, parent):
        visited.add(node)
        for nb in adj[node]:
            if nb == parent:
                continue                          # the edge we came in on
            if nb in visited or go(nb, node):
                return True
        return False
    return go(start, None)`,
javascript: `function dfs(adj, node, visited = new Set(), order = []) {
  visited.add(node);
  order.push(node);
  for (const nb of adj.get(node) ?? [])
    if (!visited.has(nb)) dfs(adj, nb, visited, order);   // deep first
  return order;
}

function dfsIterative(adj, start) {          // explicit stack
  const visited = new Set(), st = [start], order = [];
  while (st.length) {
    const node = st.pop();
    if (visited.has(node)) continue;         // may be pushed twice
    visited.add(node);
    order.push(node);
    for (const nb of [...(adj.get(node) ?? [])].reverse()) st.push(nb);
  }
  return order;
}

function components(adj) {                   // count the islands
  const visited = new Set();
  let count = 0;
  for (const node of adj.keys())
    if (!visited.has(node)) { dfs(adj, node, visited); count++; }
  return count;
}` },

{ id: 'dijkstra', name: 'Dijkstra & Topo Sort', big: 'O((V+E) log V)',
cpp: `// Dijkstra — shortest paths with NON-NEGATIVE weights
#include <vector>
#include <queue>
#include <climits>
using namespace std;

vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    int V = adj.size();
    vector<int> dist(V, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq; // min-heap

    dist[src] = 0;
    pq.push({0, src});                       // (distance, node)

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;           // stale entry, skip it

        for (auto [v, w] : adj[u])
            if (dist[u] + w < dist[v]) {     // found a cheaper route
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
    }
    return dist;
}
// O((V + E) log V). Negative weights? Use Bellman-Ford instead.

// Kahn's topological sort — valid ordering of a DAG
vector<int> topoSort(vector<vector<int>>& adj) {
    int V = adj.size();
    vector<int> indeg(V, 0), order;
    for (int u = 0; u < V; u++) for (int v : adj[u]) indeg[v]++;

    queue<int> q;
    for (int i = 0; i < V; i++) if (!indeg[i]) q.push(i);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
    }
    return order.size() == V ? order : vector<int>{};   // empty = cycle
}`,
java: `import java.util.*;

// Dijkstra — non-negative weights only
static int[] dijkstra(List<List<int[]>> adj, int src) {
    int V = adj.size();
    int[] dist = new int[V];
    Arrays.fill(dist, Integer.MAX_VALUE);
    PriorityQueue<int[]> pq =
        new PriorityQueue<>((a, b) -> a[0] - b[0]);   // min-heap by distance

    dist[src] = 0;
    pq.offer(new int[]{0, src});

    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue;                    // stale entry

        for (int[] e : adj.get(u)) {
            int v = e[0], w = e[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}

// Kahn's topological sort
static List<Integer> topoSort(List<List<Integer>> adj) {
    int V = adj.size();
    int[] indeg = new int[V];
    for (int u = 0; u < V; u++) for (int v : adj.get(u)) indeg[v]++;

    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < V; i++) if (indeg[i] == 0) q.offer(i);

    List<Integer> order = new ArrayList<>();
    while (!q.isEmpty()) {
        int u = q.poll();
        order.add(u);
        for (int v : adj.get(u)) if (--indeg[v] == 0) q.offer(v);
    }
    return order.size() == V ? order : List.of();     // empty = cycle
}`,
python: `import heapq
from collections import deque, defaultdict

def dijkstra(adj, src):               # non-negative weights only
    dist = {src: 0}
    pq = [(0, src)]                   # (distance, node) min-heap

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist.get(u, float("inf")):
            continue                  # stale entry, already improved
        for v, w in adj[u]:
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v] = nd          # cheaper route found
                heapq.heappush(pq, (nd, v))
    return dist
# O((V + E) log V). Negative weights -> Bellman-Ford.

def topo_sort(adj, nodes):            # Kahn's algorithm on a DAG
    indeg = {n: 0 for n in nodes}
    for u in nodes:
        for v in adj[u]:
            indeg[v] += 1

    q = deque(n for n in nodes if indeg[n] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == len(nodes) else []   # [] means a cycle`,
javascript: `// Dijkstra with a simple binary-heap substitute
function dijkstra(adj, src) {
  const dist = new Map([[src, 0]]);
  const pq = [[0, src]];                     // (distance, node)

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);          // swap for a real heap at scale
    const [d, u] = pq.shift();
    if (d > (dist.get(u) ?? Infinity)) continue;   // stale

    for (const [v, w] of adj.get(u) ?? []) {
      const nd = d + w;
      if (nd < (dist.get(v) ?? Infinity)) {
        dist.set(v, nd);                     // cheaper route
        pq.push([nd, v]);
      }
    }
  }
  return dist;
}

// Kahn's topological sort
function topoSort(adj) {
  const indeg = new Map([...adj.keys()].map(k => [k, 0]));
  for (const [, nbrs] of adj)
    for (const v of nbrs) indeg.set(v, (indeg.get(v) ?? 0) + 1);

  const q = [...indeg].filter(([, d]) => d === 0).map(([n]) => n);
  const order = [];
  let head = 0;
  while (head < q.length) {
    const u = q[head++];
    order.push(u);
    for (const v of adj.get(u) ?? []) {
      indeg.set(v, indeg.get(v) - 1);
      if (indeg.get(v) === 0) q.push(v);
    }
  }
  return order.length === indeg.size ? order : [];   // [] = cycle
}` }
]}

});
