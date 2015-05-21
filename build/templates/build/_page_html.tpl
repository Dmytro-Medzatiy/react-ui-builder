<!DOCTYPE html>
<html style="width: 100%; height: 100%;" xmlns="http://www.w3.org/1999/html">
    <head lang="en">
        <meta charset="UTF-8">
        <title>PageForDesk</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="x-ua-compatible" content="IE=10">

        <link rel="stylesheet" href="assets/styles/uikit.min.css"/>
        <link rel="stylesheet" href="assets/styles/tooltip.min.css"/>
        <link rel="stylesheet" href="assets/styles/umyproto.deskpage.css"/>
        <script src="assets/js/jquery-2.1.3.min.js"></script>
        <script src="assets/js/uikit.min.js"></script>
        <script src="assets/js/tooltip.min.js"></script>

        <script>

            window.endpoint = {
                Window: window,
                Page: null,
                onComponentDidMount: null,
                onComponentWillUnmount: null,
                onComponentDidUpdate: null,
                onComponentWillUpdate: null,
                replaceState: function(state){
                    if(this.Page){
                        this.Page.setState(state);
                    }
                }
            };
            window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
                inject: function(reactRuntime){
                    window.endpoint.runtime = reactRuntime;
                    //console.log(window.endpoint.runtime);
                }
            };

        </script>
    </head>
    <body>
        <div id="umy-pageBody"></div>
        <script src="bundle.js"></script>
    </body>
</html>