function to_currency(value) {
    let formatter = Intl.NumberFormat("fr-FR", {
        style: "currency",
        minimumFractionDigits: 2,
        currency: "EUR",
    });
    return isNaN(value) ? "" : formatter.format(value)
}

function to_percentage(value) {
    let formatter = Intl.NumberFormat("fr-FR", {
        style: "percent",
        minimumFractionDigits: 2,
    });
    return isNaN(value) ? "" : formatter.format(value)
}

export { to_currency, to_percentage };