import React from 'react'

export interface MenuItemProps {
    icon: React.ReactNode
    label: string
    onPress: () => void
    danger?: boolean
    disabled?: boolean
}