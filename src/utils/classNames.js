export const bindClassNames = (styles) => (...classNames) =>
    classNames
        .flatMap((className) => String(className).split(" "))
        .filter(Boolean)
        .map((className) => styles[className] || className)
        .join(" ");
