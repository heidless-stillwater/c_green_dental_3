export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="max-w-[95%] mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-sm text-foreground/60">
        <p>&copy; {new Date().getFullYear()} The Green Dental Surgery. All rights reserved.</p>
        <p>200 W Green Rd, London N15 5AG | 0208 800 7373 | test@test.com</p>
      </div>
    </footer>
  );
}
