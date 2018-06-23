Polymer({
    is: 'ws-alert',
    properties: {
        level: {
            type: String,
            value: 'info',
        },
    },
    levelIcons: {
        info: "ℹ",
        warn: "⚠",
        error: "💣",
    },
    getIcon: function (level) {
        return this.levelIcons[level];
    },
});
