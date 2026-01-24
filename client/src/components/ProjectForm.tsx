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
import { Loader2, Link as LinkIcon } from "lucide-react";
import { z } from "zod";

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
              <FormLabel>Project Image URL</FormLabel>

              <FormControl>
                <Input
                  placeholder="https://example.com/image.png"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>

              <FormDescription className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a
                  href="https://cloudinary.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  Upload image and paste URL here
                </a>
              </FormDescription>

              {field.value && (
                <div className="mt-3">
                  <img
                    src={field.value}
                    alt="Project preview"
                    className="max-h-40 rounded-md border object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
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
