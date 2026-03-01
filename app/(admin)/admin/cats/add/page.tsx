"use client";

import { FC, useState } from "react";
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

interface AddCatProps {}

const AddCat: FC<AddCatProps> = () => {
  const [form, setForm] = useState({
    name: "",
    breed: "",
    story: "",
    medicalStatus: "",
  });

  const router = useRouter();

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_IMAGES = 5;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const [isLoading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [personalityInput, setPersonalityInput] = useState("");
  const [personality, setPersonality] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const name = form.name.trim();
    const breed = form.breed.trim();
    const story = form.story.trim();
    const medicalStatus = form.medicalStatus.trim();

    if (!name || name.length < 2 || name.length > 50) {
      newErrors.name = "Name must be 2-50 characters";
    }

    if (!breed || breed.length < 2 || breed.length > 50) {
      newErrors.breed = "Breed must be 2-50 characters";
    }

    if (!story || story.length < 10 || story.length > 2000) {
      newErrors.story = "Story must be 10-2000 characters";
    }

    if (!medicalStatus || medicalStatus.length < 2) {
      newErrors.medicalStatus = "Medical status is required";
    }

    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    if (images.length > MAX_IMAGES) {
      newErrors.images = `Maximum ${MAX_IMAGES} images allowed`;
    }

    for (const file of images) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        newErrors.images = "Only JPG, PNG, WEBP allowed";
      }

      if (file.size > MAX_IMAGE_SIZE) {
        newErrors.images = "Each image must be under 5MB";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    const validFiles: File[] = [];

    for (const file of filesArray) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrors({ images: "Only JPG, PNG, WEBP allowed" });
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setErrors({ images: "Each image must be under 5MB" });
        return;
      }

      validFiles.push(file);
    }

    if (images.length + validFiles.length > MAX_IMAGES) {
      setErrors({ images: `Maximum ${MAX_IMAGES} images allowed` });
      return;
    }

    setImages((prev) => [...prev, ...validFiles]);
    setPreviewUrls((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);

    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const addPersonality = () => {
    if (!personalityInput.trim()) return;
    setPersonality([...personality, personalityInput.trim()]);
    setPersonalityInput("");
  };

  const removePersonality = (index: number) => {
    setPersonality(personality.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("breed", form.breed.trim());
      formData.append("story", form.story.trim());
      formData.append("medicalStatus", form.medicalStatus.trim());

      personality.forEach((p) => formData.append("personality", p.trim()));

      images.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/admin/cats/add", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create cat");
      }

      toast.success(`Welcome to the family, ${form.name}! 🐾`);

      setTimeout(() => {
        router.push("/cats/view");
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
            <CardTitle className="text-2xl">Add New Cat 🐱</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <p className="text-sm text-red-500">{errors.general}</p>
              )}
              {/* Name */}
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Milo"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Breed */}
              <div className="space-y-2">
                <Label>Breed</Label>
                <Input
                  name="breed"
                  value={form.breed}
                  onChange={handleChange}
                  required
                  placeholder="Persian"
                />
                {errors.breed && (
                  <p className="text-sm text-red-500">{errors.breed}</p>
                )}
              </div>

              {/* Story */}
              <div className="space-y-2">
                <Label>Story</Label>
                <Textarea
                  name="story"
                  value={form.story}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Rescued from..."
                />
                {errors.story && (
                  <p className="text-sm text-red-500">{errors.story}</p>
                )}
              </div>

              {/* Medical Status */}
              <div className="space-y-2">
                <Label>Medical Status</Label>
                <Input
                  name="medicalStatus"
                  value={form.medicalStatus}
                  onChange={handleChange}
                  required
                  placeholder="Vaccinated, Dewormed"
                />
                {errors.medicalStatus && (
                  <p className="text-sm text-red-500">{errors.medicalStatus}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Upload Images</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {errors.images && (
                  <p className="text-sm text-red-500">{errors.images}</p>
                )}

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt="preview"
                          className="h-28 w-full object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Personality Tags */}
              <div className="space-y-2">
                <Label>Personality</Label>

                <div className="flex gap-2">
                  <Input
                    value={personalityInput}
                    onChange={(e) => setPersonalityInput(e.target.value)}
                    placeholder="Playful"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPersonality();
                      }
                    }}
                  />
                  <Button type="button" onClick={addPersonality}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {personality.map((trait, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {trait}
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => removePersonality(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                Save Cat
              </Button>
            </form>
          </CardContent>
        </Card>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </>
  );
};

export default AddCat;
