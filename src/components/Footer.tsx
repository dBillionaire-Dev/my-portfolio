import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-background py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <Link href="/" className="text-xl font-bold font-display tracking-tighter">
            NexDev<span className="text-primary/50">_.</span>
          </Link>
          <p className="text-muted-foreground max-w-sm">
            Building robust digital architectures with a focus on backend excellence and AI integration.
          </p>
          <div className="flex gap-4">
            <a href="https://github.com/dBillionaire-Dev" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/ebenezer-ekunke" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://x.com/dBillionaireDev" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="mailto:nezerekunke.dev@gmail.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/5 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold">Let's Connect</h4>
          <p className="text-sm text-muted-foreground">
            Ready to build something amazing? Let's talk about your next project.
          </p>
          <Link href="/contact" className="inline-flex items-center text-primary font-medium hover:underline">
            Start a conversation &rarr;
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>&copy; {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
}
