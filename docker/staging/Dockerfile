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

ENV APP_WORKERS_ENABLED=true \
    AUTORUN_ENABLED=true \
    AUTORUN_LARAVEL_STORAGE_LINK=false \
    APP_WORKERS_ENABLED=false

# Install additional php extensions
# https://github.com/mlocati/docker-php-extension-installer?tab=readme-ov-file
RUN install-php-extensions excimer gd intl && \
    chown www-data:www-data /etc/s6-overlay/s6-rc.d/user/contents.d && \
    mv /usr/local/etc/php/conf.d/serversideup-docker-php.ini /usr/local/etc/php/php.ini

COPY --chmod=755 docker/common/entrypoint.d/ /etc/entrypoint.d/
COPY --chmod=755 docker/common/s6-overlay/ /etc/s6-overlay/s6-rc.d/
# COPY --chown=www-data:www-data --chmod=755 docker/staging/entrypoint.d/ /etc/entrypoint.d/
# COPY --chown=www-data:www-data --chmod=755 docker/staging/s6-overlay/ /etc/s6-overlay/s6-rc.d/
COPY --chown=www-data:www-data docker/common/nginx/*.conf /etc/nginx/server-opts.d/
# COPY --chown=www-data:www-data docker/staging/nginx/*.conf /etc/nginx/server-opts.d/

############################################
# Deployment Image
############################################
FROM base AS deploy

ENV SSL_MODE=off PHP_OPCACHE_ENABLE=1

USER www-data
WORKDIR ${APP_BASE_DIR}

# Copy our project files into the container
COPY --chown=www-data:www-data . .

# Make sure our container has the correct permissions
RUN find . -type f -exec chmod 644 {} + && find . -type d -exec chmod 755 {} + && \
    chmod -R 775 bootstrap/cache && chmod +x artisan && \
    rm -rf docker

# Install composer dependencies
RUN composer install --optimize-autoloader --no-interaction --no-progress --no-dev && \
    find vendor -type d -name 'docs' -exec rm -rf {} + && \
    find vendor -type f \( -name '*.md' -and -not -name 'LICENSE.md' \) -exec rm {} +

VOLUME ["${APP_BASE_DIR}/storage/app"]
