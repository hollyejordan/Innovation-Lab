// Code to run server: node index.js
// Code to stop server running: CTRL + C

//CONFIGURATION CODE - DON'T CHANGE
const mysql = require('mysql2');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();


app.use(cors())
app.use(express.json());

const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

// Im rly lazy so i just hard coded
var config =
{

};

const conn = new mysql.createConnection(config);

conn.connect(function (err)
{
    if (err)
    {
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    } else
    {
        console.log("Connection established");
    }
});

// ✅ LOGIN ROUTE
app.post("/Login", (req, res) =>
{
    const { username, password } = req.body;
    console.log("Login attempt:", username);

    if (!username || !password)
    {
        return res.status(400).json({ success: false, message: "Missing credentials" });
    }

    conn.query('SELECT * FROM users WHERE username = ?', [username], (err, results) =>
    {
        if (err)
        {
            console.error("DB error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (results.length === 0)
        {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = results[0];

        if (user.pass_word === password)
        {
            res.json({ success: true, user_ID: user.user_ID, username: user.username });
        } else
        {
            res.status(401).json({ success: false, message: "Incorrect password" });
        }
    });
});

// GET EVERYTHING REQUESTS

//Get everything from the users tables
app.get("/GetEverythingUsers", (request, response) =>
{
    console.log("A request to Get Everything has been made");
    conn.query('SELECT * FROM users', function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Get everything from the languages tables
app.get("/GetEverythingLanguages", (request, response) =>
{
    console.log("A request to get all languages has been made");
    conn.query('SELECT * FROM languages', function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Get everything from the fonts table 
app.get("/GetEverythingFonts", (request, response) =>
{
    console.log("A request to get all fonts has been made");
    conn.query('SELECT * FROM fonts', function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Get everything from the preferences table 
app.get("/GetEverythingPreferences", (request, response) =>
{
    console.log("A request to get all preferences has been made");
    conn.query('SELECT * FROM preferences', function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//GET REQUESTS BASED ON USERNAME

//Get single user
app.get("/GetUser", (request, response) =>
{
    console.log("A request to get users has been made");
    conn.query('SELECT * FROM users WHERE username = (?)', [request.query.username], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

// Get preferences for a single user using their username
app.get("/GetUserPreferences", (req, res) =>
{
    const username = req.query.username;

    conn.query(
        `SELECT p.* FROM preferences p
       JOIN users u ON u.user_ID = p.user_ID
       WHERE u.username = ?`,
        [username],
        (err, results) =>
        {
            if (err)
            {
                console.error("Error fetching preferences:", err);
                return res.status(500).send("Server error");
            }
            res.json(results);
        }
    );
});


//Get preferences related to single user
app.get("/GetPreferences", (request, response) =>
{
    console.log("A request to Get Preferences has been made");
    conn.query('SELECT * FROM preferences WHERE user_ID = (?)', [request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//INSERT STATEMENTS

//Insert a user into the user table
app.post("/PostUsername", (request, response) =>
{
    console.log("A request to insert a user was made");
    console.log(request.body.username)
    console.log(request.body)
    console.log(request)

    conn.query('INSERT INTO users (username, pass_word) VALUES (?,?);', [request.body.username, request.body.pass_word],
        function (err, results, fields)
        {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
            response.send("yes");
        });
});

//Insert a users preferences into the preference table - requires the user to exist in the user table
app.post("/PostPreferences", (request, response) =>
{
    console.log("A request to insert preferences was made");
    console.log(request.body)
    console.log(request)

    conn.query('INSERT INTO preferences (user_ID, language_ID, font_ID, font_size, dark_mode, single_speaker) VALUES (?,?,?,?,?,?);',
        [request.body.user_ID, request.body.language_ID, request.body.font_ID, request.body.font_size, request.body.dark_mode, request.body.single_speaker],
        function (err, results, fields)
        {
            if (err) throw err;
            else console.log('Inserted ' + results.affectedRows + ' row(s).');
            response.send("yes");
        });
});

//UPDATE STATEMENTS

//Update password 
app.get("/UpdatePassword", (request, response) =>
{
    console.log("A request to update password has been made");
    conn.query('UPDATE users SET pass_word = (?) WHERE user_ID = (?)',
        [request.query.pass_word, request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Update language
app.get("/UpdateLanguage", (request, response) =>
{
    console.log("A request to update languages has been made");
    conn.query('UPDATE preferences SET language_ID = (?) WHERE user_ID = (?)',
        [request.query.language_ID, request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Update font
app.get("/UpdateFont", (request, response) =>
{
    console.log("A request to update font has been made");
    conn.query('UPDATE preferences SET font_ID = (?) WHERE user_ID = (?)',
        [request.query.font_ID, request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Update font size
app.get("/UpdateFontSize", (request, response) =>
{
    console.log("A request to update font size has been made");
    conn.query('UPDATE preferences SET font_size = (?) WHERE user_ID = (?)',
        [request.query.font_size, request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Update dark mode
app.get("/UpdateDarkMode", (request, response) =>
{
    console.log("A request to update dark mode has been made");
    conn.query('UPDATE preferences SET dark_mode = (?) WHERE user_ID = (?)',
        [request.query.dark_mode, request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//Update single speaker 
app.get("/UpdateSingleSpeaker", (request, response) =>
{
    console.log("A request to update single speaker has been made");
    conn.query('UPDATE preferences SET single_speaker = (?) WHERE user_ID = (?)',
        [request.query.single_speaker, request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log(results);
        response.send(results);
    });
});

//DELETE REQUEST

//Delete user from user table
app.delete("/DeleteUserData", (request, response) =>
{
    console.log("A request has been made to delete data");
    conn.query('DELETE from users WHERE user_ID = (?)', [request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log("Deleted");
        response.send("Deleted");
    });
});

//Delete user from preferences
app.delete("/DeleteUserPreferences", (request, response) =>
{
    console.log("A request has been made to delete preferences");
    conn.query('DELETE from preferences WHERE user_ID = (?)', [request.query.user_ID], function (error, results, fields)
    {
        if (error) throw error;
        else console.log("Deleted");
        response.send("Deleted");
    });
});
