
DROP DATABASE cplayground_db;

CREATE DATABASE cplayground_db;

USE cplayground_db;

CREATE TABLE users(
     u_id INT NOT NULL AUTO_INCREMENT,
     u_name VARCHAR(255),
     u_password VARCHAR(255),
     u_email VARCHAR(255),

    PRIMARY KEY (u_id)
);


CREATE TABLE buttons(
    b_id INT NOT NULL AUTO_INCREMENT,
    b_name VARCHAR(255),
    button text,
    b_department VARCHAR(255),

    PRIMARY KEY (b_id)
);

CREATE TABLE flashcards(
    f_id INT NOT NULL AUTO_INCREMENT,
    f_name VARCHAR(255),
    flashcard text,
    answer text,
    f_user VARCHAR(255),

    PRIMARY KEY (f_id)
);
 