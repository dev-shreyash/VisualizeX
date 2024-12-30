
export function bubbleSort(array) {
    const steps = [];
    const arr = [...array]; // Clone the array to avoid mutation
  
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Record the current step
        steps.push({
          array: [...arr],
          comparison: [j, j + 1], // Highlight these indices
        });
  
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
  
          // Record the swap
          steps.push({
            array: [...arr],
            swapped: [j, j + 1], // Highlight swapped indices
          });
        }
      }
    }
  
    // Final state
    steps.push({ array: [...arr], sorted: true });
  
    return steps;
  }
  