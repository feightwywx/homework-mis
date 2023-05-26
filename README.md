# homework-mis

一个基于[Next.js](https://nextjs.org)的作业管理信息系统。

[Demo链接](https://homework-mis.drwf.ink)

[备用链接（Vercel）](https://homework-mis-tog4.vercel.app)

||用户名|密码|
|--|--|--|
|学生端|student|123456|
|教师端|teacher|123456|

## 功能

### 学生端

- 查看被下发的作业列表，以及单项作业详情
- 提交作业
- 查看作业批阅情况、得分和评语

### 教师端

- 查看自己下发的所有作业，以及单项作业内容
- 查看作业完成情况
- 查看某个学生的作业完成内容，批阅作业
- 打回作业


## Get Started

#### 1. 安装依赖
```commandline
npm i
```

#### 2. 数据库准备
本项目使用一个名为`homework_mis`的MySQL 8.0数据库。

在调试之前，需要手动创建该数据库，并运行`sql/homework_mis.sql`来初始化表结构。

Jest测试同样调用这个数据库，但是可以通过`.env.test`指定不同的MySQL实例。

#### 3. 环境变量

本项目通过环境变量存储参数。你需要在项目根目录下创建一个`.env.local`文件，启动服务时Next.js会自动从中载入环境变量。`.env.local`的结构如下：

```ini
SECRET_COOKIE_PASSWORD=
MYSQL_HOST=
MYSQL_USER=
MYSQL_PORT=  # 默认3306
MYSQL_PASSWORD=
```

#### 4. 开始调试
```commandline
npm run dev
```

## 通过Docker部署

本项目提供了`linux/amd64`和`linux/amd64`的[Docker镜像](https://hub.docker.com/r/dotdirewolf/hwmis-docker)。

以下命令将会拉取镜像，启动一个名为的`hwmis`的容器，并将容器内`3000`端口映射到随机端口。记得替换成你自己的环境变量。

```commandline
docker pull dotdirewolf/hwmis-docker
docker run -itdP --name hwmis \
-e SECRET_COOKIE_PASSWORD= \
-e MYSQL_HOST= \
-e MYSQL_USER= \
-e MYSQL_PORT= \
-e MYSQL_PASSWORD= \
dotdirewolf/hwmis-docker
```
