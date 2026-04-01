---
title: Spring bean的生命周期的讲解
date: 2024-09-01 08:00:00
updated: 2024-09-01 08:00:00
tags: [Spring, Bean, 生命周期, IOC, DI]
categories: Spring
cover: /img/fj.jpg
top_img: /img/fj.jpg
---

# Spring bean的生命周期的讲解

![Spring Bean Lifecycle](/img/spring_bean_lifecycle.jpg)

Spring Bean的生命周期是Spring框架的核心概念之一，它描述了Bean从创建到销毁的完整过程。根据您提供的图片内容，我将详细讲解Spring Bean的九个生命周期阶段。

## 1. Bean定义信息解析

第一步是从XML、注解或配置类中解析bean的定义信息，将这些bean的定义信息（如id、class、属性等）存入BeanDefinition对象，并保存在BeanDefinitionMap中。

```java
// 示例：通过注解定义Bean
@Component("userService")
public class UserService {
    // Bean属性
    private String name;
    
    public void setName(String name) {
        this.name = name;
    }
}
```

## 2. BeanFactoryPostProcessor处理

第二步如果实现了BeanFactoryPostProcessor扩展接口，它会在Spring容器加载完BeanDefinition之后、Bean实例化之前执行，用于对bean中的元数据进行加工处理。

```java
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;

public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        // 对BeanDefinition进行处理
        System.out.println("BeanFactoryPostProcessor执行");
    }
}
```

## 3. 实例化Bean对象

第三步是实例化bean对象，此时会在堆内存开辟新内存，底层调用createBeanInstance方法，通过反射机制获取bean的实例对象。

```java
// Spring容器会自动完成实例化
ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
UserService userService = context.getBean(UserService.class);
```

## 4. 属性赋值和依赖注入

第四步是属性赋值，在spring实例化后，spring会调用populateBean()方法完成依赖注入，通过依赖注入机制填充Bean属性。

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;  // 依赖注入
    
    public void saveUser(User user) {
        userRepository.save(user);
    }
}
```

## 5. Aware感知机制

第五步在spring中使用了Aware感知机制，如果Bean实现了任何Aware接口，Spring会通过invokeAwareMethods()触发容器感知回调。

```java
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.context.ApplicationContextAware;

@Component
public class MyBean implements BeanNameAware, ApplicationContextAware {
    private String beanName;
    private ApplicationContext applicationContext;
    
    @Override
    public void setBeanName(String name) {
        this.beanName = name;
        System.out.println("Bean名称: " + name);
    }
    
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
        System.out.println("ApplicationContext注入成功");
    }
}
```

## 6. 执行前置处理方法

第六步是执行前置处理方法，如果对象实现了BeanPostProcessor接口，则会在此过程中对bean进行一些扩展操作。

```java
import org.springframework.beans.factory.config.BeanPostProcessor;

public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        System.out.println("前置处理: " + beanName);
        return bean;  // 返回处理后的bean
    }
    
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        System.out.println("后置处理: " + beanName);
        return bean;  // 返回处理后的bean
    }
}
```

## 7. 执行初始化方法

第七步是执行初始化方法，Spring会检测开发者是否在方法上添加了@PostConstruct注解或者是实现了InitializingBean接口，重写了afterPropertiesSet方法，或者是在xml配置文件中配置了指定初始化方法init-method。

```java
import javax.annotation.PostConstruct;

@Component
public class UserService {
    @PostConstruct
    public void init() {
        System.out.println("初始化方法执行");
    }
    
    // 或者实现InitializingBean接口
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("InitializingBean初始化方法执行");
    }
}
```

## 8. 执行后置方法

第八步是执行后置方法，同样是看对象是否实现了BeanPostProcessor接口，实现了该接口可以执行一些后置方法。

```java
// 在MyBeanPostProcessor中已经定义了postProcessAfterInitialization方法
```

## 9. 销毁Bean对象

第九步是销毁bean对象。容器关闭时，单例Bean会依次触发：@PreDestroy → DisposableBean.destroy() → 自定义destroy-method。原型Bean不管理销毁。

```java
import javax.annotation.PreDestroy;

@Component
public class UserService {
    @PreDestroy
    public void destroy() {
        System.out.println("销毁方法执行");
    }
    
    // 或者实现DisposableBean接口
    @Override
    public void destroy() throws Exception {
        System.out.println("DisposableBean销毁方法执行");
    }
}
```

## 总结

Spring Bean的生命周期分为九个阶段：
1. Bean定义信息解析
2. BeanFactoryPostProcessor处理
3. 实例化Bean对象
4. 属性赋值和依赖注入
5. Aware感知机制
6. 执行前置处理方法
7. 执行初始化方法
8. 执行后置方法
9. 销毁Bean对象

这些阶段共同构成了Spring Bean的完整生命周期，确保了Bean能够被正确地创建、配置和销毁。