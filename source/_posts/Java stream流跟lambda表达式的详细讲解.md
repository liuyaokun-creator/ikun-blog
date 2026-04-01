---
title: Java stream流跟lambda表达式的详细讲解
date: 2024-07-26 08:00:00
updated: 2024-07-26 08:00:00
tags: [Java, Stream, Lambda, 函数式编程, 集合操作]
categories: Java
---

# Java stream流跟lambda表达式的详细讲解

在Java 8中引入的Stream API和Lambda表达式是两个非常重要的特性，它们极大地简化了集合操作和函数式编程。本文将详细讲解这两个概念及其使用方法。

## 1. Lambda表达式

Lambda表达式是Java 8引入的一个重要特性，它提供了一种简洁的方式来实现函数式接口（只有一个抽象方法的接口）。

### 1.1 Lambda表达式语法

Lambda表达式的基本语法是：`(参数列表) -> { 表达式或语句块 }`

```java
// 传统匿名内部类写法
Runnable runnable1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello from anonymous class");
    }
};

// Lambda表达式写法
Runnable runnable2 = () -> System.out.println("Hello from lambda expression");

// 带参数的Lambda表达式
// 传统写法
java.util.Comparator<Integer> comparator1 = new java.util.Comparator<Integer>() {
    @Override
    public int compare(Integer o1, Integer o2) {
        return o1.compareTo(o2);
    }
};

// Lambda写法
java.util.Comparator<Integer> comparator2 = (Integer o1, Integer o2) -> o1.compareTo(o2);

// 简化后的Lambda写法（参数类型可省略）
java.util.Comparator<Integer> comparator3 = (o1, o2) -> o1.compareTo(o2);
```

### 1.2 Lambda表达式的使用场景

```java
import java.util.*;
import java.util.function.*;

public class LambdaExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");
        
        // 使用Lambda表达式遍历集合
        names.forEach(name -> System.out.println(name));
        
        // 使用Lambda表达式过滤
        List<String> filteredNames = new ArrayList<>();
        names.forEach(name -> {
            if (name.startsWith("A")) {
                filteredNames.add(name);
            }
        });
        
        // 更简洁的过滤方式（配合Stream）
        List<String> filteredWithStream = names.stream()
                .filter(name -> name.startsWith("A"))
                .collect(java.util.stream.Collectors.toList());
        
        System.out.println("Filtered with Stream: " + filteredWithStream);
        
        // 使用Predicate函数式接口
        Predicate<String> startsWithA = name -> name.startsWith("A");
        List<String> filteredWithPredicate = names.stream()
                .filter(startsWithA)
                .collect(java.util.stream.Collectors.toList());
        
        // 使用Function函数式接口
        Function<String, Integer> stringLength = str -> str.length();
        List<Integer> lengths = names.stream()
                .map(stringLength)
                .collect(java.util.stream.Collectors.toList());
        
        System.out.println("字符串长度: " + lengths);
    }
}
```

## 2. Stream API

Stream API提供了一种高效且易于使用的处理数据集合的方式。它支持函数式编程，并且可以进行各种操作，如过滤、映射、排序等。

### 2.1 Stream的基本概念

Stream操作分为三类：
1. 创建Stream
2. 中间操作（Intermediate operations）- 返回Stream
3. 终端操作（Terminal operations）- 返回结果或副作用

```java
import java.util.*;
import java.util.stream.*;

public class StreamBasicExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // 创建Stream的几种方式
        Stream<Integer> stream1 = numbers.stream();  // 从集合创建
        Stream<Integer> stream2 = Stream.of(1, 2, 3, 4, 5);  // 直接创建
        Stream<Integer> stream3 = Arrays.stream(new Integer[]{1, 2, 3, 4, 5});  // 从数组创建
        
        // Stream操作示例
        List<Integer> result = numbers.stream()
                .filter(n -> n % 2 == 0)           // 中间操作：过滤偶数
                .map(n -> n * n)                   // 中间操作：映射为平方
                .limit(3)                          // 中间操作：限制结果数量
                .collect(Collectors.toList());     // 终端操作：收集到列表
        
        System.out.println("处理结果: " + result);  // [4, 16, 36]
    }
}
```

