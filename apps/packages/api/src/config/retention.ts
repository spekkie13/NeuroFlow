export const TOMBSTONE_RETENTION_MONTHS = 3

/**
 * Cutoff timestamp for soft-delete tombstones. Rows soft-deleted before this point
 * are considered expired: no longer advertised to clients and eligible to be purged.
 * Three months gives every device ample time to sync the deletion and converge.
 */
export function tombstoneCutoff(now: Date = new Date()): Date {
    const cutoff = new Date(now)
    cutoff.setMonth(cutoff.getMonth() - TOMBSTONE_RETENTION_MONTHS)
    return cutoff
}