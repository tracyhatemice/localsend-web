FROM node:24-bookworm AS builder

# Sub-path the app is served from. Override with `--build-arg BASE_PATH=/send/`.
# Leave as `/` to serve at the domain root.
ARG BASE_PATH=/send/
ENV BASE_PATH=${BASE_PATH}

# Public origin used for SEO canonical/hreflang links.
# Override with `--build-arg BASE_URL=https://example.org`.
ARG BASE_URL=https://web.localsend.org
ENV BASE_URL=${BASE_URL}

# Signaling server WebSocket URL baked into the generated bundle.
# Override with `--build-arg SIGNALING_URL=wss://example.org/send/v1/ws`.
ARG SIGNALING_URL=wss://public.localsend.org/v1/ws
ENV SIGNALING_URL=${SIGNALING_URL}

WORKDIR /data

COPY ./ /data

# pnpm needs a TTY to confirm recreating the modules directory; CI=true makes
# it auto-confirm in the non-interactive Docker build.
ENV CI=true

RUN corepack enable && \
    corepack prepare pnpm@10.32.0 --activate && \
    pnpm install && \
    pnpm approve-builds @parcel/watcher esbuild && \
    pnpm run generate

FROM caddy:alpine
ARG BASE_PATH=/send/
COPY --from=builder /data/.output/public /usr/share/caddy${BASE_PATH}
# Use an unquoted heredoc so ${BASE_PATH} is expanded at build time.
# try_files gives an SPA fallback to Nuxt's generated 200.html for routes
# that aren't pre-rendered (e.g. non-default i18n locales like /send/de).
RUN cat > /etc/caddy/Caddyfile <<EOF
:80 {
    root * /usr/share/caddy
    encode zstd gzip
    try_files {path} {path}.html {path}/index.html ${BASE_PATH}200.html
    file_server
}
EOF
EXPOSE 80
