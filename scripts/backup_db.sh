#!/bin/bash
#
# Database Backup Script for AetherCrown98
# Backs up Supabase database to secure storage
#
# Usage: ./backup_db.sh
# Cron: 0 2 * * * /path/to/backup_db.sh  # Daily at 2 AM
#

set -e  # Exit on error

# ==================================
# CONFIGURATION
# ==================================

# Backup settings
BACKUP_DIR="/var/backups/aethercrown98"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="aethercrown98_backup_${TIMESTAMP}.sql.gz"

# Database connection (from environment variables)
DB_HOST="${SUPABASE_DB_HOST}"
DB_NAME="${SUPABASE_DB_NAME:-postgres}"
DB_USER="${SUPABASE_DB_USER:-postgres}"
DB_PASSWORD="${SUPABASE_DB_PASSWORD}"

# S3 settings for remote backup (optional)
S3_BUCKET="${BACKUP_S3_BUCKET}"
AWS_REGION="${AWS_REGION:-us-east-1}"

# ==================================
# FUNCTIONS
# ==================================

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error_exit() {
    log "ERROR: $1"
    exit 1
}

check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v pg_dump &> /dev/null; then
        error_exit "pg_dump not found. Install postgresql-client"
    fi
    
    if [ -n "$S3_BUCKET" ] && ! command -v aws &> /dev/null; then
        error_exit "aws cli not found but S3_BUCKET is set"
    fi
}

check_credentials() {
    log "Checking database credentials..."
    
    if [ -z "$DB_HOST" ]; then
        error_exit "SUPABASE_DB_HOST not set"
    fi
    
    if [ -z "$DB_PASSWORD" ]; then
        error_exit "SUPABASE_DB_PASSWORD not set"
    fi
}

create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        log "Creating backup directory: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR" || error_exit "Failed to create backup directory"
    fi
}

perform_backup() {
    log "Starting database backup..."
    
    local backup_path="$BACKUP_DIR/$BACKUP_FILE"
    
    # Set password for pg_dump
    export PGPASSWORD="$DB_PASSWORD"
    
    # Perform backup with compression
    if pg_dump -h "$DB_HOST" \
               -U "$DB_USER" \
               -d "$DB_NAME" \
               --clean \
               --if-exists \
               --no-owner \
               --no-privileges \
               | gzip > "$backup_path"; then
        
        log "Backup created successfully: $backup_path"
        
        # Get file size
        local size=$(du -h "$backup_path" | cut -f1)
        log "Backup size: $size"
        
        # Unset password
        unset PGPASSWORD
        
        return 0
    else
        unset PGPASSWORD
        error_exit "Backup failed"
    fi
}

upload_to_s3() {
    if [ -z "$S3_BUCKET" ]; then
        log "S3 bucket not configured, skipping remote backup"
        return 0
    fi
    
    log "Uploading backup to S3: s3://$S3_BUCKET/"
    
    local backup_path="$BACKUP_DIR/$BACKUP_FILE"
    
    if aws s3 cp "$backup_path" \
              "s3://$S3_BUCKET/backups/" \
              --region "$AWS_REGION" \
              --storage-class STANDARD_IA; then
        
        log "Upload to S3 successful"
        return 0
    else
        log "WARNING: S3 upload failed"
        return 1
    fi
}

cleanup_old_backups() {
    log "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local deleted_count=0
    
    # Find and delete old local backups
    find "$BACKUP_DIR" -name "aethercrown98_backup_*.sql.gz" \
         -type f -mtime +$RETENTION_DAYS -print0 | while IFS= read -r -d '' file; do
        log "Deleting old backup: $file"
        rm -f "$file"
        ((deleted_count++))
    done
    
    log "Deleted $deleted_count old local backups"
    
    # Cleanup old S3 backups if configured
    if [ -n "$S3_BUCKET" ]; then
        log "Cleaning up old S3 backups..."
        
        # Calculate date for retention
        local cutoff_date=$(date -d "$RETENTION_DAYS days ago" +%Y%m%d)
        
        # List and delete old S3 backups
        aws s3 ls "s3://$S3_BUCKET/backups/" --region "$AWS_REGION" | \
        while read -r line; do
            local file=$(echo "$line" | awk '{print $4}')
            local file_date=$(echo "$file" | grep -oP '\d{8}' | head -1)
            
            if [ -n "$file_date" ] && [ "$file_date" -lt "$cutoff_date" ]; then
                log "Deleting old S3 backup: $file"
                aws s3 rm "s3://$S3_BUCKET/backups/$file" --region "$AWS_REGION"
            fi
        done
    fi
}

verify_backup() {
    local backup_path="$BACKUP_DIR/$BACKUP_FILE"
    
    log "Verifying backup integrity..."
    
    # Check if file exists and is not empty
    if [ ! -f "$backup_path" ]; then
        error_exit "Backup file not found: $backup_path"
    fi
    
    if [ ! -s "$backup_path" ]; then
        error_exit "Backup file is empty: $backup_path"
    fi
    
    # Test gzip integrity
    if ! gzip -t "$backup_path" 2>/dev/null; then
        error_exit "Backup file is corrupted"
    fi
    
    log "Backup verification successful"
}

send_notification() {
    local status=$1
    local message=$2
    
    # Send notification via webhook or email
    # Customize this based on your notification system
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
             -H 'Content-Type: application/json' \
             -d "{\"text\": \"🗄️ Database Backup $status: $message\"}" \
             --silent --output /dev/null
    fi
    
    # Or send email
    if [ -n "$NOTIFICATION_EMAIL" ] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "Database Backup $status" "$NOTIFICATION_EMAIL"
    fi
}

# ==================================
# MAIN EXECUTION
# ==================================

main() {
    log "==================================="
    log "AetherCrown98 Database Backup"
    log "==================================="
    
    # Run checks
    check_dependencies
    check_credentials
    create_backup_dir
    
    # Perform backup
    if perform_backup; then
        verify_backup
        upload_to_s3
        cleanup_old_backups
        
        log "Backup completed successfully"
        send_notification "SUCCESS" "Database backup completed: $BACKUP_FILE"
        exit 0
    else
        log "Backup failed"
        send_notification "FAILED" "Database backup failed"
        exit 1
    fi
}

# Run main function
main
