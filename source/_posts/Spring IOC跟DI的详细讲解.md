---
title: Spring IOC跟DI的详细讲解
date: 2024-08-15 08:00:00
updated: 2024-08-15 08:00:00
tags: [Spring, IOC, DI, 控制反转, 依赖注入, 容器]
categories: Spring
---

# Spring IOC跟DI的详细讲解

Spring框架是Java企业级开发中最流行的框架之一，其核心特性包括控制反转（Inversion of Control，IOC）和依赖注入（Dependency Injection，DI）。这两个概念是Spring框架的基石，理解它们对于掌握Spring框架至关重要。

## 1. Spring框架概述

Spring是一个轻量级的开源框架，由Rod Johnson在2003年创建。Spring框架提供了全面的编程和配置模型，用于构建灵活、可测试和可维护的企业级应用程序。

Spring框架的核心特性包括：
- 控制反转（IOC）
- 依赖注入（DI）
- 面向切面编程（AOP）
- 事务管理
- 数据访问抽象
- Web MVC框架

## 2. 控制反转（Inversion of Control，IOC）

控制反转是一种设计原则，它将对象的创建和管理的控制权从代码本身转移到外部容器。在传统的编程方式中，对象自己负责创建和管理它所依赖的其他对象，而在控制反转模式中，这个责任被反转了。

### 2.1 传统方式的问题

在传统的编程方式中，一个类需要依赖其他类时，通常会直接在类内部创建依赖对象：

```java
public class UserService {
    private UserRepository userRepository;
    
    public UserService() {
        // 在类内部创建依赖对象
        this.userRepository = new UserRepository();
    }
    
    public void saveUser(User user) {
        userRepository.save(user);
    }
}

public class UserRepository {
    public void save(User user) {
        // 保存用户到数据库
        System.out.println("User saved to database: " + user.getName());
    }
}
```

这种方式存在以下问题：
1. **紧耦合**：UserService与UserRepository紧密耦合
2. **难以测试**：无法轻松替换UserRepository的实现
3. **难以维护**：如果UserRepository的构造方式改变，UserService也需要修改

### 2.2 控制反转的解决方案

通过控制反转，对象的创建和依赖关系的管理被转移到外部容器：

```java
// 定义接口
public interface UserRepository {
    void save(User user);
}

// 实现类
public class UserRepositoryImpl implements UserRepository {
    @Override
    public void save(User user) {
        System.out.println("User saved to database: " + user.getName());
    }
}

// 使用依赖注入的服务类
public class UserService {
    private UserRepository userRepository;
    
    // 通过构造函数注入依赖
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public void saveUser(User user) {
        userRepository.save(user);
    }
}

// 用户类
class User {
    private String name;
    
    public User(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}
```

## 3. 依赖注入（Dependency Injection，DI）

依赖注入是实现控制反转的一种具体方式，它将对象所依赖的其他对象（依赖项）通过外部容器注入到对象中。

### 3.1 依赖注入的类型

Spring支持三种主要的依赖注入方式：

#### 3.1.1 构造函数注入

```java
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // 构造函数注入
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void createUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}

public class EmailService {
    public void sendWelcomeEmail(User user) {
        System.out.println("Welcome email sent to: " + user.getName());
    }
}
```

#### 3.1.2 Setter方法注入

```java
public class UserService {
    private UserRepository userRepository;
    private EmailService emailService;
    
    // Setter方法注入
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public void setEmailService(EmailService emailService) {
        this.emailService = emailService;
    }
    
    public void processUser(User user) {
        if (userRepository != null) {
            userRepository.save(user);
        }
        if (emailService != null) {
            emailService.sendWelcomeEmail(user);
        }
    }
}
```

#### 3.1.3 字段注入（注解方式）

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    public void createUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}
```

## 4. Spring IOC容器

Spring IOC容器是Spring框架的核心，它负责创建对象、管理对象的生命周期、装配对象之间的依赖关系。

### 4.1 BeanFactory和ApplicationContext

Spring提供了两种主要的容器接口：

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Component;

// 示例Bean
@Component
class DatabaseConfig {
    public void connect() {
        System.out.println("Database connected");
    }
}

@Component
class BusinessService {
    @Autowired
    private DatabaseConfig databaseConfig;
    
    public void executeBusinessLogic() {
        databaseConfig.connect();
        System.out.println("Business logic executed");
    }
}

// 配置类
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan;

@Configuration
@ComponentScan(basePackages = "com.example")
class AppConfig {
}

// 使用容器
public class ContainerExample {
    public static void main(String[] args) {
        // 使用XML配置
        ApplicationContext context1 = new ClassPathXmlApplicationContext("applicationContext.xml");
        
        // 使用注解配置
        ApplicationContext context2 = new AnnotationConfigApplicationContext(AppConfig.class);
        
        BusinessService service = context2.getBean(BusinessService.class);
        service.executeBusinessLogic();
    }
}
```

