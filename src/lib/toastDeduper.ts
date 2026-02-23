import { toast } from 'react-hot-toast';

const toastCache = new Map<string, number>();
const DEDUPE_INTERVAL = 10_000; // 10 seconds — prevents spam on polling errors

/**
 * Enhanced toast utility that prevents duplicate messages from appearing 
 * within a short time window.
 */
export const dedupedToast = {
    error: (message: string) => {
        const now = Date.now();
        const lastSeen = toastCache.get(message);

        if (!lastSeen || now - lastSeen > DEDUPE_INTERVAL) {
            toastCache.set(message, now);
            toast.error(message, {
                duration: 5000,
                id: message, // Overwrite if same message exists
            });
        }
    },
    success: (message: string) => {
        toast.success(message);
    },
    loading: (message: string) => {
        return toast.loading(message);
    },
    dismiss: (id?: string) => {
        toast.dismiss(id);
    }
};
