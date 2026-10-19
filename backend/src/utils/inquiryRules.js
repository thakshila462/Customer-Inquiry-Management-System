const VALID_STATUSES = [
    "NEW",
    "IN_PROGRESS",
    "RESOLVED",
];

const ALLOWED_TRANSITIONS = {
    NEW: ["IN_PROGRESS"],
    IN_PROGRESS: ["RESOLVED"],
    RESOLVED: [],
};

function canTransitionStatus(currentStatus, nextStatus) {
    if (!VALID_STATUSES.includes(nextStatus)) {
        return false;
    }

    return ALLOWED_TRANSITIONS[currentStatus]?.includes(nextStatus) ?? false;
}

module.exports = {
    VALID_STATUSES,
    canTransitionStatus,
};