import { Resend } from "resend";

let cached: Resend | null = null;

function getResend(): Resend {
  if (cached) return cached;
  if (!process.env.RESEND_API_KEY) {
    throw new Error("[email] RESEND_API_KEY is not configured");
  }
  cached = new Resend(process.env.RESEND_API_KEY);
  return cached;
}

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Prime Athlete Academy <plan@primeathleteacademy.com>";
const REPLY_TO =
  process.env.RESEND_REPLY_TO ?? "primeathleteacademy@primeathleteacademy.com";

type PurchaseEmailParams = {
  toEmail: string;
  toName: string | null;
  productName: string;
  downloadUrl: string;
};

export async function sendPurchaseEmail(params: PurchaseEmailParams) {
  const resend = getResend();
  const firstName = params.toName?.split(" ")[0] ?? null;

  const html = renderPurchaseEmail({ ...params, firstName });
  const text = renderPurchaseEmailText({ ...params, firstName });

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: params.toEmail,
    replyTo: REPLY_TO,
    subject: `Dein ${params.productName} ist da`,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

function renderPurchaseEmail(p: PurchaseEmailParams & { firstName: string | null }) {
  const greeting = p.firstName ? `Hey ${p.firstName},` : "Hey,";
  const safeProduct = escapeHtml(p.productName);
  const safeUrl = encodeURI(p.downloadUrl);

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>${safeProduct}</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;color:#F5F5F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Inter,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0A0A0A;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background:#1A1A1A;border:1px solid rgba(197,165,90,0.25);border-radius:16px;overflow:hidden;">
          <!-- gold top accent -->
          <tr><td style="height:3px;background:linear-gradient(90deg,transparent,#C5A55A,transparent);"></td></tr>

          <tr>
            <td style="padding:36px 32px 8px 32px;">
              <p style="margin:0;letter-spacing:0.25em;text-transform:uppercase;color:#C5A55A;font-size:11px;font-weight:600;">
                Prime Athlete Academy
              </p>
              <h1 style="margin:14px 0 0 0;font-size:28px;line-height:1.15;font-weight:900;color:#F5F5F5;">
                Willkommen in der Off-Season.
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 8px 32px;">
              <p style="margin:0 0 14px 0;font-size:16px;line-height:1.55;color:#F5F5F5;">${escapeHtml(greeting)}</p>
              <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:rgba(245,245,245,0.85);">
                danke für dein Vertrauen. Du hast gerade den
                <strong style="color:#C5A55A;">${safeProduct}</strong> gesichert &mdash;
                den exakten 4-Wochen-Fahrplan, mit dem wir selbst in die Saison starten.
              </p>
              <p style="margin:0 0 24px 0;font-size:15px;line-height:1.65;color:rgba(245,245,245,0.85);">
                Klick unten, um den Plan herunterzuladen. Der Link ist <strong>30 Tage gültig</strong> &mdash;
                speichere die PDF anschließend lokal.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:8px 32px 32px 32px;">
              <a href="${safeUrl}" style="display:inline-block;padding:16px 32px;background:#C5A55A;color:#0A0A0A;font-weight:800;font-size:15px;text-decoration:none;border-radius:999px;letter-spacing:0.02em;">
                Plan jetzt herunterladen &rarr;
              </a>
              <p style="margin:14px 0 0 0;font-size:11px;color:rgba(245,245,245,0.45);">
                Falls der Button nicht funktioniert, kopiere diesen Link:<br>
                <span style="word-break:break-all;color:rgba(197,165,90,0.8);">${safeUrl}</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px;background:rgba(255,255,255,0.06);margin:8px 0 28px 0;"></div>
              <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#F5F5F5;letter-spacing:0.05em;text-transform:uppercase;">So holst du das Maximum raus</p>
              <ul style="margin:0 0 24px 18px;padding:0;color:rgba(245,245,245,0.78);font-size:14px;line-height:1.6;">
                <li>Lies dir die Einleitung und die 4 Phasen einmal komplett durch, bevor du startest.</li>
                <li>Plane die 4 Wochen fest in deinen Kalender &mdash; jede Session.</li>
                <li>Halte dich an die RPE-Skala. Beständigkeit schlägt Intensität.</li>
                <li>Verfolge deine Werte morgens (Gewicht, Schlaf, Energie) wie im Plan beschrieben.</li>
              </ul>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 36px 32px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(245,245,245,0.78);">
                Bei Fragen einfach auf diese Mail antworten &mdash; wir lesen jede selbst.
              </p>
              <p style="margin:18px 0 0 0;font-size:14px;color:#F5F5F5;font-weight:600;">
                Jonas & Patrick
              </p>
              <p style="margin:2px 0 0 0;font-size:12px;color:rgba(197,165,90,0.8);letter-spacing:0.05em;">
                Co-Founder &middot; Prime Athlete Academy
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px;background:#141414;border-top:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0;font-size:11px;color:rgba(245,245,245,0.4);text-align:center;line-height:1.55;">
                Diese E-Mail wurde an dich gesendet, weil du den Plan auf primeathleteacademy.com gekauft hast.<br>
                Prime Athlete Academy &middot; 95448 Bayreuth
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderPurchaseEmailText(p: PurchaseEmailParams & { firstName: string | null }) {
  const greeting = p.firstName ? `Hey ${p.firstName},` : "Hey,";
  return [
    greeting,
    "",
    `danke für dein Vertrauen. Du hast gerade den ${p.productName} gesichert.`,
    "",
    "Hier ist dein persönlicher Download-Link (30 Tage gültig):",
    p.downloadUrl,
    "",
    "Speichere die PDF nach dem Download lokal ab.",
    "",
    "Bei Fragen einfach auf diese Mail antworten.",
    "",
    "Jonas & Patrick",
    "Co-Founder · Prime Athlete Academy",
  ].join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
