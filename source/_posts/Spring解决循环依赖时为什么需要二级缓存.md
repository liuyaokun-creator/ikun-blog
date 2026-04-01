---
title: Spring解决循环依赖时为什么需要二级缓存
date: 2024-10-15 08:00:00
updated: 2024-10-15 08:00:00
tags: [Spring, 循环依赖, 二级缓存, 三级缓存, Circular Dependency, IOC]
categories: Spring
---

# Spring解决循环依赖时为什么需要二级缓存

在Spring框架中，循环依赖是一个经典问题。Spring通过三级缓存机制巧妙地解决了这个问题，其中二级缓存（earlySingletonObjects）扮演了至关重要的角色。本文将详细解释为什么Spring需要二级缓存来解决循环依赖问题。

## 1. Spring的三级缓存机制

在深入探讨二级缓存之前，我们先回顾一下Spring的三级缓存：

### 1.1 三级缓存结构
1. **一级缓存**（singletonObjects）：存放完全初始化好的单例Bean
2. **二级缓存**（earlySingletonObjects）：存放提前暴露的Bean（已完成实例化但未完成属性注入）
3. **三级缓存**（singletonFactories）：存放Bean工厂对象，用于创建早期Bean引用

### 1.2 三级缓存的协作流程
```java
// Spring源码中getSingleton方法的核心逻辑
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    // 从一级缓存获取已完全初始化的Bean
    Object singletonObject = this.singletonObjects.get(beanName);
    
    // 如果一级缓存没有且当前Bean正在创建中
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        // 从二级缓存获取早期Bean引用
        singletonObject = this.earlySingletonObjects.get(beanName);
        
        // 如果二级缓存也没有且允许早期引用
        if (singletonObject == null && allowEarlyReference) {
            synchronized (this.singletonObjects) {
                // 从三级缓存获取ObjectFactory
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                
                if (singletonFactory != null) {
                    // 通过ObjectFactory创建早期Bean引用
                    singletonObject = singletonFactory.getObject();
                    // 将早期Bean引用放入二级缓存
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    // 从三级缓存移除ObjectFactory
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    
    return singletonObject;
}
```

## 2. 为什么需要二级缓存

### 2.1 保证单例模式的正确性

二级缓存的核心作用是确保在循环依赖的情况下，同一个Bean只创建一次实例：

- 当A依赖B，B又依赖A时，A在创建过程中会提前暴露自己
- 如果没有二级缓存，当B需要A的引用时，可能会通过ObjectFactory再次创建A的实例
- 二级缓存确保了后续获取A的引用时，直接从缓存中获取，而不是重新创建

### 2.2 避免重复创建AOP代理

当Bean需要被AOP代理时，二级缓存尤为重要：

```java
// 示例：AOP代理的Bean
@Service
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
    
    @Transactional
    public void methodA() {
        // 需要AOP代理
    }
}

@Service
public class ServiceB {
    @Autowired
    private ServiceA serviceA;
    
    public void methodB() {
        serviceA.methodA();
    }
}
```

如果没有二级缓存，在循环依赖情况下可能会导致：
1. A实例化后创建代理对象存入三级缓存
2. B依赖A时，通过ObjectFactory创建A的代理对象
3. 后续A完成初始化后，又创建一次代理对象
4. 这样就违反了单例模式，且AOP代理可能失效

### 2.3 提供统一的早期引用访问

二级缓存作为中间层，确保了：
- 早期暴露的Bean引用可以被多次安全访问
- 避免重复执行ObjectFactory创建逻辑
- 保证Bean创建过程中的引用一致性

## 3. 二级缓存的工作流程

### 3.1 循环依赖场景下的工作流程

假设存在A依赖B，B依赖A的循环依赖：

1. **创建A的实例**
   - 实例化A对象
   - 将A的ObjectFactory放入三级缓存
   
2. **A注入B**
   - 发现A依赖B，开始创建B
   - 实例化B对象
   - 将B的ObjectFactory放入三级缓存
   
3. **B注入A**
   - 发现B依赖A
   - 从三级缓存获取A的ObjectFactory
   - 通过ObjectFactory创建A的早期引用
   - 将A的早期引用放入二级缓存
   - 从三级缓存移除A的ObjectFactory
   
4. **完成B的创建**
   - 将A的早期引用注入B
   - 完成B的属性注入和初始化
   - 将B放入一级缓存
   
5. **完成A的创建**
   - 将B注入A
   - 完成A的属性注入和初始化
   - 将A放入一级缓存
   - 从二级缓存移除A的早期引用

### 3.2 无循环依赖场景下的工作流程

在没有循环依赖的情况下，二级缓存也不会造成负面影响：
- Bean正常创建和初始化
- 二级缓存中的早期引用会被正式的Bean实例替换
- 最终所有Bean都存放在一级缓存中

## 4. 二级缓存的实现细节

### 4.1 早期引用的创建

```java
// AbstractAutowireCapableBeanFactory中的代码片段
protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
    Assert.notNull(singletonFactory, "Singleton factory must not be null");
    synchronized (this.singletonObjects) {
        if (!this.singletonObjects.containsKey(beanName)) {
            this.singletonFactories.put(beanName, singletonFactory);
            this.earlySingletonObjects.remove(beanName);
        }
    }
}
```

### 4.2 三级缓存的转换

当需要获取早期Bean引用时，Spring会：
1. 从三级缓存获取ObjectFactory
2. 调用ObjectFactory.getObject()创建早期引用
3. 将早期引用放入二级缓存
4. 从三级缓存移除ObjectFactory

这样做的好处是：
- 只有在真正需要早期引用时才创建
- 避免不必要的对象创建
- 确保AOP代理等逻辑只执行一次

## 5. 二级缓存与其他缓存的协作

### 5.1 与一级缓存的协作

- 二级缓存中的Bean在完全初始化后会转移到一级缓存
- 一级缓存是最终的Bean存储位置

### 5.2 与三级缓存的协作

- 三级缓存提供创建早期引用的工厂
- 二级缓存存储由工厂创建的早期引用
- 这种设计实现了延迟创建和缓存的平衡

## 6. 实际示例

```java
// 示例：带AOP的循环依赖
@Component
public class ServiceA {
    @Autowired
    private ServiceB serviceB;
    
    @Cacheable("cache")
    public String getData() {
        return "A data";
    }
}

@Component
public class ServiceB {
    @Autowired
    private ServiceA serviceA;
    
    public String process() {
        return serviceA.getData() + " processed by B";
    }
}
```

在这个例子中：
- ServiceA有缓存注解，需要创建代理对象
- 二级缓存确保在循环依赖中只创建一个代理实例
- 避免了代理对象的重复创建和潜在的单例模式破坏

## 7. 总结

Spring需要二级缓存的原因主要有：

1. **保证单例模式**：确保在循环依赖情况下，Bean只创建一次实例
2. **避免重复代理**：对于需要AOP代理的Bean，确保只创建一次代理对象
3. **提供一致性引用**：确保循环依赖中的Bean引用一致
4. **优化性能**：避免重复执行ObjectFactory的创建逻辑
5. **维护缓存层级**：作为三级缓存到一级缓存的过渡层

通过三级缓存的巧妙设计，Spring能够在保持单例模式正确性的同时，有效解决循环依赖问题，这体现了Spring框架设计的精妙之处。