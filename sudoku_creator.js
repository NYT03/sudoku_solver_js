let solutionGrid = null; // Store the solution grid

function createSudokuGrid() {
    const size = parseInt(document.getElementById("grid-size").value);
    const form = document.getElementById("sudoku-form");
    const errorMessage = document.getElementById("error-message");

    // Clear previous grid and error message
    form.innerHTML = '';
    errorMessage.style.display = 'none';

    // Check if size is a valid square grid
    if (Number.isNaN(size) || !Number.isInteger(Math.sqrt(size)) || size < 1) {
        errorMessage.style.display = 'block';
        return;
    }

    // Update grid layout
    form.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    form.className = '';
    form.classList.add(`grid-${size}`);

    // Create a valid Sudoku grid
    const grid = generateValidSudoku(size);
    solutionGrid = grid.map(row => row.slice()); // Store the solution

    // Remove some numbers to create a puzzle
    const puzzleGrid = createPuzzle(grid, size);

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
            input.value = puzzleGrid[i][j] || ''; // Pre-fill with a valid number or leave blank

            rowDiv.appendChild(input);
        }

        form.appendChild(rowDiv);
    }
}

// Function to generate a valid Sudoku grid
function generateValidSudoku(size) {
    const grid = Array.from({ length: size }, () => Array(size).fill(0));

    // Simple backtracking algorithm to fill the grid
    function fillGrid() {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col] === 0) {
                    for (let num = 1; num <= size; num++) {
                        if (isValid(grid, row, col, num, size)) {
                            grid[row][col] = num;
                            if (fillGrid()) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    fillGrid();
    return grid;
}

// Function to create a puzzle by removing some numbers
function createPuzzle(grid, size) {
    const puzzleGrid = grid.map(row => row.slice());
    const totalCells = size * size;
    const cellsToRemove = Math.floor(totalCells * 0.5); // Remove 50% of the cells

    for (let i = 0; i < cellsToRemove; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * size);
            col = Math.floor(Math.random() * size);
        } while (puzzleGrid[row][col] === 0);

        puzzleGrid[row][col] = 0;
    }

    return puzzleGrid;
}

// Function to check if the current grid is solved correctly
function checkSolution() {
    const size = parseInt(document.getElementById("grid-size").value);
    const grid = getSudokuGrid(size);
    const errorMessage = document.getElementById("error-message");

    // Attempt to solve the grid based on the current state
    if (!grid || !solveSudoku(grid, size)) {
        errorMessage.textContent = "Solution not possible based on the current board. Showing the correct solution.";
        errorMessage.style.display = 'block';
        showSolution();
        return;
    }
    else{
        errorMessage.style.display = 'none';
        alert("The solution is incorrect!");
    }
    // If the grid is solved correctly, hide any error messages
}

// Function to get Sudoku grid from inputs
function getSudokuGrid(size) {
    const grid = [];
    
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            const cell = document.getElementById(`cell-${i * size + j}`);
            const value = parseInt(cell.value) || 0;
            row.push(value);
        }
        grid.push(row);
    }

    return grid;
}

// Check if placing num in grid[row][col] is valid
function isValid(grid, row, col, num, size) {
    // Check row
    for (let c = 0; c < size; c++) {
        if (grid[row][c] === num && c !== col) {
            return false;
        }
    }

    // Check column
    for (let r = 0; r < size; r++) {
        if (grid[r][col] === num && r !== row) {
            return false;
        }
    }

    // Check subgrid
    const sqrtSize = Math.sqrt(size);
    const subgridRowStart = Math.floor(row / sqrtSize) * sqrtSize;
    const subgridColStart = Math.floor(col / sqrtSize) * sqrtSize;

    for (let r = subgridRowStart; r < subgridRowStart + sqrtSize; r++) {
        for (let c = subgridColStart; c < subgridColStart + sqrtSize; c++) {
            if (grid[r][c] === num && (r !== row || c !== col)) {
                return false;
            }
        }
    }

    return true;
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
}

// Function to show the solution
function showSolution() {
    if (!solutionGrid) {
        alert("No solution available. Please generate a grid first.");
        return;
    }

    const size = solutionGrid.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.getElementById(`cell-${i * size + j}`);
            cell.value = solutionGrid[i][j];
        }
    }
}

// Function to solve Sudoku using backtracking
function solveSudoku(grid, size) {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= size; num++) {
                    if (isValid(grid, row, col, num, size)) {
                        grid[row][col] = num;
                        if (solveSudoku(grid, size)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Attach event listeners
document.getElementById("generate-grid").addEventListener("click", createSudokuGrid);
document.getElementById("check-solution-button").addEventListener("click", checkSolution);
document.getElementById("reset-button").addEventListener("click", resetGrid);
document.getElementById("show-solution-button").addEventListener("click", showSolution);