#!/bin/bash
#
# Log Cleanup Script for AetherCrown98
# Prunes old logs to save disk space
#
# Usage: ./log_cleanup.sh
# Cron: 0 0 * * 0 /path/to/log_cleanup.sh  # Weekly on Sunday
#

set -e

# ==================================
# CONFIGURATION
# ==================================

LOG_DIR="/home/runner/work/AetherCrown98/AetherCrown98/logs"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# ==================================
# FUNCTIONS
# ==================================

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

cleanup_logs() {
    log "Starting log cleanup..."
    log "Retention period: $RETENTION_DAYS days"
    
    if [ ! -d "$LOG_DIR" ]; then
        log "Log directory does not exist: $LOG_DIR"
        return 0
    fi
    
    local deleted_count=0
    local freed_space=0
    
    # Find and delete old log files
    while IFS= read -r -d '' file; do
        local size=$(du -b "$file" | cut -f1)
        log "Deleting: $file ($(numfmt --to=iec-i --suffix=B $size))"
        rm -f "$file"
        ((deleted_count++))
        ((freed_space+=size))
    done < <(find "$LOG_DIR" -type f -name "*.log" -mtime +$RETENTION_DAYS -print0)
    
    log "Cleanup complete:"
    log "  Files deleted: $deleted_count"
    log "  Space freed: $(numfmt --to=iec-i --suffix=B $freed_space)"
}

compress_old_logs() {
    log "Compressing logs older than 7 days..."
    
    local compressed_count=0
    
    while IFS= read -r -d '' file; do
        if [[ ! "$file" =~ \.gz$ ]]; then
            log "Compressing: $file"
            gzip "$file"
            ((compressed_count++))
        fi
    done < <(find "$LOG_DIR" -type f -name "*.log" -mtime +7 -print0)
    
    log "Compressed $compressed_count log files"
}

# ==================================
# MAIN
# ==================================

main() {
    log "==================================="
    log "Log Cleanup Script"
    log "==================================="
    
    compress_old_logs
    cleanup_logs
    
    log "Log cleanup completed"
}

main
