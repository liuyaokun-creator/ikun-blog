---
title: Java泛型的详细讲解：从基础语法到高级应用全解析
date: 2024-07-10
tags: [Java, 泛型, Generic, 类型安全, 类型擦除, 泛型方法]
categories: [Java, 核心特性]
updated: 2024-07-10
---

在Java编程中，泛型（Generic）是一个非常重要的特性，它提供了编译时的类型安全检查，使得代码更加安全、可读和可维护。Java泛型的引入解决了在Java 5之前类型安全问题，让开发者能够在编译时发现类型错误，而不是在运行时。本文将从**泛型基础、泛型类、泛型接口、泛型方法、类型擦除、通配符、泛型约束**等多个维度，全面解析Java泛型的核心机制。

# Java泛型的详细讲解：从基础语法到高级应用全解析

## 一、泛型概述

### 1.1 泛型的概念和作用

泛型是Java 5引入的一个重要特性，它允许在定义类、接口和方法时使用类型参数。泛型的主要作用包括：

- **类型安全**：在编译时进行类型检查，避免运行时的ClassCastException
- **代码复用**：使用单一的实现来处理多种数据类型
- **减少类型转换**：避免显式的类型转换

### 1.2 泛型的简单示例

```java
import java.util.ArrayList;
import java.util.List;

public class GenericOverview {
    public static void main(String[] args) {
        // 使用泛型前（Java 5之前）
        List legacyList = new ArrayList();
        legacyList.add("Hello");
        legacyList.add(123);
        
        String str1 = (String) legacyList.get(0); // 需要强制类型转换
        Integer num1 = (Integer) legacyList.get(1);
        
        // 使用泛型后
        List<String> genericList = new ArrayList<>();
        genericList.add("Hello");
        // genericList.add(123); // 编译错误，类型安全
        
        String str2 = genericList.get(0); // 无需强制类型转换
        System.out.println("泛型列表内容: " + str2);
    }
}
```

## 二、泛型类

### 2.1 泛型类的定义和使用

```java
// 泛型类的定义
class GenericBox<T> {
    private T value;
    
    public GenericBox() {
        this.value = null;
    }
    
    public GenericBox(T value) {
        this.value = value;
    }
    
    public T getValue() {
        return value;
    }
    
    public void setValue(T value) {
        this.value = value;
    }
    
    public void displayType() {
        System.out.println("值的类型是: " + value.getClass().getName());
    }
}

// 多个类型参数的泛型类
class GenericPair<T, U> {
    private T first;
    private U second;
    
    public GenericPair(T first, U second) {
        this.first = first;
        this.second = second;
    }
    
    public T getFirst() {
        return first;
    }
    
    public U getSecond() {
        return second;
    }
    
    public void setFirst(T first) {
        this.first = first;
    }
    
    public void setSecond(U second) {
        this.second = second;
    }
    
    @Override
    public String toString() {
        return "GenericPair{first=" + first + ", second=" + second + "}";
    }
}

public class GenericClassDemo {
    public static void main(String[] args) {
        // 使用String类型的泛型类
        GenericBox<String> stringBox = new GenericBox<>("Hello World");
        System.out.println("字符串盒子: " + stringBox.getValue());
        stringBox.displayType();
        
        // 使用Integer类型的泛型类
        GenericBox<Integer> intBox = new GenericBox<>(42);
        System.out.println("整数盒子: " + intBox.getValue());
        intBox.displayType();
        
        // 使用多类型参数的泛型类
        GenericPair<String, Integer> pair = new GenericPair<>("Age", 25);
        System.out.println("键值对: " + pair);
        
        GenericPair<Double, Boolean> anotherPair = new GenericPair<>(3.14, true);
        System.out.println("另一个键值对: " + anotherPair);
    }
}
```

### 2.2 泛型类的继承

```java
// 泛型基类
class Container<T> {
    protected T item;
    
    public Container(T item) {
        this.item = item;
    }
    
    public T getItem() {
        return item;
    }
    
    public void setItem(T item) {
        this.item = item;
    }
}

// 继承泛型类 - 指定具体类型
class StringContainer extends Container<String> {
    public StringContainer(String item) {
        super(item);
    }
    
    public void printLength() {
        if (item != null) {
            System.out.println("字符串长度: " + item.length());
        }
    }
}

// 继承泛型类 - 保持泛型
class ExtendedContainer<T> extends Container<T> {
    private String description;
    
    public ExtendedContainer(T item, String description) {
        super(item);
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
}

public class GenericInheritanceDemo {
    public static void main(String[] args) {
        StringContainer strContainer = new StringContainer("Hello Inheritance");
        System.out.println("容器内容: " + strContainer.getItem());
        strContainer.printLength();
        
        ExtendedContainer<Double> extendedContainer = new ExtendedContainer<>(3.14159, "Pi value");
        System.out.println("扩展容器: " + extendedContainer.getItem() + ", 描述: " + extendedContainer.getDescription());
    }
}
```

