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
import { Modal } from "@/components/ui/modal";

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
    const [open, setOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

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
            setOpen(false);
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
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName("");
        setEditId(null);
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

    const filteredCities = cities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cities</h1>
                    <p className="text-muted-foreground mt-2">Manage cities for your application.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                    <Button onClick={() => setOpen(true)} className="py-4 px-5">
                        Add New City
                    </Button>
                </div>
            </div>

            <Modal
                title={editId ? "Edit City" : "Add New City"}
                description={editId ? "Update the city details." : "Add a new city to the system."}
                isOpen={open}
                onClose={handleClose}
            >
                <div className="space-y-4">
                    <Input
                        placeholder="Enter city name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading || !name.trim()}>
                            {editId ? "Update" : "Create"}
                        </Button>
                    </div>
                </div>
            </Modal>

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
                        ) : filteredCities.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">
                                    No cities found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCities.map((city) => (
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