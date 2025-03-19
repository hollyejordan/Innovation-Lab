drop database if exists TechGlasses;
create database TechGlasses;

use TechGlasses;


-- USERS TABLE
create table users (
user_ID int not null auto_increment,
username varchar(50) not null,
pass_word varchar(50) not null,
primary key (user_ID)
);

insert into users (username, pass_word) values ('Madison', 'hello');
insert into users (username, pass_word) values ('Waddles', 'quack');

select * from users;

 
create table languages (
language_ID int not null auto_increment,
language_name varchar(50) not null, 
primary key (language_ID)
);

insert into languages (language_name) values ('English');
insert into languages (language_name) values ('Spanish');
Select * from languages;


create table fonts (
font_ID int not null auto_increment, 
font_name varchar(50) not null, 
primary key (font_ID)
);

insert into fonts (font_name) values ('Comic Sans');


create table preferences (
preference_ID int not null auto_increment,

-- foriegn keys
user_ID int not null,
language_ID int not null,
font_ID int not null,

-- other values
font_size int not null,
dark_mode bool not null,
single_speaker bool not null,

primary key (preference_ID),
foreign key (user_ID) references users(user_ID),
foreign key (language_ID) references languages(language_ID),
foreign key (font_ID) references fonts(font_ID)
);

Insert into preferences (user_ID, language_ID, font_ID, font_size, dark_mode, single_speaker) values (1,1,1,10,TRUE,FALSE);

Select * from preferences;
