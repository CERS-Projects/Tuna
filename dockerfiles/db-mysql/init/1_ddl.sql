/* table作成を行うファイル */

/* 文字コード（接続）をutf8mb4に */
SET NAMES utf8mb4;

/* データベースがなければ作成する */
CREATE DATABASE IF NOT EXISTS tuna_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_bin;

/* 学校情報 */
CREATE TABLE IF NOT EXISTS tuna_db.school_info_tb(
    school_id          INT(5)       PRIMARY KEY AUTO_INCREMENT,
    school_name        VARCHAR(256) NOT NULL,
    school_code        CHAR(13)     NOT NULL UNIQUE,
    school_address     VARCHAR(161) NOT NULL,              
    school_mailaddress VARCHAR(254)  NOT NULL UNIQUE,
    approval_status    TINYINT(1)   NOT NULL DEFAULT 0 -- 0:承認待ち 1:承認済み 2:拒否済み

);

/* ユーザ情報 */
CREATE TABLE IF NOT EXISTS tuna_db.user_tb(
    user_id            INT(10)      PRIMARY KEY AUTO_INCREMENT,
    school_id          INT(5)       NOT NULL,
    show_user_id       VARCHAR(20)  NOT NULL UNIQUE,
    password           CHAR(60)     NOT NULL,
    mailaddress        VARCHAR(254) NOT NULL UNIQUE,
    name               VARCHAR(50)  NOT NULL,
    accounts_stop_flag boolean      NOT NULL DEFAULT 0,
    CHECK (accounts_stop_flag IN(0, 1)),

    FOREIGN KEY (school_id)
    REFERENCES tuna_db.school_info_tb(school_id)                       
);

