/* table作成を行うファイル */

/* データベースがなければ作成する */
CREATE DATABASE IF NOT EXISTS tuna_db;

/* 学校情報 */
CREATE TABLE IF NOT EXISTS tuna_db.school_info_tb(
    school_id          INT(5)       PRIMARY KEY AUTO_INCREMENT,
    school_name        VARCHAR(256) NOT NULL,
    school_code        VARCHAR(12)  NOT NULL UNIQUE,
    school_address     VARCHAR(161) NOT NULL,              
    school_mailaddress VARCHAR(32)  NOT NULL UNIQUE  
);

/* ユーザ情報 */
CREATE TABLE IF NOT EXISTS tuna_db.user_tb(
    user_id            INT(10)      PRIMARY KEY AUTO_INCREMENT,
    school_id          INT(5)       NOT NULL,
    show_user_id       VARCHAR(20)  NOT NULL UNIQUE,
    password           CHAR(64)     NOT NULL,
    mailaddress        VARCHAR(254) NOT NULL UNIQUE,
    name               VARCHAR(50)  NOT NULL,
    accounts_stop_flag boolean      NOT NULL DEFAULT 0,
    CHECK (accounts_stop_flag IN(0, 1)),

    FOREIGN KEY (school_id)
    REFERENCES tuna_db.school_info_tb(school_id)                       
);

/* ヘルプカテゴリー */
CREATE TABLE IF NOT EXISTS tuna_db.help_category_tb(
    help_category_id   INT(2)       PRIMARY KEY AUTO_INCREMENT,
    help_category_name VARCHAR(20)  NOT NULL
);

/* グループ情報 */
CREATE TABLE IF NOT EXISTS tuna_db.group_tb(
    group_id           INT(7)       PRIMARY KEY AUTO_INCREMENT,
    group_name         VARCHAR(50)  NOT NULL,
    school_id          INT(5)       NOT NULL,
    upper_group        INT(7),

    FOREIGN KEY (school_id)
    REFERENCES tuna_db.school_info_tb (school_id),

    FOREIGN KEY (upper_group)
    REFERENCES tuna_db.group_tb (group_id)
);

/* 教師情報 */
CREATE TABLE IF NOT EXISTS tuna_db.teacher_tb(
    user_id            INT(10)      PRIMARY KEY,
    authority_flag     boolean      NOT NULL DEFAULT 0,
    CHECK (authority_flag IN(0, 1)),

    FOREIGN KEY (user_id)
    REFERENCES tuna_db.user_tb(user_id)                         
);

/* 生徒情報 */
CREATE TABLE IF NOT EXISTS tuna_db.student_tb(
    user_id            INT(10)      NOT NULL PRIMARY KEY,
    grade              INT(1)       NOT NULL,
    enter_date         DATE         NOT NULL,               
    gradude_date       DATE,

    FOREIGN KEY (user_id)
    REFERENCES tuna_db.user_tb(user_id)
);

/* グループメンバー情報 */
CREATE TABLE IF NOT EXISTS tuna_db.group_member_tb(
    group_id          INT(7)  NOT NULL,
    user_id           INT(10) NOT NULL,

    PRIMARY KEY (group_id, user_id),

    FOREIGN KEY (group_id)
    REFERENCES tuna_db.group_tb (group_id),

    FOREIGN KEY (user_id)
    REFERENCES tuna_db.user_tb (user_id)
);

/* ヘルプコンテンツ */
CREATE TABLE IF NOT EXISTS tuna_db.help_contents_tb(
    help_contents_id   INT(3)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
    help_category_id   INT(2)       NOT NULL,
    question           VARCHAR(255) NOT NULL,
    answer             TEXT,

    FOREIGN KEY (help_category_id) 
    REFERENCES tuna_db.help_category_tb (help_category_id)
);