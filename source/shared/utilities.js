function formatLabel(label, args) {
    if (Array.isArray(args)) {
        let formatted = args.reduce((agg, arg, index) => (
            agg.replace(`{${index}}`, arg)
        ), label);
        
        return formatted;
    }
    else if (typeof args === 'string') {
        return label.replace('{0}', args);
    }

    return label;
}

function attachPathToLabel(label, path) {
    return formatLabel(`${label} caught requesting {0}`, path);
}

export { formatLabel, attachPathToLabel };