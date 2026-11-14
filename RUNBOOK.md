# S.H.E. LLC Website: Maintenance Runbook

This guide is for anyone who has to look after the Skilled Home Experts (S.H.E. LLC) website on their own. You don't need to be a developer. If you can edit a text file and use GitHub, you can do everything here.

---

## 1. How the site works

| Piece | What it is |
|---|---|
| **GitHub repo** | `https://github.com/batestzu/shellc`. All of the site's files live here. |
| **Vercel** | The hosting service. Every push to the `main` branch on GitHub **automatically publishes** the site, usually within about a minute. |
| **Google Apps Script** | A small script (`apps-script/Code.gs`) that turns the Estimate and Careers form submissions into emails. It runs on Google's servers, not on Vercel. |

There's no build step, database or CMS. The whole site is one HTML file.

### Files that matter

```
Skilled Home Experts.dc.html   <- THE WEBSITE. All pages, text, colors, photos, forms.
assets/                        <- Photos used on the site.
  she-handy-banner.jpg         <- Home page image (the S.H.E. Handy poster)
  team-placeholder.svg         <- About page "team photo coming soon" placeholder
.image-slots.state.json        <- How each photo is cropped/zoomed (see section 4)
apps-script/Code.gs            <- Copy of the Google Apps Script form-to-email code
index.html, vercel.json        <- Make the site's home address open the main file. Don't touch.
support.js, image-slot.js      <- Generated framework code. DO NOT EDIT.
```

The site has four pages: **Home, About, Contact, Careers**. They are all sections inside `Skilled Home Experts.dc.html`. There is also a **Gallery** page in the file, but it's hidden from the menu (see section 5).

---

## 2. One-time setup for a new maintainer

1. **Accounts you need access to**
   - The GitHub account or repo `batestzu/shellc` (owner access, or be added as a collaborator)
   - The Vercel project connected to that repo (to check deploys, domains and errors)
   - The Google account that owns the Apps Script (only needed if the forms break or the recipient email changes)
   - Whoever controls the domain's DNS (only needed if the domain changes)
