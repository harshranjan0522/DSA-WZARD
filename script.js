function showCode(lang) {
    let code = {
        cpp: `// C++ Array Example
#include<iostream>
using namespace std;

int main() {
  int arr[5] = {1, 2, 3, 4, 5};
  for(int i = 0; i < 5; i++) {
    cout << arr[i] << " ";
  }
  return 0;
}`,
        java: `// Java Array Example
public class Main {
  public static void main(String[] args) {
    int[] arr = {1, 2, 3, 4, 5};
    for (int i : arr) {
      System.out.print(i + " ");
    }
  }
}`,
        py: `# Python Array Example
arr = [1, 2, 3, 4, 5]
for i in arr:
    print(i, end=' ')`
    };

    document.getElementById('code-box').textContent = code[lang];
}
