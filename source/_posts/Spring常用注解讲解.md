---
title: Spring常用注解讲解
date: 2024-09-18 08:00:00
updated: 2024-09-18 08:00:00
tags: [Spring, 注解, Annotation, IOC, DI]
categories: Spring
cover: /img/img_2.png
top_img: /img/img_2.png
---

# Spring常用注解讲解

Spring框架提供了丰富的注解来简化开发，这些注解可以替代XML配置，使代码更加简洁和易读。

## 1. 组件扫描相关注解

### 1.1 @Component

用于标记一个类为Spring组件，会被自动扫描并注册为Bean。

```java
@Component
public class UserService {
    public void createUser() {
        System.out.println("用户创建成功");
    }
}
```

### 1.2 @Service

专门用于标记服务层组件，是@Component的特化。

```java
@Service
public class OrderService {
    public void createOrder() {
        System.out.println("订单创建成功");
    }
}
```

### 1.3 @Repository

专门用于标记数据访问层组件，是@Component的特化。

```java
@Repository
public class UserRepository {
    public void saveUser() {
        System.out.println("用户保存成功");
    }
}
```

### 1.4 @Controller

专门用于标记控制器层组件，是@Component的特化。

```java
@Controller
public class UserController {
    @RequestMapping("/user")
    public String getUser() {
        return "user";
    }
}
```

## 2. 依赖注入相关注解

### 2.1 @Autowired

用于自动装配Bean，可以用于字段、构造函数或方法。

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public void createUser() {
        userRepository.saveUser();
    }
}
```

### 2.2 @Qualifier

当有多个相同类型的Bean时，用于指定具体的Bean。

```java
@Service
public class UserService {
    @Autowired
    @Qualifier("userRepositoryImpl")
    private UserRepository userRepository;
}
```

### 2.3 @Resource

JSR-250规范中的注解，功能与@Autowired类似，但默认按名称注入。

```java
@Service
public class UserService {
    @Resource(name = "userRepositoryImpl")
    private UserRepository userRepository;
}
```

## 3. 配置相关注解

### 3.1 @Configuration

用于标记配置类，替代XML配置文件。

```java
@Configuration
public class AppConfig {
    
    @Bean
    public UserService userService() {
        return new UserService();
    }
    
    @Bean
    public UserRepository userRepository() {
        return new UserRepository();
    }
}
```

### 3.2 @Bean

用于在配置类中定义Bean。

```java
@Configuration
public class AppConfig {
    
    @Bean
    public UserService userService() {
        return new UserService();
    }
}
```

## 4. 事务相关注解

### 4.1 @Transactional

用于声明式事务管理。

```java
@Service
public class UserService {
    @Transactional
    public void createUser() {
        // 事务性操作
    }
}
```

## 5. 总结

Spring常用注解包括：
- 组件扫描：@Component, @Service, @Repository, @Controller
- 依赖注入：@Autowired, @Qualifier, @Resource
- 配置：@Configuration, @Bean
- 事务：@Transactional

合理使用这些注解可以大大简化Spring应用的开发。