## 三、泛型接口

### 3.1 泛型接口的定义和实现

```java
// 泛型接口定义
interface GenericProcessor<T> {
    T process(T input);
    boolean validate(T input);
}

// 实现泛型接口 - 指定具体类型
class StringProcessor implements GenericProcessor<String> {
    @Override
    public String process(String input) {
        return input.toUpperCase();
    }
    
    @Override
    public boolean validate(String input) {
        return input != null && !input.trim().isEmpty();
    }
}

// 实现泛型接口 - 保持泛型
class NumberProcessor<T extends Number> implements GenericProcessor<T> {
    @Override
    public T process(T input) {
        // 这里需要根据具体类型进行处理
        System.out.println("处理数字: " + input);
        return input;
    }
    
    @Override
    public boolean validate(T input) {
        return input != null && input.doubleValue() >= 0;
    }
}

// 多个类型参数的泛型接口
interface GenericConverter<F, T> {
    T convert(F from);
    Class<F> getSourceType();
    Class<T> getTargetType();
}

class StringToIntegerConverter implements GenericConverter<String, Integer> {
    @Override
    public Integer convert(String from) {
        try {
            return Integer.parseInt(from);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
    
    @Override
    public Class<String> getSourceType() {
        return String.class;
    }
    
    @Override
    public Class<Integer> getTargetType() {
        return Integer.class;
    }
}

public class GenericInterfaceDemo {
    public static void main(String[] args) {
        StringProcessor stringProc = new StringProcessor();
        String result = stringProc.process("hello world");
        System.out.println("处理结果: " + result);
        System.out.println("验证结果: " + stringProc.validate("test"));
        
        NumberProcessor<Integer> numberProc = new NumberProcessor<>();
        Integer numResult = numberProc.process(42);
        System.out.println("数字处理结果: " + numResult);
        
        StringToIntegerConverter converter = new StringToIntegerConverter();
        Integer converted = converter.convert("123");
        System.out.println("转换结果: " + converted);
        System.out.println("源类型: " + converter.getSourceType().getSimpleName());
        System.out.println("目标类型: " + converter.getTargetType().getSimpleName());
    }
}
```

## 四、泛型方法

### 4.1 泛型方法的定义和使用

```java
import java.util.Arrays;

public class GenericMethodExample {
    // 简单的泛型方法
    public static <T> void swap(T[] array, int i, int j) {
        if (i >= 0 && i < array.length && j >= 0 && j < array.length) {
            T temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    
    // 带有多个类型参数的泛型方法
    public static <T, U> void printPair(T first, U second) {
        System.out.println("第一项: " + first + ", 第二项: " + second);
    }
    
    // 有返回值的泛型方法
    public static <T> T getMiddle(T[] array) {
        if (array == null || array.length == 0) {
            return null;
        }
        return array[array.length / 2];
    }
    
    // 泛型方法与类型约束
    public static <T extends Comparable<T>> T findMax(T[] array) {
        if (array == null || array.length == 0) {
            return null;
        }
        
        T max = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i].compareTo(max) > 0) {
                max = array[i];
            }
        }
        return max;
    }
    
    // 泛型方法与泛型类结合
    public static class UtilClass {
        public <T> void printArray(T[] array) {
            System.out.print("数组内容: [");
            for (int i = 0; i < array.length; i++) {
                System.out.print(array[i]);
                if (i < array.length - 1) {
                    System.out.print(", ");
                }
            }
            System.out.println("]");
        }
        
        public <T> int countOccurrences(T[] array, T target) {
            int count = 0;
            for (T element : array) {
                if (element != null && element.equals(target)) {
                    count++;
                }
            }
            return count;
        }
    }
    
    public static void main(String[] args) {
        // 测试swap方法
        String[] stringArray = {"A", "B", "C", "D"};
        System.out.println("交换前: " + Arrays.toString(stringArray));
        swap(stringArray, 0, 3);
        System.out.println("交换后: " + Arrays.toString(stringArray));
        
        // 测试printPair方法
        printPair("Name", 25);
        printPair(3.14, true);
        
        // 测试getMiddle方法
        String[] middleArray = {"First", "Middle", "Last"};
        System.out.println("中间元素: " + getMiddle(middleArray));
        
        // 测试findMax方法
        Integer[] numbers = {5, 2, 8, 1, 9, 3};
        System.out.println("最大值: " + findMax(numbers));
        
        String[] words = {"apple", "banana", "cherry", "date"};
        System.out.println("最大字符串: " + findMax(words));
        
        // 测试泛型类中的泛型方法
        UtilClass util = new UtilClass();
        util.printArray(new String[]{"Hello", "World", "Generic"});
        
        String[] testArray = {"A", "B", "A", "C", "A"};
        int occurrences = util.countOccurrences(testArray, "A");
        System.out.println("'A'的出现次数: " + occurrences);
    }
}
```