2. **Install** [Git](https://git-scm.com/downloads) and a text editor ([VS Code](https://code.visualstudio.com/) is free and works well).
3. **Get a copy of the site:**
   ```bash
   git clone https://github.com/batestzu/shellc.git
   cd shellc
   ```

> **No-install option:** for small text changes you can edit files directly on github.com. Open the file, click the pencil icon, make the change, then click **Commit changes**. Vercel publishes it the same way.

---

## 3. Everyday workflow

```bash
git pull                      # 1. get the latest version first, every time
# 2. make your edits
# 3. preview locally (below)
git add -A
git commit -m "Describe what you changed"
git push                      # 4. this publishes the live site
```

### Previewing locally

Double-clicking the HTML file **won't work**, because the browser blocks it. Run a tiny local web server from the `shellc` folder instead:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000/>. Press `Ctrl+C` in the terminal to stop it.
(No Python? `npx serve .` works too if you have Node.js.)

Check your change at **phone width** too. In Chrome, press `F12` and then `Ctrl+Shift+M` to toggle the device toolbar.

---

## 4. Changing photos

### Replace an existing photo (easiest)

1. Prepare the new photo (see the size guide below).
2. Save it into `assets/` **with exactly the same filename** as the photo it replaces, overwriting the old one.
3. Preview, commit and push.

| Spot on site | File | Shape shown | Recommended size |
|---|---|---|---|
| Home page image | `assets/she-handy-banner.jpg` | Matches the poster (1080 × 1712) | Same shape as the current poster |
| About page team photo | `assets/team-placeholder.svg` (placeholder) | Tall portrait (9:16) | 900 × 1600 px |

The site crops images to fill the shape. An image with a different shape still works, but the edges get cut off. Put the important part (faces) near the center.

**Home image shape:** the Home box is sized to the poster's shape. Search for `aspect-ratio:1080/1712` in the HTML file and change the numbers to the new image's width/height (e.g. `aspect-ratio:1/1` for a square photo) so nothing important gets cropped.

**Adding the real team photo:** save it as `assets/team-photo.jpg`, then in the HTML change `src="assets/team-placeholder.svg"` to `src="assets/team-photo.jpg"`.

### Photo preparation checklist

- **Format:** `.jpg`. iPhone `.HEIC` photos **don't display** in most browsers. Convert them first: on the iPhone, change Settings → Camera → Formats → *Most Compatible*. On Windows, open the photo in the Photos app and choose *Save as* `.jpg`, or use a free converter.
- **File size:** aim for **under 500 KB**. Big photos make the site slow on phones. [squoosh.app](https://squoosh.app) is a free way to resize and compress in your browser.
- **Filenames:** lowercase, with dashes instead of spaces, e.g. `kitchen-repaint.jpg`.
- **Permission:** only use photos you own or have permission to use, and get the homeowner's OK before showing the inside of their home.

### Use a different filename

In `Skilled Home Experts.dc.html`, search for the old filename (e.g. `assets/she-handy-banner.jpg`) and change the `src="..."` to the new one.

### Adjusting the crop

`.image-slots.state.json` stores a zoom (`s`) and offset (`x`, `y`, in percent) for each photo:

```json
{"home-hero-b":{"s":1,"x":0,"y":0},"about-portrait":{"s":1,"x":0,"y":19.375}}
```

**When you replace a photo, reset its entry to `{"s":1,"x":0,"y":0}`**, because the old offset was tuned for the old picture. If faces are cut off, nudge `y` (positive moves the photo down, negative moves it up) and preview again.

### Overall photo size

Near the bottom of the HTML file, `pictureScale` (default `1`) scales every photo box up or down together.

---

## 5. Editing text and content

Everything is in `Skilled Home Experts.dc.html`. Use your editor's **Find** (`Ctrl+F`) to search for the text you see on the live site, then edit it in place.

Some content lives in lists near the **bottom** of the file, in the `renderVals()` section. Edit only the text inside the quotes:

| What | Search for |
|---|---|
| Phone, email, service area, office hours (Contact page cards) | `const contactCards` |
| The three services | `const services` |
| "Why choose us" cards | `const valueCards` |
| Mission pillars | `const pillars` |
| Careers perks list | `const perks` |
| Menu items | `const nav` |
| Gallery photos and captions | `const galleryMeta` |

**Phone number or email change:** also search the whole file for the old number or email, because it can appear in more than one place (footer, buttons, links like `tel:` and `mailto:`).

**Rules for editing safely:**
- Keep quotes, commas and brackets exactly as they are. A missing comma or quote can blank the whole site.
- An apostrophe inside single-quoted text must be written as `’` (curly apostrophe), as the existing text does. For example, `we’re`.
- Always preview before pushing. If the page is blank, press `F12` → **Console** to see the error, and look for a typo near what you just edited.

### Turning the Gallery page back on

1. Replace the stock photos. Put your photos in `assets/`, then in `const galleryMeta` change each entry's third value to your file. Also change `src: uns(g[2])` to `src: g[2]`, and write each third value as `'assets/your-photo.jpg'`. The second number in each entry is the tile height in pixels.
2. Add `['gallery', 'Gallery'],` to `const nav`.

---

## 6. Contact forms (Estimate and Careers)

**How it works:** the form on the site sends the data to a Google Apps Script web app (the URL is in `FORM_ENDPOINT_URL` in the HTML file). The script emails it to **lolaquinn@shehandy.com**, with any customer photos attached. Photos over 10 MB in total are skipped, and the email says so.

### Change who receives the form emails

1. Go to <https://script.google.com> while signed in as the Google account that owns the script, and open the project.
2. Change `const RECIPIENT = '...'` at the top.
3. Click **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. If you edit the existing deployment like this, the URL stays the same and the website needs no change.
4. Copy the same change into `apps-script/Code.gs` in the repo and commit it, so the backup stays accurate.

### If the script ever has to be re-created from scratch

1. Create a new project at script.google.com and paste in the contents of `apps-script/Code.gs`.
2. **Deploy → New deployment → Web app**. Set *Execute as*: **Me**, *Who has access*: **Anyone**. Authorize when asked.
3. Copy the `/exec` URL into `FORM_ENDPOINT_URL` in `Skilled Home Experts.dc.html`, then commit and push.

### Testing the forms

Submit a test estimate on the live site and confirm the email arrives (check spam). The website **always** shows "thanks" even if sending failed, because the browser can't see the script's response. Only the email arriving proves that it worked.

---

## 7. Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Pushed, but the live site didn't change | Check the Vercel dashboard → Deployments for a failed build. Hard-refresh your browser (`Ctrl+Shift+R`). |
| Site is blank | A typo in the HTML file, usually a missing quote or comma. Check `F12` → Console. Undo it (section 8) if needed. |
| A photo doesn't show | Wrong filename or path (it's case-sensitive: `.JPG` ≠ `.jpg`), or the file is HEIC. |
| A photo is cropped badly | Reset or adjust its entry in `.image-slots.state.json` (section 4). |
| Form emails stopped arriving | Check spam first. Then at script.google.com, open **Executions** to see errors. The Google account may need to re-authorize, or it may have hit Gmail's daily sending limit. |
| Fonts look wrong | Google Fonts didn't load. This is usually temporary or a network problem. |
| Site is down entirely | The site depends on unpkg.com (React) and Google Fonts. Check the Vercel status and the domain/DNS registration renewal. |

---

## 8. Undoing a bad change

**Quickest:** in Vercel → Deployments, find the last good deployment → **⋯ → Promote to Production** (called *Instant Rollback* in some versions). This restores the live site immediately while you fix things.

**Then fix the code** so the next push doesn't bring the problem back:

```bash
git log --oneline             # find the bad commit's ID (e.g. 2c28eb0)
git revert 2c28eb0            # creates a new commit that undoes it
git push
```

---

## 9. Things to check now and then

- **Domain renewal:** make sure the domain is on auto-renew with a valid card.
- **Contact info:** confirm the phone, email and office hours are still correct.
- **Test the forms** about once a month (section 6).
- **Photos:** swap in fresh job photos as the business grows.
