"use client";

import { useEffect, useState } from "react";
import { DiscoveryRange } from "@/types/discovery-range";
import {
  getDiscoveryRanges,
  addDiscoveryRange,
  updateDiscoveryRange,
  toggleDiscoveryRangeStatus,
  deleteDiscoveryRange,
} from "@/services/discovery-range";
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

export default function DiscoveryRangePage() {
  const [ranges, setRanges] = useState<DiscoveryRange[]>([]);
  const [label, setLabel] = useState("");
  const [km, setKm] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiError, setApiError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setApiError("");
      setRanges(await getDiscoveryRanges());
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (err as any)?.response?.status;
      if (status === 404) {
        setApiError("Discovery range endpoint not available yet (404). Add ranges below to populate it.");
      } else {
        console.error("Error fetching discovery ranges:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchData, 0);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    if (!label.trim() || !km) return;
    try {
      setLoading(true);
      const payload = {
        label,
        km: Number(km),
        description: description || undefined,
      };
      if (editId) {
        await updateDiscoveryRange(editId, payload);
      } else {
        await addDiscoveryRange(payload);
      }
      handleClose();
      fetchData();
    } catch (err) {
      console.error("Error saving discovery range:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: DiscoveryRange) => {
    setLabel(item.label);
    setKm(item.km);
    setDescription(item.description ?? "");
    setEditId(item.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLabel("");
    setKm("");
    setDescription("");
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discovery range?")) return;
    try {
      setLoading(true);
      await deleteDiscoveryRange(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting discovery range:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (item: DiscoveryRange) => {
    try {
      setLoading(true);
      await toggleDiscoveryRangeStatus(
        item.id,
        item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      );
      fetchData();
    } catch (err) {
      console.error("Error toggling status:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = ranges.filter(
    (r) =>
      r.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(r.km).includes(searchQuery)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discovery Ranges</h1>
          <p className="text-muted-foreground mt-2">
            Manage the distance options users can choose from to find nearby people.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search ranges…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => setOpen(true)} className="py-4 px-5">
            Add Range
          </Button>
        </div>
      </div>

      {apiError && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          ⚠️ {apiError}
        </div>
      )}

      {/* Modal */}
      <Modal
        title={editId ? "Edit Discovery Range" : "Add Discovery Range"}
        description={
          editId
            ? "Update the discovery range details."
            : "Add a new distance range for users."
        }
        isOpen={open}
        onClose={handleClose}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Label</label>
            <Input
              className="mt-1"
              placeholder="e.g. My neighbourhood"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Distance (km)</label>
            <Input
              className="mt-1"
              type="number"
              min={1}
              placeholder="e.g. 5"
              value={km}
              onChange={(e) =>
                setKm(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (optional)</label>
            <Input
              className="mt-1"
              placeholder="e.g. People in your immediate area"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !label.trim() || !km}
            >
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
              <TableHead>Distance</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No discovery ranges found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold text-lg">{item.km} km</TableCell>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.description ?? "—"}
                  </TableCell>
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