import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Plus } from "lucide-react";
import { AdminLogViewer } from "@/components/AdminLogViewer";

export default function AdminProductForm({ params }: { params?: { id?: string } }) {
    const isEditMode = !!params?.id;
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("leather");
    const [material, setMaterial] = useState("Leather");
    const [image, setImage] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const res = await fetch(`/api/products/${params!.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setName(data.name);
                        setDescription(data.description);
                        setPrice(String(data.price));
                        setCategory(data.category);
                        setMaterial(data.material);
                        setImage(data.image);
                        setContent(data.content || "");
                        setImages(data.images || []);
                    } else {
                        toast({ title: "Failed to load product", variant: "destructive" });
                        setLocation("/admin/dashboard");
                    }
                } catch (error) {
                    toast({ title: "Error loading product", variant: "destructive" });
                }
            };
            fetchProduct();
        }
    }, [isEditMode, params, setLocation, toast]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("admin-token");
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "x-admin-token": token || "" },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            if (isGallery) {
                setImages([...images, data.url]);
            } else {
                setImage(data.url);
            }
            toast({ title: "Image uploaded successfully" });
        } catch (error) {
            toast({ title: "Upload failed", variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("admin-token");
            const url = isEditMode ? `/api/products/${params!.id}` : "/api/products";
            const method = isEditMode ? "PUT" : "POST";

            // Only send isNew if we are creating, otherwise let backend keep existing value or handle it separately
            // Actually, for now let's just not send isNew on update unless we add a toggle for it.
            // But strict schema might require it? No, partial() allows optional.
            // On Create, we want isNew=true (default). On Update, exclude it to preserve state.
            const body: any = {
                name,
                description,
                price: Number(price),
                category,
                material,
                image,
                content,
                images,
            };

            if (!isEditMode) {
                body.isNew = true;
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-token": token || "",
                },
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast({ title: isEditMode ? "Product updated successfully" : "Product created successfully" });
                // Give user a moment to see the success message
                setTimeout(() => {
                    setLocation("/admin/dashboard");
                }, 1000);
            } else {
                const errData = await res.json();
                throw new Error(errData.message || "Failed to save product");
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold font-display mb-8">{isEditMode ? "Edit Product" : "Add New Product"}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Label>Product Title</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                placeholder="e.g. Midnight Sofa"
                            />

                            <Label>Price (£)</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                placeholder="e.g. 500000"
                            />

                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="leather">Leather</SelectItem>
                                    <SelectItem value="fabric">Fabric</SelectItem>
                                </SelectContent>
                            </Select>

                            <Label>Material</Label>
                            <Input
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                placeholder="e.g. Italian Leather"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>Thumbnail Image</Label>
                            <div
                                className="border-2 border-dashed border-zinc-800 rounded-lg p-8 text-center hover:border-zinc-600 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {image ? (
                                    <img src={image} alt="Thumbnail" className="max-h-48 object-contain" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-2 text-zinc-400" />
                                        <span className="text-zinc-400">Click to upload thumbnail</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e)}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Short Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-zinc-900 border-zinc-800"
                            placeholder="Brief summary for product card..."
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Detailed Body Content</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="bg-zinc-900 border-zinc-800 min-h-[200px]"
                            placeholder="Detailed description of the product..."
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Additional Photos (Gallery)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-32 object-cover rounded" />
                                    {/* Could add delete button here later */}
                                </div>
                            ))}
                            <div
                                className="border-2 border-dashed border-zinc-800 rounded-lg p-4 flex flex-col items-center justify-center h-32 cursor-pointer hover:border-zinc-600"
                                onClick={() => galleryInputRef.current?.click()}
                            >
                                <Plus className="w-6 h-6 text-zinc-400" />
                                <span className="text-xs text-zinc-400 mt-1">Add Photo</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={galleryInputRef}
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, true)}
                            accept="image/*"
                        />
                    </div>

                    <div className="flex justify-end pt-8">
                        <Button type="submit" className="bg-white text-black hover:bg-gray-200 px-8">
                            {isEditMode ? "Update Product" : "Save Product"}
                        </Button>
                    </div>
                </form>
            </div>
            <AdminLogViewer />
        </div>
    );
}
