/*
 Navicat Premium Data Transfer

 Source Server         : tc hwmis-mysql-v1
 Source Server Type    : MySQL
 Source Server Version : 80033
 Source Host           : 124.222.73.203:49158
 Source Schema         : homework_mis

 Target Server Type    : MySQL
 Target Server Version : 80033
 File Encoding         : 65001

 Date: 26/05/2023 22:58:21
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

SET FOREIGN_KEY_CHECKS = 1;
