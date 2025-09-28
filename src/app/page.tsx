import Link from "next/link";

export default function Home() {
    return (
        <div className="w-full h-screen flex items-center justify-center flex-col gap-2">
            <p className="text-center text-xl">Hello there!! 👋</p>
            <p className="text-center">Welcome to Sudoku Game</p>
            <Link
                href="/game"
                type="button"
                className="px-4 py-2 text-sm bg-zinc-100 text-zinc-950 mt-5"
            >
                Start Game
            </Link>
        </div>
    );
}
