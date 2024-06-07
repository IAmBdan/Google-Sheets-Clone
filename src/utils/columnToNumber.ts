

export function columnToNumber(label: string): number {
    label = label.toUpperCase();
    let columnNumber = 0;
    for (let i = 0; i < label.length; i++) {
        columnNumber *= 26;
        columnNumber += label.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return columnNumber;
}