### 2.2 Stream的中间操作

```java
public class StreamIntermediateOperations {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David", "Eva", "Frank");
        
        // filter: 过滤操作
        Stream<String> filtered = names.stream()
                .filter(name -> name.length() > 4);
        
        // map: 映射操作
        Stream<String> upperCase = names.stream()
                .map(String::toUpperCase);  // 方法引用
        
        // flatMap: 扁平化映射
        List<List<Integer>> nestedLists = Arrays.asList(
                Arrays.asList(1, 2, 3),
                Arrays.asList(4, 5),
                Arrays.asList(6, 7, 8, 9)
        );
        Stream<Integer> flattened = nestedLists.stream()
                .flatMap(List::stream);
        
        // distinct: 去重
        List<Integer> withDuplicates = Arrays.asList(1, 2, 2, 3, 3, 4, 5, 5);
        Stream<Integer> distinct = withDuplicates.stream()
                .distinct();
        
        // sorted: 排序
        Stream<String> sorted = names.stream()
                .sorted();
        Stream<String> sortedByLength = names.stream()
                .sorted(Comparator.comparing(String::length));
        
        // limit和skip: 限制和跳过
        Stream<String> limited = names.stream()
                .limit(3);
        Stream<String> skipped = names.stream()
                .skip(2);
        
        // 演示链式操作
        List<String> result = names.stream()
                .filter(name -> name.length() > 3)  // 过滤长度大于3的名称
                .map(String::toUpperCase)           // 转为大写
                .sorted()                           // 排序
                .limit(3)                           // 限制前3个
                .collect(Collectors.toList());
        
        System.out.println("链式操作结果: " + result);
    }
}
```

### 2.3 Stream的终端操作

```java
public class StreamTerminalOperations {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // collect: 收集结果
        List<Integer> evenNumbers = numbers.stream()
                .filter(n -> n % 2 == 0)
                .collect(Collectors.toList());
        
        // reduce: 归约操作
        Optional<Integer> sum = numbers.stream()
                .reduce((a, b) -> a + b);
        System.out.println("总和: " + sum.orElse(0));
        
        // 另一种reduce写法
        int sum2 = numbers.stream()
                .reduce(0, Integer::sum);
        System.out.println("总和(另一种写法): " + sum2);
        
        // count: 计数
        long count = numbers.stream()
                .filter(n -> n > 5)
                .count();
        System.out.println("大于5的数字个数: " + count);
        
        // max/min: 最大/最小值
        Optional<Integer> max = numbers.stream()
                .max(Integer::compareTo);
        Optional<Integer> min = numbers.stream()
                .min(Integer::compareTo);
        System.out.println("最大值: " + max.orElse(0));
        System.out.println("最小值: " + min.orElse(0));
        
        // findFirst/findAny: 查找
        Optional<Integer> firstEven = numbers.stream()
                .filter(n -> n % 2 == 0)
                .findFirst();
        System.out.println("第一个偶数: " + firstEven.orElse(0));
        
        // anyMatch/allMatch/noneMatch: 匹配
        boolean hasEven = numbers.stream()
                .anyMatch(n -> n % 2 == 0);
        boolean allPositive = numbers.stream()
                .allMatch(n -> n > 0);
        boolean noneNegative = numbers.stream()
                .noneMatch(n -> n < 0);
        
        System.out.println("是否有偶数: " + hasEven);
        System.out.println("是否都为正数: " + allPositive);
        System.out.println("是否没有负数: " + noneNegative);
        
        // forEach: 遍历
        System.out.println("遍历所有数字:");
        numbers.stream()
                .forEach(n -> System.out.print(n + " "));
        System.out.println();
        
        // toArray: 转数组
        Integer[] array = numbers.stream()
                .toArray(Integer[]::new);
        System.out.println("转为数组: " + Arrays.toString(array));
    }
}
```

