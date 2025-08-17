import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID_ACCEPT = 'your_accept_template_id';
const EMAILJS_TEMPLATE_ID_REJECT = 'your_reject_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

emailjs.init(EMAILJS_PUBLIC_KEY);

interface EmailParams {
  customerName: string;
  customerEmail: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  notes?: string;
}

export async function sendAcceptanceEmail(params: EmailParams) {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_ACCEPT,
      {
        to_name: params.customerName,
        to_email: params.customerEmail,
        reservation_date: params.reservationDate,
        reservation_time: params.reservationTime,
        party_size: params.partySize,
        notes: params.notes || '',
      }
    );
    return true;
  } catch (error) {
    console.error('Failed to send acceptance email:', error);
    return false;
  }
}

export async function sendRejectionEmail(params: EmailParams) {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_REJECT,
      {
        to_name: params.customerName,
        to_email: params.customerEmail,
        reservation_date: params.reservationDate,
        reservation_time: params.reservationTime,
        party_size: params.partySize,
        notes: params.notes || '',
      }
    );
    return true;
  } catch (error) {
    console.error('Failed to send rejection email:', error);
    return false;
  }
}