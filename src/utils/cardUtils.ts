import dayjs from "dayjs"

function formatCardHolderName(name: string): string {
    const upperNameArray: string[] = name.toUpperCase().split(' ')

    return upperNameArray
        .filter((name, i) => i === 0 || i === upperNameArray.length - 1 || name.length >= 3)
        .map((name, i, array) => i !== 0 && i !== array.length - 1 ? name[0] : name)
        .join(' ')
} 

function convertTimestampToDate(array: any[]): any[] {
    return array.map(object => {
        return {
            ...object,
            timestamp: dayjs(object.timestamp).format('DD/MM/YYYY')
        }
    })
}

export { formatCardHolderName, convertTimestampToDate }