"use client";

import React, { useEffect, useState } from "react";
import { Area } from "@/types/area";
import { City } from "@/types/city";
import {
    getAreas,
    addArea,
    updateArea,
    deleteArea,
} from "@/services/area";
import { getCities } from "@/services/city";

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

export default function AreasPage() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [name, setName] = useState<string>("");
    const [cityId, setCityId] = useState<string | number>("");
    const [editId, setEditId] = useState<string | number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [areasData, citiesData] = await Promise.all([
                getAreas(),
                getCities()
            ]);
            setAreas(areasData);
            setCities(citiesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Add / Update
    const handleSubmit = async () => {
        if (!name.trim() || !cityId) return;

        try {
            setLoading(true);

            if (editId) {
                await updateArea(editId, { name, cityId });
                setEditId(null);
            } else {
                await addArea({ name, cityId });
            }

            setName("");
            setCityId("");
            setOpen(false);
            fetchData();
        } catch (error) {
            console.error("Error saving area:", error);
        } finally {
            setLoading(false);
        }
    };

    // Edit
    const handleEdit = (area: Area) => {
        setName(area.name);
        setCityId(area.cityId || (area.city ? area.city.id : ""));
        setEditId(area.id || area._id || null);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName("");
        setCityId("");
        setEditId(null);
    };

    // Delete
    const handleDelete = async (id: string | number) => {
        try {
            setLoading(true);
            await deleteArea(id);
            fetchData();
        } catch (error) {
            console.error("Error deleting area:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filtering
    const filteredAreas = areas.filter((area) =>
        area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.city?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Grouping
    const groupedAreas = filteredAreas.reduce((acc, area) => {
        const cName = area.city?.name || "Unknown City";
        if (!acc[cName]) {
            acc[cName] = [];
        }
        acc[cName].push(area);
        return acc;
    }, {} as Record<string, Area[]>);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Areas</h1>
                    <p className="text-muted-foreground mt-2">Manage areas by city for your application.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search areas or cities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                    <Button onClick={() => setOpen(true)} className="py-4 px-5">
                        Add New Area
                    </Button>
                </div>
            </div>

            <Modal
                title={editId ? "Edit Area" : "Add New Area"}
                description={editId ? "Update the area details." : "Add a new area to the system."}
                isOpen={open}
                onClose={handleClose}
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">City</label>
                        <select
                            className="flex mt-1 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={cityId}
                            onChange={(e) => setCityId(e.target.value)}
                            disabled={loading}
                        >
                            <option value="">Select a city...</option>
                            {/* @ts-ignore */}
                            {cities.map((city) => (
                                <option key={city._id || city.id} value={city._id || city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Area Name</label>
                        <Input className="mt-1"
                            placeholder="Enter area name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={loading || !name.trim() || !cityId}>
                            {editId ? "Update" : "Create"}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Table */}
            <div className="rounded-md border overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-base">Area Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-6">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : Object.keys(groupedAreas).length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-6">
                                    No areas found
                                </TableCell>
                            </TableRow>
                        ) : (
                            Object.entries(groupedAreas).map(([cityName, cityAreas]) => (
                                <React.Fragment key={cityName}>
                                    {/* City Header Row */}
                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableCell colSpan={2} className="font-semibold text-lg py-3">
                                            {cityName}
                                        </TableCell>
                                    </TableRow>

                                    {/* Area Rows */}
                                    {cityAreas.map((area) => (
                                        <TableRow key={area.id || area._id}>
                                            <TableCell className="font-medium pl-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full" />
                                                    {area.name}
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(area)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(area.id || area._id!)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </React.Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}