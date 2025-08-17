import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { sendAcceptanceEmail, sendRejectionEmail } from "@/lib/emailjs";

interface Reservation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  status: "pending" | "confirmed" | "cancelled";
  notes: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("reservation_date", { ascending: true })
        .order("reservation_time", { ascending: true });

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      toast.error("Failed to fetch reservations");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusUpdate(
    reservation: Reservation,
    newStatus: "confirmed" | "cancelled",
    notes?: string
  ) {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("reservations")
        .update({
          status: newStatus,
          notes: notes || reservation.notes,
        })
        .eq("id", reservation.id);

      console.log(reservations);
      if (error) throw error;

      // Send email notification
      const emailParams = {
        customerName: reservation.customer_name,
        customerEmail: reservation.customer_email,
        reservationDate: format(
          new Date(reservation.reservation_date),
          "MMMM d, yyyy"
        ),
        reservationTime: reservation.reservation_time,
        partySize: reservation.party_size,
        notes: notes,
      };

      const emailSent =
        newStatus === "confirmed"
          ? await sendAcceptanceEmail(emailParams)
          : await sendRejectionEmail(emailParams);

      if (!emailSent) {
        toast.error("Failed to send email notification");
      }

      toast.success(`Reservation ${newStatus} successfully`);
      fetchReservations();
    } catch (error) {
      toast.error(`Failed to ${newStatus} reservation`);
    } finally {
      setIsProcessing(false);
      setSelectedReservation(null);
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Reservation Management</h1>
            <Button onClick={() => fetchReservations()}>Refresh</Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      {reservation.customer_name}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{reservation.customer_email}</div>
                        <div className="text-muted-foreground">
                          {reservation.customer_phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {format(
                            new Date(reservation.reservation_date),
                            "MMM d, yyyy"
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {reservation.reservation_time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{reservation.party_size}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(reservation.status)}>
                        {reservation.status.charAt(0).toUpperCase() +
                          reservation.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(reservation.created_at), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {reservation.status === "pending" && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" disabled={isProcessing}>
                                  Accept
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirm Reservation
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to confirm this
                                    reservation? An email will be sent to the
                                    customer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleStatusUpdate(
                                        reservation,
                                        "confirmed"
                                      )
                                    }
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={isProcessing}
                                >
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Reject Reservation
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject this
                                    reservation? An email will be sent to the
                                    customer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleStatusUpdate(
                                        reservation,
                                        "cancelled"
                                      )
                                    }
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedReservation(reservation);
                                setEditNotes(reservation.notes || "");
                              }}
                            >
                              Edit Notes
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Reservation Notes</DialogTitle>
                              <DialogDescription>
                                Add or update notes for this reservation.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Customer Details</Label>
                                <div className="text-sm">
                                  <p>
                                    <strong>Name:</strong>{" "}
                                    {reservation.customer_name}
                                  </p>
                                  <p>
                                    <strong>Date:</strong>{" "}
                                    {format(
                                      new Date(reservation.reservation_date),
                                      "MMMM d, yyyy"
                                    )}
                                  </p>
                                  <p>
                                    <strong>Time:</strong>{" "}
                                    {reservation.reservation_time}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                  id="notes"
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
                                  placeholder="Add notes about this reservation..."
                                  className="min-h-[100px]"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedReservation(null);
                                  setEditNotes("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  if (selectedReservation) {
                                    handleStatusUpdate(
                                      selectedReservation,
                                      selectedReservation.status as
                                        | "confirmed"
                                        | "cancelled",
                                      editNotes
                                    );
                                  }
                                }}
                                disabled={isProcessing}
                              >
                                Save Notes
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
