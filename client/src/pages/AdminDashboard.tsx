import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { AdminLogViewer } from "@/components/AdminLogViewer";

export default function AdminDashboard() {
    const [, setLocation] = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("admin-token");
        if (!token) {
            setLocation("/admin");
        }
    }, [setLocation]);

    const { data: products } = useQuery<Product[]>({
        queryKey: ["/api/products"],
    });

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
                <div className="space-x-4">
                    <Link href="/admin/content">
                        <Button variant="outline" className="text-white border-zinc-700 bg-zinc-900 hover:bg-zinc-800">
                            Manage Site Content
                        </Button>
                    </Link>
                    <Link href="/admin/products/new">
                        <Button className="bg-white text-black hover:bg-gray-200">
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                    <Card key={product.id} className="bg-zinc-900 border-zinc-800 text-white">
                        <CardContent className="p-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover mb-4 rounded"
                            />
                            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                            <p className="text-zinc-400 mb-2 truncate">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <p className="font-bold">£{(product.price).toLocaleString()}</p>
                                <Link href={`/admin/products/${product.id}/edit`}>
                                    <Button variant="outline" className="text-black bg-white hover:bg-gray-200 h-8">Edit</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <AdminLogViewer />
        </div>
    );
}
