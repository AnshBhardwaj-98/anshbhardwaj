# EmailJS templates

Three templates styled after the portfolio: onyx `#0f0f0f`, cream `#faf9f6`, terracotta `#c26d50`,
muted `#6e6a64`, hairline `#e4dfd6`; condensed uppercase headlines, small letter-spaced labels, thin rules.

All markup is email-safe: table layout, inline styles, no images, no web fonts (the headline stack falls back
from a condensed face to Arial). Paste each block into **EmailJS → Email Templates → (template) → Content →
Edit Content → Code (`<>`)**.

| #   | Template                         | Account | `.env` key                  | Variables the site sends             |
| --- | -------------------------------- | ------- | --------------------------- | ------------------------------------ |
| 1   | Contact message (to you)         | A       | `VITE_EMAILJS_TEMPLATE_ID`  | `from_name`, `from_email`, `message` |
| 2   | Résumé request (to you)          | A       | `VITE_EMAILJS_TEMPLATE2_ID` | `user_email`, `time`                 |
| 3   | Résumé download (to the visitor) | B       | `VITE_EMAILJS_TEMPLATE3_ID` | `user_email`, `time`                 |

---

## 1. Contact message (goes to you)

**Settings**

- Subject: `New message from {{from_name}}`
- To Email: `contact@anshbhardwaj.com`
- From Name: `Portfolio`
- Reply To: `{{from_email}}` (hitting Reply answers the sender directly)

