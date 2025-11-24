import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex w-full h-full items-center justify-center p-6">
            <Loader2 className="text-primary size-8 animate-spin" />
        </div>
    );
};

export default Loading;
