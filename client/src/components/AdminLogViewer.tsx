import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, RefreshCw, XCircle } from "lucide-react";

interface LogEntry {
    timestamp: string;
    message: string;
    type: 'info' | 'error';
}

export function AdminLogViewer() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem("admin-token");
            if (!token) return;

            const res = await fetch("/api/admin/logs", {
                headers: { "x-admin-token": token },
            });
            if (res.ok) {
                const newLogs = await res.json();
                // Only update if length changed to avoid flicker, or deep compare if needed.
                // For simplicity, just update.
                setLogs(newLogs);
            }
        } catch (e) {
            console.error("Failed to fetch logs", e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLogs(); // Initial fetch
            const interval = setInterval(fetchLogs, 2000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            // Find the scrollable viewport inside ScrollArea if possible, standard div fallback
            const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [logs, autoScroll, isOpen]);

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800 z-50 shadow-lg"
            >
                <ChevronUp className="w-4 h-4 mr-2" /> Show Server Logs
            </Button>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-zinc-950 border-t border-zinc-800 z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">SERVER LOGS</span>
                    <span className="font-mono text-xs text-zinc-600">({logs.length} entries)</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-6 text-xs ${autoScroll ? 'text-green-400' : 'text-zinc-500'}`}
                        onClick={() => setAutoScroll(!autoScroll)}
                    >
                        {autoScroll ? 'Auto-scroll On' : 'Auto-scroll Off'}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={fetchLogs}>
                        <RefreshCw className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-red-900/20 hover:text-red-400" onClick={() => setIsOpen(false)}>
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4 font-mono text-xs" ref={scrollRef}>
                {logs.length === 0 ? (
                    <div className="text-zinc-600 italic">No logs available...</div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className="mb-1 flex items-start space-x-2 hover:bg-white/5 p-0.5 rounded">
                            <span className="text-zinc-500 shrink-0">{log.timestamp}</span>
                            <span className={log.type === 'error' ? 'text-red-400 font-bold' : 'text-zinc-300'}>
                                {log.message}
                            </span>
                        </div>
                    ))
                )}
            </ScrollArea>
        </div>
    );
}