## 3. Stream的高级应用

### 3.1 分组和分区

```java
public class StreamGroupingExample {
    static class Person {
        private String name;
        private int age;
        private String city;
        
        public Person(String name, int age, String city) {
            this.name = name;
            this.age = age;
            this.city = city;
        }
        
        // getter方法
        public String getName() { return name; }
        public int getAge() { return age; }
        public String getCity() { return city; }
        
        @Override
        public String toString() {
            return String.format("Person{name='%s', age=%d, city='%s'}", name, age, city);
        }
    }
    
    public static void main(String[] args) {
        List<Person> people = Arrays.asList(
                new Person("Alice", 25, "Beijing"),
                new Person("Bob", 30, "Shanghai"),
                new Person("Charlie", 25, "Beijing"),
                new Person("David", 35, "Shanghai"),
                new Person("Eva", 28, "Beijing")
        );
        
        // 按城市分组
        Map<String, List<Person>> groupedByCity = people.stream()
                .collect(Collectors.groupingBy(Person::getCity));
        System.out.println("按城市分组: " + groupedByCity);
        
        // 按年龄分组
        Map<Integer, List<Person>> groupedByAge = people.stream()
                .collect(Collectors.groupingBy(Person::getAge));
        System.out.println("按年龄分组: " + groupedByAge);
        
        // 多级分组
        Map<String, Map<String, List<Person>>> groupedByCityAndName = people.stream()
                .collect(Collectors.groupingBy(
                    Person::getCity,
                    Collectors.groupingBy(p -> p.getName().substring(0, 1))  // 按姓名首字母分组
                ));
        System.out.println("多级分组: " + groupedByCityAndName);
        
        // 分区（分为两组）
        Map<Boolean, List<Person>> partitionedByAge = people.stream()
                .collect(Collectors.partitioningBy(p -> p.getAge() > 28));
        System.out.println("按年龄分区 (>28): " + partitionedByAge);
    }
}
```

### 3.2 并行Stream

```java
public class ParallelStreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < 1000000; i++) {
            numbers.add(i);
        }
        
        // 串行Stream
        long startTime = System.currentTimeMillis();
        long serialSum = numbers.stream()
                .mapToLong(Long::valueOf)
                .sum();
        long serialTime = System.currentTimeMillis() - startTime;
        
        // 并行Stream
        startTime = System.currentTimeMillis();
        long parallelSum = numbers.parallelStream()
                .mapToLong(Long::valueOf)
                .sum();
        long parallelTime = System.currentTimeMillis() - startTime;
        
        System.out.println("串行Stream结果: " + serialSum + ", 耗时: " + serialTime + "ms");
        System.out.println("并行Stream结果: " + parallelSum + ", 耗时: " + parallelTime + "ms");
        
        // 注意：并行Stream不适用于所有场景
        // 对于简单操作或小数据集，串行可能更快
    }
}
```

## 4. 实际应用示例

### 4.1 处理学生成绩

