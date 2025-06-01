document.addEventListener('DOMContentLoaded', function() {
    // Array code examples
    const codeExamples = {
        cpp: `// Array declaration and initialization in C++
#include <iostream>
using namespace std;

int main() {
    // Static array declaration
    int arr[5] = {1, 2, 3, 4, 5};
    
    // Dynamic array declaration
    int* dynamicArr = new int[10];
    
    // Accessing elements
    cout << arr[0]; // Output: 1
    
    return 0;
}`,

        java: `// Array declaration and initialization in Java
public class Main {
    public static void main(String[] args) {
        // Array declaration
        int[] arr = {1, 2, 3, 4, 5};
        
        // Alternative declaration
        int[] anotherArr = new int[10];
        
        // Accessing elements
        System.out.println(arr[0]); // Output: 1
    }
}`,

        python: `# Array (list) declaration in Python
# Python lists are dynamic arrays
arr = [1, 2, 3, 4, 5]

# Accessing elements
print(arr[0]) # Output: 1

# Numpy arrays (for numerical operations)
import numpy as np
np_array = np.array([1, 2, 3, 4, 5])`,

        javascript: `// Array declaration in JavaScript
// Arrays in JS are dynamic and can hold mixed types
const arr = [1, 2, 3, 4, 5];

// Alternative declaration
const anotherArr = new Array(10).fill(0);

// Accessing elements
console.log(arr[0]); // Output: 1

// Common array methods
arr.push(6); // Add to end
arr.pop();   // Remove from end
arr.unshift(0); // Add to beginning
arr.shift(); // Remove from beginning`
    };

    // Initialize terminal
    function initTerminal() {
        const tabs = document.querySelectorAll('.tab-btn');
        const codeDisplays = document.querySelectorAll('.code-display');
        
        // Set initial active tab
        setActiveTab('cpp');
        
        // Add click event listeners to tabs
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.dataset.lang;
                setActiveTab(lang);
            });
        });
    }

    // Set active tab and display corresponding code
    function setActiveTab(lang) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update code display
        document.querySelectorAll('.code-display').forEach(display => {
            display.classList.remove('active');
            if (display.id === `${lang}-code`) {
                display.classList.add('active');
                display.textContent = codeExamples[lang];
            }
        });
    }

    // Initialize when DOM is loaded
    initTerminal();
});
// Smooth scrolling for navigation
document.querySelectorAll('.options a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Skip smooth scrolling for home link (let it do normal redirect)
        if (this.getAttribute('href') === 'index.html') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
            
            // Update active class
            document.querySelectorAll('.options li').forEach(li => {
                li.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        }
    });
});

// Highlight current section in nav while scrolling
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.options li').forEach(li => {
                li.classList.remove('active');
                if (li.querySelector('a')?.getAttribute('href') === `#${sectionId}`) {
                    li.classList.add('active');
                }
            });
        }
    });
});