exports.Color = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
}

exports.success = (message, method) => {
    if(method) {
        if(method === 'get' ||
        method === 'post' ||
        method === 'put' ||
        method === 'delete'
        ) console.log(this.Color.fg.green+"OK\t"+this.Color.fg.cyan+method.toUpperCase()+"\t"+this.Color.reset+message)
    } else console.log(this.Color.fg.green+"OK\t"+this.Color.reset+message)
}

exports.info = (message, method) => {
    if(method) {
        if(method === 'get' ||
        method === 'post' ||
        method === 'put' ||
        method === 'delete') console.log(this.Color.fg.cyan+"INFO\t"+this.Color.fg.cyan+method.toUpperCase()+"\t"+this.Color.reset+message)
    } else console.log(this.Color.fg.cyan+"INFO\t"+this.Color.reset+message)
}

exports.warn = (message, method) => {
    if(method) {
        if(method === 'get' ||
        method === 'post' ||
        method === 'put' ||
        method === 'delete') console.log(this.Color.fg.yellow+"WARN\t"+this.Color.fg.cyan+method.toUpperCase()+"\t"+this.Color.reset+message)
    } else console.log(this.Color.fg.yellow+"WARN\t"+this.Color.reset+message)
}

exports.fail = (message, method) => {
    if(method) {
        if(method  === 'get' ||
        method === 'post' ||
        method === 'put' ||
        method === 'delete') console.log(this.Color.fg.red+"FAIL\t"+this.Color.fg.cyan+method.toUpperCase()+"\t"+this.Color.reset+message)
    } else console.log(this.Color.fg.red+"FAIL\t"+this.Color.reset+message)
}