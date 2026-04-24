require("dotenv").config();

const path = require("path");
const express = require("express");
const twilio = require("twilio");

const app = express();
const port = Number(process.env.PORT) || 4174;

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || "";
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || "";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "";
const businessPhoneNumber = process.env.BUSINESS_PHONE_NUMBER || "+18182038752";
const brandName = process.env.BRAND_NAME || "An Yan Diode Laser";

const twilioConfigured = Boolean(twilioAccountSid && twilioAuthToken && twilioPhoneNumber);
const twilioClient = twilioConfigured ? twilio(twilioAccountSid, twilioAuthToken) : null;

app.disable("x-powered-by");
app.use(express.json({ limit: "50kb" }));
app.use(express.static(path.join(__dirname)));

const normalizePhoneNumber = (input) => {
  const raw = `${input || ""}`.trim();
  const digits = raw.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (raw.startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return "";
};

const normalizeTextLine = (input) => `${input || ""}`.replace(/\s+/g, " ").trim();

const normalizeMultilineText = (input) =>
  `${input || ""}`
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");

app.post("/api/help-request", async (req, res) => {
  const name = normalizeTextLine(req.body?.name);
  const mobileInput = normalizeTextLine(req.body?.mobile);
  const note = normalizeMultilineText(req.body?.note);
  const consent = req.body?.consent === true;

  if (!twilioConfigured || !twilioClient) {
    res.status(503).json({
      error: "SMS auto-reply is not configured yet. Add your Twilio settings first.",
    });
    return;
  }

  if (!name) {
    res.status(400).json({ error: "Name is required." });
    return;
  }

  if (!mobileInput) {
    res.status(400).json({ error: "Mobile number is required." });
    return;
  }

  const mobile = normalizePhoneNumber(mobileInput);
  if (!mobile) {
    res.status(400).json({ error: "Enter a valid mobile number." });
    return;
  }

  if (!note) {
    res.status(400).json({ error: "Note is required." });
    return;
  }

  if (!consent) {
    res.status(400).json({ error: "Consent is required before sending a text reply." });
    return;
  }

  const businessMessage = [
    `New website help request for ${brandName}`,
    `Name: ${name}`,
    `Mobile: ${mobile}`,
    `Note: ${note}`,
  ].join("\n");

  const clientReply =
    `Hi ${name}, we received your message. Thank you for contacting ${brandName}. ` +
    `We will get back to you soon. Reply STOP to opt out.`;

  try {
    await Promise.all([
      twilioClient.messages.create({
        from: twilioPhoneNumber,
        to: businessPhoneNumber,
        body: businessMessage,
      }),
      twilioClient.messages.create({
        from: twilioPhoneNumber,
        to: mobile,
        body: clientReply,
      }),
    ]);

    res.json({ ok: true });
  } catch (error) {
    const errorMessage =
      error && typeof error.message === "string" && error.message
        ? error.message
        : "Unable to send the help request right now.";

    res.status(502).json({ error: errorMessage });
  }
});

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  if (!twilioConfigured) {
    console.log("Server started, but Twilio SMS auto-reply is not configured yet.");
  }

  console.log(`An Yan Diode Laser server listening on http://0.0.0.0:${port}`);
});
