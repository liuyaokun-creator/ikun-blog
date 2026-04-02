---
title: Spring循环依赖问题讲解
date: 2024-10-10 08:00:00
updated: 2024-10-10 08:00:00
tags: [Spring, 循环依赖, Circular Dependency, IOC, DI]
categories: Spring
cover: /img/nailong.jpg
top_img: /img/nailong.jpg
---

# Spring循环依赖问题讲解

在Spring框架中，循环依赖（Circular Dependency）是一个常见的问题，它发生在两个或多个Bean相互依赖对方的情况下。

## 1. 循环依赖的概念

循环依赖是指两个或多个Bean之间形成相互依赖的关系，例如：
- Bean A依赖Bean B
- Bean B依赖Bean A

```java
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
}

@Service
public class ServiceB {
    @Autowired
    private ServiceA serviceA;
}
```

## 2. Spring如何解决循环依赖

Spring通过三级缓存机制来解决循环依赖问题：

### 2.1 三级缓存

1. **一级缓存**（singletonObjects）：存放完全初始化好的Bean
2. **二级缓存**（earlySingletonObjects）：存放提前暴露的Bean（尚未完成属性注入）
3. **三级缓存**（singletonFactories）：存放Bean工厂对象，用于创建Bean实例

### 2.2 解决过程

1. 创建ServiceA实例
2. 将ServiceA的工厂对象放入三级缓存
3. 发现ServiceA依赖ServiceB，开始创建ServiceB
4. 创建ServiceB实例
5. 发现ServiceB依赖ServiceA，从三级缓存获取ServiceA的工厂对象
6. 从工厂对象获取ServiceA的早期引用
7. 完成ServiceB的属性注入
8. 完成ServiceA的属性注入
9. 将完全初始化好的Bean放入一级缓存

## 3. 循环依赖的解决方法

### 3.1 构造函数注入

构造函数注入会导致循环依赖无法解决，因为Spring无法提前暴露Bean。

```java
@Service
public class ServiceA {
    private final ServiceB serviceB;
    
    public ServiceA(ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}

@Service
public class ServiceB {
    private final ServiceA serviceA;
    
    public ServiceB(ServiceA serviceA) {
        this.serviceA = serviceA;
    }
}
```

### 3.2 setter方法注入

setter方法注入可以解决循环依赖问题，因为Spring可以在Bean实例化后进行属性注入。

```java
@Service
public class ServiceA {
    private ServiceB serviceB;
    
    @Autowired
    public void setServiceB(ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}

@Service
public class ServiceB {
    private ServiceA serviceA;
    
    @Autowired
    public void setServiceA(ServiceA serviceA) {
        this.serviceA = serviceA;
    }
}
```

### 3.3 使用@Lazy注解

使用@Lazy注解可以延迟Bean的初始化，从而避免循环依赖。

```java
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
}

@Service
public class ServiceB {
    @Autowired
    @Lazy
    private ServiceA serviceA;
}
```

## 4. 实际应用示例

```java
// 示例：使用setter方法注入解决循环依赖
@Service
public class OrderService {
    private UserService userService;
    
    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
    
    public void createOrder() {
        userService.createUser();
    }
}

@Service
public class UserService {
    private OrderService orderService;
    
    @Autowired
    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
    }
    
    public void createUser() {
        orderService.createOrder();
    }
}
```

## 5. 总结

Spring循环依赖问题的解决方法包括：
1. 使用setter方法注入
2. 使用@Lazy注解
3. 重构代码，避免循环依赖

理解Spring如何解决循环依赖对于编写高质量的Spring应用程序非常重要。