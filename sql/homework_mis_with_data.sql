/*
 Navicat Premium Data Transfer

 Source Server         : tc docker hwmis-mysql
 Source Server Type    : MySQL
 Source Server Version : 80030
 Source Host           : 124.222.73.203:49154
 Source Schema         : homework_mis

 Target Server Type    : MySQL
 Target Server Version : 80030
 File Encoding         : 65001

 Date: 10/10/2022 21:42:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
  PRIMARY KEY (`id`),
  KEY `homeworkToTeacher` (`teacherID`),
  CONSTRAINT `homeworkToTeacher` FOREIGN KEY (`teacherID`) REFERENCES `teacher` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of homework
-- ----------------------------
BEGIN;
INSERT INTO `homework` VALUES (1, '作业1', '这是一个测试用的作业。用于测试未完成作业。', '2022-09-27 10:50:02', '2023-10-30 11:45:14', 1);
INSERT INTO `homework` VALUES (2, '过期作业1', '这是一个过期作业。', '2022-09-25 15:29:03', '2022-09-26 22:46:12', 1);
INSERT INTO `homework` VALUES (3, '已完成作业1', '这是一个已完成作业，并且应该已经评分了。', '2022-09-27 10:50:48', '2023-10-30 09:47:52', 1);
INSERT INTO `homework` VALUES (13, '未批阅作业', '这是一个未批阅作业的例子，可以在这里测试作业的批阅和打回功能。', '2022-09-27 10:50:15', '2023-10-31 10:43:19', 1);
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of homework_content
-- ----------------------------
BEGIN;
INSERT INTO `homework_content` VALUES (1, '', '2022-09-27 17:39:38', 0, NULL, NULL, 1, 1);
INSERT INTO `homework_content` VALUES (2, NULL, '2022-09-27 15:27:16', 0, NULL, NULL, 1, 2);
INSERT INTO `homework_content` VALUES (3, '这里是作业的答案，如果作业存在答案就不显示没有提交那句话了！', '2022-09-21 20:17:36', 1, 80, NULL, 1, 3);
INSERT INTO `homework_content` VALUES (13, '这里是作业的答案', '2022-09-27 10:43:40', 1, NULL, NULL, 6, 13);
INSERT INTO `homework_content` VALUES (14, '这里是作业的答案', '2022-09-27 10:43:40', 1, NULL, '', 7, 13);
INSERT INTO `homework_content` VALUES (15, '这里是作业的答案', '2022-09-27 10:43:40', 1, NULL, NULL, 8, 13);
INSERT INTO `homework_content` VALUES (16, '这里是作业的答案', '2022-09-27 10:43:40', 1, NULL, NULL, 10, 13);
INSERT INTO `homework_content` VALUES (17, '这里是作业的答案', '2022-09-27 10:43:40', 1, NULL, NULL, 9, 13);
INSERT INTO `homework_content` VALUES (18, '这里是作业的答案', '2022-09-27 10:43:40', 1, NULL, NULL, 1, 13);
INSERT INTO `homework_content` VALUES (19, NULL, '2022-09-27 15:25:12', 0, NULL, NULL, 6, 1);
INSERT INTO `homework_content` VALUES (20, '这里是过期作业的完成内容', '2022-09-25 16:46:11', 1, NULL, NULL, 6, 2);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of student
-- ----------------------------
BEGIN;
INSERT INTO `student` VALUES (1, 'direwolf', '123456', '.direwolf', '信息管理与信息系统', '74985a778511a53ba671334bbde2125f0033a8f16907c2d8965cac571645a96ad60333d179021e65fc65ac20cf42e009');
INSERT INTO `student` VALUES (6, '1', '1', '测试同学1', '测试班级', NULL);
INSERT INTO `student` VALUES (7, '2', '2', '测试同学2', '测试班级', NULL);
INSERT INTO `student` VALUES (8, '3', '3', '测试同学3', '测试班级', NULL);
INSERT INTO `student` VALUES (9, '4', '4', '测试同学4', '测试班级', NULL);
INSERT INTO `student` VALUES (10, '5', '5', '测试同学5', '测试班级', NULL);
COMMIT;

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `actual_id` varchar(9) NOT NULL,
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(20) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_id` (`actual_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of teacher
-- ----------------------------
BEGIN;
INSERT INTO `teacher` VALUES (1, 'test', '123456', '测试教师', '128f3a6727ead7a49aaf2caf4a7f66d29f4cf614ea36c2ce09ade39dfbd3e666af14eb906caf9f5aeddf04bdd52947e0');
INSERT INTO `teacher` VALUES (2, 'test2', '123456', '测试教师2', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