### 4.2 Bean的生命周期

Spring Bean的生命周期包括以下阶段：

```java
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.stereotype.Component;

@Component
public class LifecycleBean implements InitializingBean, DisposableBean {
    
    public LifecycleBean() {
        System.out.println("1. 构造函数执行");
    }
    
    // 自定义初始化方法
    public void customInit() {
        System.out.println("3. 自定义初始化方法执行");
    }
    
    // 自定义销毁方法
    public void customDestroy() {
        System.out.println("6. 自定义销毁方法执行");
    }
    
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("4. InitializingBean.afterPropertiesSet()执行");
    }
    
    @Override
    public void destroy() throws Exception {
        System.out.println("5. DisposableBean.destroy()执行");
    }
    
    public void businessMethod() {
        System.out.println("Bean业务方法执行");
    }
}

// 测试Bean生命周期
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class LifecycleTest {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = 
            new AnnotationConfigApplicationContext(AppConfig.class);
        
        System.out.println("2. 容器创建完成");
        
        LifecycleBean bean = context.getBean(LifecycleBean.class);
        bean.businessMethod();
        
        System.out.println("Bean使用完成");
        
        // 关闭容器
        context.close();
        System.out.println("7. 容器关闭");
    }
}
```

## 5. Spring配置方式

Spring提供了多种配置Bean的方式：

### 5.1 XML配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 组件扫描 -->
    <context:component-scan base-package="com.example"/>
    
    <!-- 手动配置Bean -->
    <bean id="userRepository" class="com.example.UserRepositoryImpl"/>
    <bean id="emailService" class="com.example.EmailService"/>
    
    <!-- 构造函数注入 -->
    <bean id="userService" class="com.example.UserService">
        <constructor-arg ref="userRepository"/>
        <constructor-arg ref="emailService"/>
    </bean>
    
    <!-- Setter方法注入 -->
    <bean id="orderService" class="com.example.OrderService">
        <property name="userRepository" ref="userRepository"/>
    </bean>
</beans>
```

### 5.2 注解配置

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class ServiceConfig {
    
    @Bean
    @Scope("singleton") // 默认作用域
    public UserRepository userRepository() {
        return new UserRepositoryImpl();
    }
    
    @Bean
    @Scope("prototype")
    public EmailService emailService() {
        return new EmailService();
    }
    
    @Bean
    public UserService userService() {
        return new UserService(userRepository(), emailService());
    }
}

// 组件注解示例
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

@Repository
public class UserRepositoryImpl implements UserRepository {
    @Override
    public void save(User user) {
        System.out.println("User saved: " + user.getName());
    }
}

@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void createUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}
```

## 6. 依赖注入的实际应用

### 6.1 使用@Autowired注解

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderService {
    // 字段注入
    @Autowired
    private PaymentService paymentService;
    
    // Setter方法注入
    private InventoryService inventoryService;
    
    @Autowired
    public void setInventoryService(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }
    
    // 构造函数注入（推荐）
    private NotificationService notificationService;
    
    public OrderService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    public boolean processOrder(Order order) {
        // 检查库存
        if (!inventoryService.checkAvailability(order)) {
            return false;
        }
        
        // 处理支付
        boolean paymentSuccess = paymentService.processPayment(order);
        if (paymentSuccess) {
            notificationService.sendConfirmation(order);
        }
        
        return paymentSuccess;
    }
}

// 订单类
class Order {
    private String orderId;
    private String productId;
    private int quantity;
    
    public Order(String orderId, String productId, int quantity) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
    }
    
    public String getOrderId() { return orderId; }
    public String getProductId() { return productId; }
    public int getQuantity() { return quantity; }
}

// 服务接口及实现
interface PaymentService {
    boolean processPayment(Order order);
}

