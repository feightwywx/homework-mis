SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Records of homework
-- ----------------------------
BEGIN;
DELETE FROM `homework`;
INSERT INTO `homework` VALUES (1, '作业1', '这是一个测试用的作业。用于测试未完成作业。', '2022-09-27 10:50:02', '2023-10-30 11:45:14', 1);
INSERT INTO `homework` VALUES (2, '过期作业1', '这是一个过期作业。', '2022-09-25 15:29:03', '2022-09-26 22:46:12', 1);
INSERT INTO `homework` VALUES (3, '已完成作业1', '这是一个已完成作业，并且应该已经评分了。', '2022-09-27 10:50:48', '2023-10-30 09:47:52', 1);
INSERT INTO `homework` VALUES (13, '未批阅作业', '这是一个未批阅作业的例子，可以在这里测试作业的批阅和打回功能。', '2022-09-27 10:50:15', '2023-10-31 10:43:19', 1);
COMMIT;

-- ----------------------------
-- Records of homework_content
-- ----------------------------
BEGIN;
DELETE FROM `homework_content`;
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
-- Records of student
-- ----------------------------
BEGIN;
DELETE FROM `student`;
INSERT INTO `student` VALUES (1, 'direwolf', '123456', '.direwolf', '信息管理与信息系统', '74985a778511a53ba671334bbde2125f0033a8f16907c2d8965cac571645a96ad60333d179021e65fc65ac20cf42e009');
INSERT INTO `student` VALUES (6, '1', '1', '测试同学1', '测试班级', NULL);
INSERT INTO `student` VALUES (7, '2', '2', '测试同学2', '测试班级', NULL);
INSERT INTO `student` VALUES (8, '3', '3', '测试同学3', '测试班级', NULL);
INSERT INTO `student` VALUES (9, '4', '4', '测试同学4', '测试班级', NULL);
INSERT INTO `student` VALUES (10, '5', '5', '测试同学5', '测试班级', NULL);
COMMIT;

-- ----------------------------
-- Records of teacher
-- ----------------------------
BEGIN;
DELETE FROM `teacher`;
INSERT INTO `teacher` VALUES (1, 'test', '123456', '测试教师', '128f3a6727ead7a49aaf2caf4a7f66d29f4cf614ea36c2ce09ade39dfbd3e666af14eb906caf9f5aeddf04bdd52947e0');
INSERT INTO `teacher` VALUES (2, 'test2', '123456', '测试教师2', NULL);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
