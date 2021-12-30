CREATE TABLE `UserTable` ( 
    `_id` INT NOT NULL AUTO_INCREMENT , 
    `username` VARCHAR(256) NOT NULL , 
    `_hash` VARCHAR(256) NOT NULL , 
    `_salt` VARCHAR(256) NOT NULL , 
    PRIMARY KEY (`_id`)
);