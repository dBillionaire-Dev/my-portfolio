import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectSchema, type Project, type InsertProject } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Upload, Link as LinkIcon } from "lucide-react";
import { z } from "zod";
import { useState } from "react";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: InsertProject) => void;
  isLoading: boolean;
}

const formSchema = insertProjectSchema.extend({
  tagsString: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProjectForm({ project, onSubmit, isLoading }: ProjectFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      imageUrl: project?.imageUrl || "",
      projectUrl: project?.projectUrl || "",
      githubUrl: project?.githubUrl || "",
      featured: project?.featured || false,
      priority: project?.priority || 0,
      tags: project?.tags || [],
      tagsString: project?.tags?.join(", ") || "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: file.name, data: base64data, type: file.type })
        });
        const data = await res.json();
        form.setValue("imageUrl", data.url);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (values: FormValues) => {
    const tags = values.tagsString 
      ? values.tagsString.split(",").map(t => t.trim()).filter(Boolean)
      : values.tags;

    const { tagsString, ...rest } = values;
    onSubmit({ ...rest, tags });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the project..." className="h-24" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Image</FormLabel>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="file"
                    className="hidden"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    asChild 
                    disabled={isUploading}
                  >
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                      {field.value ? "Change Image" : "Upload from device"}
                    </label>
                  </Button>
                </div>
              </div>
              {field.value && (
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                  <Upload className="w-3 h-3" /> Image uploaded successfully
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="projectUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Demo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub Repo URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tagsString"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma separated)</FormLabel>
              <FormControl>
                <Input placeholder="React, TypeScript, Tailwind" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured</FormLabel>
                  <FormDescription>
                    Show on homepage
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Priority Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {project ? "Update Project" : "Create Project"}
        </Button>
      </form>
    </Form>
  );
}