```html
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background:#faf9f6; padding:40px 16px;"
>
  <tr>
    <td align="center">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="max-width:600px; background:#ffffff; border:1px solid #e4dfd6;"
      >
        <!-- header -->
        <tr>
          <td style="background:#0f0f0f; padding:22px 32px;">
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tr>
                <td
                  style="font-family:Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; color:#faf9f6;"
                >
                  Divyansh Bhardwaj<span style="color:#c26d50;">.</span>
                </td>
                <td
                  align="right"
                  style="font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                >
                  ( Contact )
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td
            style="height:3px; background:#c26d50; line-height:3px; font-size:0;"
          >
            &nbsp;
          </td>
        </tr>

        <!-- headline -->
        <tr>
          <td style="padding:40px 32px 8px;">
            <div
              style="font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#c26d50;"
            >
              &#9632;&nbsp; New message
            </div>
            <div
              style="margin-top:14px; font-family:'Google Sans Flex','Arial Narrow','Helvetica Neue',Arial,sans-serif; font-stretch:condensed; font-size:44px; line-height:0.95; font-weight:800; letter-spacing:-0.5px; text-transform:uppercase; color:#0f0f0f;"
            >
              Someone wants<br /><span style="color:#c26d50;">to talk.</span>
            </div>
          </td>
        </tr>

        <!-- sender -->
        <tr>
          <td style="padding:28px 32px 0;">
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="border-top:1px solid #e4dfd6;"
            >
              <tr>
                <td
                  width="110"
                  valign="top"
                  style="padding:16px 0; font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                >
                  01 &mdash; Name
                </td>
                <td
                  valign="top"
                  style="padding:16px 0; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#0f0f0f;"
                >
                  {{from_name}}
                </td>
              </tr>
              <tr>
                <td
                  width="110"
                  valign="top"
                  style="padding:16px 0; border-top:1px solid #e4dfd6; font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                >
                  02 &mdash; Email
                </td>
                <td
                  valign="top"
                  style="padding:16px 0; border-top:1px solid #e4dfd6; font-family:Arial, Helvetica, sans-serif; font-size:16px;"
                >
                  <a
                    href="mailto:{{from_email}}"
                    style="color:#0f0f0f; text-decoration:underline;"
                    >{{from_email}}</a
                  >
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- message -->
        <tr>
          <td style="padding:8px 32px 0;">
            <div
              style="border-top:1px solid #e4dfd6; padding-top:16px; font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
            >
              03 &mdash; Message
            </div>
            <div
              style="margin-top:12px; background:#faf9f6; border-left:3px solid #c26d50; padding:18px 20px; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.65; color:#2a2826; white-space:pre-wrap;"
            >
              {{message}}
            </div>
          </td>
        </tr>

        <!-- reply button -->
        <tr>
          <td style="padding:32px 32px 40px;">
            <a
              href="mailto:{{from_email}}"
              style="display:inline-block; background:#0f0f0f; color:#faf9f6; padding:14px 26px; border-radius:999px; font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; text-decoration:none;"
            >
              Reply to {{from_name}} &nbsp;&#8599;
            </a>
          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td
            style="background:#0f0f0f; padding:18px 32px; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#8a857d;"
          >
            Sent from the contact form on your portfolio &middot;
            <span style="color:#c26d50;">anshbhardwaj.com</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

---

## 2. Résumé request (goes to you)

**Settings**

- Subject: `Résumé requested by {{user_email}}`
- To Email: `contact@anshbhardwaj.com`
- From Name: `Portfolio`
- Reply To: `{{user_email}}`

```html
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background:#faf9f6; padding:40px 16px;"
>
  <tr>
    <td align="center">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="max-width:600px; background:#ffffff; border:1px solid #e4dfd6;"
      >
        <!-- header -->
        <tr>
          <td style="background:#0f0f0f; padding:22px 32px;">
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tr>
                <td
                  style="font-family:Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; color:#faf9f6;"
                >
                  Divyansh Bhardwaj<span style="color:#c26d50;">.</span>
                </td>
                <td
                  align="right"
                  style="font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                >
                  ( Résumé )
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td
            style="height:3px; background:#c26d50; line-height:3px; font-size:0;"
          >
            &nbsp;
          </td>
        </tr>

        <!-- headline -->
        <tr>
          <td style="padding:40px 32px 8px;">
            <div
              style="font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#c26d50;"
            >
              &#9632;&nbsp; Download request
            </div>
            <div
              style="margin-top:14px; font-family:'Google Sans Flex','Arial Narrow','Helvetica Neue',Arial,sans-serif; font-stretch:condensed; font-size:44px; line-height:0.95; font-weight:800; letter-spacing:-0.5px; text-transform:uppercase; color:#0f0f0f;"
            >
              Your résumé<br /><span style="color:#c26d50;">is out there.</span>
            </div>
            <div
              style="margin-top:18px; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#6e6a64;"
            >
              Someone asked for your résumé on the portfolio. The download link
              has been sent to them automatically.
            </div>
          </td>
        </tr>

        <!-- details -->
        <tr>
          <td style="padding:28px 32px 0;">
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="border-top:1px solid #e4dfd6;"
            >
              <tr>
                <td
                  width="110"
                  valign="top"
                  style="padding:16px 0; font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                >
                  01 &mdash; Email
                </td>
                <td
                  valign="top"
                  style="padding:16px 0; font-family:Arial, Helvetica, sans-serif; font-size:16px;"
                >
                  <a
                    href="mailto:{{user_email}}"
                    style="color:#0f0f0f; text-decoration:underline;"
                    >{{user_email}}</a
                  >
                </td>
              </tr>
              <tr>
                <td
                  width="110"
                  valign="top"
                  style="padding:16px 0; border-top:1px solid #e4dfd6; border-bottom:1px solid #e4dfd6; font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                >
                  02 &mdash; When
                </td>
                <td
                  valign="top"
                  style="padding:16px 0; border-top:1px solid #e4dfd6; border-bottom:1px solid #e4dfd6; font-family:Arial, Helvetica, sans-serif; font-size:16px; color:#0f0f0f;"
                >
                  {{time}}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- follow-up button -->
        <tr>
          <td style="padding:32px 32px 40px;">
            <a
              href="mailto:{{user_email}}"
              style="display:inline-block; background:#c26d50; color:#faf9f6; padding:14px 26px; border-radius:999px; font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; text-decoration:none;"
            >
              Follow up &nbsp;&#8599;
            </a>
          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td
            style="background:#0f0f0f; padding:18px 32px; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#8a857d;"
          >
            Résumé request from your portfolio &middot;
            <span style="color:#c26d50;">anshbhardwaj.com</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

---

## 3. Résumé download (goes to the visitor)

**Settings** (on account B)

- Subject: `Divyansh Bhardwaj · Résumé`
- To Email: `{{user_email}}` (must be exactly this, or the visitor never receives it)
- From Name: `Divyansh Bhardwaj`
- Reply To: `contact@anshbhardwaj.com`

The download link is the same Google Drive file as before. Swap the `id=` value if the résumé is re-uploaded.

