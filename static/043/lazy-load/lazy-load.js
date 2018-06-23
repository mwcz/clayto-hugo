Polymer({

    is: 'lazy-load',

    attached: function lazyLoadAttached() {
        this.lazyLoad();
    },

    lazyLoad: function lazyLoad() {
        var els = this.querySelectorAll(LazyComponents.names);
        for (var i = 0; i < els.length; ++i) {
            var name = els[i].nodeName.toLowerCase();
            this.importHref(LazyComponents.paths[name]);
        }
    },

});
