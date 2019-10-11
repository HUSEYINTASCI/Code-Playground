DROP DATABASE cplayground_db;

CREATE DATABASE cplayground_db;

USE cplayground_db;

CREATE TABLE user(
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

CREATE TABLE playground (
    p_id INT NOT NULL AUTO_INCREMENT,
    html text,
    css text,
    js text,
    u_id INT NOT NULL,
    p_name VARCHAR(255),

    FOREIGN KEY (u_id) REFERENCES user(u_id),
    PRIMARY KEY (p_id)
);


CREATE TABLE flashcards(
    f_id INT NOT NULL AUTO_INCREMENT,
    f_name VARCHAR(255),
    flashcard text,
    answer text,
    f_user VARCHAR(255),

    PRIMARY KEY (f_id)
);