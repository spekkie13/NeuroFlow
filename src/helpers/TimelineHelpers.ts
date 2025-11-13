import {Priority} from "@/app/utils/types";

export const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
        case 'high':
            return {
                backgroundColor: '#FEF2F2',
                borderColor: '#FECACA',
                color: '#B91C1C',
            };
        case 'medium':
            return {
                backgroundColor: '#FFFBEB',
                borderColor: '#FDE68A',
                color: '#92400E',
            };
        case 'low':
            return {
                backgroundColor: '#ECFDF3',
                borderColor: '#BBF7D0',
                color: '#166534',
            };
    }
};
