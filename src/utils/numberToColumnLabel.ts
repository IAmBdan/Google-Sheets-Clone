

// Convert a number to a column label ie: 1=A, 2=B, 27=AA, 28=AB, etc
export function numberToColumnLabel(number: number): string {
    let label = '';
    while (number > 0) {
        const remainder = (number - 1) % 26;
        label = String.fromCharCode(remainder + 'A'.charCodeAt(0)) + label;
        number = Math.floor((number - 1) / 26);
    }
    return label;
}