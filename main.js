function createSudokuGrid() {
    const size = parseInt(document.getElementById("grid-size").value);
    const form = document.getElementById("sudoku-form");
    const errorMessage = document.getElementById("error-message");

    // Clear previous grid and error message
    form.innerHTML = '';
    errorMessage.style.display = 'none';

    // Check if size is a valid square grid (perfect square numbers like 1, 4, 9, 16, 25, 32, ...)
    if (Number.isNaN(size) || !Number.isInteger(Math.sqrt(size)) || size < 1) {
        errorMessage.style.display = 'block';
        disableSolveButton();
        return; // Exit if the grid size is invalid
    }

    // Update grid layout
    form.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    
    // Remove any existing grid classes
    form.className = ''; // Clear all classes
    // Add the appropriate grid class
    form.classList.add(`grid-${size}`);

    // Create rows
    for (let i = 0; i < size; i++) {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("sudoku-row");

        // Create cells for each row
        for (let j = 0; j < size; j++) {
            const input = document.createElement("input");
            input.type = "number";
            input.min = 1;
            input.max = size;
            input.id = `cell-${i * size + j}`;
            input.classList.add("sudoku-cell");

            // Add input event listener to validate input
            input.addEventListener('input', function() {
                validateCellInput(input, size);
            });

            rowDiv.appendChild(input);
        }

        form.appendChild(rowDiv);
    }
}

// Function to validate cell input
function validateCellInput(cell, size) {
    const value = parseInt(cell.value);
    const errorMessage = document.getElementById("error-message");

    // Hide error message initially
    errorMessage.style.display = 'none';

    // Check if the value is valid (between 1 and the grid size)
    if (isNaN(value) || value < 1 || value > size) {
        // Show error message
        errorMessage.textContent = `Input should not be greater than ${size}.`;
        errorMessage.style.display = 'block';
        cell.value = ''; // Clear the input if it's invalid
        return; // Ignore invalid input
    }

    // Validate Sudoku rules (check row, column, subgrid)
    const rowIndex = Math.floor((parseInt(cell.id.split('-')[1]) / size));
    const colIndex = parseInt(cell.id.split('-')[1]) % size;

    if (!isValidInput(rowIndex, colIndex, size)) {
        errorMessage.style.display = 'block';
        disableSolveButton();
    } else {
        enableSolveButton();
    }
}

// Function to check if the current grid is valid
function isValidInput(row, col, size) {
    const grid = getSudokuGrid(size);

    // Validate row
    for (let i = 0; i < size; i++) {
        const cell = document.getElementById(`cell-${row * size + i}`);
        const value = parseInt(cell.value) || 0;
        if (value !== 0 && i !== col && value === parseInt(grid[row][col])) {
            return false; // Duplicate found in row
        }
    }

    // Validate column
    for (let i = 0; i < size; i++) {
        const cell = document.getElementById(`cell-${i * size + col}`);
        const value = parseInt(cell.value) || 0;
        if (value !== 0 && i !== row && value === parseInt(grid[row][col])) {
            return false; // Duplicate found in column
        }
    }

    // Validate subgrid
    const sqrtSize = Math.sqrt(size);
    const startRow = Math.floor(row / sqrtSize) * sqrtSize;
    const startCol = Math.floor(col / sqrtSize) * sqrtSize;

    for (let i = startRow; i < startRow + sqrtSize; i++) {
        for (let j = startCol; j < startCol + sqrtSize; j++) {
            const cell = document.getElementById(`cell-${i * size + j}`);
            const value = parseInt(cell.value) || 0;
            if (value !== 0 && value === parseInt(grid[row][col]) && (i !== row || j !== col)) {
                return false; // Duplicate found in subgrid
            }
        }
    }

    return true;
}

// Function to solve Sudoku
function solveSudoku() {
    const size = parseInt(document.getElementById("grid-size").value);
    const grid = getSudokuGrid(size);
    
    // If the grid is invalid, show error
    if (!grid) {
        alert("Invalid Sudoku grid.");
        return;
    }

    if (solve(grid, size)) {
        displaySolution(grid, size);
    } else {
        alert("No solution found.");
    }
}

// Function to get Sudoku grid from inputs
function getSudokuGrid(size) {
    const grid = [];
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const cell = document.getElementById(`cell-${i * size + j}`);
            const value = parseInt(cell.value) || 0;  // Default to 0 if the cell is empty
            row.push(value);
        }
        grid.push(row);
    }

    return grid;
}

// Sudoku solver logic
function solve(grid, size) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (grid[row][col] === 0) {  // Find an empty cell
                for (let num = 1; num <= size; num++) {
                    if (isValid(grid, row, col, num, size)) {
                        grid[row][col] = num;

                        if (solve(grid, size)) {
                            return true; // Recurse with the next empty cell
                        }

                        grid[row][col] = 0;  // Backtrack if no solution is found
                    }
                }
                return false;  // No valid number found, trigger backtracking
            }
        }
    }
    return true;
}

// Check if placing num in grid[row][col] is valid
function isValid(grid, row, col, num, size) {
    // Check row
    for (let c = 0; c < size; c++) {
        if (grid[row][c] === num) {
            return false;
        }
    }

    // Check column
    for (let r = 0; r < size; r++) {
        if (grid[r][col] === num) {
            return false;
        }
    }

    // Check subgrid
    const sqrtSize = Math.sqrt(size);
    const subgridRowStart = Math.floor(row / sqrtSize) * sqrtSize;
    const subgridColStart = Math.floor(col / sqrtSize) * sqrtSize;

    for (let r = subgridRowStart; r < subgridRowStart + sqrtSize; r++) {
        for (let c = subgridColStart; c < subgridColStart + sqrtSize; c++) {
            if (grid[r][c] === num) {
                return false;
            }
        }
    }

    return true;
}

// Display the solution on the grid
function displaySolution(grid, size) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.getElementById(`cell-${i * size + j}`);
            cell.value = grid[i][j];  // Set the value in the cell
        }
    }
}

// Function to reset the grid
function resetGrid() {
    const size = parseInt(document.getElementById("grid-size").value);
    const form = document.getElementById("sudoku-form");
    const errorMessage = document.getElementById("error-message");

    // Reset all cells to empty
    const inputs = form.getElementsByTagName("input");
    for (let input of inputs) {
        input.value = '';
    }
    errorMessage.style.display = 'none';
    enableSolveButton(); // Enable solve button after reset
}

// Function to disable the "Solve" button
function disableSolveButton() {
    document.getElementById("solve-button").disabled = true;
}

// Function to enable the "Solve" button
function enableSolveButton() {
    document.getElementById("solve-button").disabled = false;
}

// Attach event listeners
document.getElementById("generate-grid").addEventListener("click", createSudokuGrid);
document.getElementById("solve-button").addEventListener("click", solveSudoku);
document.getElementById("reset-button").addEventListener("click", resetGrid);