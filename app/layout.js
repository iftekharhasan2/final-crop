// app/layout.jsx (server component)
import './globals.css';
import AppWrapper from './components/AppWrapper';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head><title>Your App</title></head>
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