### 4.2 泛型方法的类型推断

```java
import java.util.ArrayList;
import java.util.List;

public class GenericMethodInference {
    // 泛型方法，类型可以被自动推断
    public static <T> List<T> createList(T... elements) {
        List<T> list = new ArrayList<>();
        for (T element : elements) {
            list.add(element);
        }
        return list;
    }
    
    // 返回泛型类型的工厂方法
    public static <T> T getFirstElement(List<T> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        return list.get(0);
    }
    
    // 链式调用的泛型方法
    public static <T> List<T> addElement(List<T> list, T element) {
        List<T> newList = new ArrayList<>(list);
        newList.add(element);
        return newList;
    }
    
    public static void main(String[] args) {
        // 类型自动推断
        List<String> stringList = createList("A", "B", "C");
        System.out.println("字符串列表: " + stringList);
        
        List<Integer> intList = createList(1, 2, 3, 4, 5);
        System.out.println("整数列表: " + intList);
        
        // 获取第一个元素
        String firstString = getFirstElement(stringList);
        System.out.println("第一个字符串: " + firstString);
        
        // 链式调用
        List<String> chainedList = addElement(addElement(stringList, "D"), "E");
        System.out.println("链式添加后: " + chainedList);
    }
}
```

## 五、类型擦除

### 5.1 类型擦除的概念和原理

```java
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

public class TypeErasureExample {
    public static void demonstrateTypeErasure() {
        // 在运行时，泛型信息被擦除
        List<String> stringList = new ArrayList<>();
        List<Integer> intList = new ArrayList<>();
        
        System.out.println("String List的运行时类型: " + stringList.getClass());
        System.out.println("Integer List的运行时类型: " + intList.getClass());
        System.out.println("类型是否相同: " + (stringList.getClass() == intList.getClass()));
        
        // 通过反射验证类型擦除
        try {
            Method addMethod = stringList.getClass().getMethod("add", Object.class);
            System.out.println("add方法的参数类型: " + addMethod.getParameterTypes()[0]);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // 演示类型擦除导致的桥接方法
    static class Parent<T> {
        public T getValue() {
            return null;
        }
    }
    
    static class Child extends Parent<String> {
        @Override
        public String getValue() {  // 返回类型协变
            return "Hello";
        }
    }
    
    public static void main(String[] args) {
        demonstrateTypeErasure();
        
        Child child = new Child();
        System.out.println("子类方法返回: " + child.getValue());
        
        // 验证桥接方法
        Method[] methods = Child.class.getMethods();
        for (Method method : methods) {
            if (method.getName().equals("getValue")) {
                System.out.println("方法名: " + method.getName() + 
                                 ", 返回类型: " + method.getReturnType().getSimpleName() +
                                 ", 桥接方法: " + method.isBridge());
            }
        }
    }
}
```

### 5.2 类型擦除的限制和解决方案

```java
import java.util.ArrayList;
import java.util.List;

public class TypeErasureLimitations {
    // 无法创建泛型数组（编译错误）
    // public static <T> T[] createArray(int size) {
    //     return new T[size]; // 编译错误
    // }
    
    // 解决方案1：使用反射创建数组
    @SuppressWarnings("unchecked")
    public static <T> T[] createArray(Class<T> type, int size) {
        return (T[]) java.lang.reflect.Array.newInstance(type, size);
    }
    
    // 解决方案2：使用Object数组并在使用时转换
    public static <T> List<T> createListWithSize(int size, T defaultValue) {
        List<T> list = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            list.add(defaultValue);
        }
        return list;
    }
    
    // 无法对泛型类型进行instanceof检查
    public static void checkType(Object obj) {
        // if (obj instanceof List<String>) { // 编译错误
        //     System.out.println("是String列表");
        // }
        
        // 只能检查原始类型
        if (obj instanceof List) {
            System.out.println("是List类型");
            // 但无法确定具体的泛型参数类型
        }
    }
    
    // 无法创建泛型类型的实例
    public static <T> T createInstance(Class<T> clazz) {
        try {
            return clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("无法创建实例", e);
        }
    }
    
    public static void main(String[] args) {
        // 使用反射创建数组
        String[] stringArray = createArray(String.class, 5);
        System.out.println("创建的字符串数组长度: " + stringArray.length);
        
        // 创建带默认值的列表
        List<Integer> intList = createListWithSize(3, 42);
        System.out.println("带默认值的列表: " + intList);
        
        // 类型检查
        checkType(new ArrayList<>());
        checkType("Hello");
        
        // 创建实例
        String str = createInstance(String.class);
        System.out.println("创建的String实例: '" + str + "'");
    }
}
```

## 六、通配符（Wildcard）

### 6.1 无界通配符

