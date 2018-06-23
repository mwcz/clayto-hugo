---
Title: "Toy javascript unit tester"
Date: 2012-01-30
Tags:
 -  javascript
 -  testing
 -  web
Mwc: 18
---

Last week I was sitting in a meeting, thinking about unit testing frameworks (not the subject of the meeting), and had a minor epiphany.  In the back of my mind, there has always been a bit of uncertainty as to how unit testing frameworks work.  Deep in my brain I knew there was something I didn't understand, but I wasn't quite sure what.  I never gave it any conscious thought.

As a developer, I'd use a framework, write a bunch of `testBlahFoo` functions, and the framework would magically run them.  

Then I realized... "Oh, it's just introspection."

    :::javascript
    // Create an object with three properties, all functions
    var myfuncs = {
        func1: function() { console.log("func it up"); },
        func2: function() { console.log("func's old brother"); },
        func3: function() { console.log("bring back da func"); }
    };

    // Run all functions attached to myfuncs
    for( func in myfuncs ) {
        myfuncs[ func ]();
    }

    // Outputs:
    // 
    // func it up
    // func's old brother
    // bring back da func

So simple.  Later, I wrote a very basic unit testing framework, purely as an educational excercise.

The guts are almost simple as the example above.

    :::javascript
    var JTestSuite = function () {

        var version = 0.1,
            jt,

        init = function( callback ) {
            jt = JTests();
            jt.init( callback );
        },

        run = function() {
            var fn,
                prop;

            // Run all functions that begin with "test"
            for( prop in this ) {
                if( typeof this[prop] === "function" ) {
                    if( prop.slice(0,4) === "test" ) {
                        console.log( this[prop](jt) );
                    }
                }
            }
        };

        if( !(this instanceof JTestSuite) ) return new JTestSuite();

        return {
            init : init,
            run  : run
        };

    };

In the `run` function's loop, I first check that each property is a function before attemping to run it.  This avoids a `called_non_callable TypeError`.  I then check that the name of the property begins with the string "test".  When dynamically calling functions, it's usually a good idea to call `obj.hasOwnProperty(propname)` to ensure the property wasn't inherited from some unknown source (especially if the property you wanted to reference may have been `delete`d, but a property with the same name is now surfacing from a parent object), but in this case I'd like to leave open the possibility for inherited Test Suites.

The `JTests` object created in the `init` function is a separate object that contains a bunch of assertions.  It looks something like this:

    :::javascript
    var JTests = function () {

        var version = 0.1,
            result_callback,

        init = function( callback ) {
            result_callback = callback;
        }

        assertTrue = function( a ) {
            var result = a === false;
            result_callback( {                                                                                                                                                                         
                name   : "assertTrue",
                args   : [ a ],
                result : result
            } );
        };
        
        return {
            assertTrue : assertTrue
        };

    };

...except with many more assertions. :)

Both `JTestSuite` and `JTests` use the [revealing module pattern](http://stackoverflow.com/a/5647397/215148). 

I have a lot of ideas for improvement, like [DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself)ing up the assertions, so the `{name,args,result}` object doesn't have to be defined in each assertion.  But [many others](http://en.wikipedia.org/wiki/List_of_unit_testing_frameworks#JavaScript) have already done a great job, and I don't want to reinvent too many wheels.

    :::javascript
    // Define a custom handler for the result
    function test_callback( result ) {
        console.log(result);
    }

    // Create a new JTestSuite object and initialize it with the callback
    var TestSuite = new JTestSuite();
    TestSuite.init( test_callback );

    // Create some tests
    TestSuite.testMath = function(jt) {
        jt.assertEquals( 2 + 2, 4 );
    };

    TestSuite.testFalsy = function(jt) {
        // [], "", and "0" all == false in javascript
        jt.assertFalsy( [] );
        jt.assertFalsy( "" );
        jt.assertFalsy( "0" );
    };

    // Run all the tests
    TestSuite.run();

The callback allows a user to determine how the results from the unit test should be processed or displayed.  Results could be printed to console.log, displayed on a page by adding them to the DOM, sent to a Web service with AJAX, or any arbitrary service with Web Sockets.

After writing this toy framework, and explaining it to a colleague, I was told that the Rails unit tester uses almost the exact same approach.  I'd wager a few bucks that JUnit uses the Reflection API's `Class.getMethods()` to find and run all the methods added to a TestCase class.  Only a few bucks, though.
