"use client";

import Logic from "@/models/logic";
import { initSudoku, SudokuType } from "@/types/sudoku";
import { useEffect, useState } from "react";

export default function Board() {
    const [sudoku, setSudoku] = useState<SudokuType>(initSudoku);
    const numPad: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // initialize fixed cells
    useEffect(() => {
        const updateSudoku = { ...sudoku };
        if (updateSudoku.cells.length === 0) {
            Logic.setCells(updateSudoku);
            setSudoku(updateSudoku);
        }
    }, [sudoku]);

    //check errors and game state
    useEffect(() => {
        const updateSudoku = { ...sudoku };
        if (updateSudoku.has_updated) {
            updateSudoku.error_cells = [];
            Logic.checkError.checkRow(updateSudoku);
            Logic.checkError.checkCol(updateSudoku);
            Logic.checkError.checkGrid(updateSudoku);
            Logic.completeGrid(updateSudoku);
            Logic.isComplete(updateSudoku);
            updateSudoku.has_updated = false;
            setSudoku(updateSudoku);
        }
    }, [sudoku]);

    // update fixed cells - cells whose values cannot be changed
    function isFixedCell(row: number, col: number) {
        const isFixed = sudoku.fixed_cells.some(
            (cell) => cell.position.toString() === [row, col].toString()
        );
        if (isFixed) {
            return "text-blue-400";
        }
        return "text-white/60";
    }

    function handleClick(row: number, col: number) {
        const updateSudoku = { ...sudoku };
        if (!updateSudoku.game_over) {
            Logic.updateCursorLog(updateSudoku, [row, col]);
            Logic.selectedEmptyCell(updateSudoku);
            Logic.similarCells(updateSudoku);
            Logic.relatedCells(updateSudoku);
        }
        setSudoku(updateSudoku);
    }

    // highlight cells with same values
    function highlightSimilarCells(row: number, col: number) {
        const isSimilar = sudoku.similar_num.some(
            (pos) => pos.toString() === [row, col].toString()
        );
        if (isSimilar) {
            return "bg-white/[0.04]";
        }
        return "";
    }

    // higlight adjancent cells position to the selected cells
    function highlightAdjacentCells(row: number, col: number) {
        const isAdjacent = sudoku.related_cells.some(
            (pos) => pos.toString() === [row, col].toString()
        );
        if (isAdjacent) {
            return "bg-white/[0.01]";
        }
        return "";
    }

    // show error cells
    function highlightError(row: number, col: number) {
        const isError = sudoku.error_cells.some(
            (pos) => pos.toString() === [row, col].toString()
        );
        if (isError) {
            return "!text-red-500";
        }
        return "";
    }

    const clickInput = (num: number) => {
        const updateSudoku = { ...sudoku };

        if (updateSudoku.selected_cell.length !== 0) {
            const isCompletedNum = updateSudoku.completed_nums.some(
                (value) => value === num
            );

            if (!isCompletedNum) {
                Logic.enterNum(num, updateSudoku);
                Logic.similarCells(updateSudoku);
                Logic.relatedCells(updateSudoku);
            }
        }

        setSudoku(updateSudoku);
    };

    const deleteValue = (num: number) => {
        const updateSudoku = { ...sudoku };

        if (!updateSudoku.game_over) {
            if (updateSudoku.selected_cell.length !== 0) {
                Logic.enterNum(num, updateSudoku);
                updateSudoku.cursor_log.length = 0;
                updateSudoku.similar_num.length = 0;
            }
        }

        setSudoku(updateSudoku);
    };

    // numbers that have already been filled in the grid
    const disableCompleted = (num: number) => {
        for (let i = 0; i < sudoku.completed_nums.length; i++) {
            if (sudoku.completed_nums[i] === num) {
                return "!bg-zinc-900/30 !text-white/30";
            }
        }
        return "";
    };

    console.log(sudoku);

    return (
        <div className="flex flex-col items-center gap-y-7">
            <div>
                {sudoku.grid.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`flex items-center ${
                            (rowIndex + 1) % 3 === 0
                                ? "border-b-2 border-b-white/20"
                                : "border-b border-b-white/10"
                        } ${rowIndex === 0 && "border-t-2 border-t-white/20"}`}
                    >
                        {row.map((col, colIndex) => (
                            <div
                                key={colIndex}
                                onClick={() => handleClick(rowIndex, colIndex)}
                                className={`w-[45px] cursor-default bg-clip-content h-[45px] ${
                                    sudoku.selected_cell.toString() ===
                                        [rowIndex, colIndex].toString() &&
                                    "bg-blue-400/10"
                                } ${isFixedCell(rowIndex, colIndex)} ${
                                    (colIndex + 1) % 3 === 0
                                        ? "border-r-2 border-r-white/20"
                                        : "border-r border-r-white/10"
                                } ${highlightSimilarCells(
                                    rowIndex,
                                    colIndex
                                )} ${highlightAdjacentCells(
                                    rowIndex,
                                    colIndex
                                )} ${highlightError(rowIndex, colIndex)} ${
                                    colIndex === 0 &&
                                    "border-l-2 border-l-white/20"
                                }  flex items-center justify-center`}
                            >
                                {col !== 0 ? col : ""}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-x-3 justify-center">
                {numPad.map((value) => (
                    <button
                        type="button"
                        key={value}
                        onClick={() => clickInput(value)}
                        className={`w-10 h-10 text-sm bg-zinc-900 text-white flex items-center justify-center ${disableCompleted(
                            value
                        )}`}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <button
                type="button"
                onClick={() => deleteValue(0)}
                className="px-5 py-2 bg-red-500 text-white text-sm"
            >
                Delete
            </button>
        </div>
    );
}
