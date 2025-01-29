import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "../admin/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

interface PasswordDialogProps {
    user: User | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdatePassword: (userId: string, password: string) => void;
}

const passwordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be more than 8 characters")
        .max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export function PasswordDialog({ user, open, onOpenChange, onUpdatePassword }: PasswordDialogProps) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setNewPassword('');
            setConfirmPassword('');
            setError('');
            setIsLoading(false);
        }
    }, [open]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            if (!newPassword || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }

            if (newPassword !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            if (newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters');
            }
            
            if (user) {
                await onUpdatePassword(user.id, newPassword);
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update password';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Password</DialogTitle>
                    <DialogDescription>
                        Set new password for {user?.name}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Confirm Password</Label>
                        <Input
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 