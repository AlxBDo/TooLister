interface IStyleOptions {
    bgColor: string;
    color?: string;
    icon?: string;
}

const style = (bgColor: string, color: string = 'white') =>
    `background-color: ${bgColor}; color: ${color}; padding: 2px; margin-right: 5px; font-weight: bold; font-size: 12px`

const styles = {
    log: style('skyblue', 'black'),
    error: style('red'),
    warn: style('orange'),
    info: style('blue'),
    debug: (message: any) => console.debug(message),
    trace: (message: any) => console.trace(message),
    group: (label: any) => console.group(label),
    groupEnd: () => console.groupEnd(),
    time: (label: any) => console.time(label),
    timeEnd: (label: any) => console.timeEnd(label),
    assert: (condition: any, message?: any) => console.assert(condition, message)
}

const methods = {
    log: (message: string, args?: any[], styleOptions?: IStyleOptions) => {
        const logStyle = styleOptions ? style(styleOptions.bgColor, styleOptions.color) : styles.log
        const icon = styleOptions?.icon ?? '👉🏼'

        const separator = Array.from(message).reduce((acc: string, curr: string) => `-${acc}`, '-------')

        message = `${separator}  
- ${icon} ${message} - 
${separator}  
`

        console.log(
            '%c%s',
            logStyle,
            message,
            ...(args ?? [])
        )
    },
    error: (message: any) => console.error(message),
    warn: (message: any) => console.warn(message),
    info: (message: any) => console.info(message),
    debug: (message: any) => console.debug(message),
    table: (data: any, options?: any) => console.table(data, options),
    trace: (message: any) => console.trace(message),
    group: (label: any) => console.group(label),
    groupEnd: () => console.groupEnd(),
    time: (label: any) => console.time(label),
    timeEnd: (label: any) => console.timeEnd(label),
    assert: (condition: any, message?: any) => console.assert(condition, message)
}

export default function useConsole() {
    return methods;
}