```java
public class StudentGradeExample {
    static class Student {
        private String name;
        private int mathScore;
        private int englishScore;
        private int scienceScore;
        
        public Student(String name, int mathScore, int englishScore, int scienceScore) {
            this.name = name;
            this.mathScore = mathScore;
            this.englishScore = englishScore;
            this.scienceScore = scienceScore;
        }
        
        public String getName() { return name; }
        public int getMathScore() { return mathScore; }
        public int getEnglishScore() { return englishScore; }
        public int getScienceScore() { return scienceScore; }
        
        public int getTotalScore() {
            return mathScore + englishScore + scienceScore;
        }
        
        public double getAverageScore() {
            return getTotalScore() / 3.0;
        }
        
        @Override
        public String toString() {
            return String.format("Student{name='%s', total=%d, average=%.2f}", 
                               name, getTotalScore(), getAverageScore());
        }
    }
    
    public static void main(String[] args) {
        List<Student> students = Arrays.asList(
                new Student("Alice", 95, 87, 92),
                new Student("Bob", 78, 82, 85),
                new Student("Charlie", 90, 94, 88),
                new Student("David", 65, 70, 68),
                new Student("Eva", 88, 92, 95)
        );
        
        // 计算所有学生的平均分
        double averageTotalScore = students.stream()
                .mapToInt(Student::getTotalScore)
                .average()
                .orElse(0.0);
        System.out.println("平均总分: " + averageTotalScore);
        
        // 找出总分最高的学生
        Optional<Student> topStudent = students.stream()
                .max(Comparator.comparingInt(Student::getTotalScore));
        System.out.println("最高分学生: " + topStudent.orElse(null));
        
        // 筛选优秀学生（总分>=270）
        List<Student> excellentStudents = students.stream()
                .filter(s -> s.getTotalScore() >= 270)
                .collect(Collectors.toList());
        System.out.println("优秀学生: " + excellentStudents);
        
        // 按总分排序
        List<Student> sortedByTotal = students.stream()
                .sorted(Comparator.comparingInt(Student::getTotalScore).reversed())
                .collect(Collectors.toList());
        System.out.println("按总分排序: " + sortedByTotal);
        
        // 计算每门课程的平均分
        double avgMath = students.stream()
                .mapToInt(Student::getMathScore)
                .average()
                .orElse(0.0);
        double avgEnglish = students.stream()
                .mapToInt(Student::getEnglishScore)
                .average()
                .orElse(0.0);
        double avgScience = students.stream()
                .mapToInt(Student::getScienceScore)
                .average()
                .orElse(0.0);
        
        System.out.printf("数学平均分: %.2f, 英语平均分: %.2f, 科学平均分: %.2f%n", 
                         avgMath, avgEnglish, avgScience);
    }
}
```

### 4.2 字符串处理

```java
public class StringProcessingExample {
    public static void main(String[] args) {
        List<String> sentences = Arrays.asList(
                "Hello World Java Programming",
                "Java Stream API is powerful",
                "Lambda expressions make code concise",
                "Functional programming in Java 8",
                "Collection processing made easy"
        );
        
        // 统计所有单词
        List<String> allWords = sentences.stream()
                .flatMap(sentence -> Arrays.stream(sentence.split("\\s+")))
                .map(String::toLowerCase)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
        
        System.out.println("所有不重复单词: " + allWords);
        
        // 找出长度大于4的单词及其出现次数
        Map<String, Long> wordCount = sentences.stream()
                .flatMap(sentence -> Arrays.stream(sentence.split("\\s+")))
                .map(String::toLowerCase)
                .filter(word -> word.length() > 4)
                .collect(Collectors.groupingBy(
                    word -> word,
                    Collectors.counting()
                ));
        
        System.out.println("长度>4的单词计数: " + wordCount);
        
        // 找出包含特定字母的句子
        List<String> javaSentences = sentences.stream()
                .filter(sentence -> sentence.toLowerCase().contains("java"))
                .collect(Collectors.toList());
        
        System.out.println("包含Java的句子: " + javaSentences);
    }
}
```

## 5. Lambda表达式与方法引用

### 5.1 方法引用类型

```java
import java.util.function.*;

public class MethodReferenceExample {
    public static void main(String[] args) {
        // 1. 静态方法引用: ClassName::staticMethodName
        Function<String, Integer> parseInt = Integer::parseInt;
        System.out.println("解析字符串为整数: " + parseInt.apply("123"));
        
        // 2. 实例方法引用: instance::methodName
        String str = "hello";
        Supplier<Integer> lengthSupplier = str::length;
        System.out.println("字符串长度: " + lengthSupplier.get());
        
        // 3. 特定对象的实例方法引用: object::methodName
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
        names.forEach(System.out::println);  // 等价于 names.forEach(name -> System.out.println(name))
        
        // 4. 构造方法引用: ClassName::new
        Supplier<List<String>> listSupplier = ArrayList::new;
        Function<String, Integer> stringToInteger = Integer::new;
        
        // 5. 数组构造方法引用: TypeName[]::new
        Function<Integer, String[]> arrayCreator = String[]::new;
        String[] arr = arrayCreator.apply(5);  // 创建长度为5的String数组
        System.out.println("数组长度: " + arr.length);
    }
    
    // 示例方法用于演示实例方法引用
    public void printMessage(String message) {
        System.out.println("Message: " + message);
    }
    
    // 示例静态方法用于演示静态方法引用
    public static int calculateLength(String str) {
        return str.length();
    }
}
```