```java
import java.util.ArrayList;
import java.util.List;

public class UnboundedWildcardExample {
    // 使用无界通配符的方法
    public static void printList(List<?> list) {
        for (Object item : list) {
            System.out.println(item);
        }
    }
    
    // 无界通配符的限制
    public static void demonstrateWildcardLimitations() {
        List<?> wildcardList = new ArrayList<String>();
        
        // 可以读取元素（返回Object类型）
        if (!wildcardList.isEmpty()) {
            Object item = wildcardList.get(0);
            System.out.println("列表第一个元素: " + item);
        }
        
        // 不能添加元素（除了null）
        // wildcardList.add("Hello"); // 编译错误
        wildcardList.add(null); // 只有null可以添加
        
        System.out.println("列表大小: " + wildcardList.size());
    }
    
    public static void main(String[] args) {
        List<String> stringList = new ArrayList<>();
        stringList.add("Hello");
        stringList.add("World");
        
        List<Integer> intList = new ArrayList<>();
        intList.add(1);
        intList.add(2);
        intList.add(3);
        
        System.out.println("字符串列表:");
        printList(stringList);
        
        System.out.println("\n整数列表:");
        printList(intList);
        
        System.out.println("\n通配符限制演示:");
        demonstrateWildcardLimitations();
    }
}
```

### 6.2 上界通配符

```java
import java.util.ArrayList;
import java.util.List;

// 定义一个继承层次
class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public void eat() {
        System.out.println(name + " is eating");
    }
    
    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "{" + name + "}";
    }
}

class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
    
    public void bark() {
        System.out.println(name + " is barking");
    }
}

class Cat extends Animal {
    public Cat(String name) {
        super(name);
    }
    
    public void meow() {
        System.out.println(name + " is meowing");
    }
}

public class UpperBoundedWildcardExample {
    // 使用上界通配符的方法 - 只能读取，不能添加（除了null）
    public static void printAnimals(List<? extends Animal> animals) {
        for (Animal animal : animals) {
            System.out.println(animal);
            animal.eat(); // 可以调用Animal的方法
        }
    }
    
    // 计算所有动物的平均重量（假设Animal有getWeight方法）
    public static double calculateAverageWeight(List<? extends Animal> animals) {
        if (animals.isEmpty()) return 0.0;
        
        double totalWeight = 0.0;
        for (Animal animal : animals) {
            // 假设我们有一个计算重量的方法
            totalWeight += getWeight(animal);
        }
        return totalWeight / animals.size();
    }
    
    private static double getWeight(Animal animal) {
        // 简化的重量计算
        return animal.name.length() * 2.5;
    }
    
    public static void main(String[] args) {
        List<Dog> dogs = new ArrayList<>();
        dogs.add(new Dog("旺财"));
        dogs.add(new Dog("小黑"));
        
        List<Cat> cats = new ArrayList<>();
        cats.add(new Cat("咪咪"));
        cats.add(new Cat("花花"));
        
        List<Animal> mixed = new ArrayList<>();
        mixed.add(new Dog("大黄"));
        mixed.add(new Cat("小白"));
        
        System.out.println("狗狗列表:");
        printAnimals(dogs);
        
        System.out.println("\n猫咪列表:");
        printAnimals(cats);
        
        System.out.println("\n混合动物列表:");
        printAnimals(mixed);
        
        System.out.println("\n狗狗平均重量: " + calculateAverageWeight(dogs));
        System.out.println("猫咪平均重量: " + calculateAverageWeight(cats));
    }
}
```

### 6.3 下界通配符

```java
import java.util.ArrayList;
import java.util.List;

public class LowerBoundedWildcardExample {
    // 使用下界通配符的方法 - 可以添加元素，但读取受限
    public static void addAnimals(List<? super Dog> animals) {
        // 可以添加Dog及其子类型
        animals.add(new Dog("新狗狗"));
        animals.add(new Dog("另一个狗狗"));
        
        // 不能添加Animal或其父类型
        // animals.add(new Animal("普通动物")); // 编译错误
        
        // 读取时只能确定是Object类型
        for (Object obj : animals) {
            System.out.println("动物: " + obj);
        }
    }
    
    // 比较上界和下界通配符的使用场景
    public static void demonstrateBoundsUsage() {
        // 创建不同类型的列表
        List<Animal> animalList = new ArrayList<>();
        List<Dog> dogList = new ArrayList<>();
        List<Object> objectList = new ArrayList<>();
        
        System.out.println("=== 添加狗狗到Animal列表 ===");
        addAnimals(animalList); // 可以，因为Animal是Dog的父类型
        System.out.println("Animal列表大小: " + animalList.size());
        
        System.out.println("\n=== 添加狗狗到Dog列表 ===");
        addAnimals(dogList); // 可以，因为Dog是Dog本身
        System.out.println("Dog列表大小: " + dogList.size());
        
        System.out.println("\n=== 添加狗狗到Object列表 ===");
        addAnimals(objectList); // 可以，因为Object是所有类型的父类型
        System.out.println("Object列表大小: " + objectList.size());
    }
    
    public static void main(String[] args) {
        demonstrateBoundsUsage();
    }
}
```

