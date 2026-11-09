# farhankhaleque.com

Source for my portfolio website, [www.farhankhaleque.com](https://www.farhankhaleque.com).

Plain HTML and CSS. No build step.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy (GitHub Pages)

1. Go to the repo's **Settings → Pages**. Set the source to **Deploy from a branch**, `main`, `/ (root)`.
2. The `CNAME` file already points Pages at `www.farhankhaleque.com`.
3. At your domain registrar, add these DNS records:
   - `CNAME` record: `www` → `farhankhaleque.github.io`
   - `A` records for the apex `farhankhaleque.com`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Once DNS resolves, turn on **Enforce HTTPS** in Settings → Pages.

## Editing

Placeholder content is marked with `<!-- TODO -->` comments in `index.html`.
