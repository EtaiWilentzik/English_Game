set global local_infile=true;
CREATE SCHEMA English_Game;

USE English_Game;

CREATE TABLE Word (
  `Word` VARCHAR(100) NOT NULL PRIMARY KEY,
  `Length` INT NOT NULL,
  `UseRate` INT NOT NULL);

CREATE TABLE User (
  `Username` VARCHAR(30) CHARACTER SET utf8 COLLATE utf8_bin  NOT NULL PRIMARY KEY,
  `Password` VARCHAR(30) NOT NULL,
  `Hakbatza` VARCHAR(1) NOT NULL,
  `Class` INT NOT NULL);

CREATE TABLE UserLog (
  `Username` VARCHAR(30)  CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `TypeOfGame` VARCHAR(30) NOT NULL,
  `Result` VARCHAR(4) NOT NULL,
  `Date` DATETIME  NOT NULL,
  `Accuracy` INT NOT NULL);

CREATE TABLE Context (
  `Index` BIGINT NOT NULL PRIMARY KEY,
  `Type` VARCHAR(1) NOT NULL,
  `Example` TEXT(600) NULL,
  `Definition` TEXT(600) NOT NULL,
  `Size` INT NOT NULL);

CREATE TABLE UsedIn (
   `Word` VARCHAR(100) NOT NULL,
   `Index` BIGINT NOT NULL
);

LOAD DATA LOCAL INFILE 'C:/Users/etaiw/PycharmProjects/English_Game/DB/random_logs.csv'
INTO TABLE UserLog
FIELDS TERMINATED BY ','
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'C:/Users/etaiw/PycharmProjects/English_Game/DB/used in.csv'
INTO TABLE UsedIn
FIELDS TERMINATED BY ','
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'C:/Users/etaiw/PycharmProjects/English_Game/DB/words.csv'
INTO TABLE Word
FIELDS TERMINATED BY ','
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'C:/Users/etaiw/PycharmProjects/English_Game/DB/random_users.csv'
INTO TABLE User
FIELDS TERMINATED BY ','
IGNORE 1 LINES;

LOAD DATA LOCAL INFILE 'C:/Users/etaiw/PycharmProjects/English_Game/DB/context.csv'
INTO TABLE Context
FIELDS TERMINATED BY '>'
IGNORE 1 LINES;

CREATE INDEX UserIndex ON User (Username);
CREATE INDEX userLogIndex ON userlog (username, `Date`);
CREATE INDEX Word_Index ON Word (useRate ASC);
CREATE INDEX ContextIndex ON context (example(255) DESC);
CREATE INDEX ContextIndex2 ON context (Size Desc);
CREATE INDEX usedinIndex ON usedin (word, `index`);

ALTER TABLE UsedIn
ADD FOREIGN KEY (`Word`) REFERENCES Word(`word`);

ALTER TABLE UserLog
ADD FOREIGN KEY (`Username`) REFERENCES User(`Username`);

ALTER TABLE UsedIn
ADD FOREIGN KEY (`index`) REFERENCES context(`index`);
