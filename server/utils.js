const removeMORE = str => str.replace('[[MORE]]', '');

const pipeEmit = (events, from, to) => {
    events.forEach((event) => {
        from.on(event, function() {
            to.emit.apply(to, [event].concat(Array.slice.call(arguments, 0)));
        })
    })
}

module.exports = {
    removeMORE,
    pipeEmit
}