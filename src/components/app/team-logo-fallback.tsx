export function TeamLogoFallback({ teamName }: { teamName: string }) {
    // Get first letter of team name for the fallback
    const initial = teamName.charAt(0).toUpperCase();

    return (
        <div className="relative size-7 shrink-0 rounded-full bg-muted/50 border border-border flex items-center justify-center">
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted-foreground"
            >
                <path
                    d="M12 2L2 7L3 17.5C3 20.5 7 22 12 22C17 22 21 20.5 21 17.5L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <path
                    d="M12 22V2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M7 9.5C8.5 11 10 12 12 12C14 12 15.5 11 17 9.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
        </div>
    );
}
