export const sentenceCase = (str) => {
    return str
        .replace(/[_-]/g, ' ')               // replace underscores/dashes with spaces
        .toLowerCase()                       // lowercase all
        .replace(/^\w/, c => c.toUpperCase()); // capitalize first letter
};