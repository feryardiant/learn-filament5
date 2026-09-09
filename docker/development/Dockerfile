# Add user/group
ARG USER_ID=9999
ARG GROUP_ID=9999
ARG PHP_VERSION=8.5
ARG BASE_OS=alpine
ARG BASE_VERSION=3.23

############################################
# Base Image
############################################
FROM serversideup/php:${PHP_VERSION}-fpm-nginx-${BASE_OS}${BASE_VERSION} AS base

USER root

ARG USER_ID
ARG GROUP_ID

ENV APP_WORKERS_ENABLED=true
ENV AUTORUN_ENABLED=true AUTORUN_LARAVEL_STORAGE_LINK=false

# Install additional php extensions
# https://github.com/mlocati/docker-php-extension-installer?tab=readme-ov-file
RUN install-php-extensions excimer gd sockets xdebug && \
    chown www-data:www-data /etc/s6-overlay/s6-rc.d/user/contents.d && \
    mv /usr/local/etc/php/conf.d/serversideup-docker-php.ini /usr/local/etc/php/php.ini

COPY --chmod=755 docker/common/entrypoint.d/ /etc/entrypoint.d/
COPY --chmod=755 docker/common/s6-overlay/ /etc/s6-overlay/s6-rc.d/
COPY --chown=www-data:www-data --chmod=755 docker/development/entrypoint.d/ /etc/entrypoint.d/
COPY --chown=www-data:www-data --chmod=755 docker/development/s6-overlay/ /etc/s6-overlay/s6-rc.d/
COPY --chown=www-data:www-data docker/common/nginx/*.conf /etc/nginx/server-opts.d/
COPY --chown=www-data:www-data docker/development/nginx/*.conf /etc/nginx/server-opts.d/
COPY docker/development/php/*.ini /usr/local/etc/php/conf.d/

############################################
# Deployment Image
############################################
FROM base AS deploy

ENV SSL_MODE=off PHP_OPCACHE_ENABLE=0

WORKDIR ${APP_BASE_DIR}

# Install node.js and enable corepack
RUN set -eux && apk --update add --no-cache --purge nodejs npm && \
    mkdir -p node_modules && chown www-data:www-data node_modules && \
    npm install -g pnpm

USER www-data