## 七、泛型约束

### 7.1 上界约束

```java
// 使用接口作为上界约束
interface Drawable {
    void draw();
    default void display() {
        System.out.println("显示图形");
    }
}

class Circle implements Drawable {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
    @Override
    public void draw() {
        System.out.println("绘制圆形，半径: " + radius);
    }
    
    public double getArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle implements Drawable {
    private double width, height;
    
    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
    
    @Override
    public void draw() {
        System.out.println("绘制矩形，宽: " + width + ", 高: " + height);
    }
    
    public double getArea() {
        return width * height;
    }
}

public class UpperBoundConstraintExample {
    // 只接受实现Drawable接口的类型
    public static <T extends Drawable> void processDrawable(T drawable) {
        drawable.draw();
        drawable.display();
    }
    
    // 多重约束：同时继承类和实现接口
    static class NumberWrapper extends Number implements Comparable<NumberWrapper> {
        private double value;
        
        public NumberWrapper(double value) {
            this.value = value;
        }
        
        @Override
        public int intValue() {
            return (int) value;
        }
        
        @Override
        public long longValue() {
            return (long) value;
        }
        
        @Override
        public float floatValue() {
            return (float) value;
        }
        
        @Override
        public double doubleValue() {
            return value;
        }
        
        @Override
        public int compareTo(NumberWrapper other) {
            return Double.compare(this.value, other.value);
        }
        
        @Override
        public String toString() {
            return "NumberWrapper{" + value + "}";
        }
    }
    
    // 多重约束的泛型方法
    public static <T extends Number & Comparable<T>> T findMax(T a, T b) {
        return a.compareTo(b) > 0 ? a : b;
    }
    
    public static void main(String[] args) {
        Circle circle = new Circle(5.0);
        Rectangle rectangle = new Rectangle(4.0, 6.0);
        
        processDrawable(circle);
        processDrawable(rectangle);
        
        NumberWrapper num1 = new NumberWrapper(10.5);
        NumberWrapper num2 = new NumberWrapper(7.3);
        
        NumberWrapper max = findMax(num1, num2);
        System.out.println("较大的数: " + max);
        
        Integer int1 = 15;
        Integer int2 = 20;
        Integer intMax = findMax(int1, int2);
        System.out.println("较大的整数: " + intMax);
    }
}
```

### 7.2 类型参数的命名约定

```java
public class TypeParameterNaming {
    // 常见的类型参数命名约定：
    // E - Element (在集合中使用)
    // T - Type
    // K - Key
    // V - Value
    // N - Number
    // ? - 通配符
    
    // 使用E表示元素类型
    interface List<E> {
        void add(E element);
        E get(int index);
    }
    
    // 使用K和V表示键值对
    interface Map<K, V> {
        V put(K key, V value);
        V get(K key);
    }
    
    // 使用T表示一般类型
    class GenericBox<T> {
        private T content;
        
        public GenericBox(T content) {
            this.content = content;
        }
        
        public T getContent() {
            return content;
        }
    }
    
    // 使用N表示数字类型
    class NumericProcessor<N extends Number> {
        public double calculateSquare(N number) {
            return Math.pow(number.doubleValue(), 2);
        }
    }
    
    public static void main(String[] args) {
        // 示例使用
        GenericBox<String> stringBox = new GenericBox<>("Hello");
        System.out.println("盒子内容: " + stringBox.getContent());
        
        NumericProcessor<Integer> intProcessor = new NumericProcessor<>();
        System.out.println("5的平方: " + intProcessor.calculateSquare(5));
        
        NumericProcessor<Double> doubleProcessor = new NumericProcessor<>();
        System.out.println("2.5的平方: " + doubleProcessor.calculateSquare(2.5));
    }
}
```

## 八、泛型的实际应用

### 8.1 泛型在集合框架中的应用

