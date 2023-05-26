/*
 Navicat Premium Data Transfer

 Source Server         : local hwmis-mysql
 Source Server Type    : MySQL
 Source Server Version : 80030
 Source Host           : localhost:3307
 Source Schema         : homework_mis

 Target Server Type    : MySQL
 Target Server Version : 80030
 File Encoding         : 65001

 Date: 06/05/2023 01:19:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for course
-- ----------------------------
DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `time` datetime DEFAULT CURRENT_TIMESTAMP,
  `ended` tinyint(1) DEFAULT '0',
  `teacherID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `courseToTeacher` (`teacherID`),
  CONSTRAINT `courseToTeacher` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of course
-- ----------------------------
BEGIN;
INSERT INTO `course` VALUES (3, '示例课程', '2023-05-05 16:12:31', 0, 1);
INSERT INTO `course` VALUES (4, '飞行器驾驶', '2023-05-05 16:15:15', 0, 2);
INSERT INTO `course` VALUES (5, '围棋入门', '2023-05-05 16:16:23', 0, 3);
INSERT INTO `course` VALUES (6, '体育（篮球）', '2023-05-05 16:18:43', 0, 4);
INSERT INTO `course` VALUES (7, '生态学', '2023-05-05 16:19:47', 0, 5);
INSERT INTO `course` VALUES (8, '语文', '2023-05-05 17:15:05', 0, 6);
COMMIT;

-- ----------------------------
-- Table structure for course_student
-- ----------------------------
DROP TABLE IF EXISTS `course_student`;
CREATE TABLE `course_student` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `courseID` int unsigned NOT NULL,
  `studentID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `to_course` (`courseID`),
  KEY `to_student` (`studentID`),
  CONSTRAINT `to_course` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `to_student` FOREIGN KEY (`studentID`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of course_student
-- ----------------------------
BEGIN;
INSERT INTO `course_student` VALUES (3, 3, 1);
INSERT INTO `course_student` VALUES (4, 3, 11);
INSERT INTO `course_student` VALUES (5, 3, 12);
INSERT INTO `course_student` VALUES (6, 3, 15);
INSERT INTO `course_student` VALUES (7, 3, 16);
INSERT INTO `course_student` VALUES (8, 4, 1);
INSERT INTO `course_student` VALUES (13, 5, 1);
INSERT INTO `course_student` VALUES (14, 6, 1);
INSERT INTO `course_student` VALUES (15, 7, 1);
INSERT INTO `course_student` VALUES (16, 8, 1);
COMMIT;

-- ----------------------------
-- Table structure for exam
-- ----------------------------
DROP TABLE IF EXISTS `exam`;
CREATE TABLE `exam` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `time` datetime NOT NULL,
  `endtime` datetime NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `courseID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_to_course` (`courseID`),
  CONSTRAINT `exam_to_course` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of exam
-- ----------------------------
BEGIN;
INSERT INTO `exam` VALUES (21, '期末考试', '2023-06-15 08:00:00', '2023-05-15 10:00:00', '某个神秘的教室', 3);
INSERT INTO `exam` VALUES (22, '期中考试', '2023-03-20 16:00:00', '2023-05-20 18:00:00', '某个神秘的教室', 3);
INSERT INTO `exam` VALUES (23, '单手运球考试', '2023-05-27 11:45:14', '2023-05-27 19:19:00', '体育场', 6);
INSERT INTO `exam` VALUES (24, '汉语能力测试', '2023-06-03 00:00:00', '2023-06-03 02:00:00', '很稀有的高级教室', 8);
COMMIT;

-- ----------------------------
-- Table structure for exam_result
-- ----------------------------
DROP TABLE IF EXISTS `exam_result`;
CREATE TABLE `exam_result` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `score` tinytext,
  `studentID` int unsigned NOT NULL,
  `examID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_result_to_student` (`studentID`),
  KEY `exam_result_to_exam` (`examID`),
  CONSTRAINT `exam_result_to_exam` FOREIGN KEY (`examID`) REFERENCES `exam` (`id`),
  CONSTRAINT `exam_result_to_student` FOREIGN KEY (`studentID`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of exam_result
-- ----------------------------
BEGIN;
INSERT INTO `exam_result` VALUES (5, '80', 16, 21);
INSERT INTO `exam_result` VALUES (6, NULL, 11, 21);
INSERT INTO `exam_result` VALUES (7, NULL, 12, 21);
INSERT INTO `exam_result` VALUES (8, NULL, 15, 21);
INSERT INTO `exam_result` VALUES (9, '100', 1, 21);
INSERT INTO `exam_result` VALUES (10, '87', 12, 22);
INSERT INTO `exam_result` VALUES (11, '73', 11, 22);
INSERT INTO `exam_result` VALUES (12, '92', 16, 22);
INSERT INTO `exam_result` VALUES (13, '99', 1, 22);
INSERT INTO `exam_result` VALUES (14, '62', 15, 22);
INSERT INTO `exam_result` VALUES (15, NULL, 1, 23);
INSERT INTO `exam_result` VALUES (16, NULL, 1, 24);
COMMIT;

-- ----------------------------
-- Table structure for homework
-- ----------------------------
DROP TABLE IF EXISTS `homework`;
CREATE TABLE `homework` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `assignment` text NOT NULL,
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deadline` datetime NOT NULL,
  `teacherID` int unsigned NOT NULL,
  `courseID` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `homeworkToTeacher` (`teacherID`),
  KEY `homeworkToCourse` (`courseID`),
  CONSTRAINT `homeworkToCourse` FOREIGN KEY (`courseID`) REFERENCES `course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `homeworkToTeacher` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of homework
-- ----------------------------
BEGIN;
INSERT INTO `homework` VALUES (78, '一项作业', '这是一项作业', '2023-05-05 16:37:10', '2023-06-01 00:00:00', 1, 3);
INSERT INTO `homework` VALUES (79, '另一项作业', '这是另一项作业', '2023-05-04 16:43:24', '2023-06-02 00:00:00', 1, 3);
INSERT INTO `homework` VALUES (80, '已经过期的作业', '热知识：作业过期了就没法提交了', '2023-05-01 16:44:50', '2023-05-06 00:00:00', 1, 3);
INSERT INTO `homework` VALUES (81, '死活题', '死活题', '2023-05-05 17:05:43', '2023-06-03 00:00:00', 3, 5);
INSERT INTO `homework` VALUES (82, '预习：认识雪豹', '芝士雪豹', '2023-05-05 17:07:40', '2023-06-10 00:00:00', 5, 7);
COMMIT;

-- ----------------------------
-- Table structure for homework_content
-- ----------------------------
DROP TABLE IF EXISTS `homework_content`;
CREATE TABLE `homework_content` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `content` text,
  `time` datetime DEFAULT CURRENT_TIMESTAMP,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `score` tinyint DEFAULT NULL,
  `comment` text,
  `studentID` int unsigned NOT NULL,
  `homeworkID` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contentToStudent` (`studentID`),
  KEY `contentToHomework` (`homeworkID`),
  CONSTRAINT `contentToHomework` FOREIGN KEY (`homeworkID`) REFERENCES `homework` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `contentToStudent` FOREIGN KEY (`studentID`) REFERENCES `student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of homework_content
-- ----------------------------
BEGIN;
INSERT INTO `homework_content` VALUES (83, '这是一次普通的作业提交内容', '2023-05-06 12:45:34', 1, 100, '这是一行普通的评语', 1, 78);
INSERT INTO `homework_content` VALUES (84, '我去，是初音未来！', '2023-05-06 12:24:15', 1, 93, NULL, 16, 78);
INSERT INTO `homework_content` VALUES (85, '树枭树枭？', '2023-05-06 07:37:10', 1, NULL, NULL, 15, 78);
INSERT INTO `homework_content` VALUES (86, '哼哼啊啊啊啊', '2023-05-06 20:16:20', 0, NULL, NULL, 12, 78);
INSERT INTO `homework_content` VALUES (87, NULL, '2023-05-07 06:45:24', 0, NULL, NULL, 11, 78);
INSERT INTO `homework_content` VALUES (88, NULL, '2023-05-05 16:43:24', 0, NULL, NULL, 1, 79);
INSERT INTO `homework_content` VALUES (89, NULL, '2023-05-05 16:43:25', 1, 88, NULL, 11, 79);
INSERT INTO `homework_content` VALUES (90, NULL, '2023-05-05 16:43:25', 0, NULL, NULL, 16, 79);
INSERT INTO `homework_content` VALUES (91, NULL, '2023-05-05 16:43:25', 0, NULL, NULL, 12, 79);
INSERT INTO `homework_content` VALUES (92, NULL, '2023-05-05 16:43:25', 1, 67, NULL, 15, 79);
INSERT INTO `homework_content` VALUES (93, '这是一次普通的作业提交内容', '2023-05-05 16:44:50', 1, 100, NULL, 1, 80);
INSERT INTO `homework_content` VALUES (94, NULL, '2023-05-05 16:44:50', 1, 97, NULL, 12, 80);
INSERT INTO `homework_content` VALUES (95, NULL, '2023-05-05 16:44:50', 1, 92, NULL, 16, 80);
INSERT INTO `homework_content` VALUES (96, NULL, '2023-05-05 16:44:50', 1, 87, NULL, 15, 80);
INSERT INTO `homework_content` VALUES (97, NULL, '2023-05-05 16:44:50', 0, NULL, NULL, 11, 80);
INSERT INTO `homework_content` VALUES (98, NULL, '2023-05-05 17:05:43', 0, NULL, NULL, 1, 81);
INSERT INTO `homework_content` VALUES (99, NULL, '2023-05-05 17:07:40', 0, NULL, NULL, 1, 82);
COMMIT;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `actual_id` char(12) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(20) NOT NULL,
  `class` varchar(20) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`actual_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of student
-- ----------------------------
BEGIN;
INSERT INTO `student` VALUES (1, 'student', '123456', '.direwolf', '信息管理与信息系统', '74985a778511a53ba671334bbde2125f0033a8f16907c2d8965cac571645a96ad60333d179021e65fc65ac20cf42e009');
INSERT INTO `student` VALUES (11, 'bloth', '玩apex玩的', '寻血猎犬', '信息管理与信息系统', NULL);
INSERT INTO `student` VALUES (12, 'yajusenpai', '114514', '李田所', '信息管理与信息系统', NULL);
INSERT INTO `student` VALUES (15, 'decidueye', 'juunaipa', '狙射树枭', '信息管理与信息系统', NULL);
INSERT INTO `student` VALUES (16, 'hatsunemiku', '3939', '初音未来', '信息管理与信息系统', NULL);
COMMIT;

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `actual_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(20) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`actual_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of teacher
-- ----------------------------
BEGIN;
INSERT INTO `teacher` VALUES (1, 'teacher', '123456', '测试教师', '128f3a6727ead7a49aaf2caf4a7f66d29f4cf614ea36c2ce09ade39dfbd3e666af14eb906caf9f5aeddf04bdd52947e0');
INSERT INTO `teacher` VALUES (2, 'hanjinlong', '123456', '韩金龙', NULL);
INSERT INTO `teacher` VALUES (3, 'kejie', '123456', '柯洁', 'f30bc0ab9a7faf04b56dd3d51c0874ecdc85ff6369fbbd47301dddbcf9a94fa8c36cff0bf68f9a0e2cb3f3180cc3c0ff');
INSERT INTO `teacher` VALUES (4, 'cxk', '123456', '蔡徐坤', '4cddc5b7cfc41a614efa9b9bc8d9853d1d599f4404646649d21640d8e19b79f5a2c987a4750eb1f1dc3901ebbee8bb63');
INSERT INTO `teacher` VALUES (5, 'dj', '123456', '丁真珍珠', '404abb977e089d96ccf0babb1d5023107e89dc63ed824c27050448b3ba79122d7ccbc3a628634132d524056fa77fde69');
INSERT INTO `teacher` VALUES (6, 'hanjian', '123456', '东雪莲', '19786fcfe1c3a3c018ffad7c9d9d4c652bf19050771e89642aca15402a8960610420f8fa27273495d783c1c6fbb3e10f');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
