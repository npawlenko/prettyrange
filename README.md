# prettyrange
Easy to develop custom HTML range input

## Getting started
1. Attach a style sheet to your HTML page
    ```html
    <link rel="stylesheet" href="prettyrange.css">
    ```

2. Embed prettyrange's Javascript file.
    ```html
    <script src="prettyrange.js"></script>
    ```

3. Initialize your input
    ```html
    <script>
            const element = document.getElementById("myinput");
            const range = new PrettyRange(element);
    </script>
    ```
<br>
From now on you only have to adjust the appearance :)