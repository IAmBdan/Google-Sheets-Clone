

export function numberToColumnLabel(number: number): string {
    let label = '';
    while (number > 0) {
        let remainder = (number - 1) % 26;
        label = String.fromCharCode(remainder + 'A'.charCodeAt(0)) + label;
        number = Math.floor((number - 1) / 26);
    }
    return label;
}