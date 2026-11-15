# farhankhaleque.com

Source for my portfolio site, [www.farhankhaleque.com](https://www.farhankhaleque.com).

Built with [Astro](https://astro.build), based on the MIT-licensed
[Big City Life](https://github.com/jramma/big-city) template by casset.cat.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:4321.

## Where things live

| What | File |
|---|---|
| Name, email, LinkedIn, menu | `src/consts.ts` |
| Home page scrolling panels and photos | `src/data/lookbook.ts` |
| Jobs (one file each) | `src/content/work/*.md` |
| Projects (one file each) | `src/content/collection/*.md` |
| About page | `src/pages/about.astro` |
| Photos | `public/lookbook/` |

To add a photo to a project, put it in `public/lookbook/` and add
`image: "/lookbook/your-photo.jpg"` to the project's frontmatter.

## Private page

`/private` asks for a password. Its content is encrypted before it's committed,
so the repo and the live site only hold ciphertext. To change the content or
the password:

1. Edit `private/content.html` (gitignored; start from `private/content.example.html`).
2. Run `npm run encrypt-private -- "new password"`.
3. Commit `src/data/private.enc.json` and push.

The page isn't linked from the menu, is left out of the sitemap, and tells
search engines not to index it.

## Deploy

Every push to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`).

One-time setup:

1. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
2. `public/CNAME` points Pages at `www.farhankhaleque.com`.
3. In Squarespace DNS, add:
   - `CNAME` record: `www` → `farhankhaleque.github.io`
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Once DNS resolves, turn on **Enforce HTTPS** in Settings → Pages.
