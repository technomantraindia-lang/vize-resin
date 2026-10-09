#!/bin/bash
set -e

echo "=== VIZE Resin Backend Booting ==="

if [ -n "$DB_HOST" ] && [ "$DB_CONNECTION" = "mysql" ]; then
    echo "Connecting to MySQL at $DB_HOST..."
    if ! mysql -h "$DB_HOST" -P "${DB_PORT:-3306}" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" -e "DESCRIBE admins;" > /dev/null 2>&1; then
        echo "Admins table not found. Auto-importing database_backup.sql..."
        mysql -h "$DB_HOST" -P "${DB_PORT:-3306}" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" < database_backup.sql || true
        echo "Database imported successfully!"
    else
        echo "Database already initialized."
    fi
fi

mkdir -p storage/app storage/framework/cache storage/framework/sessions storage/framework/views
touch storage/installed

echo "Starting Laravel server..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
