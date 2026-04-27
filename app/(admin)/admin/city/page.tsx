"use client";

import { useEffect, useState } from "react";
import { City } from "@/types/city";
import {
    getCities,
    addCity,
    updateCity,
    deleteCity,
} from "@/services/city";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function CitiesPage() {
    const [cities, setCities] = useState<City[]>([]);
    const [name, setName] = useState<string>("");
    const [editId, setEditId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch Cities
    const fetchCities = async () => {
        try {
            setLoading(true);
            const data = await getCities();
            setCities(data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    // Add / Update
    const handleSubmit = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);

            if (editId) {
                await updateCity(editId, { name });
                setEditId(null);
            } else {
                await addCity({ name });
            }

            setName("");
            fetchCities();
        } catch (error) {
            console.error("Error saving city:", error);
        } finally {
            setLoading(false);
        }
    };

    // Edit
    const handleEdit = (city: City) => {
        setName(city.name);
        setEditId(city._id);
    };

    // Delete
    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await deleteCity(id);
            fetchCities();
        } catch (error) {
            console.error("Error deleting city:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Add / Update */}
            <div className="flex gap-2">
                <Input
                    placeholder="Enter city name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Button className="py-4 px-5" onClick={handleSubmit} disabled={loading}>
                    {editId ? "Update" : "Add"}
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>City Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : cities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                    No cities found
                                </TableCell>
                            </TableRow>
                        ) : (
                            cities.map((city) => (
                                <TableRow key={city._id}>
                                    <TableCell className="font-medium">
                                        {city.name}
                                    </TableCell>

                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(city)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(city._id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}