interface InventoryService {
    boolean checkAvailability(Order order);
}

interface NotificationService {
    void sendConfirmation(Order order);
}

@Component
class PaymentServiceImpl implements PaymentService {
    @Override
    public boolean processPayment(Order order) {
        System.out.println("Processing payment for order: " + order.getOrderId());
        return true; // 简化示例
    }
}

@Component
class InventoryServiceImpl implements InventoryService {
    @Override
    public boolean checkAvailability(Order order) {
        System.out.println("Checking inventory for product: " + order.getProductId());
        return true; // 简化示例
    }
}

@Component
class NotificationServiceImpl implements NotificationService {
    @Override
    public void sendConfirmation(Order order) {
        System.out.println("Order confirmation sent for: " + order.getOrderId());
    }
}
```

### 6.2 使用@Qualifier解决依赖歧义

```java
// 多个实现类
@Component("databaseRepository")
public class DatabaseUserRepository implements UserRepository {
    @Override
    public void save(User user) {
        System.out.println("Saving user to database: " + user.getName());
    }
}

@Component("fileRepository")
public class FileUserRepository implements UserRepository {
    @Override
    public void save(User user) {
        System.out.println("Saving user to file: " + user.getName());
    }
}

// 使用@Qualifier指定具体实现
@Service
public class UserService {
    private final UserRepository userRepository;
    
    public UserService(@Qualifier("databaseRepository") UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public void saveUser(User user) {
        userRepository.save(user);
    }
}
```

## 7. Spring AOP与IOC/DI的结合

Spring AOP（面向切面编程）与IOC/DI完美结合：

```java
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    
    @Before("execution(* com.example.service.*.*(..))")
    public void logBeforeMethod() {
        System.out.println("Method execution started");
    }
}

@Service
public class UserService {
    
    public void createUser(User user) {
        System.out.println("Creating user: " + user.getName());
        // 实际业务逻辑
    }
}
```

## 8. 最佳实践

### 8.1 依赖注入最佳实践

```java
// 推荐：构造函数注入
@Service
public class RecommendedUserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    // 构造函数注入确保依赖不为null
    public RecommendedUserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public void createUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}

// 不推荐：字段注入（可能导致空指针异常）
@Service
public class NotRecommendedUserService {
    @Autowired
    private UserRepository userRepository; // 可能为null
    
    public void createUser(User user) {
        userRepository.save(user); // 如果userRepository为null，会抛出异常
    }
}
```

### 8.2 配置最佳实践

```java
// 推荐：使用配置类而不是XML
@Configuration
@ComponentScan(basePackages = "com.example")
@EnableTransactionManagement
public class AppConfig {
    
    @Bean
    @Primary // 当有多个实现时，指定首选的Bean
    public UserRepository primaryUserRepository() {
        return new DatabaseUserRepository();
    }
    
    @Bean
    public UserRepository backupUserRepository() {
        return new FileUserRepository();
    }
}
```

## 9. 实际项目示例

以下是一个完整的Spring Boot应用示例：

```java
// 主应用类
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// 控制器
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @PostMapping
    public String createUser(@RequestBody User user) {
        userService.createUser(user);
        return "User created successfully";
    }
}

// 服务类
@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    @Transactional
    public void createUser(User user) {
        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
    }
}

// 数据访问层
@Repository
public class UserRepository {
    
    public void save(User user) {
        // 模拟数据库保存
        System.out.println("User saved to database: " + user.getName());
    }
}

// 邮件服务
@Service
public class EmailService {
    
    public void sendWelcomeEmail(User user) {
        // 模拟发送邮件
        System.out.println("Welcome email sent to: " + user.getName());
    }
}
```

## 10. 总结

Spring的IOC和DI是Spring框架的核心概念：

1. **控制反转（IOC）**：将对象的创建和管理控制权从代码转移到容器
2. **依赖注入（DI）**：将对象的依赖项通过外部容器注入到对象中
3. **Spring容器**：负责创建、管理和装配Bean的生命周期
4. **配置方式**：支持XML配置、注解配置和Java配置类
5. **最佳实践**：推荐使用构造函数注入，避免字段注入

通过使用Spring的IOC和DI，我们可以构建松耦合、可测试、可维护的应用程序。这些特性使得Spring成为企业级Java开发的首选框架。