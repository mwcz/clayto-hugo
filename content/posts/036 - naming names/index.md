---
Title: "Naming Names - Anonymity is Dead"
Date: 2015-01-01
Tags:
 -  programming
 -  javascript
 -  web
thumbnail: ./naming.gif
description: "Naming things is hard enough, and JavaScript doesn't make it any easier.  Should anonymous functions be considered harmful?"
Mwc: 36
---

Published: true

<blockquote>
    <p>
    There are only two hard problems in computer science: cache invalidation,
    naming things, and off-by-one errors.
    </p>
    <footer>
        <cite>
            Phil Karlton, but I can't find a name for the original source...
        </cite>
    </footer>
</blockquote>

Contriving names for things is so commonplace for computer programmers that we
may be thinking up names more often than any other profession.  Every day,
usually dozens of times, I find myself trying to imagine the perfect name for a
function or variable or module.  Then I remember that there's a term for the
*process* of formulating the perfect name for a thing.

I just can't remember what it's called...

Then I find myself sitting there, trying to think of the perfect name for the
process of creating the perfect name for a thing when I should be *actually*
dreaming up the perfect name for that thing.

<figure>
    <img src="naming.gif" alt="naming is hard" />
    <figcaption>Naming is hard.</figcaption>
</figure>

Can you relate?  The word, by the way, is...

<dl>
    <dt>onomastics - n.</dt>
    <dd>1. The study of the origins and forms of proper names.</dd>
    <dd>2. The study of the origins and forms of terms used in specialized fields.</dd>
    <dd>3. The system that underlies the formation and use of proper names or terms used in specialized fields.</dd>
</dl>

Short, but informative names are important in all programming languages, though
JavaScript's anonymous functions do pose a unique temptation.

For those unfamiliar, an anonymous function is, unsurprisingly, a function
declaration without a name.

A named function:

    function count_sheep() { /* code */ }

An anonymous function:

    function () { /* code */ }

One has a name, one doesn't.  Other than two low-level (and usually
inconsequental) behavioral differences, they're drop-in replacements for one
another.  The primary difference is that one has a name, so you can tell what
it does.  So, pick the one that has the name!  Easy choice, right?

I wish!  Choosing a name is a very real mental tax.  Choosing a *good* name
is time-consuming and often impossible.  That is why, I feel, anonymous
functions are used so commonly in JavaScript programs.

Anonymous functions **free the programmer from the responsibility of choosing a
name**.

As a practical example, here's some code from the [jQuery DataTables example
page][datatables], with three nested anonymous functions.

    :::javascript
    $(document).ready(function() {
        $('#example').dataTable( {
            "initComplete": function () {
                var api = this.api();
                api.$('td').click( function () {
                    api.search( this.innerHTML ).draw();
                } );
            }
        } );
    } );

There are much (**much**!) more deeply nested examples of the Pyramid of Doom,
but this one serves well as an example.  If it had been implemented with short,
named functions, it would be something like the following.

    $(document).ready( create_datatable );

    function create_datatable() {
        $('#example').dataTable( {
            "initComplete": init_datatable_api
        } );
    }

    function init_datatable_api() {
        var api = this.api();
        api.$('td').click( filter_datatable );
    }

    function filter_datatable() {
        api.search( this.innerHTML ).draw();
    }

This updated code isn't perfect, to be sure, but the first line really
exemplifies this benefits of this approach, to me.  `$(document).ready(
create_datatable )` reads so clearly.

The joy of small functions is a discovery I'm making and re-making every day.
I've been *craving* a programming style like this for years, but it wasn't
until I read [Functional JavaScript][funcjs] (and all the FP talk on
[r/programming][rprog]) that my eyes opened.

Very, very small, reusable functions are a joy to work with.  Give it a try, if
you haven't yet!

<script>
$('pre code').each(add_prism_js);
function add_prism_js(i, el) {
    $(el).addClass('language-javascript');
}
</script>

[nfe]: http://kangax.github.io/nfe/
[funcjs]: http://amzn.com/1449360726
[datatables]: http://datatables.net/examples/api/api_in_init.html
[soq]: http://stackoverflow.com/questions/1960517/anonymous-functions-considered-harmful
[badindent]: http://teaching.idallen.org/cst8165/06f/notes/deep_indentation.txt
[rprog]: http://www.reddit.com/r/programming
