import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the login page, as it is the main entry point for the app.
  // The authenticated layout will handle redirecting logged-in users to the dashboard.
  redirect('/login');
}
