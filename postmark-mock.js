const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

let emails = [];

// Mock endpoint that Postmark client calls
app.post("/email", (req, res) => {
    const email = {
        id: "mock-" + Date.now(),
        to: req.body.To,
        from: req.body.From,
        subject: req.body.Subject,
        htmlBody: req.body.HtmlBody,
        textBody: req.body.TextBody,
        messageStream: req.body.MessageStream,
        receivedAt: new Date()
    };

    emails.push(email);
    console.log("📩 Mock email received:", email);

    res.json({
        To: email.to,
        MessageID: email.id,
        ErrorCode: 0,
        Message: "Mock success",
    });
});

// Browser UI to inspect emails
app.get("/", (req, res) => {
    res.send(`
    <body style="background-color: #4c4c4c; color: white">
        <h1>📧 Mock Postmark Inbox</h1>
        <form method="post" action="/clear-inbox" style="margin-bottom:10px;">
          <button>🗑️ Clear Inbox</button>
        </form>
        <ul>
          ${emails.toReversed().map(e => `
            <li>
              <b>To:</b> ${e.to} <br>
              <b>Subject:</b> ${e.subject} <br>
              <b>Message Stream:</b> ${e.messageStream} <br>
              <a href="/email/${e.id}">View</a>
            </li>`)
        .join("")}
        </ul>
    </body>

  `);
});

app.get("/emails", (req, res) => {
    res.json(emails);
});

// View individual email
app.get("/email/:id", (req, res) => {
    const email = emails.find((e) => e.id === req.params.id);
    if (!email) return res.status(404).send("Not found");

    res.send(`
    <h2>${email.subject}</h2>
    <p><b>To:</b> ${email.to}</p>
    <p><b>From:</b> ${email.from}</p>
    <div style="border:1px solid #ccc; padding:10px; margin-top:10px;">
      ${email.htmlBody || "<pre>" + email.textBody + "</pre>"}
    </div>
  `);
});

// Clear all stored emails
app.delete("/emails", (req, res) => {
    emails = [];
    console.log("🗑️ Inbox cleared");
    res.json({message: "Inbox cleared"});
});

// UI helper endpoint
app.post("/clear-inbox", (req, res) => {
    emails = [];
    console.log("🗑️ Inbox cleared via UI");
    res.redirect("/");
});

const PORT = 8085;
app.listen(PORT, () =>
    console.log(`📨 Mock Postmark running at http://localhost:${PORT}`)
);

