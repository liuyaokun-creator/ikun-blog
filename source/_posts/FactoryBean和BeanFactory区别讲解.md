---
title: FactoryBean和BeanFactory区别讲解
date: 2024-09-12 08:00:00
updated: 2024-09-12 08:00:00
tags: [Spring, FactoryBean, BeanFactory, IOC, DI]
categories: Spring
cover: /img/img_1.jpg
top_img: /img/img_1.jpg
---

# FactoryBean和BeanFactory区别讲解

在Spring框架中，FactoryBean和BeanFactory是两个经常被混淆的概念。虽然它们的名称相似，但它们在Spring容器中的作用和使用方式有显著的区别。

## 1. BeanFactory

BeanFactory是Spring框架的基础接口，它定义了容器的基本行为，如管理bean的生命周期、配置文件的加载和解析、bean的装配和依赖注入等。

```java
import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanFactoryExample {
    public static void main(String[] args) {
        // 创建BeanFactory容器
        BeanFactory factory = new ClassPathXmlApplicationContext("applicationContext.xml");
        
        // 获取bean实例
        UserService userService = (UserService) factory.getBean("userService");
        userService.createUser();
    }
}
```

## 2. FactoryBean

FactoryBean是一种特殊的bean，它可以通过getObject()方法自定义逻辑来创建其他bean。FactoryBean在容器启动时被创建，而在实际使用时则是通过调用getObject()方法来得到其所生产的bean。

```java
import org.springframework.beans.factory.FactoryBean;

public class UserServiceFactoryBean implements FactoryBean<UserService> {
    @Override
    public UserService getObject() throws Exception {
        // 自定义逻辑创建UserService实例
        UserService userService = new UserService();
        userService.setName("Custom User Service");
        return userService;
    }
    
    @Override
    public Class<?> getObjectType() {
        return UserService.class;
    }
    
    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

## 3. 主要区别

### 3.1 功能定位

- **BeanFactory**：用于管理bean的框架基础接口，提供了基本的容器功能和bean生命周期管理
- **FactoryBean**：用于创建bean的接口，提供了更加灵活的初始化定制功能

### 3.2 使用场景

- **BeanFactory**：通常用于获取已经定义好的bean实例
- **FactoryBean**：通常用于整合第三方框架或实现复杂的bean创建逻辑

### 3.3 实现方式

```java
// BeanFactory的使用
BeanFactory factory = new ClassPathXmlApplicationContext("applicationContext.xml");
UserService userService = (UserService) factory.getBean("userService");

// FactoryBean的使用
UserService userService = (UserService) factory.getBean("userServiceFactoryBean");
// 注意：这里获取的是FactoryBean创建的对象，而不是FactoryBean本身
```

## 4. 实际应用示例

### 4.1 整合第三方框架

```java
// 整合MyBatis的SqlSessionFactoryBean（实际上是FactoryBean）
import org.mybatis.spring.SqlSessionFactoryBean;

@Bean
public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
    SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
    factoryBean.setDataSource(dataSource);
    return factoryBean.getObject(); // 通过FactoryBean创建SqlSessionFactory
}
```

### 4.2 自定义Bean创建

```java
@Component
public class CustomBeanFactory implements FactoryBean<CustomBean> {
    @Override
    public CustomBean getObject() throws Exception {
        CustomBean bean = new CustomBean();
        // 复杂的初始化逻辑
        bean.initialize();
        return bean;
    }
    
    @Override
    public Class<?> getObjectType() {
        return CustomBean.class;
    }
    
    @Override
    public boolean isSingleton() {
        return true;
    }
}
```

## 5. 总结

FactoryBean和BeanFactory的主要区别在于：
1. **功能不同**：FactoryBean用于创建bean，BeanFactory用于管理bean
2. **使用方式不同**：FactoryBean通过getObject()方法创建对象，BeanFactory通过getBean()方法获取对象
3. **应用场景不同**：FactoryBean常用于复杂对象创建，BeanFactory是Spring容器的基础

理解这两个概念的区别对于深入掌握Spring框架至关重要。