```java
import java.util.*;

public class GenericInCollections {
    public static void demonstrateGenericCollections() {
        // List的泛型使用
        List<String> names = new ArrayList<>();
        names.add("张三");
        names.add("李四");
        names.add("王五");
        
        System.out.println("名字列表: " + names);
        
        // Set的泛型使用
        Set<Integer> uniqueNumbers = new HashSet<>();
        uniqueNumbers.add(1);
        uniqueNumbers.add(2);
        uniqueNumbers.add(2); // 重复元素会被忽略
        uniqueNumbers.add(3);
        
        System.out.println("唯一数字集合: " + uniqueNumbers);
        
        // Map的泛型使用
        Map<String, Integer> ageMap = new HashMap<>();
        ageMap.put("张三", 25);
        ageMap.put("李四", 30);
        ageMap.put("王五", 28);
        
        System.out.println("年龄映射: " + ageMap);
        
        // Queue的泛型使用
        Queue<String> taskQueue = new LinkedList<>();
        taskQueue.offer("任务1");
        taskQueue.offer("任务2");
        taskQueue.offer("任务3");
        
        System.out.println("队列头部: " + taskQueue.peek());
        while (!taskQueue.isEmpty()) {
            System.out.println("处理任务: " + taskQueue.poll());
        }
    }
    
    public static void demonstrateGenericAlgorithms() {
        List<Integer> numbers = Arrays.asList(5, 2, 8, 1, 9, 3);
        System.out.println("原始列表: " + numbers);
        
        // 排序
        Collections.sort(numbers);
        System.out.println("排序后: " + numbers);
        
        // 查找
        int index = Collections.binarySearch(numbers, 8);
        System.out.println("数字8的索引: " + index);
        
        // 反转
        Collections.reverse(numbers);
        System.out.println("反向后: " + numbers);
        
        // 洗牌
        Collections.shuffle(numbers);
        System.out.println("洗牌后: " + numbers);
    }
    
    public static void main(String[] args) {
        System.out.println("=== 集合框架中的泛型 ===");
        demonstrateGenericCollections();
        
        System.out.println("\n=== 泛型算法 ===");
        demonstrateGenericAlgorithms();
    }
}
```

### 8.2 泛型在设计模式中的应用

```java
// 泛型工厂模式
interface Product {
    void use();
}

class ConcreteProductA implements Product {
    @Override
    public void use() {
        System.out.println("使用产品A");
    }
}

class ConcreteProductB implements Product {
    @Override
    public void use() {
        System.out.println("使用产品B");
    }
}

interface ProductFactory<T extends Product> {
    T createProduct();
}

class ConcreteFactoryA implements ProductFactory<ConcreteProductA> {
    @Override
    public ConcreteProductA createProduct() {
        return new ConcreteProductA();
    }
}

class ConcreteFactoryB implements ProductFactory<ConcreteProductB> {
    @Override
    public ConcreteProductB createProduct() {
        return new ConcreteProductB();
    }
}

// 泛型观察者模式
interface Observer<T> {
    void update(T data);
}

interface Subject<T> {
    void addObserver(Observer<T> observer);
    void removeObserver(Observer<T> observer);
    void notifyObservers(T data);
}

class GenericSubject<T> implements Subject<T> {
    private List<Observer<T>> observers = new ArrayList<>();
    
    @Override
    public void addObserver(Observer<T> observer) {
        observers.add(observer);
    }
    
    @Override
    public void removeObserver(Observer<T> observer) {
        observers.remove(observer);
    }
    
    @Override
    public void notifyObservers(T data) {
        for (Observer<T> observer : observers) {
            observer.update(data);
        }
    }
}

class StringObserver implements Observer<String> {
    private String name;
    
    public StringObserver(String name) {
        this.name = name;
    }
    
    @Override
    public void update(String data) {
        System.out.println(name + " 收到消息: " + data);
    }
}

public class GenericDesignPatterns {
    public static void demonstrateFactoryPattern() {
        ProductFactory<ConcreteProductA> factoryA = new ConcreteFactoryA();
        ProductFactory<ConcreteProductB> factoryB = new ConcreteFactoryB();
        
        Product productA = factoryA.createProduct();
        Product productB = factoryB.createProduct();
        
        productA.use();
        productB.use();
    }
    
    public static void demonstrateObserverPattern() {
        GenericSubject<String> subject = new GenericSubject<>();
        
        Observer<String> observer1 = new StringObserver("观察者1");
        Observer<String> observer2 = new StringObserver("观察者2");
        
        subject.addObserver(observer1);
        subject.addObserver(observer2);
        
        subject.notifyObservers("Hello Observers!");
        
        subject.removeObserver(observer1);
        subject.notifyObservers("After removing observer1");
    }
    
    public static void main(String[] args) {
        System.out.println("=== 泛型工厂模式 ===");
        demonstrateFactoryPattern();
        
        System.out.println("\n=== 泛型观察者模式 ===");
        demonstrateObserverPattern();
    }
}
```

## 九、泛型的高级特性

### 9.1 递归类型限定