## 6. 性能考虑和最佳实践

### 6.1 性能优化建议

```java
public class StreamPerformanceTips {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < 1000000; i++) {
            numbers.add(i);
        }
        
        // 1. 避免不必要的装箱/拆箱
        // 不好的做法
        long sum1 = numbers.stream()
                .mapToInt(Integer::intValue)  // 避免装箱
                .sum();
        
        // 2. 合理使用短路操作
        boolean hasLargeNumber = numbers.stream()
                .anyMatch(n -> n > 999999);  // anyMatch是短路操作
        
        // 3. 适当使用并行Stream（大数据集）
        // 对于大数据集，可以使用parallelStream
        long parallelSum = numbers.parallelStream()
                .mapToLong(Long::valueOf)
                .sum();
        
        // 4. 避免在Stream操作中进行复杂计算
        // 好的做法：将复杂逻辑提取为方法
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");
        List<String> processedNames = names.stream()
                .filter(StreamPerformanceTips::isValidName)  // 使用方法引用
                .map(StreamPerformanceTips::processName)     // 使用方法引用
                .collect(Collectors.toList());
        
        System.out.println("处理后的名称: " + processedNames);
    }
    
    // 辅助方法
    private static boolean isValidName(String name) {
        return name != null && name.length() > 2;
    }
    
    private static String processName(String name) {
        return name.toUpperCase().substring(0, Math.min(name.length(), 4));
    }
}
```

## 7. 常见错误和注意事项

### 7.1 常见错误示例

```java
public class StreamCommonMistakes {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
        
        // 错误1: 重复使用Stream
        Stream<Integer> stream = numbers.stream()
                .filter(n -> n % 2 == 0);
        List<Integer> result1 = stream.collect(Collectors.toList());
        // 以下代码会抛出异常，因为Stream已经被消费
        // List<Integer> result2 = stream.collect(Collectors.toList()); // IllegalStateException
        
        // 正确做法：重新创建Stream
        List<Integer> result2 = numbers.stream()
                .filter(n -> n % 2 == 0)
                .collect(Collectors.toList());
        
        // 错误2: 在Stream操作中修改外部变量
        int counter = 0;  // 这是final变量，不能修改
        // numbers.stream().forEach(n -> counter++); // 编译错误
        
        // 正确做法：使用AtomicInteger或其他线程安全的容器
        AtomicInteger atomicCounter = new AtomicInteger(0);
        numbers.stream().forEach(n -> atomicCounter.incrementAndGet());
        
        // 错误3: 不必要的中间操作
        List<Integer> badExample = numbers.stream()
                .filter(n -> true)  // 无意义的过滤
                .map(n -> n)        // 无意义的映射
                .collect(Collectors.toList());
        
        // 正确做法：只使用必要的操作
        List<Integer> goodExample = numbers.stream()
                .collect(Collectors.toList());
    }
}
```

## 8. 总结

Java的Stream API和Lambda表达式为处理集合数据提供了强大而简洁的方式：

1. **Lambda表达式**简化了函数式接口的实现，使代码更简洁
2. **Stream API**提供了链式操作，使数据处理逻辑更清晰
3. **方法引用**进一步简化了Lambda表达式的写法
4. 合理使用并行Stream可以提高大数据集的处理性能
5. 需要注意避免常见的错误，如重复使用Stream、在操作中修改外部变量等

掌握Stream API和Lambda表达式对于现代Java开发至关重要，它们能够显著提高代码的可读性和开发效率。