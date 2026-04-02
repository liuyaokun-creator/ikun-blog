---
title: MySQL中增删改查SQL语句写法讲解
date: 2024-11-03 08:00:00
updated: 2024-11-03 08:00:00
tags: [MySQL, SQL, 增删改查, 数据库, Database, CRUD]
categories: 数据库
cover: /img/plane.jpg
top_img: /img/plane.jpg
---

# MySQL中增删改查SQL语句写法讲解

在数据库操作中，增删改查（CRUD）是最基本也是最重要的操作。CRUD分别代表：Create（创建）、Read（读取）、Update（更新）、Delete（删除）。本文将详细介绍MySQL中这四种基本操作的SQL语句写法。

## 1. 增（INSERT）- 数据插入

INSERT语句用于向数据库表中插入新记录。

### 1.1 基本语法

```sql
-- 插入所有字段的值
INSERT INTO table_name VALUES (value1, value2, value3, ...);

-- 插入指定字段的值
INSERT INTO table_name (column1, column2, column3, ...) VALUES (value1, value2, value3, ...);
```

### 1.2 实例演示

```sql
-- 创建示例表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    age INT,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入一条完整记录
INSERT INTO users (name, age, email) VALUES ('张三', 25, 'zhangsan@example.com');

-- 插入多条记录
INSERT INTO users (name, age, email) VALUES 
    ('李四', 30, 'lisi@example.com'),
    ('王五', 28, 'wangwu@example.com'),
    ('赵六', 35, 'zhaoliu@example.com');
```

### 1.3 注意事项
- 字段数量和值的数量必须匹配
- 如果字段有NOT NULL约束，必须提供值或设置默认值
- 可以使用INSERT...SELECT语句从其他表复制数据

## 2. 删（DELETE）- 数据删除

DELETE语句用于删除表中的记录。

### 2.1 基本语法

```sql
-- 删除满足条件的记录
DELETE FROM table_name WHERE condition;

-- 删除所有记录（保留表结构）
DELETE FROM table_name;
```

### 2.2 实例演示

```sql
-- 删除特定用户
DELETE FROM users WHERE id = 1;

-- 删除年龄大于30的用户
DELETE FROM users WHERE age > 30;

-- 删除满足多个条件的用户
DELETE FROM users WHERE age > 25 AND name LIKE '王%';

-- 清空表中所有数据
DELETE FROM users;
```

### 2.3 注意事项
- 必须使用WHERE子句指定删除条件，否则会删除所有记录
- DELETE语句可以回滚（如果在事务中）
- 删除操作会影响表的性能，特别是大表

## 3. 改（UPDATE）- 数据更新

UPDATE语句用于修改表中已存在的记录。

### 3.1 基本语法

```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

### 3.2 实例演示

```sql
-- 更新单个字段
UPDATE users SET age = 26 WHERE id = 2;

-- 更新多个字段
UPDATE users SET age = 31, email = 'newemail@example.com' WHERE id = 3;

-- 根据条件批量更新
UPDATE users SET age = age + 1 WHERE age < 30;

-- 使用表达式更新
UPDATE users SET name = CONCAT(name, '_updated') WHERE id > 5;
```

### 3.3 注意事项
- 必须使用WHERE子句指定更新条件，否则会更新所有记录
- 可以使用子查询作为更新值
- 更新操作会影响表的性能

## 4. 查（SELECT）- 数据查询

SELECT语句用于从数据库中查询数据，是最复杂的SQL语句。

### 4.1 基本语法

```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
ORDER BY column_name
LIMIT number;
```

### 4.2 实例演示

```sql
-- 查询所有字段
SELECT * FROM users;

-- 查询指定字段
SELECT name, age FROM users;

-- 带条件查询
SELECT * FROM users WHERE age > 25;

-- 带排序查询
SELECT * FROM users ORDER BY age DESC;

-- 限制结果数量
SELECT * FROM users LIMIT 5;

-- 带条件、排序和限制的查询
SELECT name, age FROM users 
WHERE age BETWEEN 25 AND 35 
ORDER BY age ASC 
LIMIT 10;

-- 模糊查询
SELECT * FROM users WHERE name LIKE '%张%';

-- 统计查询
SELECT COUNT(*) AS total_users FROM users;
SELECT AVG(age) AS average_age FROM users;
SELECT MAX(age) AS max_age, MIN(age) AS min_age FROM users;
```

### 4.3 高级查询

```sql
-- 分组查询
SELECT age, COUNT(*) AS count FROM users GROUP BY age;

-- 带条件的分组查询
SELECT age, COUNT(*) AS count FROM users 
GROUP BY age 
HAVING COUNT(*) > 1;

-- 多表连接查询
SELECT u.name, u.age, p.title 
FROM users u 
JOIN posts p ON u.id = p.user_id;

-- 子查询
SELECT * FROM users 
WHERE age > (SELECT AVG(age) FROM users);
```

## 5. 事务处理

在进行增删改操作时，事务管理非常重要：

```sql
-- 开始事务
START TRANSACTION;

-- 执行多个操作
INSERT INTO users (name, age) VALUES ('测试用户', 25);
UPDATE users SET age = 26 WHERE name = '李四';

-- 提交事务
COMMIT;

-- 或者回滚事务
-- ROLLBACK;
```

## 6. 安全注意事项

### 6.1 SQL注入防护
- 使用参数化查询
- 验证和过滤输入数据
- 避免直接拼接SQL语句

### 6.2 权限管理
- 为不同用户分配最小必要权限
- 定期审查用户权限
- 使用专用账户执行特定操作

## 7. 性能优化建议

### 7.1 索引优化
- 为经常查询的字段创建索引
- 避免过度索引，影响插入和更新性能

### 7.2 查询优化
- 使用EXPLAIN分析查询计划
- 避免SELECT *，只查询需要的字段
- 合理使用LIMIT限制结果集大小

## 8. 实际应用示例

```sql
-- 完整的CRUD操作示例
-- 1. 插入用户
INSERT INTO users (name, age, email) VALUES ('新用户', 28, 'newuser@example.com');

-- 2. 查询用户
SELECT * FROM users WHERE id = LAST_INSERT_ID();

-- 3. 更新用户信息
UPDATE users SET email = 'updated_email@example.com' WHERE name = '新用户';

-- 4. 删除用户
DELETE FROM users WHERE name = '新用户';
```

## 9. 总结

MySQL的增删改查操作是数据库操作的基础：

1. **INSERT**：用于添加新数据，注意字段匹配和约束条件
2. **DELETE**：用于删除数据，必须小心使用WHERE条件
3. **UPDATE**：用于修改数据，同样需要注意WHERE条件
4. **SELECT**：用于查询数据，功能最丰富，支持复杂的查询操作

掌握这些基本操作是进行数据库开发的必要技能。在实际应用中，还需要注意安全性、性能和事务管理等方面的问题。