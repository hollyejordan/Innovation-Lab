const char homepage[] PROGMEM = R"=====(
<html>

<head>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>homepage</title>

    <style>
    html{
        background-color: #294a5e;
    }

    h1{
        color: white;
        font-size: 50;
    }

    .flexbox{
      display: flex;
      justify-content: center;
      align-items: center;
    }


    button {
    background-color: #4a7ba3;
    border: none;
    color: white;
    padding: 16px 40px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 30px;
    cursor: pointer;}

    a {
      text-decoration: none;
      color: white;
    } 

    /*Used to create circles*/
    .dot {
      height: 300px;
      width: 300px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
    }

    </style>
</head>

<body>
    <div class="container">
        <h1 class="flexbox">Smart Glasses</h1>

        <p>
            <button class="flexbox"><a href="/login">Login</a></button>
        </p>

    </div>
</body>

</html>
)=====";
