# Restaurant Reservation System

A modern web application for managing restaurant reservations with real-time status updates and email notifications.

## Features

- 📅 Easy reservation management
- 📧 Automated email notifications
- 📱 Responsive design
- 🔒 Secure data handling
- 📊 Real-time status updates

## Tech Stack

- **Frontend**: React + TypeScript
- **UI Library**: Shadcn UI
- **Database**: Supabase
- **Email Service**: EmailJS
- **Date Handling**: date-fns
- **Form Handling**: React Hook Form + Zod

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account
- EmailJS account

## Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_key
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Create a new Supabase project
2. Run the following SQL to create the reservations table:

```sql
create table reservations (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  party_size integer not null,
  reservation_date date not null,
  reservation_time time not null,
  status text not null default 'pending',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table reservations enable row level security;

-- Create policies
create policy "Enable read access for all users" on reservations
  for select using (true);

create policy "Enable insert for authenticated users only" on reservations
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on reservations
  for update using (auth.role() = 'authenticated');
```

## Email Setup

1. Create an EmailJS account
2. Set up an email service (e.g., Gmail)
3. Create an email template with the following variables:
   - `to_email`
   - `to_name`
   - `reservation_status`
   - `notes`

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # Shadcn UI components
│   └── forms/     # Form components
├── lib/           # Utility functions
│   ├── supabase.ts
│   └── utils.ts
├── pages/         # Application pages
│   ├── Reservations.tsx
│   └── ManageReservations.tsx
└── types/         # TypeScript types
    └── index.ts
```

## Usage

### Making a Reservation

1. Navigate to the reservations page
2. Fill in the reservation form:
   - Name
   - Email
   - Phone
   - Party Size
   - Date
   - Time
3. Submit the form
4. Receive confirmation email

### Managing Reservations

1. Access the admin dashboard
2. View all reservations
3. Update reservation status:
   - Pending
   - Accepted
   - Rejected
   - Cancelled
4. Add notes if needed
5. Save changes

## API Reference

### Supabase

#### Create Reservation

```typescript
const { data, error } = await supabase
  .from("reservations")
  .insert([
    {
      customer_name: string,
      customer_email: string,
      customer_phone: string,
      party_size: number,
      reservation_date: string,
      reservation_time: string,
      status: "pending",
    },
  ])
  .select();
```

#### Update Reservation

```typescript
const { data, error } = await supabase
  .from("reservations")
  .update({
    status: string,
    notes: string,
    updated_at: new Date().toISOString(),
  })
  .eq("id", string)
  .select();
```

### EmailJS

#### Send Email

```typescript
await emailjs.send(serviceId, templateId, {
  to_email: string,
  to_name: string,
  reservation_status: string,
  notes: string,
});
```

## Error Handling

The application includes comprehensive error handling for:

- Form validation
- Database operations
- Email sending
- Network requests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email [your-email@example.com] or open an issue in the repository.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [EmailJS](https://www.emailjs.com/)
