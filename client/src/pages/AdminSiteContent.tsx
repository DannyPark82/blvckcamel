import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { AdminLogViewer } from "@/components/AdminLogViewer";

interface ContentSection {
    image?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    link?: string;
    buttonText?: string;
    link2?: string;
    buttonText2?: string;
}

export default function AdminSiteContent() {
    const { toast } = useToast();
    const [hero, setHero] = useState<ContentSection>({});
    const [leather, setLeather] = useState<ContentSection>({});
    const [fabric, setFabric] = useState<ContentSection>({});
    const [philosophy, setPhilosophy] = useState<ContentSection>({});
    const [midBanner, setMidBanner] = useState<ContentSection>({});
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        try {
            const [h, l, f, p, m] = await Promise.all([
                fetch("/api/content/hero").then(r => r.json()),
                fetch("/api/content/leather").then(r => r.json()),
                fetch("/api/content/fabric").then(r => r.json()),
                fetch("/api/content/philosophy").then(r => r.json()),
                fetch("/api/content/midBanner").then(r => r.json()),
            ]);

            if (h.content) setHero(h.content);
            if (l.content) setLeather(l.content);
            if (f.content) setFabric(f.content);
            if (p.content) setPhilosophy(p.content);
            if (m.content) setMidBanner(m.content);
        } catch (e) {
            console.error("Failed to fetch content", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const handleSave = async (key: string, data: ContentSection) => {
        try {
            const token = localStorage.getItem("admin-token");
            const res = await fetch(`/api/content/${key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-token": token || "",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast({ title: "Content updated successfully" });
            } else {
                throw new Error("Failed to save");
            }
        } catch (e) {
            toast({ title: "Error saving content", variant: "destructive" });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (c: ContentSection) => void, current: ContentSection) => {
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
            setter({ ...current, image: data.url });
            toast({ title: "Image uploaded" });
        } catch (error) {
            toast({ title: "Upload failed", variant: "destructive" });
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold font-display mb-8">Site Content Management</h1>

                <Tabs defaultValue="hero" className="w-full">
                    <TabsList className="bg-zinc-900 border-zinc-800">
                        <TabsTrigger value="hero">Hero Section</TabsTrigger>
                        <TabsTrigger value="midBanner">Mid Banner</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                        <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
                    </TabsList>

                    <TabsContent value="hero" className="mt-6">
                        <Card className="bg-zinc-900 border-zinc-800 text-white">
                            <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                                <CardDescription>Main banner on the homepage</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Background Image</Label>
                                    <div className="mt-2 border-2 border-dashed border-zinc-700 rounded p-4 text-center cursor-pointer hover:border-zinc-500 relative min-h-[150px] flex items-center justify-center">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, setHero, hero)} />
                                        {hero.image ? <img src={hero.image} alt="Hero" className="max-h-[200px] mx-auto object-cover" /> : <span className="text-zinc-500"><Upload className="inline mb-1 mr-2" />Upload Image</span>}
                                    </div>
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input value={hero.title || ""} onChange={e => setHero({ ...hero, title: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="Redefining Darkness" />
                                </div>
                                <div>
                                    <Label>Subtitle</Label>
                                    <Textarea value={hero.subtitle || ""} onChange={e => setHero({ ...hero, subtitle: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="Subtitle text..." />
                                </div>
                                <div>
                                    <Label>Button Text</Label>
                                    <Input value={hero.buttonText || ""} onChange={e => setHero({ ...hero, buttonText: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="Explore Collection" />
                                </div>
                                <div className="pt-4 text-right">
                                    <Button onClick={() => handleSave("hero", hero)} className="bg-white text-black hover:bg-gray-200">Save Hero</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="midBanner" className="mt-6">
                        <Card className="bg-zinc-900 border-zinc-800 text-white">
                            <CardHeader>
                                <CardTitle>Mid Banner Section</CardTitle>
                                <CardDescription>Large banner between Latest Arrivals and Philosophy</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Background Image</Label>
                                    <div className="mt-2 border-2 border-dashed border-zinc-700 rounded p-4 text-center cursor-pointer hover:border-zinc-500 relative min-h-[150px] flex items-center justify-center">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, setMidBanner, midBanner)} />
                                        {midBanner.image ? <img src={midBanner.image} alt="Mid Banner" className="max-h-[200px] mx-auto object-cover" /> : <span className="text-zinc-500"><Upload className="inline mb-1 mr-2" />Upload Image</span>}
                                    </div>
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input value={midBanner.title || ""} onChange={e => setMidBanner({ ...midBanner, title: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="Shades of Blvck" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-sm text-zinc-400">Left Button</h3>
                                        <div>
                                            <Label>Text</Label>
                                            <Input value={midBanner.buttonText || ""} onChange={e => setMidBanner({ ...midBanner, buttonText: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="MEN" />
                                        </div>
                                        <div>
                                            <Label>Link URL</Label>
                                            <Input value={midBanner.link || ""} onChange={e => setMidBanner({ ...midBanner, link: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="/shop?gender=men" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-sm text-zinc-400">Right Button</h3>
                                        <div>
                                            <Label>Text</Label>
                                            <Input value={midBanner.buttonText2 || ""} onChange={e => setMidBanner({ ...midBanner, buttonText2: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="WOMEN" />
                                        </div>
                                        <div>
                                            <Label>Link URL</Label>
                                            <Input value={midBanner.link2 || ""} onChange={e => setMidBanner({ ...midBanner, link2: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="/shop?gender=women" />
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 text-right">
                                    <Button onClick={() => handleSave("midBanner", midBanner)} className="bg-white text-black hover:bg-gray-200">Save Mid Banner</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="categories" className="mt-6 space-y-6">
                        <Card className="bg-zinc-900 border-zinc-800 text-white">
                            <CardHeader>
                                <CardTitle>Leather Category</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Banner Image</Label>
                                    <div className="mt-2 border-2 border-dashed border-zinc-700 rounded p-4 text-center cursor-pointer hover:border-zinc-500 relative min-h-[150px] flex items-center justify-center">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, setLeather, leather)} />
                                        {leather.image ? <img src={leather.image} alt="Leather" className="max-h-[200px] mx-auto object-cover" /> : <span className="text-zinc-500"><Upload className="inline mb-1 mr-2" />Upload Image</span>}
                                    </div>
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input value={leather.title || ""} onChange={e => setLeather({ ...leather, title: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="Leather" />
                                </div>
                                <div className="pt-4 text-right">
                                    <Button onClick={() => handleSave("leather", leather)} className="bg-white text-black hover:bg-gray-200">Save Leather</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800 text-white">
                            <CardHeader>
                                <CardTitle>Fabric Category</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Banner Image</Label>
                                    <div className="mt-2 border-2 border-dashed border-zinc-700 rounded p-4 text-center cursor-pointer hover:border-zinc-500 relative min-h-[150px] flex items-center justify-center">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, setFabric, fabric)} />
                                        {fabric.image ? <img src={fabric.image} alt="Fabric" className="max-h-[200px] mx-auto object-cover" /> : <span className="text-zinc-500"><Upload className="inline mb-1 mr-2" />Upload Image</span>}
                                    </div>
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input value={fabric.title || ""} onChange={e => setFabric({ ...fabric, title: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="Fabric" />
                                </div>
                                <div className="pt-4 text-right">
                                    <Button onClick={() => handleSave("fabric", fabric)} className="bg-white text-black hover:bg-gray-200">Save Fabric</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="philosophy" className="mt-6">
                        <Card className="bg-zinc-900 border-zinc-800 text-white">
                            <CardHeader>
                                <CardTitle>Philosophy Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Section Image</Label>
                                    <div className="mt-2 border-2 border-dashed border-zinc-700 rounded p-4 text-center cursor-pointer hover:border-zinc-500 relative min-h-[150px] flex items-center justify-center">
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, setPhilosophy, philosophy)} />
                                        {philosophy.image ? <img src={philosophy.image} alt="Philosophy" className="max-h-[200px] mx-auto object-cover" /> : <span className="text-zinc-500"><Upload className="inline mb-1 mr-2" />Upload Image</span>}
                                    </div>
                                </div>
                                <div>
                                    <Label>Title</Label>
                                    <Input value={philosophy.title || ""} onChange={e => setPhilosophy({ ...philosophy, title: e.target.value })} className="bg-zinc-800 border-zinc-700" placeholder="Designed for the bold." />
                                </div>
                                <div>
                                    <Label>Content (Body Text)</Label>
                                    <Textarea value={philosophy.content || ""} onChange={e => setPhilosophy({ ...philosophy, content: e.target.value })} className="bg-zinc-800 border-zinc-700" rows={5} placeholder="We believe in the power of absence..." />
                                </div>
                                <div className="pt-4 text-right">
                                    <Button onClick={() => handleSave("philosophy", philosophy)} className="bg-white text-black hover:bg-gray-200">Save Philosophy</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <AdminLogViewer />
        </div>
    );
}