/*リフレッシュトークン*/
CREATE TABLE IF NOT EXISTS tuna_db.refresh_token_tb(
    user_id INT(10) PRIMARY KEY NOT NULL,
    refresh_token VARCHAR(64) NOT NULL,

    FOREIGN KEY (user_id)
    REFERENCES tuna_db.user_tb(user_id)
    ON DELETE CASCADE
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
    admission_date     DATE         NOT NULL,               
    graduate_date      DATE,

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

INSERT INTO tuna_db.school_info_tb (school_name, school_code, school_address, school_mailaddress, approval_status) VALUES
('マグロ市立第一中学校', 'MAGURO0000001', '東京都港区まぐろ1-1-1', 'maguro1@tuna.ac.jp',0),
('カツオ私立高等専門学校', 'KATSUO0000002', '大阪府中央区かつお2-2-2', 'akatsuo2@tuna.ac.jp',2),
('水戸電子専門学校','MITO0000004','茨城県水戸市浜田3-3-3','mitoDigital@tuna.ac.jp',1);

-- school_id = 1 (マグロ市立第一中学校) のユーザー
INSERT INTO tuna_db.user_tb (school_id, show_user_id, password, mailaddress, name, accounts_stop_flag) VALUES
(1, 't001_teacher_a', '$2a$08$K7559zjnWnbpFmsw.Z1LHeJZ1PBdbvOwu0fzf1uHI3qoBVDceM9pu', 'teacher.a@maguro1.jp', '佐藤 太郎 (教)', 0), -- 教師
(1, 's001_student_x', '$2a$08$HrFsARLjNxBMk.JNiKh/9O9gilc.gsEy.MaU/VvqzRk/kF4CfOMS.', 'student.x@maguro1.jp', '田中 花子 (生)', 0), -- 生徒
(1, 's001_student_y', '$2a$10$UIHJ7FvDtz3wWV6.pdaCCOEMPDFEAPVND5gWNzXmV.VXavbs29g3m', 'student.y@maguro1.jp', '小林 健太 (生)', 0), -- 生徒
-- school_id = 2 (カツオ私立高等専門学校) のユーザー
(2, 't002_teacher_b', '$2a$10$GJOmEGnrVUH44ZbY2JygtOy3NpX0OKEGAJuhdrRLN.aDhFxZayR5S', 'teacher.b@katsuo2.jp', '山田 次郎 (教)', 0), -- 教師
(2, 's002_student_z', '$2a$10$7f1Y8u1r0F6p0k1F0G8nUu5jF6b9HqOa8KqE6Zx9YzF1JHkL2mN3W', 'student.z@katsuo2.jp', '佐々木 一郎 (生)', 0), -- 生徒
-- school_id = 3 (水戸電子専門学校) のユーザー
(3, 't003_teacher_c', '$2a$10$X9JH6FvDtz3wWV6.pdaCCOEMPDFEAPVND5gWNzXmV.VXavbs29g3m', 'mitocollege@mito.ac.jp', '上野 淳 (教)', 0), -- 教師
(3, 's003_student_w', '$2a$10$Yf2Y8u1r0F6p0k1F0G8nUu5jF6b9HqOa8KqE6Zx9YzF1JHkL2mN3W', 'daigo_uchida@ygcollege.jp', '内田 大悟 (生)', 0), -- 生徒
(3, 's004_student_v', '$2a$10$Zg3Y8u1r0F6p0k1F0G8nUu5jF6b9HqOa8KqE6Zx9YzF1JHkL2mN3W', 'sou_matumoto@ygcollege.jp', '松本 爽 (生)', 0), -- 生徒
(3, 's005_student_u', '$2a$10$Ag4Y8u1r0F6p0k1F0G8nUu5jF6b9HqOa8KqE6Zx9YzF1JHkL2mN3W', 'yuuki_kikuti@ygcollege.jp', '菊池 優希 (生)', 0); -- 生徒
-- user_id = 1, 4 を教師として登録
INSERT INTO tuna_db.teacher_tb (user_id, authority_flag) VALUES
(1, 1), -- 佐藤太郎 (管理者権限あり)
(4, 0), -- 山田次郎 (管理者権限なし)
(6, 1); -- 上野淳 (管理者権限あり)
-- user_id = 2, 3 を生徒として登録
INSERT INTO tuna_db.student_tb (user_id, grade, admission_date, graduate_date) VALUES
(2, 3, '2023-04-01', NULL), -- 田中花子: 3年生
(3, 1, '2025-04-01', NULL), -- 小林健太: 1年生
(5, 2, '2024-04-01', NULL), -- 佐々木一郎: 2年生
(7, 2, '2024-04-01', NULL), -- 内田大悟: 2年生
(8, 1, '2025-04-01', NULL), -- 松本爽: 1年生
(9, 1, '2025-04-01', NULL); -- 菊池優希: 1年生

INSERT INTO tuna_db.help_category_tb (help_category_name) VALUES
('アカウント'),
('グループ管理'),
('機能操作'),
('トラブルシューティング');

INSERT INTO tuna_db.help_contents_tb (help_category_id, question, answer) VALUES
(1, 'パスワードを忘れてしまいました', 'ログイン画面の「パスワードをリセット」から手続きを行ってください。'),
(3, 'グループへの参加方法を教えてください', 'グループ管理者から配布された招待コードを入力するか、管理者に申請してください。'),
(1, 'アカウントを停止したいです', '学校管理者またはシステム管理者にお問い合わせください。'),
(4, '画面が真っ白になってしまいました', 'ブラウザのキャッシュをクリアするか、別のブラウザでお試しください。');

INSERT INTO tuna_db.group_tb (group_name, school_id, upper_group) VALUES
-- school_id = 1 (マグロ市立第一中学校)
('全校生徒', 1, NULL), -- group_id = 1
('3年A組', 1, 1),      -- group_id = 2
('1年B組', 1, 1),      -- group_id = 3
('バスケットボール部', 1, NULL), -- group_id = 4
-- school_id = 2 (カツオ私立高等専門学校)
('情報処理科', 2, NULL), -- group_id = 5
('電子工学科', 2, NULL); -- group_id = 6

--
INSERT INTO tuna_db.group_member_tb (group_id, user_id) VALUES
-- 田中花子 (user_id=2, 3年生) は全校生徒, 3年A組, バスケ部
(1, 2),
(2, 2),
(4, 2),
-- 小林健太 (user_id=3, 1年生) は全校生徒, 1年B組
(1, 3),
(3, 3),
-- 佐藤太郎 (user_id=1, 教師) は全校生徒 (管理者的な立場で)
(1, 1),
-- 山田次郎 (user_id=4, 教師) は情報処理科 (管理者的な立場で)
(5, 4),
(5, 5), -- 佐々木一郎 (user_id=5, 生徒) は情報処理科
(6, 5);