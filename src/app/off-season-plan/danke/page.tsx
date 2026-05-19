"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, CheckCircle2, Mail, Loader2, ArrowRight, AlertTriangle } from "lucide-react";

type VerifyState =
  | { status: "loading" }
  | { status: "pending"; paymentStatus?: string }
  | { status: "paid"; downloadToken: string; email: string }
  | { status: "error"; message: string };

export default function DankePage() {
  // useSearchParams must live under a Suspense boundary for Next.js static
  // export — wrap the content here so the page can be pre-rendered.
  return (
    <Suspense fallback={<DankeSkeleton />}>
      <DankeContent />
    </Suspense>
  );
}

function DankeSkeleton() {
  return (
    <section className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gold/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-surface to-surface-light border border-gold/25 rounded-2xl md:rounded-3xl p-7 sm:p-10 md:p-14">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
              <Loader2 className="w-7 h-7 text-gold animate-spin" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-3">Einen Moment…</h1>
            <p className="text-muted text-sm md:text-base">Wir prüfen deine Bestellung.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DankeContent() {
  const search = useSearchParams();
  const sessionId = search.get("session_id");
  const [state, setState] = useState<VerifyState>({ status: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setState({
        status: "error",
        message: "Es fehlt der Session-Verweis. Wende dich an den Support, falls die Bezahlung erfolgt ist.",
      });
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const fetchVerify = async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setState({ status: "error", message: data?.error ?? "Verifizierung fehlgeschlagen." });
          return;
        }

        if (data.status === "paid" && data.downloadToken) {
          setState({
            status: "paid",
            downloadToken: data.downloadToken,
            email: data.email,
          });
          return;
        }

        if (data.status === "pending") {
          // Stripe might still be processing — retry a few times with backoff.
          if (attempts < 6) {
            setTimeout(fetchVerify, 1500 + attempts * 500);
            setState({ status: "pending", paymentStatus: data.paymentStatus });
            return;
          }
          setState({
            status: "pending",
            paymentStatus: data.paymentStatus,
          });
          return;
        }

        setState({ status: "error", message: "Unbekannter Status." });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Netzwerkfehler",
        });
      }
    };

    fetchVerify();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <section className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* gold glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gold/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-surface to-surface-light border border-gold/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-gold/10"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="p-7 sm:p-10 md:p-14">
            {state.status === "loading" || state.status === "pending" ? (
              <LoadingState pending={state.status === "pending"} />
            ) : null}

            {state.status === "paid" ? (
              <PaidState token={state.downloadToken} email={state.email} />
            ) : null}

            {state.status === "error" ? <ErrorState message={state.message} /> : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================ */

function LoadingState({ pending }: { pending: boolean }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-gold animate-spin" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
        {pending ? "Zahlung wird verarbeitet…" : "Einen Moment…"}
      </h1>
      <p className="text-muted text-sm md:text-base">
        {pending
          ? "Stripe bestätigt deine Zahlung. Das dauert manchmal ein paar Sekunden — bitte nicht schließen."
          : "Wir prüfen deine Bestellung."}
      </p>
    </div>
  );
}

function PaidState({ token, email }: { token: string; email: string }) {
  const downloadHref = `/api/download/${token}`;

  return (
    <>
      <div className="text-center mb-7 md:mb-9">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 16 }}
          className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-5 rounded-full bg-gold/15 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-gold" />
        </motion.div>

        <p className="tracking-[0.3em] uppercase text-gold/80 text-[10px] md:text-xs mb-3">
          Zahlung bestätigt
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
          Willkommen in der <span className="gradient-text-gold">Off-Season.</span>
        </h1>
        <p className="text-muted text-sm md:text-base max-w-md mx-auto">
          Dein Plan ist freigeschaltet. Lade ihn jetzt herunter — der Link ist
          30 Tage gültig. Eine Kopie ist auch auf dem Weg in dein Postfach.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 mb-8">
        <a
          href={downloadHref}
          className="group inline-flex items-center justify-center gap-2 px-7 py-4 md:px-9 md:py-5 bg-gold hover:bg-gold-light text-background text-base md:text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-gold/30"
        >
          <Download size={18} />
          Off-Season Plan jetzt herunterladen
        </a>
        <p className="text-[11px] md:text-xs text-muted">PDF · ca. 5,5 MB</p>
      </div>

      <div className="border-t border-white/5 pt-7 md:pt-8 space-y-4 md:space-y-5">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="text-foreground text-sm md:text-base font-semibold">
              Backup per E-Mail an {email}
            </p>
            <p className="text-muted text-xs md:text-sm mt-1 leading-relaxed">
              Falls die Mail nicht in den nächsten Minuten ankommt, prüfe deinen Spam-Ordner.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="text-foreground text-sm md:text-base font-semibold">
              Rechnung mit USt von Stripe
            </p>
            <p className="text-muted text-xs md:text-sm mt-1 leading-relaxed">
              Stripe schickt dir automatisch eine USt-konforme Rechnung an deine E-Mail.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-10 pt-7 border-t border-white/5 text-center">
        <p className="text-muted text-xs md:text-sm mb-3">
          Lust auf 1-zu-1 Coaching, das auf dich zugeschnitten ist?
        </p>
        <Link
          href="/leistungen"
          className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light transition-colors font-medium"
        >
          Unsere Coaching-Pakete ansehen
          <ArrowRight size={14} />
        </Link>
      </div>
    </>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
        Da ist etwas schiefgelaufen
      </h1>
      <p className="text-muted text-sm md:text-base mb-7 max-w-md mx-auto">{message}</p>
      <p className="text-muted text-xs md:text-sm mb-5">
        Falls dein Kauf bereits erfolgreich war, schreib uns kurz — wir kümmern uns sofort.
      </p>
      <a
        href="mailto:primeathleteacademy@primeathleteacademy.com"
        className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-gold/30 rounded-full text-sm text-foreground/80 hover:text-gold transition-colors"
      >
        <Mail size={14} />
        Support kontaktieren
      </a>
    </div>
  );
}
