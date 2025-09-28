import { Cell } from "@/types/cell";
import { SudokuType } from "@/types/sudoku";

const Logic = {
    setCells: (state: SudokuType) => {
        state.grid.forEach((row, r) => {
            row.forEach((num, c) => {
                const cell: Cell = {
                    position: [r, c],
                    value: num,
                    is_fixed: num !== 0,
                };
                state.cells.push(cell);
                if (num !== 0) {
                    state.fixed_cells.push(cell);
                }
            });
        });
        return state;
    },
    similarCells: (state: SudokuType) => {
        if (state.cursor_log.length !== 0) {
            const [_row, _col] = state.cursor_log[state.cursor_log.length - 1];
            if (state.grid[_row][_col] !== 0) {
                state.similar_num = [];
                state.cells.forEach((cell) => {
                    if (cell.value === state.grid[_row][_col]) {
                        state.similar_num.push(cell.position);
                    }
                });
            } else {
                state.similar_num = [];
            }
        }
        return state;
    },
    updateCursorLog: (state: SudokuType, position: number[]) => {
        if (state.cursor_log.length !== 0) {
            if (
                state.cursor_log[state.cursor_log.length - 1].toString() !==
                position.toString()
            ) {
                state.cursor_log.push(position);
            } else {
                state.cursor_log.length = 0;
                state.selected_cell.length = 0;
                state.similar_num.length = 0;
                state.related_cells.length = 0;
            }
        } else {
            state.cursor_log.push(position);
        }
        return state;
    },
    selectedEmptyCell: (state: SudokuType) => {
        if (state.cursor_log.length !== 0) {
            const selected = state.cursor_log[state.cursor_log.length - 1];
            state.selected_cell = selected;
        }
        return state;
    },
    relatedCells: (state: SudokuType) => {
        // Check if there is a cursor log (user's last cell selection)
        if (state.cursor_log.length !== 0) {
            // Get the row and column of the last selected cell
            const [r, c] = state.cursor_log[state.cursor_log.length - 1];

            // Calculate the small grid (sub-grid) row and column indices
            const [c_row, c_col] = [Math.floor(r % 3), Math.floor(c % 3)];

            // Reset the list of related cells
            state.related_cells = [];

            // Iterate through every cell in the grid
            for (let row = 0; row < state.grid.length; row++) {
                for (let col = 0; col < state.grid.length; col++) {
                    // Calculate the sub-grid row and column indices for the current cell
                    const [g_row, g_col] = [
                        Math.floor(row % 3),
                        Math.floor(col % 3),
                    ];

                    // Check if the cell is in the same row, column, or sub-grid (but not the selected cell itself)
                    if (
                        (row + c_row === r + c_row ||
                            col + c_col === c + c_col) &&
                        [row, col].toString() !== [r, c].toString()
                    ) {
                        state.related_cells.push([row, col]);
                    }

                    // Handle additional cases based on the relative position of the current cell
                    // within the sub-grid and the selected cell's sub-grid
                    if (g_row !== c_row && g_col !== c_col) {
                        if (c_row === 2) {
                            // If the selected cell is in the bottom sub-grid
                            if (c_col === 2) {
                                // Bottom-right sub-grid
                                if (row < r && r - row <= 2) {
                                    if (col < c && c - col <= 2) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                            if (c_col === 1) {
                                // Bottom-center sub-grid
                                if (row < r && r - row <= 2) {
                                    if (col < c && c - col <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                    if (col > c && col - c <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                            if (c_col === 0) {
                                // Bottom-left sub-grid
                                if (row < r && r - row <= 2) {
                                    if (col > c && col - c <= 2) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                        }
                        if (c_row === 1) {
                            // If the selected cell is in the middle sub-grid
                            if (c_col === 2) {
                                // Middle-right sub-grid
                                if (col < c && c - col <= 2) {
                                    if (row < r && r - row <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                    if (row > r && row - r <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                            if (c_col === 1) {
                                // Middle-center sub-grid
                                if (row < r && r - row <= 1) {
                                    if (col > c && col - c <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                    if (c > col && c - col <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                                if (row > r && row - r <= 1) {
                                    if (col > c && col - c <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                    if (c > col && c - col <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                            if (c_col === 0) {
                                // Middle-left sub-grid
                                if (col > c && col - c <= 2) {
                                    if (row < r && r - row <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                    if (row > r && row - r <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                        }
                        if (c_row === 0) {
                            // If the selected cell is in the top sub-grid
                            if (c_col === 2) {
                                // Top-right sub-grid
                                if (col < c && c - col <= 2) {
                                    if (row > r && row - r <= 2) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                            if (c_col === 1) {
                                // Top-center sub-grid
                                if (row > r && row - r <= 2) {
                                    if (col < c && c - col <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                    if (col > c && col - c <= 1) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                            if (c_col === 0) {
                                // Top-left sub-grid
                                if (row > r && row - r <= 2) {
                                    if (col > c && col - c <= 2) {
                                        state.related_cells.push([row, col]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return state;
    },
    enterNum: (num: number, state: SudokuType) => {
        if (state.selected_cell.length !== 0) {
            const [row, col] = state.selected_cell;
            if (num !== 0) {
                if (state.grid[row][col] === 0) {
                    state.grid[row][col] = num;
                    state.cells.forEach((cell) => {
                        if (
                            cell.position.toString() === [row, col].toString()
                        ) {
                            cell.value = num;
                            state.has_updated = true;
                        }
                    });
                } else {
                    if (state.grid[row][col] !== num) {
                        state.cells.forEach((cell) => {
                            if (
                                cell.position.toString() ===
                                [row, col].toString()
                            ) {
                                if (!cell.is_fixed) {
                                    state.grid[row][col] = num;
                                    cell.value = num;
                                    state.has_updated = true;
                                }
                            }
                        });
                    }
                }
            } else {
                if (state.grid[row][col] !== 0) {
                    state.grid[row][col] = num;
                    state.cells.forEach((cell) => {
                        if (
                            cell.position.toString() === [row, col].toString()
                        ) {
                            cell.value = num;
                            state.has_updated = true;
                        }
                    });
                }
            }
        }
        return state;
    },
    checkError: {
        checkRow: (state: SudokuType) => {
            for (let row = 0; row < state.grid.length; row++) {
                for (let col = 0; col < state.grid.length; col++) {
                    const num = state.grid[row][col];
                    if (num !== 0) {
                        // check if a row has more than one num
                        if (
                            state.grid[row].filter((value) => value === num)
                                .length > 1
                        ) {
                            // check if pos already exist in fixed cell
                            if (
                                !state.fixed_cells.some(
                                    (cell) =>
                                        cell.position.toString() ===
                                        [row, col].toString()
                                )
                            ) {
                                // check if position exist in error cells
                                if (
                                    !state.error_cells.some(
                                        (cell) =>
                                            cell.toString() ===
                                            [row, col].toString()
                                    )
                                ) {
                                    state.error_cells.push([row, col]);
                                }
                            }
                        }
                    }
                }
            }

            return state;
        },
        checkCol: (state: SudokuType) => {
            const grid_transpose = [];
            // rotate the grid anticlockwise by 90deg
            for (let row = 0; row < state.grid.length; row++) {
                const board_row = [];
                for (let col = 0; col < state.grid.length; col++) {
                    board_row.push(state.grid[col][row]);
                }
                grid_transpose.push(board_row);
            }

            for (let row = 0; row < state.grid.length; row++) {
                for (let col = 0; col < state.grid.length; col++) {
                    const num = grid_transpose[row][col];
                    if (num !== 0) {
                        const repeatedValues = grid_transpose[row].filter(
                            (value) => value === num
                        );

                        if (repeatedValues.length > 1) {
                            // check if the repeat position is not of a fixed cell
                            const inFixedCell = state.fixed_cells.some(
                                (cell) =>
                                    cell.position.toString() ===
                                    [col, row].toString()
                            );
                            if (!inFixedCell) {
                                // check if the repeat position is not already in error cell
                                const inErrorCell = state.error_cells.some(
                                    (cell) =>
                                        cell.toString() ===
                                        [col, row].toString()
                                );
                                if (!inErrorCell) {
                                    state.error_cells.push([col, row]);
                                }
                            }
                        }
                    }
                }
            }
            return state;
        },
        checkGrid: (state: SudokuType) => {
            // Create a 3D array to represent all 3x3 sub-grids in the Sudoku grid
            const grid = Array.from({ length: 3 }, (_, col) =>
                Array.from({ length: 3 }, (_, row) =>
                    Array.from({ length: 9 }, (_, index) => [
                        // Map each cell to its absolute (row, col) position in the main grid
                        Math.floor(index / 3) + col * 3, // Row in the main grid
                        (index % 3) + row * 3, // Column in the main grid
                    ])
                )
            );
        
            // Flatten the sub-grid positions into a single array
            const grid_pos = [];
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid.length; j++) {
                    grid_pos.push(grid[i][j]); // Add each sub-grid's positions
                }
            }
        
            // Create a 3D array for the numbers in each 3x3 sub-grid
            const num = Array.from({ length: 3 }, (_, col) =>
                Array.from({ length: 3 }, (_, row) =>
                    Array.from(
                        { length: 9 },
                        (_, index) =>
                            // Extract the corresponding number from the main Sudoku grid
                            state.grid[col * 3 + Math.floor(index / 3)][
                                row * 3 + (index % 3)
                            ]
                    )
                )
            );
        
            // Flatten the sub-grid numbers into a single array
            const grid_num = [];
            for (let i = 0; i < num.length; i++) {
                for (let j = 0; j < num.length; j++) {
                    grid_num.push(num[i][j]); // Add each sub-grid's numbers
                }
            }
        
            // Iterate through the entire grid to check for errors
            for (let row = 0; row < state.grid.length; row++) {
                for (let col = 0; col < state.grid.length; col++) {
                    const [i, j] = grid_pos[row][col]; // Get the absolute position of the cell
                    const num = grid_num[row][col]; // Get the number in that cell
                    
                    if (num !== 0) {
                        // Check if the same number appears more than once in the sub-grid
                        if (
                            grid_num[row].filter((value) => value === num).length > 1
                        ) {
                            // Check if the cell is not a fixed cell
                            if (
                                !state.fixed_cells.some(
                                    (cell) =>
                                        cell.position.toString() === [i, j].toString()
                                )
                            ) {
                                // Check if the cell is not already marked as an error
                                if (
                                    !state.error_cells.some(
                                        (cell) =>
                                            cell.toString() === [i, j].toString()
                                    )
                                ) {
                                    // Add the cell to the error_cells
                                    state.error_cells.push([i, j]);
                                }
                            }
                        }
                    }
                }
            }
        
            return state;
        },        
    },
    completeGrid: (state: SudokuType) => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        state.completed_nums = [];

        values.forEach((value) => {
            let is_filled = true;

            // Check rows
            for (let row = 0; row < 9; row++) {
                if (!state.grid[row].includes(value)) {
                    is_filled = false;
                }
            }

            // Check columns
            for (let col = 0; col < 9; col++) {
                if (!state.grid.map((row) => row[col]).includes(value)) {
                    is_filled = false;
                }
            }

            // Check 3x3 subgrids
            for (let subgridRow = 0; subgridRow < 3; subgridRow++) {
                for (let subgridCol = 0; subgridCol < 3; subgridCol++) {
                    const subgridValues = [];
                    for (let row = 0; row < 3; row++) {
                        for (let col = 0; col < 3; col++) {
                            subgridValues.push(
                                state.grid[subgridRow * 3 + row][
                                    subgridCol * 3 + col
                                ]
                            );
                        }
                    }
                    if (!subgridValues.includes(value)) {
                        is_filled = false;
                    }
                }
            }

            if (is_filled) {
                if (!state.completed_nums.some((n) => n === value)) {
                    state.completed_nums.push(value);
                }
            }
        });

        return state;
    },
    isComplete: (state: SudokuType) => {
        if (state.error_cells.length === 0) {
            let has_completed = true;
            state.grid.forEach((row) => {
                row.forEach((cell) => {
                    if (cell === 0) {
                        has_completed = false;
                    }
                });
            });
            if (has_completed) {
                state.game_over = true;
            }
        }
        return state;
    },
};

export default Logic;
