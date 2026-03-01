"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import Loading from "@/app/container/Loading";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
interface Cat {
  _id: string;
  name: string;
}

interface AddStoryProps {
  cats: Cat[];
}

const AddStory: FC<AddStoryProps> = ({ cats }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catIdFromQuery = searchParams.get("catId");

  const [form, setForm] = useState({
    caption: "",
    slug: "",
    featured: false,
  });

  const [selectedCats, setSelectedCats] = useState<string[]>(
    catIdFromQuery ? [catIdFromQuery] : [],
  );

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setLoading] = useState(false);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  // ===============================
  // Handlers
  // ===============================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCat = (id: string) => {
    if (selectedCats.includes(id)) {
      setSelectedCats(selectedCats.filter((c) => c !== id));
    } else {
      setSelectedCats([...selectedCats, id]);
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors({ coverImage: "Only JPG, PNG, WEBP allowed" });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors({ coverImage: "Image must be under 5MB" });
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, coverImage: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.caption.trim() || form.caption.length < 5) {
      newErrors.caption = "Caption must be at least 5 characters";
    }

    if (!form.slug.trim()) {
      newErrors.slug = "Slug is required";
    }

    if (selectedCats.length === 0) {
      newErrors.cats = "Select at least one cat";
    }

    if (!image) {
      newErrors.coverImage = "Cover image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("caption", form.caption.trim());
      formData.append("slug", form.slug.trim());
      formData.append("featured", String(form.featured));
      formData.append("coverImage", image as File);

      selectedCats.forEach((catId) => formData.append("cats", catId));

      tags.forEach((tag) => formData.append("tags", tag));

      const res = await fetch("/api/admin/stories/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create story");
      }

      toast.success("Story created successfully 🎉");

      setTimeout(() => {
        router.push("/stories/view");
      }, 1000);
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="max-w-3xl mx-auto py-10 px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Add Story 📖</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <p className="text-sm text-red-500">{errors.general}</p>
              )}

              {/* Caption */}
              <div className="space-y-2">
                <Label>Caption</Label>
                <Textarea
                  name="caption"
                  value={form.caption}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Rescued and now thriving..."
                />
                {errors.caption && (
                  <p className="text-sm text-red-500">{errors.caption}</p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="rescued-milo-2026"
                />
                {errors.slug && (
                  <p className="text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.featured}
                  onCheckedChange={(val: any) =>
                    setForm({ ...form, featured: Boolean(val) })
                  }
                />
                <Label>Mark as Featured</Label>
              </div>

              {/* Cat Selection */}
              <div className="space-y-2">
                <Label>Select Cats</Label>
                <div className="flex flex-wrap gap-2">
                  {cats.map((cat) => (
                    <Badge
                      key={cat._id}
                      variant={
                        selectedCats.includes(cat._id) ? "default" : "secondary"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleCat(cat._id)}
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>
                {errors.cats && (
                  <p className="text-sm text-red-500">{errors.cats}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>

                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="happy-ending"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                      <X
                        size={14}
                        className="ml-1 cursor-pointer"
                        onClick={() => removeTag(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.coverImage && (
                  <p className="text-sm text-red-500">{errors.coverImage}</p>
                )}

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-48 w-full object-cover rounded-lg border mt-2"
                  />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                Create Story
              </Button>
            </form>
          </CardContent>
        </Card>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
};

export default AddStory;