```html
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="background:#faf9f6; padding:40px 16px;"
>
  <tr>
    <td align="center">
      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="max-width:600px; background:#ffffff; border:1px solid #e4dfd6;"
      >
        <!-- header -->
        <tr>
          <td style="background:#0f0f0f; padding:22px 32px;">
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
            >
              <tr>
                <td
                  style="font-family:Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; color:#faf9f6;"
                >
                  Divyansh Bhardwaj<span style="color:#c26d50;">.</span>
                </td>
                <td
                  align="right"
                  style="font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                >
                  Software Engineer
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td
            style="height:3px; background:#c26d50; line-height:3px; font-size:0;"
          >
            &nbsp;
          </td>
        </tr>

        <!-- headline -->
        <tr>
          <td style="padding:44px 32px 8px;">
            <div
              style="font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#c26d50;"
            >
              &#9632;&nbsp; Your copy
            </div>
            <div
              style="margin-top:14px; font-family:'Google Sans Flex','Arial Narrow','Helvetica Neue',Arial,sans-serif; font-stretch:condensed; font-size:48px; line-height:0.95; font-weight:800; letter-spacing:-0.5px; text-transform:uppercase; color:#0f0f0f;"
            >
              Thanks for<br /><span style="color:#c26d50;">stopping by.</span>
            </div>
            <div
              style="margin-top:20px; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.65; color:#6e6a64;"
            >
              Here's the latest version of my résumé. I build backends,
              full-stack products and LLM pipelines, and I'm open to software
              engineering roles across backend, full-stack and GenAI.
            </div>
          </td>
        </tr>

        <!-- download -->
        <tr>
          <td style="padding:32px 32px 8px;">
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="background:#0f0f0f;"
            >
              <tr>
                <td style="padding:28px 28px 26px;">
                  <div
                    style="font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d;"
                  >
                    Divyansh_Bhardwaj.pdf
                  </div>
                  <div
                    style="margin-top:8px; font-family:'Google Sans Flex','Arial Narrow','Helvetica Neue',Arial,sans-serif; font-stretch:condensed; font-size:26px; line-height:1; font-weight:800; text-transform:uppercase; color:#faf9f6;"
                  >
                    Résumé &middot; 2026
                  </div>
                  <a
                    href="https://drive.google.com/uc?export=download&id=1xntWcrEWPhZlQ8hMZjOsUDFHVt7YaDk7"
                    style="display:inline-block; margin-top:22px; background:#c26d50; color:#faf9f6; padding:14px 28px; border-radius:999px; font-family:Arial, Helvetica, sans-serif; font-size:12px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; text-decoration:none;"
                  >
                    Download résumé &nbsp;&#8595;
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- elsewhere -->
        <tr>
          <td style="padding:28px 32px 40px;">
            <div
              style="font-family:Arial, Helvetica, sans-serif; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8a857d; border-top:1px solid #e4dfd6; padding-top:16px;"
            >
              ( Find me elsewhere )
            </div>
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin-top:14px;"
            >
              <tr>
                <td
                  style="padding-right:22px; font-family:Arial, Helvetica, sans-serif; font-size:14px;"
                >
                  <a
                    href="https://linkedin.com/in/divyanshbhardwaj001"
                    style="color:#0f0f0f; text-decoration:none; border-bottom:1px solid #c26d50;"
                    >LinkedIn</a
                  >
                </td>
                <td
                  style="padding-right:22px; font-family:Arial, Helvetica, sans-serif; font-size:14px;"
                >
                  <a
                    href="https://github.com/AnshBhardwaj-98"
                    style="color:#0f0f0f; text-decoration:none; border-bottom:1px solid #c26d50;"
                    >GitHub</a
                  >
                </td>
                <td
                  style="font-family:Arial, Helvetica, sans-serif; font-size:14px;"
                >
                  <a
                    href="mailto:contact@anshbhardwaj.com"
                    style="color:#0f0f0f; text-decoration:none; border-bottom:1px solid #c26d50;"
                    >Email</a
                  >
                </td>
              </tr>
            </table>
            <div
              style="margin-top:22px; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:1.6; color:#6e6a64;"
            >
              Want to talk? Just reply to this email.
            </div>
          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td
            style="background:#0f0f0f; padding:18px 32px; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#8a857d;"
          >
            Divyansh Bhardwaj &middot; New Delhi, India &middot;
            <span style="color:#c26d50;">anshbhardwaj.com</span><br />
            You're receiving this because a résumé was requested for
            {{user_email}} on {{time}}.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```
