import { useQuery, useMutation } from "@tanstack/react-query";
import { api, type InsertMessage } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

const API_BASE = "http://localhost:4000";

export function useMessages() {
  const { toast } = useToast();

  const { data: messages, isLoading } = useQuery({
    queryKey: [api.messages.list.path],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}${api.messages.list.path}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (data: InsertMessage) => {
      const res = await fetch(`${API_BASE}${api.messages.create.path}`, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({ title: "Message sent", description: "Thanks for reaching out! I'll get back to you soon." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  return {
    messages,
    isLoading,
    sendMessage
  };
}

