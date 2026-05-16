# LocalSend Web App

A web app integrating WebRTC and WebSockets to share files with other LocalSend peers (browsers, or native versions).

Live: https://web.localsend.org

## Setup

Make sure to install [pnpm](https://pnpm.io).

```bash
npm install -g pnpm
```

Get dependencies

```bash
pnpm install
```

Start the development server

```bash
pnpm run dev
```

## Deployment

Generates the static website in the `dist` directory.

```bash
pnpm run generate
```

### Self-hosting

1. Clone this repo
2. Build: `docker build --tag localsend-web --file Containerfile .`
3. Run: `docker run --rm --publish 8080:80 localsend-web`

The container listens on plain HTTP on port `80` so a reverse proxy (e.g. Traefik, Caddy, nginx) can terminate TLS in front of it. Make sure the proxy forwards the request path **as-is** — do not strip the `BASE_PATH` prefix, since it is baked into the generated HTML and asset URLs at build time.

**Note**:
The web app requires a signaling server to work. By default, it uses the public signaling server at `wss://public.localsend.org/v1/ws`.
You can change this by setting the `SIGNALING_URL` environment variable during `pnpm run generate`.

To be fully self-hosted, you can also deploy your own [signaling server](https://github.com/localsend/localsend/tree/main/server).

### Serving under a sub-path

By default the app is served at the domain root (`/`). To host it under a sub-path such as `https://example.org/send/`, set the `BASE_PATH` environment variable for both `dev` and `generate`:

```bash
BASE_PATH=/send/ pnpm run generate
```

Or set `app.baseURL` directly in `nuxt.config.ts`. The value should start and end with a slash.

`BASE_URL` controls the public origin used for SEO canonical and hreflang links (defaults to `https://web.localsend.org`). Set both together when self-hosting under your own domain:

```bash
BASE_URL=https://example.org BASE_PATH=/send/ pnpm run generate
```

When building the container image, pass it as a build arg so the generated files land at the matching path inside Caddy:

```bash
docker build \
  --build-arg BASE_PATH=/send/ \
  --build-arg BASE_URL=https://example.org \
  --tag localsend-web --file Containerfile .
```

## Contributing

### Adding a new language

1. Add new JSON file in `i18n/locales/` directory.
2. Add the new language in `nuxt.config.ts`.