```java
// 递归类型限定的例子：实现可比较的实体
abstract class Entity<T extends Entity<T>> implements Comparable<T> {
    protected String id;
    
    public Entity(String id) {
        this.id = id;
    }
    
    public String getId() {
        return id;
    }
    
    @Override
    public int compareTo(T other) {
        return this.id.compareTo(other.getId());
    }
    
    // 一个返回相同类型的方法
    public abstract T copy();
}

class User extends Entity<User> {
    private String name;
    private int age;
    
    public User(String id, String name, int age) {
        super(id);
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    @Override
    public User copy() {
        return new User(this.id, this.name, this.age);
    }
    
    @Override
    public String toString() {
        return "User{id='" + id + "', name='" + name + "', age=" + age + "}";
    }
}

class Product extends Entity<Product> {
    private String name;
    private double price;
    
    public Product(String id, String name, double price) {
        super(id);
        this.name = name;
        this.price = price;
    }
    
    public String getName() {
        return name;
    }
    
    public double getPrice() {
        return price;
    }
    
    @Override
    public Product copy() {
        return new Product(this.id, this.name, this.price);
    }
    
    @Override
    public String toString() {
        return "Product{id='" + id + "', name='" + name + "', price=" + price + "}";
    }
}

public class RecursiveTypeBounds {
    // 使用递归类型限定的方法
    public static <T extends Entity<T>> void sortEntities(List<T> entities) {
        Collections.sort(entities);
    }
    
    public static void main(String[] args) {
        List<User> users = new ArrayList<>();
        users.add(new User("003", "张三", 25));
        users.add(new User("001", "李四", 30));
        users.add(new User("002", "王五", 28));
        
        System.out.println("排序前的用户: " + users);
        sortEntities(users);
        System.out.println("排序后的用户: " + users);
        
        List<Product> products = new ArrayList<>();
        products.add(new Product("P003", "笔记本", 5000.0));
        products.add(new Product("P001", "手机", 3000.0));
        products.add(new Product("P002", "平板", 2000.0));
        
        System.out.println("\n排序前的产品: " + products);
        sortEntities(products);
        System.out.println("排序后的产品: " + products);
    }
}
```

### 9.2 泛型方法的重载

```java
public class GenericMethodOverloading {
    // 不同类型参数的泛型方法
    public static <T> void process(T item) {
        System.out.println("处理单个项目: " + item + " (类型: " + item.getClass().getSimpleName() + ")");
    }
    
    public static <T> void process(T[] items) {
        System.out.println("处理项目数组，大小: " + items.length);
        for (T item : items) {
            System.out.println("  - " + item);
        }
    }
    
    // 不同数量类型参数的方法
    public static <T, U> void process(T first, U second) {
        System.out.println("处理两个不同类型的项目: " + first + ", " + second);
    }
    
    // 带约束的泛型方法
    public static <T extends Number> void processNumbers(T... numbers) {
        System.out.println("处理数字，数量: " + numbers.length);
        double sum = 0;
        for (T number : numbers) {
            sum += number.doubleValue();
        }
        System.out.println("总和: " + sum);
    }
    
    // 与普通方法的重载
    public static void process(String item) {
        System.out.println("特殊处理字符串: " + item.toUpperCase());
    }
    
    public static void main(String[] args) {
        // 调用处理单个项目的泛型方法
        process("Hello");
        process(42);
        process(3.14);
        
        // 调用处理数组的泛型方法
        String[] stringArray = {"A", "B", "C"};
        Integer[] intArray = {1, 2, 3, 4, 5};
        process(stringArray);
        process(intArray);
        
        // 调用处理两个项目的泛型方法
        process("Name", 25);
        process(3.14, true);
        
        // 调用处理数字的泛型方法
        processNumbers(1, 2, 3, 4, 5);
        processNumbers(1.5, 2.5, 3.5);
        
        // 调用重载的普通方法（优先级更高）
        process("Special String Processing");
    }
}
```

## 十、最佳实践和注意事项

### 10.1 泛型使用最佳实践

```java
import java.util.*;

public class GenericBestPractices {
    // 1. 优先使用泛型而不是原始类型
    public void avoidRawTypes() {
        // 不好的做法
        List rawList = new ArrayList();
        rawList.add("String");
        rawList.add(123); // 容易出错
        
        // 好的做法
        List<String> genericList = new ArrayList<>();
        // genericList.add(123); // 编译错误，类型安全
        genericList.add("String");
    }
    
    // 2. 使用有限制的通配符而不是无限制的通配符
    public static void addNumbers(List<? extends Number> numbers) {
        double sum = 0.0;
        for (Number num : numbers) {
            sum += num.doubleValue();
        }
        System.out.println("数字总和: " + sum);
    }
    
    // 3. 不要使用泛型异常
    // class GenericException<T> extends Exception { } // 不要这样做
    
    // 4. 使用泛型方法而不是泛型类，如果只需要方法级别的泛型
    public static <T> boolean contains(T[] array, T target) {
        for (T element : array) {
            if (element != null && element.equals(target)) {
                return true;
            }
        }
        return false;
    }
    
    // 5. 为泛型类提供有意义的类型参数名
    class Repository<T> {  // T代表要存储的类型
        private List<T> items = new ArrayList<>();
        
        public void save(T item) {
            items.add(item);
        }
        
        public List<T> findAll() {
            return new ArrayList<>(items); // 返回副本以保持封装
        }
    }
    
    // 6. 在返回类型中使用泛型
    public static <T> Optional<T> findFirst(List<T> list) {
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }
    
    public static void main(String[] args) {
        // 测试数字求和
        List<Integer> intList = Arrays.asList(1, 2, 3, 4, 5);
        List<Double> doubleList = Arrays.asList(1.1, 2.2, 3.3);
        
        addNumbers(intList);
        addNumbers(doubleList);
        
        // 测试contains方法
        String[] stringArray = {"A", "B", "C", "D"};
        System.out.println("数组包含'B': " + contains(stringArray, "B"));
        System.out.println("数组包含'X': " + contains(stringArray, "X"));
        
        // 测试Optional返回
        List<String> names = Arrays.asList("张三", "李四", "王五");
        Optional<String> first = findFirst(names);
        System.out.println("第一个名字: " + first.orElse("未找到"));
        
        List<String> emptyList = new ArrayList<>();
        Optional<String> emptyFirst = findFirst(emptyList);
        System.out.println("空列表第一个元素: " + emptyFirst.orElse("未找到"));
    }
}
```

