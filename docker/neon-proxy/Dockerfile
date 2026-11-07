# Reuses the upstream neon-proxy binary; regenerates TLS certs (pre-built images ship expired certs).
FROM ghcr.io/timowilhelm/local-neon-http-proxy:mutli-platform-image AS upstream

FROM debian:bookworm-slim

ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update -qq \
	&& apt-get install -qq --no-install-recommends \
		ca-certificates \
		curl \
		caddy \
		postgresql-client \
		openssl \
	&& apt-get clean -qq && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=upstream /app/neon-proxy ./neon-proxy
COPY --from=upstream /app/Caddyfile ./Caddyfile
COPY --from=upstream /app/start.sh ./start.sh

RUN openssl req -new -x509 \
	-days 365 \
	-nodes -text \
	-out server.pem \
	-keyout server.key \
	-subj "/CN=*.localtest.me" \
	-addext "subjectAltName = DNS:*.localtest.me" \
	&& chmod +x start.sh

EXPOSE 4444
ENTRYPOINT ["./start.sh"]
