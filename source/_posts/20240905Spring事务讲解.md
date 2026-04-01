---
title: Spring事务讲解
date: 2024-09-05 08:00:00
updated: 2024-09-05 08:00:00
tags: [Spring, 事务, Transaction, ACID, 声明式事务]
categories: Spring
---

# Spring事务讲解

Spring事务管理是Spring框架的重要特性之一，它提供了声明式和编程式两种事务管理方式，使开发者能够轻松地在应用程序中管理数据库事务。

## 1. 事务的基本概念

事务（Transaction）是一组原子性的操作，这些操作要么全部成功，要么全部失败。事务具有ACID特性：
- **原子性（Atomicity）**：事务中的所有操作要么全部完成，要么全部不完成
- **一致性（Consistency）**：事务执行前后，数据库从一个一致状态转换到另一个一致状态
- **隔离性（Isolation）**：多个事务并发执行时，彼此之间互不干扰
- **持久性（Durability）**：事务一旦提交，其结果就是永久性的

## 2. Spring事务管理方式

Spring提供了两种事务管理方式：

### 2.1 编程式事务管理

通过TransactionTemplate或PlatformTransactionManager手动管理事务。

```java
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

@Service
public class UserService {
    @Autowired
    private TransactionTemplate transactionTemplate;
    
    public void createUser(User user) {
        transactionTemplate.execute(new TransactionCallback<Void>() {
            @Override
            public Void doInTransaction(TransactionStatus status) {
                // 业务逻辑
                userRepository.save(user);
                emailService.sendWelcomeEmail(user);
                return null;
            }
        });
    }
}
```

### 2.2 声明式事务管理

通过注解或XML配置实现事务管理，这是最常用的方式。

```java
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Transactional
    public void createUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}
```

## 3. 事务传播行为
![事务传播行为](/img/img.png)
Spring支持多种事务传播行为，定义了事务方法被其他事务方法调用时的行为：

```java
@Service
public class UserService {
    @Transactional(propagation = Propagation.REQUIRED)
    public void createUser(User user) {
        // 默认传播行为
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void createNewUser(User user) {
        // 总是创建新事务
    }
    
    @Transactional(propagation = Propagation.NESTED)
    public void nestedUser(User user) {
        // 嵌套事务
    }
}
```

## 4. 事务隔离级别

Spring支持多种事务隔离级别：

```java
@Service
public class UserService {
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void readCommitted() {
        // 读已提交
    }
    
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public void repeatableRead() {
        // 可重复读
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void serializable() {
        // 序列化
    }
}
```

## 5. 事务回滚规则

Spring默认情况下，只有遇到运行时异常（RuntimeException）或错误（Error）才会回滚事务。

```java
@Service
public class UserService {
    @Transactional(rollbackFor = Exception.class)
    public void createUser(User user) throws Exception {
        // 指定检查型异常也回滚
        if (user == null) {
            throw new Exception("用户不能为空");
        }
        userRepository.save(user);
    }
    
    @Transactional(noRollbackFor = CustomException.class)
    public void createUserWithCustomException(User user) {
        // 指定特定异常不回滚
    }
}
```

## 6. 事务超时和只读属性

```java
@Service
public class UserService {
    @Transactional(timeout = 30, readOnly = true)
    public List<User> getAllUsers() {
        // 设置超时时间和只读属性
        return userRepository.findAll();
    }
    
    @Transactional(timeout = 60, readOnly = false)
    public void updateUser(User user) {
        // 更新操作，非只读
        userRepository.save(user);
    }
}
```

## 7. 实际应用示例

```java
// 完整的事务管理示例
@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private PaymentService paymentService;
    
    @Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED, timeout = 30)
    public boolean processOrder(Order order) {
        try {
            // 1. 创建订单
            orderRepository.save(order);
            
            // 2. 处理支付
            boolean paymentSuccess = paymentService.processPayment(order);
            
            if (!paymentSuccess) {
                throw new RuntimeException("支付失败");
            }
            
            return true;
        } catch (Exception e) {
            // 记录日志
            System.out.println("订单处理失败: " + e.getMessage());
            throw e; // 重新抛出异常以触发回滚
        }
    }
}
```

## 8. 总结

Spring事务管理简化了数据库事务的处理，主要特点包括：
1. 支持声明式和编程式两种事务管理方式
2. 提供丰富的事务传播行为和隔离级别
3. 灵活的回滚规则配置
4. 支持事务超时和只读属性
5. 与Spring框架无缝集成

通过合理使用Spring事务管理，可以确保数据的一致性和完整性，提高应用程序的可靠性。