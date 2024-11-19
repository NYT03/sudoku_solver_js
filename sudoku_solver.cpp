#include <vector>
#include <emscripten/bind.h>
using namespace std;

class SudokuSolver {
    int n;  // Size of each subgrid
    int grid_size;  // Size of entire grid
    vector<vector<int>> board;

public:
    SudokuSolver(int n) : n(n), grid_size(n * n), board(n * n, vector<int>(n * n, 0)) {}

    bool isValid(int row, int col, int num) {
        // Check row and column
        for (int i = 0; i < grid_size; ++i) {
            if (board[row][i] == num || board[i][col] == num) {
                return false;
            }
        }

        // Check subgrid
        int startRow = (row / n) * n, startCol = (col / n) * n;
        for (int i = 0; i < n; ++i) {
            for (int j = 0; j < n; ++j) {
                if (board[startRow + i][startCol + j] == num) {
                    return false;
                }
            }
        }
        return true;
    }

    bool solve() {
        for (int row = 0; row < grid_size; ++row) {
            for (int col = 0; col < grid_size; ++col) {
                if (board[row][col] == 0) {
                    for (int num = 1; num <= grid_size; ++num) {
                        if (isValid(row, col, num)) {
                            board[row][col] = num;
                            if (solve()) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    void setBoard(const vector<vector<int>>& newBoard) {
        board = newBoard;
    }

    vector<vector<int>> getBoard() {
        return board;
    }
};

EMSCRIPTEN_BINDINGS(sudoku_solver_module) {
    emscripten::class_<SudokuSolver>("SudokuSolver")
        .constructor<int>()
        .function("solve", &SudokuSolver::solve)
        .function("setBoard", &SudokuSolver::setBoard)
        .function("getBoard", &SudokuSolver::getBoard);
}