### 10.2 常见陷阱和解决方案

```java
import java.util.*;

public class GenericPitfalls {
    // 陷阱1: 混淆泛型和数组
    public static void arrayVsGenericList() {
        // 数组是协变的
        Number[] numbers = new Integer[3];
        numbers[0] = 1;  // OK
        // numbers[1] = 1.5; // 运行时错误
        
        // 泛型是不可协变的
        // List<Number> numberList = new ArrayList<Integer>(); // 编译错误
        
        // 解决方案：使用通配符
        List<? extends Number> boundedList = new ArrayList<Integer>();
    }
    
    // 陷阱2: 类型擦除导致的问题
    public static void demonstrateErasureIssue() {
        List<String> stringList = new ArrayList<>();
        List<Integer> intList = new ArrayList<>();
        
        // 这两个方法不能同时存在，因为类型擦除后签名相同
        // public static void method(List<String> list) { }
        // public static void method(List<Integer> list) { }
        
        // 解决方案：使用不同的方法名或添加其他参数
    }
    
    // 陷阱3: 未检查的转换警告
    @SuppressWarnings("unchecked")
    public static <T> T unsafeCast(Object obj, Class<T> type) {
        // 需要进行类型检查
        if (type.isInstance(obj)) {
            return type.cast(obj);
        }
        throw new ClassCastException("Cannot cast " + obj.getClass() + " to " + type);
    }
    
    // 陷阱4: 泛型中的异常处理
    public static <T> T safeExecute(Supplier<T> supplier, T defaultValue) {
        try {
            return supplier.get();
        } catch (Exception e) {
            System.out.println("执行出错: " + e.getMessage());
            return defaultValue;
        }
    }
    
    // 函数式接口用于安全执行
    @FunctionalInterface
    interface Supplier<T> {
        T get() throws Exception;
    }
    
    public static void main(String[] args) {
        arrayVsGenericList();
        demonstrateErasureIssue();
        
        // 测试安全转换
        try {
            String str = unsafeCast("Hello", String.class);
            System.out.println("安全转换结果: " + str);
            
            Integer num = unsafeCast(42, Integer.class);
            System.out.println("安全转换数字: " + num);
            
            // 这会抛出ClassCastException
            Double dbl = unsafeCast("Hello", Double.class);
        } catch (ClassCastException e) {
            System.out.println("转换失败: " + e.getMessage());
        }
        
        // 测试安全执行
        String result1 = safeExecute(() -> "Success", "Default");
        System.out.println("安全执行结果1: " + result1);
        
        String result2 = safeExecute(() -> {
            throw new RuntimeException("Test exception");
        }, "DefaultValue");
        System.out.println("安全执行结果2: " + result2);
    }
}
```

## 十一、总结

Java泛型是一个强大而重要的特性，它提供了编译时的类型安全检查，使代码更加安全、可读和可维护。通过本文的详细讲解，我们了解了：

### 核心概念：
- **泛型类**：使用类型参数的类定义
- **泛型接口**：使用类型参数的接口定义
- **泛型方法**：在方法级别使用类型参数
- **类型擦除**：Java泛型的实现机制
- **通配符**：处理不确定类型的情况

### 主要优势：
1. **类型安全**：在编译时检查类型错误
2. **代码复用**：使用单一实现处理多种类型
3. **减少转换**：避免显式类型转换
4. **可读性**：代码意图更加明确

### 使用原则：
- 优先使用泛型而不是原始类型
- 合理使用通配符来提高灵活性
- 遵循类型参数命名约定
- 注意类型擦除的限制
- 遵循泛型设计的最佳实践

掌握Java泛型的正确使用方法，能够帮助开发者编写出更加安全、灵活和可维护的Java程序。