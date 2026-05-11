"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Interest } from "@/types/interest";
import {
  getInterests,
  addInterest,
  updateInterest,
  toggleInterestStatus,
  deleteInterest,
} from "@/services/interest";
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

export default function InterestsPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setInterests(await getInterests());
    } catch (err) {
      console.error("Error fetching interests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchData, 0);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      if (editId) {
        await updateInterest(editId, { name, icon });
      } else {
        await addInterest({ name, icon });
      }
      handleClose();
      fetchData();
    } catch (err) {
      console.error("Error saving interest:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Interest) => {
    setName(item.name);
    setIcon(item.icon ?? "");
    setEditId(item.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setIcon("");
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this interest?")) return;
    try {
      setLoading(true);
      await deleteInterest(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting interest:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (item: Interest) => {
    try {
      setLoading(true);
      await toggleInterestStatus(
        item.id,
        item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      );
      fetchData();
    } catch (err) {
      console.error("Error toggling interest status:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = interests.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interests</h1>
          <p className="text-muted-foreground mt-2">
            Manage the interests users can pick during onboarding.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search interests…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => setOpen(true)} className="py-4 px-5">
            Add Interest
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editId ? "Edit Interest" : "Add New Interest"}
        description={
          editId
            ? "Update the interest details."
            : "Add a new interest for users to select."
        }
        isOpen={open}
        onClose={handleClose}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Interest Name</label>
            <Input
              className="mt-1"
              placeholder="e.g. Photography"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Icon URL</label>
            <Input
              className="mt-1"
              placeholder="https://example.com/icon.png"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              disabled={loading}
            />
            {icon && (
              <div className="flex justify-center pt-1">
                <Image
                  src={icon}
                  alt="icon preview"
                  width={48}
                  height={48}
                  className="rounded-lg object-cover border"
                  onError={() => {}}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 pt-2">
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
      <div className="rounded-md border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Loading…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No interests found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.icon ? (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover border"
                      />
                    ) : (
                      <span className="text-2xl">⭐</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(item)}
                    >
                      {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
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