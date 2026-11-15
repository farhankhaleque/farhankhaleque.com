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

## Private pages

`/private` and the project pages under it ask for a password. Their content is
encrypted before it's committed, so the repo and the live site only hold
ciphertext. Each `private/<name>.html` becomes `/private/<name>`
(`index.html` is `/private` itself). Those plaintext files are gitignored.

To edit a page, add one, or change the password:

1. On a fresh checkout, recover the plaintext: `npm run decrypt-private -- "current password"`.
2. Edit or add files in `private/`.
3. Run `npm run encrypt-private -- "password"` (use a new password here to change it).
4. Commit `src/data/private/` and push.

The pages aren't linked from the menu, are left out of the sitemap, and tell
search engines not to index them.

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
