import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-9xl font-display font-bold text-muted-foreground/20">404</h1>
      <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">The page you are looking for doesn't exist.</p>
      
      <Link href="/">
        <Button>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back Home
        </Button>
      </Link>
    </div>
  );
}
