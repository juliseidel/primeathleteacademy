"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export default function DownloadRecoveryPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/download/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error ?? "Etwas ist schiefgelaufen.");
        return;
      }
      setStatus("done");
      setMessage(data.message);
    } catch {
      setStatus("error");
      setMessage("Netzwerkfehler. Bitte erneut versuchen.");
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-gold/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-surface to-surface-light border border-gold/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-gold/10"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="p-7 sm:p-10 md:p-12">
            {status === "done" ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gold/15 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-gold" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white mb-3">
                  Check deine Mails
                </h1>
                <p className="text-muted text-sm md:text-base">{message}</p>
                <p className="text-muted text-xs mt-4">
                  Nichts angekommen? Schau im Spam-Ordner oder schreib uns.
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-7">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gold/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-gold" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
                    Download erneut senden
                  </h1>
                  <p className="text-muted text-sm md:text-base">
                    Du hast den Off-Season Plan gekauft, aber deinen Download-Link
                    verlegt? Gib deine E-Mail ein — wir schicken ihn dir nochmal.
                  </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="deine@email.de"
                    className="w-full px-5 py-3.5 rounded-full bg-background/60 border border-white/10 focus:border-gold/40 outline-none text-foreground placeholder:text-muted/60 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group w-full flex items-center justify-center gap-2 px-7 py-4 bg-gold hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed text-background text-base font-bold rounded-full transition-all duration-300 hover:scale-[1.02]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Wird gesendet…
                      </>
                    ) : (
                      <>
                        Link senden
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  {status === "error" ? (
                    <p className="text-center text-sm text-red-400">{message}</p>
                  ) : null}
                </form>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <Link
                href="/off-season-plan"
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold transition-colors"
              >
                Zurück zum Off-Season Plan
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
