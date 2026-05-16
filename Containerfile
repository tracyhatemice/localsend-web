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

RUN corepack enable pnpm && \
    pnpm install && \
    pnpm run generate

FROM caddy:alpine
ARG BASE_PATH=/send/
COPY --from=builder /data/.output/public /usr/share/caddy${BASE_PATH}
COPY <<"EOT" /etc/caddy/Caddyfile
:80 {
    root * /usr/share/caddy
    encode zstd gzip
    file_server
}
EOT
EXPOSE 80
