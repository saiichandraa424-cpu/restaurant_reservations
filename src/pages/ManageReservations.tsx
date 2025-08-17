import { useEffect, useState } from "react";
import { format } from "date-fns";
import emailjs from "@emailjs/browser";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Initialize EmailJS with your public key
emailjs.init("4OnEACCR69rG1JSpv"); // Replace with your public key from Account > API Keys

// Define valid status types
const VALID_STATUSES = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
] as const;
type ReservationStatus = (typeof VALID_STATUSES)[number];

type Reservation = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  status: ReservationStatus;
  notes?: string;
  created_at: string;
};

export default function ManageReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ReservationStatus>("pending");

  useEffect(() => {
    fetchReservations();
  }, []);

  const sendStatusEmail = async (
    reservation: Reservation,
    status: ReservationStatus,
    note: string
  ) => {
    try {
      // Validate email
      if (
        !reservation.customer_email ||
        !reservation.customer_email.includes("@")
      ) {
        throw new Error("Invalid recipient email address");
      }

      console.log("Sending email to:", reservation.customer_email);

      const emailParams = {
        to_email: reservation.customer_email.trim(),
        from_name: "Fine Dine",
        reservation_status: status.charAt(0).toUpperCase() + status.slice(1),
        notes: note || "No additional notes provided.",
      };

      console.log("Email parameters:", emailParams);

      const response = await emailjs.send(
        "service_4gpbwi8",
        "template_e3sd523",
        emailParams
      );

      console.log("Email response:", response);

      if (response.status !== 200) {
        throw new Error(`Email failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to send status update email:", error);
      toast.error("Could not send notification email to customer");
    }
  };

  const fetchReservations = async () => {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("reservation_date", { ascending: true });

      if (error) throw error;

      setReservations(data || []);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (
    reservation: Reservation,
    status: ReservationStatus
  ) => {
    setSelectedReservation(reservation);
    setNewStatus(status);
    setStatusNote("");
    setShowDialog(true);
  };

  const updateReservationStatus = async () => {
    if (!selectedReservation) return;

    try {
      // Validate status before update
      if (!VALID_STATUSES.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      console.log("Updating reservation:", {
        id: selectedReservation.id,
        newStatus,
        notes: statusNote,
      });

      const { data, error } = await supabase
        .from("reservations")
        .update({
          status: newStatus,
          notes: statusNote,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedReservation.id)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Update response:", data);

      // Update local state
      setReservations((prev) =>
        prev.map((res) =>
          res.id === selectedReservation.id
            ? { ...res, status: newStatus, notes: statusNote }
            : res
        )
      );

      // Send email notification
      await sendStatusEmail(selectedReservation, newStatus, statusNote);

      // Refresh reservations from database
      await fetchReservations();

      toast.success(`Reservation ${newStatus} successfully`);
      setShowDialog(false);
    } catch (error: any) {
      console.error("Error updating reservation:", error);
      toast.error(error.message || "Failed to update reservation status");
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "accepted":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "cancelled":
        return "text-gray-600";
      default:
        return "text-yellow-600";
    }
  };

  if (loading) {
    return <div className="p-8">Loading reservations...</div>;
  }

  return (
    <>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Manage Reservations</h1>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Party Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {reservation.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.customer_email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(reservation.reservation_date),
                      "MMM d, yyyy"
                    )}
                  </TableCell>
                  <TableCell>{reservation.reservation_time}</TableCell>
                  <TableCell>{reservation.party_size}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(reservation.status)}>
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {reservation.notes}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={reservation.status}
                      onValueChange={(value: ReservationStatus) =>
                        handleStatusChange(reservation, value)
                      }
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VALID_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Reservation Status</DialogTitle>
            <DialogDescription>
              Add a note to explain why you are{" "}
              {newStatus === "accepted"
                ? "accepting"
                : newStatus === "rejected"
                ? "rejecting"
                : "updating"}{" "}
              this reservation.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Enter a note about this status change..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={updateReservationStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
