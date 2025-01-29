import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    pending: boolean;
    children: React.ReactNode;
}

export default function LoadingButton({ pending, children, className, ...props }: LoadingButtonProps) {
    return (
        <Button disabled={pending} className={className} {...props}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </Button>
    );
}
