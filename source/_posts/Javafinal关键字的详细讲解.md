---
title: Java final关键字的详细讲解：从final变量到final方法全解析
date: 2024-07-03
tags: [Java, final, 常量, 不可变性, 继承控制, 线程安全]
categories: [Java, 核心特性]
updated: 2024-07-03
---

在Java编程中，[final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字是一个非常重要的概念，它用于创建不可变的元素。理解[final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字的含义和用法，对于编写安全、高效的Java程序至关重要。本文将从**final变量、final方法、final类、不可变对象、线程安全**等多个维度，全面解析Java [final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字的核心机制。

# Java final关键字的详细讲解：从final变量到final方法全解析

## 一、final关键字概述

[final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字在Java中用于创建不可变的元素，这意味着：
- **final变量**：一旦赋值后就不能再改变
- **final方法**：不能被子类重写
- **final类**：不能被继承

[final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字提供了编译时的安全保障，确保某些重要的程序元素不会被意外修改。

## 二、final变量

### 2.1 基本数据类型的final变量

```java
public class FinalPrimitiveVariable {
    // 在声明时初始化
    private final int finalInt = 100;
    private final double finalDouble = 3.14;
    private final boolean finalBoolean = true;
    
    // 在构造函数中初始化
    private final String finalString;
    
    public FinalPrimitiveVariable() {
        this.finalString = "Hello Final";
    }
    
    public void demonstrateFinalVariables() {
        System.out.println("finalInt: " + finalInt);
        System.out.println("finalDouble: " + finalDouble);
        System.out.println("finalBoolean: " + finalBoolean);
        System.out.println("finalString: " + finalString);
        
        // 以下代码会编译错误：
        // finalInt = 200; // 错误：不能修改final变量
        // finalString = "New Value"; // 错误：不能修改final变量
    }
    
    public static void main(String[] args) {
        FinalPrimitiveVariable example = new FinalPrimitiveVariable();
        example.demonstrateFinalVariables();
    }
}
```

### 2.2 引用类型的final变量

```java
import java.util.ArrayList;
import java.util.List;

public class FinalReferenceVariable {
    // final引用变量 - 引用本身不能改变，但对象内容可以改变
    private final List<String> finalList = new ArrayList<>();
    private final StringBuilder finalStringBuilder = new StringBuilder("Hello");
    
    public void demonstrateFinalReference() {
        // 可以修改final引用指向的对象的内容
        finalList.add("Item 1");
        finalList.add("Item 2");
        System.out.println("List内容: " + finalList);
        
        finalStringBuilder.append(" World");
        System.out.println("StringBuilder内容: " + finalStringBuilder.toString());
        
        // 但是不能改变引用本身
        // finalList = new ArrayList<>(); // 编译错误
        // finalStringBuilder = new StringBuilder("New"); // 编译错误
    }
    
    // 展示"不可变"的误解
    public void showCommonMistake() {
        final int[] finalArray = {1, 2, 3, 4, 5};
        
        // 可以修改数组元素
        finalArray[0] = 100;
        System.out.println("修改后的数组: " + java.util.Arrays.toString(finalArray));
        
        // 但不能改变引用
        // finalArray = new int[5]; // 编译错误
    }
    
    public static void main(String[] args) {
        FinalReferenceVariable example = new FinalReferenceVariable();
        example.demonstrateFinalReference();
        example.showCommonMistake();
    }
}
```

### 2.3 final变量的初始化时机

```java
public class FinalVariableInitialization {
    // 1. 声明时初始化
    private final int initializedAtDeclaration = 42;
    
    // 2. 实例初始化块中初始化
    private final String initializedInBlock;
    
    {
        initializedInBlock = "Initialized in block";
    }
    
    // 3. 构造函数中初始化
    private final double initializedInConstructor;
    
    public FinalVariableInitialization() {
        initializedInConstructor = Math.PI;
    }
    
    // 重载构造函数
    public FinalVariableInitialization(double value) {
        initializedInConstructor = value; // 必须在每个构造函数中初始化
    }
    
    public void displayValues() {
        System.out.println("initializedAtDeclaration: " + initializedAtDeclaration);
        System.out.println("initializedInBlock: " + initializedInBlock);
        System.out.println("initializedInConstructor: " + initializedInConstructor);
    }
    
    public static void main(String[] args) {
        FinalVariableInitialization example1 = new FinalVariableInitialization();
        example1.displayValues();
        
        FinalVariableInitialization example2 = new FinalVariableInitialization(2.718);
        example2.displayValues();
    }
}
```

## 三、final方法

### 3.1 final方法的定义和特点

```java
public class FinalMethodExample {
    // 普通方法
    public void normalMethod() {
        System.out.println("这是普通方法，可以被重写");
    }
    
    // final方法 - 不能被子类重写
    public final void finalMethod() {
        System.out.println("这是final方法，不能被重写");
    }
    
    // private方法默认是final的（虽然不能使用final修饰符）
    private void privateMethod() {
        System.out.println("私有方法，不能被重写");
    }
    
    // static方法默认是final的（虽然不能使用final修饰符）
    public static void staticMethod() {
        System.out.println("静态方法，不能被重写");
    }
}

class SubClass extends FinalMethodExample {
    @Override
    public void normalMethod() {
        System.out.println("重写了父类的普通方法");
    }
    
    // 以下代码会编译错误：
    // @Override
    // public final void finalMethod() { // 编译错误：Cannot override the final method from FinalMethodExample
    //     System.out.println("尝试重写final方法");
    // }
    
    public void testInheritance() {
        finalMethod(); // 可以调用，但不能重写
        normalMethod(); // 调用重写后的方法
    }
}

public class FinalMethodDemo {
    public static void main(String[] args) {
        FinalMethodExample parent = new FinalMethodExample();
        parent.finalMethod();
        parent.normalMethod();
        
        SubClass child = new SubClass();
        child.testInheritance();
        child.finalMethod(); // 调用父类的final方法
    }
}
```

### 3.2 final方法的应用场景

```java
// 模板方法模式中使用final
abstract class GameTemplate {
    // 模板方法，定义算法骨架
    public final void playGame() {
        initialize();
        startPlay();
        endPlay();
    }
    
    // 具体方法
    private void initialize() {
        System.out.println("游戏初始化...");
    }
    
    // 抽象方法，子类必须实现
    abstract void startPlay();
    abstract void endPlay();
}

class Cricket extends GameTemplate {
    @Override
    void startPlay() {
        System.out.println("板球游戏开始，开始击球和投球");
    }
    
    @Override
    void endPlay() {
        System.out.println("板球游戏结束");
    }
}

class Football extends GameTemplate {
    @Override
    void startPlay() {
        System.out.println("足球游戏开始，开始运球和射门");
    }
    
    @Override
    void endPlay() {
        System.out.println("足球游戏结束");
    }
}

public class FinalMethodUseCase {
    public static void main(String[] args) {
        GameTemplate cricket = new Cricket();
        cricket.playGame();
        
        System.out.println();
        
        GameTemplate football = new Football();
        football.playGame();
    }
}
```

## 四、final类

### 4.1 final类的定义和特点

```java
// final类 - 不能被继承
final class FinalClassExample {
    private final String name;
    private final int value;
    
    public FinalClassExample(String name, int value) {
        this.name = name;
        this.value = value;
    }
    
    public String getName() {
        return name;
    }
    
    public int getValue() {
        return value;
    }
    
    public final void displayInfo() {
        System.out.println("Final类实例: " + name + ", " + value);
    }
}

// 以下代码会编译错误：
// class SubOfFinalClass extends FinalClassExample { // 编译错误：Cannot extend final 'FinalClassExample'
//     public SubOfFinalClass(String name, int value) {
//         super(name, value);
//     }
// }

public class FinalClassDemo {
    public static void main(String[] args) {
        FinalClassExample finalObj = new FinalClassExample("Test", 100);
        finalObj.displayInfo();
    }
}
```

### 4.2 Java标准库中的final类

```java
public class StandardFinalClasses {
    public static void demonstrateStandardFinalClasses() {
        // String类是final的
        String str = "Hello";
        System.out.println("String: " + str);
        
        // Integer类是final的
        Integer num = 42;
        System.out.println("Integer: " + num);
        
        // System类是final的
        System.out.println("Current time: " + System.currentTimeMillis());
        
        // Math类是final的
        double result = Math.sqrt(16);
        System.out.println("Square root of 16: " + result);
    }
    
    public static void main(String[] args) {
        demonstrateStandardFinalClasses();
    }
}
```

## 五、不可变对象

### 5.1 创建不可变对象的原则

```java
// 不可变类示例
final class ImmutablePerson {
    private final String name;
    private final int age;
    private final String[] hobbies; // 注意：需要特殊处理
    
    public ImmutablePerson(String name, int age, String[] hobbies) {
        this.name = name;
        this.age = age;
        // 创建副本以防止外部修改
        this.hobbies = hobbies != null ? hobbies.clone() : null;
    }
    
    // 只提供getter方法，不提供setter方法
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    // 返回数组副本，防止外部修改
    public String[] getHobbies() {
        return hobbies != null ? hobbies.clone() : null;
    }
    
    // 或者返回不可变集合
    public java.util.List<String> getHobbiesAsList() {
        return hobbies != null ? 
            java.util.Collections.unmodifiableList(java.util.Arrays.asList(hobbies)) : 
            java.util.Collections.emptyList();
    }
    
    @Override
    public String toString() {
        return "ImmutablePerson{name='" + name + "', age=" + age + 
               ", hobbies=" + java.util.Arrays.toString(hobbies) + "}";
    }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        
        ImmutablePerson that = (ImmutablePerson) obj;
        return age == that.age &&
               java.util.Objects.equals(name, that.name) &&
               java.util.Arrays.equals(hobbies, that.hobbies);
    }
    
    @Override
    public int hashCode() {
        return java.util.Objects.hash(name, age, java.util.Arrays.hashCode(hobbies));
    }
}

public class ImmutableObjectDemo {
    public static void main(String[] args) {
        String[] hobbies = {"Reading", "Swimming"};
        ImmutablePerson person = new ImmutablePerson("张三", 25, hobbies);
        
        System.out.println("原始对象: " + person);
        
        // 尝试修改外部数组
        hobbies[0] = "Running";
        System.out.println("修改外部数组后: " + person);
        
        // 获取hobbies数组并尝试修改
        String[] retrievedHobbies = person.getHobbies();
        if (retrievedHobbies != null) {
            retrievedHobbies[0] = "Cycling"; // 这不会影响原始对象
        }
        System.out.println("修改返回的数组后: " + person);
    }
}
```

### 5.2 不可变对象的优点

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

// 展示不可变对象的线程安全性
final class ImmutableCounter {
    private final int value;
    
    public ImmutableCounter(int value) {
        this.value = value;
    }
    
    public int getValue() {
        return value;
    }
    
    // 返回新对象而不是修改当前对象
    public ImmutableCounter increment() {
        return new ImmutableCounter(value + 1);
    }
    
    public ImmutableCounter add(int amount) {
        return new ImmutableCounter(value + amount);
    }
    
    @Override
    public String toString() {
        return "ImmutableCounter{value=" + value + "}";
    }
}

public class ImmutableAdvantages {
    public static void demonstrateThreadSafety() {
        final ImmutableCounter counter = new ImmutableCounter(0);
        ExecutorService executor = Executors.newFixedThreadPool(5);
        
        // 多个线程同时访问同一个不可变对象是安全的
        for (int i = 0; i < 5; i++) {
            executor.submit(() -> {
                ImmutableCounter localCounter = counter;
                for (int j = 0; j < 100; j++) {
                    localCounter = localCounter.increment();
                }
                System.out.println(Thread.currentThread().getName() + ": " + localCounter);
            });
        }
        
        executor.shutdown();
        try {
            executor.awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    public static void demonstrateCaching() {
        // 不可变对象可以被安全地缓存
        ImmutableCounter zero = new ImmutableCounter(0);
        ImmutableCounter one = new ImmutableCounter(1);
        
        // 由于对象不可变，可以安全地重用
        java.util.Map<Integer, ImmutableCounter> cache = new java.util.HashMap<>();
        cache.put(0, zero);
        cache.put(1, one);
        
        System.out.println("从缓存获取: " + cache.get(0));
    }
    
    public static void main(String[] args) {
        System.out.println("=== 线程安全性演示 ===");
        demonstrateThreadSafety();
        
        System.out.println("\n=== 缓存演示 ===");
        demonstrateCaching();
    }
}
```

## 六、final与线程安全

### 6.1 final字段的内存语义

```java
class FinalFieldExample {
    // 普通字段
    private int normalField;
    
    // final字段
    private final int finalField;
    
    // 对象引用
    private final String[] stringArray;
    
    public FinalFieldExample(int finalValue, String[] array) {
        this.normalField = 100; // 普通字段赋值
        this.finalField = finalValue; // final字段赋值
        this.stringArray = array; // final引用赋值
        
        // 在构造函数中，final字段的写入对所有线程都是可见的
        // 这是Java内存模型的保证
    }
    
    public int getNormalField() {
        return normalField;
    }
    
    public int getFinalField() {
        return finalField;
    }
    
    public String[] getStringArray() {
        return stringArray.clone(); // 返回副本以维护不可变性
    }
}

public class FinalMemorySemantics {
    public static void main(String[] args) throws InterruptedException {
        // 创建FinalFieldExample实例
        FinalFieldExample example = new FinalFieldExample(42, new String[]{"A", "B"});
        
        // 多线程访问
        Thread thread1 = new Thread(() -> {
            System.out.println("Thread1 - finalField: " + example.getFinalField());
            System.out.println("Thread1 - normalField: " + example.getNormalField());
        });
        
        Thread thread2 = new Thread(() -> {
            System.out.println("Thread2 - finalField: " + example.getFinalField());
            System.out.println("Thread2 - normalField: " + example.getNormalField());
        });
        
        thread1.start();
        thread2.start();
        
        thread1.join();
        thread2.join();
    }
}
```

### 6.2 final与单例模式

```java
// 使用final实现线程安全的单例模式
class FinalSingleton {
    // 使用final确保实例一旦创建就不会被修改
    private static final FinalSingleton INSTANCE = new FinalSingleton();
    
    private FinalSingleton() {
        // 私有构造函数
    }
    
    public static FinalSingleton getInstance() {
        return INSTANCE;
    }
    
    public void doSomething() {
        System.out.println("执行单例方法");
    }
}

// 懒加载单例模式（使用内部类）
class LazyFinalSingleton {
    private LazyFinalSingleton() {}
    
    // 静态内部类，利用类加载机制保证线程安全
    private static class SingletonHolder {
        // final确保实例一旦创建就不会被修改
        private static final LazyFinalSingleton INSTANCE = new LazyFinalSingleton();
    }
    
    public static LazyFinalSingleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
    
    public void doSomething() {
        System.out.println("执行懒加载单例方法");
    }
}

public class FinalSingletonDemo {
    public static void main(String[] args) {
        // 饿饿汉式单例
        FinalSingleton singleton1 = FinalSingleton.getInstance();
        FinalSingleton singleton2 = FinalSingleton.getInstance();
        System.out.println("饿汉式单例是否相同: " + (singleton1 == singleton2));
        
        // 懒加载单例
        LazyFinalSingleton lazy1 = LazyFinalSingleton.getInstance();
        LazyFinalSingleton lazy2 = LazyFinalSingleton.getInstance();
        System.out.println("懒加载单例是否相同: " + (lazy1 == lazy2));
        
        singleton1.doSomething();
        lazy1.doSomething();
    }
}
```

## 七、final关键字的最佳实践

### 7.1 参数中的final

```java
public class FinalParameterExample {
    // 使用final参数防止在方法内部修改参数引用
    public void processList(final java.util.List<String> list) {
        // list = new ArrayList<>(); // 编译错误：不能修改final参数
        list.add("New Item"); // 可以修改对象内容，但不能改变引用
    }
    
    // 使用final参数提高代码可读性
    public int calculate(final int a, final int b) {
        // a = 10; // 编译错误：不能修改final参数
        // b = 20; // 编译错误：不能修改final参数
        return a + b;
    }
    
    // 在Lambda表达式中的应用
    public void demonstrateLambdaWithFinal() {
        final String finalVariable = "Hello";
        String normalVariable = "World"; // 在Java 8+中，effectively final也可以
        
        java.util.List<String> list = java.util.Arrays.asList("A", "B", "C");
        list.forEach(item -> {
            // item是隐式final的（不能修改）
            System.out.println(finalVariable + " " + normalVariable + " " + item);
        });
    }
    
    public static void main(String[] args) {
        FinalParameterExample example = new FinalParameterExample();
        java.util.List<String> myList = new java.util.ArrayList<>();
        example.processList(myList);
        System.out.println("处理后的列表: " + myList);
        
        int result = example.calculate(5, 3);
        System.out.println("计算结果: " + result);
        
        example.demonstrateLambdaWithFinal();
    }
}
```

### 7.2 final字段的初始化模式

```java
public class FinalInitializationPatterns {
    // 模式1：声明时初始化
    private final int IMMEDIATE_INIT = 100;
    
    // 模式2：实例初始化块
    private final String BLOCK_INIT;
    
    {
        BLOCK_INIT = "Initialized in block: " + System.currentTimeMillis();
    }
    
    // 模式3：构造函数初始化
    private final double CONSTRUCTOR_INIT;
    
    public FinalInitializationPatterns() {
        this.CONSTRUCTOR_INIT = Math.random() * 100;
    }
    
    // 模式4：条件初始化
    private final String CONDITIONAL_INIT;
    
    public FinalInitializationPatterns(boolean condition) {
        if (condition) {
            this.CONDITIONAL_INIT = "Condition is true";
            this.CONSTRUCTOR_INIT = 1.0;
        } else {
            this.CONDITIONAL_INIT = "Condition is false";
            this.CONSTRUCTOR_INIT = 2.0;
        }
    }
    
    // 模式5：工厂方法模式
    private final java.util.function.Supplier<String> LAZY_INIT;
    
    private FinalInitializationPatterns(java.util.function.Supplier<String> supplier) {
        this.LAZY_INIT = supplier;
        this.CONSTRUCTOR_INIT = 3.0;
    }
    
    public static FinalInitializationPatterns createWithLazyInit(java.util.function.Supplier<String> supplier) {
        return new FinalInitializationPatterns(supplier);
    }
    
    public void displayValues() {
        System.out.println("IMMEDIATE_INIT: " + IMMEDIATE_INIT);
        System.out.println("BLOCK_INIT: " + BLOCK_INIT);
        System.out.println("CONSTRUCTOR_INIT: " + CONSTRUCTOR_INIT);
        System.out.println("CONDITIONAL_INIT: " + CONDITIONAL_INIT);
        if (LAZY_INIT != null) {
            System.out.println("LAZY_INIT: " + LAZY_INIT.get());
        }
    }
    
    public static void main(String[] args) {
        FinalInitializationPatterns obj1 = new FinalInitializationPatterns();
        System.out.println("=== 默认构造函数 ===");
        obj1.displayValues();
        
        FinalInitializationPatterns obj2 = new FinalInitializationPatterns(true);
        System.out.println("\n=== 条件构造函数(true) ===");
        obj2.displayValues();
        
        FinalInitializationPatterns obj3 = new FinalInitializationPatterns(false);
        System.out.println("\n=== 条件构造函数(false) ===");
        obj3.displayValues();
        
        FinalInitializationPatterns obj4 = FinalInitializationPatterns.createWithLazyInit(() -> "Lazy initialized at: " + System.currentTimeMillis());
        System.out.println("\n=== 工厂方法模式 ===");
        obj4.displayValues();
    }
}
```

## 八、常见误区和注意事项

### 8.1 常见误区

```java
public class FinalCommonMistakes {
    // 误区1：认为final对象的内容也不能修改
    public void demonstrateReferenceVsContent() {
        final java.util.List<String> list = new java.util.ArrayList<>();
        
        // 这是可以的：修改对象内容
        list.add("Item 1");
        list.add("Item 2");
        System.out.println("List内容: " + list);
        
        // 这是不行的：改变引用
        // list = new java.util.ArrayList<>(); // 编译错误
    }
    
    // 误区2：认为final方法可以被重载
    public final void method(int param) {
        System.out.println("final方法接受int参数");
    }
    
    // 这是可以的：重载（不是重写）
    public final void method(String param) {
        System.out.println("final方法接受String参数");
    }
    
    // 误区3：认为final类中的所有方法都是final的
    public void nonFinalMethodInFinalClass() {
        System.out.println("这个方法不是final的");
    }
}

// 误区4：在构造函数中可以修改final字段
class FinalFieldAssignment {
    private final int value;
    
    public FinalFieldAssignment() {
        // 在构造函数中可以赋值给final字段
        this.value = 42;
    }
    
    // 但是不能在其他方法中修改
    // public void setValue(int newValue) {
    //     this.value = newValue; // 编译错误
    // }
    
    public int getValue() {
        return value;
    }
}

public class FinalMistakesDemo {
    public static void main(String[] args) {
        FinalCommonMistakes example = new FinalCommonMistakes();
        example.demonstrateReferenceVsContent();
        
        FinalFieldAssignment obj = new FinalFieldAssignment();
        System.out.println("Final字段值: " + obj.getValue());
    }
}
```

### 8.2 性能考虑

```java
public class FinalPerformanceConsiderations {
    // final字段可能被JVM优化
    private final int finalField = 100;
    private int normalField = 100;
    
    // final方法可能被内联优化
    public final int finalMethod() {
        return finalField * 2;
    }
    
    public int normalMethod() {
        return normalField * 2;
    }
    
    public static void performanceTest() {
        FinalPerformanceConsiderations obj = new FinalPerformanceConsiderations();
        int iterations = 10_000_000;
        
        // 测试final方法性能
        long start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            obj.finalMethod();
        }
        long finalTime = System.nanoTime() - start;
        
        // 测试普通方法性能
        start = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            obj.normalMethod();
        }
        long normalTime = System.nanoTime() - start;
        
        System.out.println("Final方法调用时间: " + finalTime / 1_000_000.0 + " ms");
        System.out.println("普通方法调用时间: " + normalTime / 1_000_000.0 + " ms");
    }
    
    public static void main(String[] args) {
        performanceTest();
    }
}
```

## 九、设计模式中的应用

### 9.1 不可变对象模式

```java
// 使用Builder模式创建不可变对象
final class ImmutablePersonWithBuilder {
    private final String firstName;
    private final String lastName;
    private final int age;
    private final String email;
    
    private ImmutablePersonWithBuilder(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
        this.email = builder.email;
    }
    
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public int getAge() { return age; }
    public String getEmail() { return email; }
    
    public static class Builder {
        private String firstName;
        private String lastName;
        private int age;
        private String email;
        
        public Builder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public Builder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public ImmutablePersonWithBuilder build() {
            // 验证必要字段
            if (firstName == null || lastName == null) {
                throw new IllegalArgumentException("First name and last name are required");
            }
            return new ImmutablePersonWithBuilder(this);
        }
    }
    
    @Override
    public String toString() {
        return "ImmutablePersonWithBuilder{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", age=" + age +
                ", email='" + email + '\'' +
                '}';
    }
}

public class ImmutablePatternDemo {
    public static void main(String[] args) {
        ImmutablePersonWithBuilder person = new ImmutablePersonWithBuilder.Builder()
                .firstName("张")
                .lastName("三")
                .age(25)
                .email("zhangsan@example.com")
                .build();
        
        System.out.println("创建的不可变对象: " + person);
        
        // 尝试修改（实际上是创建新对象）
        ImmutablePersonWithBuilder person2 = new ImmutablePersonWithBuilder.Builder()
                .firstName(person.getFirstName())
                .lastName(person.getLastName())
                .age(person.getAge() + 1) // 年龄加1
                .email(person.getEmail())
                .build();
        
        System.out.println("修改后的对象: " + person2);
    }
}
```

## 十、总结

Java [final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字是一个强大而重要的特性，它提供了以下功能：

1. **final变量**：创建不可变的变量，提供编译时安全检查
2. **final方法**：防止方法被重写，确保核心逻辑不被修改
3. **final类**：防止类被继承，保护类的完整性

使用[final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字的注意事项：
- final变量必须在声明时或构造函数中初始化
- final引用变量的内容可以修改，但引用本身不能改变
- final方法不能被重写，但可以被重载
- final类不能被继承
- final字段有助于线程安全和JVM优化

掌握[final](file:///E:/Code/backend/lyk-blogs-hexo/../../Java/Java8Features/src/main/java/com/dunshan/final_/FinalExample.java#L10-L10)关键字的正确用法，能够帮助开发者编写出更加安全、稳定和高效的Java程序。