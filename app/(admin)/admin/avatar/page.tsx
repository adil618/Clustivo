"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar } from "@/types/avatar";
import {
  getAvatars,
  addAvatar,
  updateAvatar,
  toggleAvatarStatus,
  deleteAvatar,
} from "@/services/avatar";
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

export default function AvatarPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [url, setUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setAvatars(await getAvatars());
    } catch (err) {
      console.error("Error fetching avatars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchData, 0);
    return () => clearTimeout(t);
  }, []);

  // Add / Update
  const handleSubmit = async () => {
    if (!url.trim()) return;
    try {
      setLoading(true);
      if (editId) {
        await updateAvatar(editId, { url });
      } else {
        await addAvatar({ url });
      }
      handleClose();
      fetchData();
    } catch (err) {
      console.error("Error saving avatar:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (av: Avatar) => {
    setUrl(av.url);
    setEditId(av.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUrl("");
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this avatar?")) return;
    try {
      setLoading(true);
      await deleteAvatar(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting avatar:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (av: Avatar) => {
    try {
      setLoading(true);
      await toggleAvatarStatus(
        av.id,
        av.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      );
      fetchData();
    } catch (err) {
      console.error("Error toggling status:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = avatars.filter((av) =>
    av.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avatars</h1>
          <p className="text-muted-foreground mt-2">
            Manage profile avatars available to users.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by URL…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => setOpen(true)} className="py-4 px-5">
            Add Avatar
          </Button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editId ? "Edit Avatar" : "Add New Avatar"}
        description={
          editId
            ? "Update the avatar image URL."
            : "Paste a public image URL for the new avatar."
        }
        isOpen={open}
        onClose={handleClose}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <Input
              className="mt-1"
              placeholder="https://example.com/avatar.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>

          {url && (
            <div className="flex justify-center">
              <Image
                src={url}
                alt="preview"
                width={80}
                height={80}
                className="rounded-xl object-cover border"
                onError={() => {}}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !url.trim()}>
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
              <TableHead>Preview</TableHead>
              <TableHead>ID</TableHead>
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
                  No avatars found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((av) => (
                <TableRow key={av.id}>
                  <TableCell>
                    <Image
                      src={av.url}
                      alt="avatar"
                      width={48}
                      height={48}
                      className="rounded-lg object-cover border"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground max-w-[180px] truncate">
                    {av.id}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        av.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {av.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(av)}
                    >
                      {av.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(av)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(av.id)}
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