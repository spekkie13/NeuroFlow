import * as Localization from 'expo-localization'
import {LocalDateInput} from "../models/dates.types";
import {Locale} from "expo-localization";

const getPrimaryLocale = (): string => {
    const locales: Locale[] = Localization.getLocales()
    return locales && locales.length > 0 ? locales[0].languageTag : 'en-US'
}

export const getLocalDateFormat = (): string => {
    const formatter = new Intl.DateTimeFormat(getPrimaryLocale())
    const parts = formatter.formatToParts(new Date())

    const template = parts.map((p) => {
        if (p.type === 'day') return 'dd'
        if (p.type === 'month') return 'MM'
        if (p.type === 'year') return 'yyyy'
        return p.value
    })

    return template.join('')
}

export const inferDateSeparator = (template: string): string => {
    if (template.includes('-')) return '-'
    if (template.includes('/')) return '/'
    if (template.includes('.')) return '.'
    return '/' // fallback
}

/** Zero-pads a number to 2 digits. e.g. 5 → "05", 12 → "12" */
export const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`)

const toDate = (value: LocalDateInput): Date | null => {
    if (!value) return null
    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value
    }
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d
}

/**
 * Formatteert een datum (Date of string) in lokale notatie.
 *
 * - Zonder options: gebruikt een patroon als "dd-MM-yyyy"
 * - Met options: direct via toLocaleDateString(locale, options)
 */
export const formatLocalDate = (
    value?: LocalDateInput,
    options?: Intl.DateTimeFormatOptions,
): string => {
    const date: Date = toDate(value)
    if (!date) return ''

    if (options) {
        return date.toLocaleDateString(getPrimaryLocale(), options)
    }

    const fmt: string = getLocalDateFormat() // bijv. "dd-MM-yyyy"
    const day: string = pad2(date.getDate())
    const month: string = pad2(date.getMonth() + 1)
    const year = `${date.getFullYear()}`

    return fmt
        .replace('dd', day)
        .replace('MM', month)
        .replace('yyyy', year)
}

/**
 * Formatteert een datumbereik in lokale notatie.
 *
 * - returnAsArray = false → "12-02-2025 – 15-02-2025"
 * - returnAsArray = true  → ["12-02-2025", "15-02-2025"]
 */
export const formatLocalDateRange = (
    start?: LocalDateInput,
    end?: LocalDateInput,
    returnAsArray: boolean = false,
): string | [string, string] => {
    const startStr: string = formatLocalDate(start)
    if (!startStr)
        return returnAsArray ? ['', ''] : ''

    const endStr: string = formatLocalDate(end ?? start)

    if (returnAsArray) {
        return [startStr, endStr]
    }

    return startStr === endStr ? startStr : `${startStr} – ${endStr}`
}

/**
 * Parseert een locale datum-string (bv. "25-12-2024" of "12/25/2024")
 * terug naar een Date, op basis van het locale-patroon.
 */
export const parseLocalDate = (value: string): Date | null => {
    if (!value) return null

    const fmt: string = getLocalDateFormat()        // bijv. "dd-MM-yyyy"
    const sep: string = inferDateSeparator(fmt)     // bijv. "-"

    const valueParts: string[] = value.split(sep)
    const patternParts: string[] = fmt.split(sep)

    if (valueParts.length !== 3 || patternParts.length !== 3) {
        return null
    }

    let dayStr: string | undefined
    let monthStr: string | undefined
    let yearStr: string | undefined

    for (let i = 0; i < 3; i++) {
        const pat: string = patternParts[i]
        const v: string = valueParts[i]

        if (pat.includes('d')) {
            dayStr = v
        } else if (pat.includes('M')) {
            monthStr = v
        } else if (pat.includes('y')) {
            yearStr = v
        }
    }

    const day: number = dayStr ? parseInt(dayStr, 10) : NaN
    const month: number = monthStr ? parseInt(monthStr, 10) - 1 : NaN
    const year: number = yearStr ? parseInt(yearStr, 10) : NaN

    const date = new Date(year, month, day)
    return isNaN(date.getTime()) ? null : date
}

/**
 * Date → "yyyy-MM-dd" (ISO-date zonder tijd)
 */
export const toIsoDateString = (date: Date): string | null => {
    if (!date || isNaN(date.getTime())) return null
    const year: number = date.getFullYear()
    const month: string = pad2(date.getMonth() + 1)
    const day: string = pad2(date.getDate())
    return `${year}-${month}-${day}`
}

/**
 * Placeholder voor inputs, bv. "DD-MM-YYYY" of "MM/DD/YYYY"
 */
export const getDateInputPlaceholder = (): string => {
    const fmt: string = getLocalDateFormat()
    return fmt.replace('dd', 'DD').replace('MM', 'MM').replace('yyyy', 'YYYY')
}

export const startOfDay = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d
}

export const isSameDay = (a: Date, b: Date) => {
    return startOfDay(a).getTime() === startOfDay(b).getTime()
}

/** Formats a number of minutes as a human-readable string, e.g. 90 → "1h 30m" */
export const formatMinutes = (mins: number): string => {
    if (mins < 60) return `${mins}m`
    const h: number = Math.floor(mins / 60)
    const m: number = mins % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function formatTime(timeHHMM: string): string {
    const [h, m] = timeHHMM.split(':').map(Number)
    const period: "PM" | "AM" = h >= 12 ? 'PM' : 'AM'
    const hour: number = h % 12 || 12
    const minute: string = pad2(m);
    return `${hour}:${minute} ${period}`
}

export function timeToDate(timeHHMM: string): Date {
    const [h, m] = timeHHMM.split(':').map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
}

export function dateToHHMM(date: Date): string {
    const h: string = pad2(date.getHours());
    const m: string = pad2(date.getMinutes());
    return `${h}:${m}`
}
