import MagneticButton from "./MagneticButton";

export default function Footer() {
  return (
    <footer id="visit" className="bg-espresso px-6 py-20 text-cream md:px-12 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-cream/50">
              Visit Us
            </p>
            <h2 className="font-display max-w-md text-3xl italic leading-tight md:text-4xl">
              Come sit with us, cup in hand.
            </h2>
          </div>
          <MagneticButton className="!bg-cream !text-espresso hover:!bg-cream-soft">
            Find a Location
          </MagneticButton>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-cream/15 pt-10 text-sm text-cream/60 sm:grid-cols-3">
          <div>
            <p className="mb-2 text-cream/90">Hours</p>
            <p>Mon – Fri · 7am – 6pm</p>
            <p>Sat – Sun · 8am – 5pm</p>
          </div>
          <div>
            <p className="mb-2 text-cream/90">Address</p>
            <p>14 Roastery Lane</p>
            <p>Portland, OR</p>
          </div>
          <div>
            <p className="mb-2 text-cream/90">Follow</p>
            <p>Instagram</p>
            <p>Journal</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 text-xs text-cream/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Aroura Coffee. All rights reserved.</p>
          <p className="font-display italic text-cream/70">Aroura</p>
        </div>
      </div>
    </footer>
  );
}
