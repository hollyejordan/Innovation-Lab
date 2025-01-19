const char login[] PROGMEM = R"=====(
<html>

<head>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LOGIN</title>
    <style>

      html {
        height: 100%;
        width: 100%;
      }

      html { 
        font-family: Helvetica; 
        background-color: #294a5e;
        display: inline-block; 
        margin: 0px auto; 
        text-align: center;
      }

      h1 {
        font-size: 64px;
      }

      body {
        color:white;
      }

      button { 
        background-color: #4caeac; 
        border: none; 
        color: white; 
        padding: 16px 40px;
        border-radius: 10px;
        text-decoration: none; 
        font-size: 30px; 
        margin: 6px; 
        cursor: pointer;}

      a {
        text-decoration: none;
        color: white;
      } 

      form {
      margin: 10px;
      text-align: left;
      font-size: 20px;
      }

      .textBox {
        padding: 5px;
        margin: 10px;
      }

      .submit {
        margin: 20px;
        border: black 1px;
        border-radius: 10%;
        padding: 5px;
        font-size: 24px;
      }
</style>
</head>

<body>
    <div class="container">
        <h1>Login</h1>
        <form action='/login' method='POST'>
          Username <input class="textBox" type='text' name='USERNAME' placeholder='Username'><br>
          Password <input class="textBox" type='password' name='PASSWORD' placeholder='Password'><br>
          <input class="submit" type='submit' name='SUBMIT' value='Submit'></form>
          <br></form>
    </div>
</body>

</html>
)=====";
