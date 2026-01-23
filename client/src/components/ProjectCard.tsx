import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-card rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors duration-300"
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
            No Image
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
          {project.projectUrl && (
            <a 
              href={project.projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
              title="Live Demo"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-zinc-900 text-white rounded-full hover:scale-110 transition-transform border border-white/10"
              title="GitHub Repo"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl font-bold font-display tracking-tight">{project.title}</h3>
          {project.featured && (
            <Badge variant="secondary" className="text-xs bg-white/10 text-white border-none">
              Featured
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span key={tag} className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-white/5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
