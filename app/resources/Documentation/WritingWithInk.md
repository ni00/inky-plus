# Writing with ink

（译注：以下中文基于 GPT 翻译，可能存在错误，请以官方文档为准，点此查看原文：[WritingWithInk.md](https://github.com/inkle/inky/blob/master/app/resources/Documentation/WritingWithInk.md)）

<details>
  <summary>Table of Contents</summary>

  * [Introduction](#introduction)
  * [Part One: The Basics](#part-one-the-basics)
    * [1) Content](#1-content)
    * [2) Choices](#2-choices)
    * [3) Knots](#3-knots)
    * [4) Diverts](#4-diverts)
    * [5) Branching The Flow](#5-branching-the-flow)
    * [6) Includes and Stitches](#6-includes-and-stitches)
    * [7) Varying Choices](#7-varying-choices)
    * [8) Variable Text](#8-variable-text)
    * [9) Game Queries and Functions](#9-game-queries-and-functions)
  * [Part 2: Weave](#part-2-weave)
    * [1) Gathers](#1-gathers)
    * [2) Nested Flow](#2-nested-flow)
    * [3) Tracking a Weave](#3-tracking-a-weave)
  * [Part 3: Variables and Logic](#part-3-variables-and-logic)
    * [1) Global Variables](#1-global-variables)
    * [2) Logic](#2-logic)
    * [3) Conditional blocks (if/else)](#3-conditional-blocks-ifelse)
    * [4) Temporary Variables](#4-temporary-variables)
    * [5) Functions](#5-functions)
    * [6) Constants](#6-constants)
    * [7) Advanced: Game-side logic](#7-advanced-game-side-logic)
   * [Part 4: Advanced Flow Control](#part-4-advanced-flow-control)
     * [1) Tunnels](#1-tunnels)
     * [2) Threads](#2-threads)
   * [Part 5: Advanced State Tracking](#part-5-advanced-state-tracking)
     * [1) Basic Lists](#1-basic-lists)
	 * [2) Reusing Lists](#2-reusing-lists)
	 * [3) List Values](#3-list-values)
	 * [4) Multivalued Lists](#4-multivalued-lists)
	 * [5) Advanced List Operations](#5-advanced-list-operations)
	 * [6) Multi-list Lists](#6-multi-list-lists)
	 * [7) Long example: crime scene](#7-long-example-crime-scene)
	 * [8) Summary](#8-summary)
   * [Part 6: International character support in identifiers](#part-6-international-character-support-in-identifiers)
</details>

## Introduction 简介

**ink** 是一种脚本语言，核心理念是通过在纯文本中标记流程，从而生成交互式脚本。

在最基础的层面上，它可用于创作类似“选择你自己的冒险”风格的故事，或构建分支式对话树。但 **ink** 真正的优势在于，它能轻松应对包含众多选项与丰富组合的对话场景。

**ink** 提供了多种特性，帮助非技术背景的创作者轻松地为剧情频繁分支，并在细微或重大的层面上展现这些分支的后果，而无需繁琐的操作。

这一脚本语言的设计目标是保持整洁与逻辑有序，以便通过直观地检视就能轻松测试分支对话。在可能的情况下，**ink** 会以声明式的方式来描述流程。

此外，**ink** 还在设计时充分考虑了重新起草（重写）的需求，使得修改流程变得快速而高效。

# Part One: The Basics 第一部分：基础知识

## 1) Content 内容

### The simplest ink script 最简单的 ink 脚本

最基本的 ink 脚本只是一个 `.ink` 文件中的文本内容：

	你好，世界！  

运行后，它会输出这段文字，然后停止。

将文本写在单独的行中会产生新的段落。如下脚本所示：

	你好，世界！  
	你好？  
	你好，你在吗？  

它的输出和上面相同，看起来也是三行文本，每行一个段落。

### Comments 注释

默认情况下，文件中所有文本都会出现在输出中，除非使用特定标记加以区分。

最简单的标记是注释。**ink** 支持两种类型的注释。

一种是给阅读代码的人看的，编译器会忽略它：

	“你怎么看这个？”她问道。  

	// 这里是一些不用于输出的内容

	“我无法发表评论，”我回答道。  

	/*
		...或者是一个不限长度的注释块
	*/

另一种注释是给作者自己用的，用来提醒需要完成的工作。这种注释会在编译时打印出来：

	TODO: 把这一部分完善！

### Tags 标签

游戏运行时，文本内容会原样呈现给玩家。但有时标记一行文本以携带额外信息会很有用，比如告诉游戏引擎如何处理这行内容。

**ink** 使用简单的“#”标记系统为文本行添加标签：

	一行普通的游戏文本。# 将其设置为蓝色

这些标签不会出现在主文本流中，但游戏可以在后台读取并根据需要使用。更多信息请参考 [运行你的 Ink](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md)。

## 2) Choices 选项

玩家的输入通过文字选项（choices）来实现。文本选项使用 `*` 字符表示。

如果没有其他流程指令，当玩家选择一项选项后，叙事将继续向下执行下一行文本。

	你好，世界！  
	* 	你好呀！  
		真高兴听到你的回复

上述脚本的游戏表现为：

	你好，世界  

	1：你好呀！  

	> 1
	你好呀！  
	真高兴听到你的回复。 

默认情况下，玩家选择的选项文本会再次出现在最终输出中。

### Suppressing choice text 隐藏选项文本

在某些游戏中，选项文本和其对应的后续输出需要分离。在 **ink** 中，如果将选项文本用方括号 `[]` 包裹起来，选项文本将不会在后续输出中重复出现。

	你好，世界！  
	* 	[你好呀！]  
		真高兴听到你的回复！  

输出为：

	你好，世界  
	1：你好呀！  
	> 1  
	真高兴听到你的回复。  

#### Advanced: mixing choice and output text 高级技巧：混合选项与输出文本

事实上，方括号会将选项内容分割成多个部分。方括号前的内容会在选项和选择后输出中同时出现；方括号内的内容只会在选项中出现；方括号后的内容则只会在选择结果的输出中出现。这相当于为文本的结尾提供了多种输出路径。
（译注：这个例子不方便翻译为中文，原文如下）

	Hello world!
	*	Hello [back!] right back to you!
		Nice to hear from you!

输出为：

	Hello world
	1: Hello back!
	> 1
	Hello right back to you!
	Nice to hear from you.

此技巧在书写对话选项时尤其有用：

	“怎么了？” 我的主人问道。 
	* 	“我有点累了[。”],” 我重复道。  
		“是吗，” 他答道。“真是让人难受啊。”  

输出为：

	“怎么了？” 我的主人问道。 
	1. “我有点累了。”
	> 1
	“我有点累了,” 我重复道。  
	“是吗，” 他答道。“真是让人难受啊。”  

### Multiple Choices 多个选项

要体现真正的选择性，我们需要提供多个可选项。只需将多条选项依次列出即可：

	“怎么了？” 我的主人问道。 
	* 	“我有点累了[。”],” 我重复道。  
		“是吗，” 他答道。“真是让人难受啊。”  
	* 	“没什么，先生！”[] 我回答道。  
		“那很好。”  
	*  	“我说，这趟旅程糟透了[。”]，我再也不想继续下去了。”  
		“啊，” 他语气温和地说道，“我明白你很沮丧。明天一切都会好起来的。”

上述脚本的游戏表现为：

	“怎么了？” 我的主人问道。 

	1: “我有点累了。”
	2: “没什么，先生！”
	3: “我说，这趟旅程糟透了。”

	> 3
	“我说，这趟旅程糟透了，我再也不想继续下去了。”  
	“啊，” 他语气温和地说道，“我明白你很沮丧。明天一切都会好起来的。”

上面的语法足以创建单次的选择集合。在实际游戏中，我们往往希望根据玩家选择的不同，将故事流程导向不同的节点。这就需要更复杂的流程结构，我们将在后面进一步讨论。

## 3) Knots 节点

### Pieces of content are called knots 内容单元称为节点

为了让游戏能够分支，我们需要给内容区块命名（类似于传统的游戏书有“第18段”这样的标记）。这些独立的内容区块称为 “节点（knots）”，它们是 **ink** 内容的基本结构单元。

### Writing a knot 定义一个节点

节点的开头以两个或更多个 `=` 号来表示，例如：

	=== top_knot ===

（行尾的 `===` 是可选的；节点名称必须是一个不含空格的单词。）

节点起始行是一个头部标记，紧随其后的内容都属于该节点。

	=== back_in_london ===

	我们在晚上9点45分准时抵达伦敦。

#### Advanced: a knottier "hello world" 进阶用法：一个稍显复杂的 hello world

当你启动一个 ink 文件时，所有位于节点之外的内容会自动运行；但节点内的内容不会自动运行。因此，如果你开始使用节点来组织内容，你需要告诉游戏从哪个节点开始执行。我们通过使用转向箭头 `->` 来指定，这将在下一节详细介绍。

最简单的使用节点的脚本是：

	-> top_knot

	=== top_knot ===
	你好，世界！

然而，**ink** 不喜欢流程无故中断。在编译和/或运行时，如果引擎判断流程无处可去，它会给出警告。上述脚本在编译时会产生如下警告：

	WARNING: Apparent loose end exists where the flow runs out. Do you need a '-> END' statement, choice or divert? on line 3 of tests/test.ink

在运行时也会报错：

	Runtime error in tests/test.ink line 3: ran out of content. Do you need a '-> DONE' or '-> END'?

以下版本的代码可以正常运行和编译无误：

	=== top_knot ===
	你好，世界！
	-> END

`-> END` 对编写者和编译器而言都是一个明确的结束标记，表示“故事流程到此为止”。

## 4) Diverts 跳转

### Knots divert to knots 节点间的跳转

你可以使用 `->`（称为“跳转箭头”）让故事从一个节点（knot）跳转到另一个节点。跳转是立刻发生的，不需要玩家输入。

	=== back_in_london ===

	我们在晚上9点45分准时抵达伦敦。
	-> hurry_home

	=== hurry_home ===
	我们尽可能快地赶回萨维尔街的家。

#### Diverts are invisible 跳转是无形的

跳转是无缝的，甚至可以在句子中间进行：
（译注：这个例子不方便翻译为中文，原文如下）

	=== hurry_home ===
	We hurried home to Savile Row -> as_fast_as_we_could

	=== as_fast_as_we_could ===
	as fast as we could.

上述脚本的输出与以下效果相同：

	We hurried home to Savile Row as fast as we could.

#### Glue 粘合

默认情况下，每当遇到新行内容，**ink** 会在输出中插入换行符。但在某些情况下，我们需要紧密衔接文本，而不希望换行。这时可以使用 `<>`（“粘合”符号）来实现。
（译注：这个例子不方便翻译为中文，原文如下）

	=== hurry_home ===
	We hurried home <>
	-> to_savile_row

	=== to_savile_row ===
	to Savile Row
	-> as_fast_as_we_could

	=== as_fast_as_we_could ===
	<> as fast as we could.

该脚本的输出同样为：

	We hurried home to Savile Row as fast as we could.

你不能过度使用“粘合”符号：多个连续的粘合符号不会产生额外效果。（也无法“抵消”粘合，一旦一行被“粘”上，就会一直粘合。）


## 5) Branching The Flow 分支流程

### Basic branching 基本分支

将节点、选项和跳转（diverts）结合起来，可以实现最基本的多路径故事结构。

	=== paragraph_1 ===  
	你站在阿纳兰德的城墙旁，手握长剑。  
	* 	[打开城门] -> paragraph_2  
	* 	[砸开城门] -> paragraph_3  
	* [转身回家] -> paragraph_4  

	=== paragraph_2 ===  
	你打开了城门，踏上了小路。

	...

### Branching and joining 分支与合流

通过使用跳转（diverts），作者可以让故事流程分支，然后在不让玩家察觉的情况下让分支重新汇合。这意味着多个不同的路径可以最终回到同一个叙事点上。

	=== back_in_london ===

	我们在晚上9点45分准时抵达伦敦。

	*	“一刻都不能耽误！”[] 我说道。  
		-> hurry_outside

	*	“先生，让我们好好享受这一刻吧！”[] 我说道。  
		我的主人狠狠地敲了我的头一下，把我拖出了门。  
		-> dragged_outside

	*	[我们赶紧回家] -> hurry_outside


	=== hurry_outside ===
	我们尽可能快地赶回萨维尔街的家 -> as_fast_as_we_could


	=== dragged_outside ===
	他坚持要我们尽快赶回萨维尔街的家  
	-> as_fast_as_we_could


	=== as_fast_as_we_could ===
	<> ，尽可能快地。

### The story flow 故事流程

节点与跳转的组合构建出了游戏的基础故事流程。这个流程是“平的”（flat），即没有调用栈（call stack），跳转后不会再“返回”原来的位置。

在大多数 **ink** 脚本中，故事从文件开头的内容开始，然后在各节点间“跳来跳去”，像一团意大利面一样盘绕，最后（希望）到达 `-> END` 告终。

这种极为松散的结构让创作者可以随心所欲地写作，在必要时随意分支和合流，而无需过分担心整体结构的完备性。引入新的分支或变向并不需要任何模板化的步骤，也无需手动追踪状态。

#### Advanced: Loops 进阶用法：循环

完全可以使用跳转来创建循环内容。**ink** 提供了多种特性来利用这一点，包括动态变化文本的方式，以及控制选项重复选择频率的方法。

更多信息请参考有关动态文本变化以及[条件分支选项](#conditional-choices)的相关章节。

哦，顺带一提，下面这种写法虽然合法，但并不是个好主意：

	=== round ===
	and
	-> round

## 6) Includes and Stitches 包含与分段

### Knots can be subdivided 节点可以进一步细分

随着故事规模增大，如果没有额外的结构支持，保持条理就会变得困难。

节点（knots）内部可以进一步细分为子章节（stitches）。子章节以单个等号作为标记：

	=== the_orient_express ===
	= in_first_class
		...
	= in_third_class
		...
	= in_the_guards_van
		...
	= missed_the_train
		...

例如，你可以将一个节点视为一个场景，而将其内部的子章节用来表示该场景中的不同事件。

### Stitches have unique names 子章节有独立的名字

你可以通过“地址”的方式跳转到子章节。地址的格式为：`节点名.子章节名`

	*	[乘坐三等车厢]
		-> the_orient_express.in_third_class

	*	[乘坐列车员车厢]
		-> the_orient_express.in_the_guards_van

### The first stitch is the default 第一个子章节是默认入口

如果你跳转到一个含有多个子章节的节点（但未指定具体子章节），则会自动跳转到该节点内的第一个子章节。因此：

	*	[乘坐头等车厢]
		“头等车厢，先生。还能去哪呢？”  
		-> the_orient_express

与下面的写法效果相同：

	*	[乘坐头等车厢]
		“头等车厢，先生。还能去哪呢？”  
		-> the_orient_express.in_first_class

（除非你在节点内部改变子章节的顺序！）

你也可以在节点顶部（在所有子章节之前）添加内容。然而，需要记住的是，在这些内容结束后，故事并不会自动进入首个子章节，你必须手动跳转（divert）进入相应子章节。

	=== the_orient_express ===

	我们登上了火车，但是在哪个车厢？  
	* 	[头等车厢] -> in_first_class  
	* 	[二等车厢] -> in_second_class  

	= in_first_class
		...
	= in_second_class
		...

### Local diverts 本地跳转

在同一个节点内，你不需要使用完整的地址来跳转到子章节：

	-> the_orient_express

	=== the_orient_express ===
	= in_first_class
		我安顿好了我的主人。  
		*	[移动到三等车厢]
			-> in_third_class

	= in_third_class
		我将自己安顿在了三等车厢。  

这意味着子章节名在同一节点内是唯一的，但不同节点之间可以使用相同的子章节名。（例如，the_orient_express 和 SS_Mongolia 都可以有一个 in_first_class 子章节。）

如果存在名称冲突，编译器会发出警告。

### Script files can be combined 脚本文件可以合并

你还可以通过使用 `INCLUDE` 语句，将内容分散在多个文件中进行组织：

	INCLUDE newspaper.ink
	INCLUDE cities/vienna.ink
	INCLUDE journeys/orient_express.ink

`INCLUDE` 语句应该始终放在文件顶部，而不应位于节点内部。

文件分离不会对游戏内的名称空间产生影响，也就是说，你可以自由地在多个文件中创建节点和子章节，并在任意文件中对其进行跳转。

## 7) Varying Choices 选择的多样性

### Choices can only be used once 选项只能使用一次

默认情况下，游戏中的每个选项只能被选择一次。如果你的故事中没有循环结构，你可能不会注意到这一点；但一旦使用循环，你会很快发现选项会在重复循环中逐渐消失……

	=== find_help ===

		你在拥挤的人群中拼命寻找一张友善的面孔。  
		*	戴帽子的女人[？] 粗暴地把你推到一边。 -> find_help
		*	拿公文包的男人[？] 在你跌跌撞撞地从他身边经过时，露出厌恶的表情。 -> find_help

输出为：

	你在拥挤的人群中拼命寻找一张友善的面孔。

	1: 戴帽子的女人？  
	2: 拿公文包的男人？  

	> 1  
	戴帽子的女人粗暴地把你推到一边。  
	你在拥挤的人群中拼命寻找一张友善的面孔。  

	1: 拿公文包的男人？  

	>

当再次循环时，你将没有任何选项可选。

#### Fallback choices 后备选项

上面的例子会在此时停止，因为下次循环时会发生“内容耗尽”的运行时错误。

	> 1
	拿公文包的男人在你跌跌撞撞地从他身边经过时，露出厌恶的表情。  
	你在拥挤的人群中拼命寻找一张友善的面孔。

	Runtime error in tests/test.ink line 6: ran out of content. Do you need a '-> DONE' or '-> END'?

我们可以通过添加一个“后备选项”来解决这个问题。当没有其他选项可供玩家选择时，游戏会自动选择后备选项。后备选项不会显示给玩家，只在无其他可选时生效。

一个后备选项可以是一个没有任何选项文本的选择：

	*	-> out_of_options

或者使用一种稍有语法“滥用”的方式，提供一个有内容但无文本的默认选项：

	* 	->
		穆德从未能解释清楚他是如何从那辆燃烧的货车里逃出来的。 -> season_2

#### Example of a fallback choice 后备选项示例

将这一机制添加到之前的示例中：

	=== find_help ===

	你在拥挤的人群中拼命寻找一张友善的面孔。  
	* 	戴帽子的女人[？] 粗暴地把你推到一边。 -> find_help  
	* 	拿公文包的男人[？] 在你跌跌撞撞地从他身边经过时，露出厌恶的表情。 -> find_help  
	* 	->  
		但一切都太晚了：你倒在了车站的站台上。这就是结局。  
		-> END  

输出为：

	你在拥挤的人群中拼命寻找一张友善的面孔。

	1: 戴帽子的女人？  
	2: 拿公文包的男人？  

	> 1
	戴帽子的女人粗暴地把你推到一边。  
	你在拥挤的人群中拼命寻找一张友善的面孔。  

	1: 拿公文包的男人？  

	> 1
	拿公文包的男人在你跌跌撞撞地从他身边经过时，露出厌恶的表情。  
	你在拥挤的人群中拼命寻找一张友善的面孔。
	但一切都太晚了：你倒在了车站的站台上。这就是结局。  


### Sticky choices 粘性选项

“只可用一次”并非总是我们所需要的，因此还有另一种选项类型：粘性选项（sticky choices）。粘性选项不会在选择后消失，用 `+` 来标记：

	=== homers_couch ===
		+	[再吃一个甜甜圈]
			你又吃了一个甜甜圈。 -> homers_couch  
		* 	[起身离开沙发]  
			你挣扎着从沙发上站起来，准备去创作史诗诗歌。 
			-> END

后备选项也可以是粘性的：

	=== conversation_loop
		* 	[谈论天气] -> chat_weather  
		* 	[谈论孩子] -> chat_children  
		+ 	-> 再次静静地坐着  

### Conditional Choices 条件化选项

你也可以通过逻辑来控制选项的显示与否。**ink** 提供了丰富的逻辑功能，这里先介绍最简单的用法——检测玩家是否已经看过某段内容。

游戏中每个节点（knot）和子章节（stitch）都有独特的地址，对该地址的检测可判断玩家是否已阅读过对应内容：

	*	{ not visit_paris } 	[去巴黎] -> visit_paris
	+ 	{ visit_paris 	  } 	[回到巴黎] -> visit_paris

	*	{ visit_paris.met_estelle } [给埃斯特尔夫人打电话] -> phone_estelle

注意：`knot_name` 在条件中为真，表示玩家看过该节点下的任何子章节内容。

同样要注意，条件不会覆盖选项“一次性”行为，如果你希望重复出现的条件选项，需要使用粘性选项。

#### Advanced: multiple conditions 进阶：多重条件

你可以在一个选项上使用多个条件；所有条件都必须通过测试，选项才会出现：

	*	{ not visit_paris } [去巴黎] -> visit_paris
	+ 	{ visit_paris } { not bored_of_paris }
		[回到巴黎] -> visit_paris


#### Logical operators: AND and OR 逻辑运算符：AND 和 OR

上述示例的多重条件相当于编程中的 AND 逻辑。**ink** 支持 `and`（也可写为 `&&`）和 `or`（也可写为 `||`），还支持使用括号进行逻辑分组。

	*	{ not (visit_paris or visit_rome) && (visit_london || visit_new_york) } [ 等等。去哪儿？我有点困惑。 ] -> visit_someplace

对于非程序员而言，`X and Y` 表示 X 和 Y 都要为真；`X or Y` 表示 X 和 Y 中至少有一个为真。**ink** 没有提供 `xor`。

你也可以使用标准的 `!` 来表示 `not`，但有时会让编译器误以为 `{!text}` 是一次性列表，因此建议使用单词 `not` 来避免歧义。

#### Advanced: knot/stitch labels are actually read counts 进阶：节点和子章节名称其实是阅读次数

条件检测如：

	*	{seen_clue} [指控杰斐逊先生]

实际上测试的是一个整数，而非真/假布尔值。被引用的节点或子章节地址在逻辑中代表该内容被阅读过的次数（一个整数）。只要阅读次数不为零，`{seen_clue}` 在条件中就相当于 true。

你也可以更精确地判断：

	* 	{seen_clue > 3} [直接逮捕杰斐逊先生]  

#### Advanced: more logic 进阶：更多逻辑

**ink** 支持的逻辑和条件远不止这些，更多内容请参考 [变量和逻辑](#part-3-variables-and-logic) 的相关章节。

## 8) Variable Text 可变文本

### Text can vary 文本可以变化

到目前为止，我们看到的内容都是静态固定的文本。但在 **ink** 中，文本内容在显示时也可以发生变化。

### Sequences, cycles and other alternatives 序列、循环及其他变体

最简单的文本变化方式是通过备选文本（alternatives）实现的，根据一定规则从中选择一个变体进行展示。**ink** 支持多种类型的变体。备选文本用 `{` 和 `}` 括起来，内部使用 `|` 分隔不同的选项。

只有当某段内容被多次访问时，这些变体才会显现出作用！

#### Types of alternatives 备选文本的类型

**序列** (默认)：

序列（或“停止块”）是一组备选内容，它会记录被访问的次数，并依次显示下一个元素。当没有新的内容时，它会持续显示最后一个元素。  

	收音机突然嘶嘶作响。{"三！"|"二！"|"一！"|接着是一阵白噪声般的爆炸声。|不过只是静电声。} 

	{我用五英镑买了一杯咖啡。|我为朋友买了第二杯咖啡。|我没钱再买更多的咖啡了。}  

**循环** （以 `&` 标记）：

循环与序列类似，但它会循环显示内容。  

	今天是{&星期一|星期二|星期三|星期四|星期五|星期六|星期日}。 

**一次性** （以 `!` 标记）：

一次性选项与序列类似，但当没有新内容可显示时，它会显示为空。（你可以将一次性选项视为最后一项为空白的序列。）  

	他给我讲了个笑话。{!我礼貌地笑了笑。|我微笑了一下。|我做了个怪脸。|我暗暗发誓不再有任何反应。}  

**随机排列** （以 `~` 标记）： 

随机排列会生成随机输出。  

	我抛了硬币。{~正面|反面}。 

#### Features of Alternatives 备选文本的特性

备选文本可以包含空元素。

    我向前迈了一步。{!||||然后灯灭了。 -> eek}

备选文本可以嵌套。
（译注：这个例子不方便翻译为中文，原文如下）

	The Ratbear {&{wastes no time and |}swipes|scratches} {&at you|into your {&leg|arm|cheek}}.

备选文本可以包含跳转语句。

	    我{等着。|又等了一会儿。|打了个盹。|醒来后继续等。|放弃了然后离开。 -> leave_post_office}

备选文本也可以用在选项文本中：

	+ 	"你好，{&主人|福格先生|你|棕眼睛的朋友}！"[] 我说道。

（……不过有一个限制：你不能以 `{` 开头作为选项的文本，否则它会被视为一个条件。）

（……但是这个限制还有一个例外，如果你在 `{` 前使用一个转义空格 `\ `，Ink 会将其识别为文本。）

    +\ {&他们朝着沙地出发了|他们前往了沙漠|一行人沿着古道向南走去}

#### Examples

备选文本可以用在循环中，创造出一种智能且具有状态跟踪的游戏玩法效果，而无需特别努力。

以下是一个只有一个节点的打地鼠游戏版本。请注意，我们使用了仅一次的选项和一个后备选项，以确保地鼠不会到处乱跑，并且游戏最终会结束。

	=== whack_a_mole ===
		{我抡起锤子。|{~打偏了！|什么都没打到！|不行。它在哪？|啊哈！打中了！ -> END}}
		这只{&地鼠|{&讨厌的|该死的|恶心的} {&生物|啮齿类}}{&藏在某处|还在躲着|依然逍遥法外|正在嘲笑我|还没有被敲到|注定被消灭}。<>
		{！我要让它好看！|但这次它逃不掉了！}
		*  [{&敲打|猛击|试试} 左上] -> whack_a_mole
		*  [{&猛击|拍打|敲击} 右上] -> whack_a_mole
		*  [{&用力锤|猛锤} 中间] -> whack_a_mole
		*  [{&拍下|猛打} 左下] -> whack_a_mole
		*  [{&重击|狠敲} 右下] -> whack_a_mole
		*  ->
			然后你因为饥饿而倒下了。地鼠打败了你！
			-> END

运行这个游戏会产生以下效果：

	我抡起锤子。
	这只地鼠藏在某处。我要让它好看！

	1: 敲打 左上
	2: 猛击 右上
	3: 用力锤 中间
	4: 拍下 左下
	5: 重击 右下

	> 1
	打偏了！
	这只讨厌的生物正在躲着。但这次它逃不掉了！

	1: 拍打 右上
	2: 猛锤 中间
	3: 猛打 左下
	4: 狠敲 右下

	> 4
	什么都没打到！
	这只地鼠依然逍遥法外。

	1: 敲击 右上
	2: 用力锤 中间
	3: 拍下 左下

	> 2
	它在哪？
	这只该死的啮齿类正在嘲笑我。

	1: 猛击 右上
	2: 猛打 左下

	> 1
	啊哈！打中了！


以下是一个生活方式建议的例子。请注意这里的“黏性选项”——电视的诱惑永远不会消失：

	=== turn_on_television ===
	我打开了电视{第一次|第二次|又一次|再一次}，但发现{没什么好看的，于是关掉了|仍然没有值得看的东西|比之前更无聊|只是一堆垃圾|是关于鲨鱼的节目，而我不喜欢鲨鱼|什么都没放}。
	+ [再试一次] -> turn_on_television
	* [改为出门] -> go_outside_instead

	=== go_outside_instead ===
	-> END



#### Sneak Preview: Multiline alternatives 偷跑预览：多行备选文本  
**ink** 还提供了一种格式，可以为不同内容块创建备选文本。详情请参见[多行块](#multiline-blocks)部分。


### Conditional Text 条件文本

文本也可以根据逻辑判断进行变化，就像选项一样。

	{met_blofeld: "我见过他。只有一会儿。"}

and

	"他的真名是 {met_blofeld.learned_his_name: 弗朗茨|一个秘密}。"

这些文本可以作为单独的行出现，也可以嵌入到内容部分中。它们甚至可以嵌套，例如：

	{met_blofeld: "我见过他。只有一会儿。他的真名是 {met_blofeld.learned_his_name: 弗朗茨|一个秘密}。" | "我错过了他。他特别邪恶吗？"}

可以生成以下任一内容：

	"我见过他。只有一会儿。他的真名是弗朗茨。"

或：

	"我见过他。只有一会儿。他的真名是一个秘密。"

或：

	"我错过了他。他特别邪恶吗？"

## 9) Game Queries and Functions 游戏查询和函数  

**ink** 提供了一些关于游戏状态的“游戏层级”查询，用于条件逻辑。这些查询并不是语言本身的一部分，但它们始终可用，并且无法被作者修改。从某种意义上来说，它们是语言的“标准库函数”。  

这些查询通常以全大写命名。

### CHOICE_COUNT()

`CHOICE_COUNT` 返回当前区块中到目前为止创建的选项数量。例如：

	* 	{false} 选项 A
	* 	{true} 选项 B
	* 	{CHOICE_COUNT() == 1} 选项 C

会生成两个选项：B 和 C。这对于控制玩家在一回合中可以获得的选项数量非常有用。

### TURNS()

该函数返回自游戏开始以来的游戏回合数。

### TURNS_SINCE(-> knot)

`TURNS_SINCE` 返回自某个结点/段落（knot/stitch）上次被访问以来的回合数（严格来说是玩家输入次数）。  

- 返回值为 0 表示“在当前区块中已被访问”。  
- 返回值为 -1 表示“从未被访问过”。  
- 任何其他正值表示它在该回合数之前被访问过。  

	* {TURNS_SINCE(-> sleeping.intro) > 10} 你感到有些疲倦…… -> sleeping
	* {TURNS_SINCE(-> laugh) == 0} 你试图停止笑声。

注意，传递给 `TURNS_SINCE` 的参数是一个“转向目标”，而不是简单的结点地址本身（因为结点地址是一个数字——阅读次数，而不是故事中的位置……）

TODO: （需要向编译器传递 -c 参数）

#### Sneak preview: using TURNS_SINCE in a function 偷跑预览：在函数中使用 TURNS_SINCE

`TURNS_SINCE(->x) == 0` 的测试非常有用，因此通常值得将其封装为一个 ink 函数。

	=== function came_from(-> x)
		~ return TURNS_SINCE(x) == 0

函数章节更清楚地概述了这里的语法，但上述函数允许你编写如下内容：

	* {came_from(->  nice_welcome)} '我很高兴来到这里！'
	* {came_from(->  nasty_welcome)} '让我们快点结束吧。'

……从而让游戏对玩家“刚刚”看到的内容做出反应。

### SEED_RANDOM()

出于测试目的，固定随机数生成器通常非常有用，这样 ink 在每次运行时都会产生相同的结果。你可以通过“设置种子”来初始化随机数系统。

~ SEED_RANDOM(235)

传递给种子函数的数字是任意的，但使用不同的种子将会生成不同的结果序列。

#### Advanced: more queries 高级：更多查询  

你可以创建自己的外部函数，不过其语法略有不同：请参阅下面的[函数](#5-functions)章节。

# Part 2: Weave 编织

到目前为止，我们一直在用最简单的方式构建分支故事，通过“选项”链接到“页面”。

但这种方式要求我们为故事中的每个目标单独命名，这可能会降低编写效率，并让小分支的创建变得繁琐。

**ink** 提供了一种更强大的语法，旨在简化具有始终向前推进方向的故事流程（正如大多数故事所具有的，而大多数计算机程序却没有）。

这种格式被称为“编织（weave）”，它是基于基础内容/选项语法构建的，并引入了两个新特性：聚合标记 `-`，以及选项和聚合的嵌套。

## 1) Gathers 聚合

### Gather points gather the flow back together 聚合点将流程汇集到一起

让我们回到本文档开头的第一个多选示例。

	“那是什么？”我的主人问道。

	* 	“我有点累了[。”]”，我重复道。  
		“是吗，”他回应道，“真让人难受。”  
	* 	“没什么，先生！”[] 我回答道。  
	* 	“我说，这趟旅程糟透了[。”]，我再也不想继续了。”  
		“啊，”他语气温和地说道，“我明白你感到沮丧了。明天会好起来的。”

在实际的游戏中，这三个选项可能最终都会导致相同的结论——福格先生离开房间。我们可以通过一个聚合点来实现这一点，而不需要创建新的结点或添加任何跳转。

	“那是什么？”我的主人问道。

	* 	“我有点累了[。”]”，我重复道。  
		“是吗，”他回应道，“真让人难受。”  
	* 	“没什么，先生！”[] 我回答道。  
		“很好，那就这样吧。”  
	* 	“我说，这趟旅程糟透了[。”]，我再也不想继续了。”  
		“啊，”他语气温和地说道，“我明白你感到沮丧了。明天会好起来的。”  

然后通过聚合点结束：  

	- 	随后，福格先生离开了房间。

这将产生以下游戏流程：

	“那是什么？”我的主人问道。

	1: “我有点累了。”  
	2: “没什么，先生！”  
	3: “我说，这趟旅程糟透了。”

	> 1  
	“我有点累了[。”]”，我重复道。  
	“是吗，”他回应道，“真让人难受。”  
	随后，福格先生离开了房间。

### Options and gathers form chains of content 选项和聚合点构成内容链条

我们可以将这些聚合和分支的部分串联起来，创建始终向前推进的分支序列。

	=== escape ===
	我穿过森林奔跑，猎狗紧追在后。

		* 	我检查了口袋中的珠宝[]，触摸到它们让我步伐更加轻快。 <>

		* 	我没有停下喘气[]，而是继续奔跑。 <>

		* 	我欢呼着，满心喜悦。 <>

	- 	道路应该不远了！麦基会发动引擎，然后我就安全了。

		* 	我跑到路边环顾四周[]。你能相信吗？  
		* 	我应该插一句，麦基通常非常可靠[]。他从未让我失望过，或者更确切地说，从未让我失望过……直到那个晚上。

	- 	路上空无一人。麦基无影无踪。

这是最基础的一种编织（weave）形式。本节的其余部分将详细说明更多功能，包括如何让编织嵌套、包含支线和偏离内容、自我跳转，以及最重要的，如何引用早期的选项来影响后续内容。

#### The weave philosophy 编织的理念

编织（weave）不仅仅是分支流程的一种便利封装，它也是一种创作更健壮内容的方式。上面的 `escape` 示例已经包含四种可能的路径，而更复杂的序列可能会有更多更多的路径。使用常规的跳转（diverts），需要通过逐点检查跳转链接，这很容易导致错误。

使用编织，流程保证从顶部开始并“流向”底部。在基础编织结构中，流程错误是不可能发生的，并且输出的文本可以轻松快速地阅读。这意味着无需在游戏中实际测试所有分支，也能确保它们按预期工作。

编织还允许轻松地对选项点进行重新设计；特别是，可以很方便地分割句子并插入额外的选项，以增加多样性或调整节奏，而无需重新设计任何流程。

## 2) Nested Flow 嵌套流程

上面展示的编织结构相对简单，属于“扁平化”结构。无论玩家做出什么选择，他们从头到尾所需的回合数都是相同的。然而，有时某些选择可能需要更多的深度或复杂性。

为此，我们允许编织进行嵌套。

需要注意的是，嵌套编织功能非常强大且紧凑，但需要一些时间来适应和掌握！

### Options can be nested 选项可以嵌套

考虑以下场景：

	- 	"那么，波洛？是谋杀还是自杀？"
	* 	"谋杀！"
	* 	"自杀！"
	- 	克里斯蒂夫人放下了手中的手稿片刻。其余写作小组成员目瞪口呆地坐在那里。

首先出现的选项是“谋杀！”或“自杀！”。如果波洛宣布是自杀，那么无需进一步操作；但如果是谋杀，则需要后续的问题——他怀疑是谁？

我们可以通过一组嵌套的子选项来添加新选项。通过使用两个星号（**）而不是一个星号（*），我们告诉脚本这些新选项是“属于”另一个选项的。


	- 	"那么，波洛？是谋杀还是自杀？"
		* 	"谋杀！"
			"是谁干的？"
			* *		"侦探督察贾普！"
			* *		"海斯廷斯上尉！"
			* *		"我自己！"
		* 	"自杀！"
	- 	克里斯蒂夫人放下了手中的手稿片刻。其余写作小组成员目瞪口呆地坐在那里。

（注意，为了清晰起见，最好对嵌套的行进行缩进，但编译器对此并不在意。）

如果我们希望为另一条路线添加新的子选项，也可以采用类似的方法：

	- 	"那么，波洛？是谋杀还是自杀？"
		* 	"谋杀！"
			"是谁干的？"
			* * 	"侦探督察贾普！"
			* * 	"海斯廷斯上尉！"
			* * 	"我自己！"
		* 	"自杀！"
			"真的，波洛？你确定吗？"
			* * 	"非常确定。"
			* * 	"这显而易见。"
	- 	克里斯蒂夫夫人放下了手中的手稿片刻。其余写作小组成员目瞪口呆地坐在那里。

现在，最初的指控选项将引导到特定的后续问题——无论如何，流程最终都会在聚合点回合，迎来克里斯蒂夫人的客串登场。

但如果我们想要更长的子场景呢？

### Gather points can be nested too 聚合点也可以嵌套

有时候，问题并不是增加选项的数量，而是需要在故事中添加多个额外的情节节点。我们可以通过嵌套聚合点和选项来实现这一点。

	- 	"那么，波洛？是谋杀还是自杀？"
    	* 	"谋杀！"
        	"是谁干的？"
        	* * 	"侦探督察贾普！"
        	* * 	"海斯廷斯上尉！"
        	* * 	"我自己！"
        	- - 	"你一定是在开玩笑！"
        	* * 	"我的朋友，我是认真的。"
        	* * 	"如果是这样的话……"
    	* "自杀！"
    	    "真的，波洛？你确定吗？"
    	    * * 	"非常确定。"
    	    * * 	"这显而易见。"
	-	克里斯蒂夫人放下了手中的手稿片刻。其余写作小组成员目瞪口呆地坐在那里。

如果玩家选择了“谋杀”选项，他们将在自己的分支中连续面对两个选择——这是一个完整的“扁平化”编织，仅为他们设计。

#### Advanced: What gathers do 高级：聚合点的作用


聚合点（Gathers）的概念希望是直观的，但它们的行为稍微难以用语言描述：一般来说，在某个选项被选择后，故事会找到下一个不在更低层级的聚合点，并跳转到那里。

基本思想是这样的：选项将故事路径分开，而聚合点将它们重新汇集在一起。（这也是“编织（weave）”这个名称的由来！）

### You can nest as many levels are you like

在上面的例子中，我们使用了两层嵌套：主流程和子流程。但实际上，你可以嵌套任意多层级，没有限制。

	- "给我们讲个故事吧，船长！"
		* "好吧，你们这些海狗。这是一个故事……"
			* * "这是一个黑暗而暴风雨的夜晚……"
				* * * "……船员们都坐立不安……"
					* * * * "……他们对船长说……"
						* * * * * "……讲个故事吧，船长！"
		* "不行，太晚了，该睡觉了。"
	- 所有的船员都开始打哈欠。

随着嵌套层级的增加，子嵌套内容会变得难以阅读和操作。因此，如果某个分支选项变得过于复杂，最好将其跳转到一个新的段落（stitch），以保持代码的清晰性。

不过，至少在理论上，你可以将整个故事写成一个单一的编织结构。

### Example: a conversation with nested nodes 示例：带嵌套节点的对话

以下是一个更长的示例：

	- 我看向福格先生。
	* ... 然后我再也无法忍耐。
		“我们的旅程目的是什么，先生？”
		“是一个赌注。”他回答。
		* * “一个赌注！”[] 我回应道。
				他点了点头。
				* * * “但这未免太荒唐了吧！”
				* * * “那么这一定是件非常严肃的事情！”
				- - - 他又点了点头。
				* * * “但我们能赢吗？”
						“这正是我们要努力去发现的。”他回答。
				* * * “我相信这是个小赌注吧？”
						“两万英镑。”他平淡地说道。
				* * * 我没有再问他任何问题[.]，最后他礼貌地清了清嗓子，也没有再说什么。 <>
		* * “啊[.]。”我回答道，不确定自己在想什么。
		- - 然后，<>
	* ... 但我什么也没说[]，然后 <>
	- 我们一整天都沉默不语。
	- -> END

有几种可能的游戏流程。一个较短的示例：

	我看向福格先生。

	1: ... 然后我再也无法忍耐。
	2: ... 但我什么也没说。

	> 2
	... 但我什么也没说，然后我们一整天都沉默不语。

以及一个较长的示例：

	我看向福格先生。

	1: ... 然后我再也无法忍耐。
	2: ... 但我什么也没说。

	> 1
	... 然后我再也无法忍耐。
	“我们的旅程目的是什么，先生？”
	“是一个赌注。”他回答。

	1: “一个赌注！”
	2: “啊。”

	> 1
	“一个赌注！”我回应道。
	他点了点头。

	1: “但这未免太荒唐了吧！”
	2: “那么这一定是件非常严肃的事情！”

	> 2
	“那么这一定是件非常严肃的事情！”
	他又点了点头。

	1: “但我们能赢吗？”
	2: “我相信这是个小赌注吧？”
	3: 我没有再问他任何问题。

	> 2
	“我相信这是个小赌注吧？”
	“两万英镑。”他平淡地说道。
	然后，我们一整天都沉默不语。

希望这个例子很好地展示了上述理念：编织（weave）提供了一种紧凑的方式，能够创建丰富的分支和大量的选择，但始终能保证从开头到结尾的连贯性！


## 3) Tracking a Weave 跟踪编织

有时候，编织结构本身已经足够，但当情况复杂时，我们需要更多的控制。

### Weaves are largely unaddressed 编织大多是无标记的

默认情况下，编织中的内容行没有地址或标签，这意味着它们不能被跳转到，也无法进行测试。在最基本的编织结构中，选项只是决定玩家在编织中所经历的路径和所看到的内容，但一旦编织结束，这些选择和路径就会被遗忘。

然而，如果我们希望记住玩家所经历的内容，可以通过添加标签来实现。使用 `(label_name)` 语法，我们可以在需要的地方添加标签。

### Gathers and options can be labelled 聚合点和选项可以添加标签

嵌套层级中的任何聚合点都可以使用括号添加标签。

	-  (top)

一旦添加了标签，聚合点就可以像结点（knots）和段落（stitches）一样被跳转到，或用于条件测试。这意味着你可以在编织中利用先前的选择来改变后续的结果，同时仍然保留清晰可靠的前向流程优势。

选项也可以像聚合点一样使用括号添加标签。标签括号位于该行的条件之前。

这些地址可以用于条件测试，这在创建由其他选项解锁的选项时非常有用。

	=== meet_guard ===
	卫兵皱着眉头看着你。

	* (greet) [向他打招呼]  
		“你好。”  
	* (get_out) “滚开[.]，”你对卫兵说道。

	- “嗯，”卫兵答道。

	* {greet} “今天过得怎么样？” // 只有在你向他打招呼时可见

	* “嗯？”[] 你回答。

	* {get_out} [把他推开] // 只有在你威胁他时可见  
		你狠狠地把他推开。他盯着你看，拔出了剑！  
		-> fight_guard // 这一选项跳出编织结构

	- “唔，”卫兵回答，然后递给你一个纸袋。“太妃糖？”  


### Scope 作用域

在同一个编织块中，你可以直接使用标签名称；而从块外引用时，需要使用路径。路径可以指向同一结点中的不同段落（stitch）：

	=== knot ===
	= stitch_one
		- (gatherpoint) 一些内容。
	= stitch_two
		*	{stitch_one.gatherpoint} 选项

或者指向另一个结点（knot）中的内容：

	=== knot_one ===
	-	(gather_one)
		* {knot_two.stitch_two.gather_two} 选项

	=== knot_two ===
	= stitch_two
		- (gather_two)
			*	{knot_one.gather_one} 选项


#### Advanced: all options can be labelled 高级：所有选项都可以添加标签

事实上，Ink 中的所有内容都是编织（weave），即使看不到任何聚合点。这意味着你可以用括号标签为游戏中的*任何*选项添加标签，并使用地址语法引用它们。尤其是，这允许你测试玩家选择了*哪个*选项以到达特定的结果。

	=== fight_guard ===
	...
	= throw_something
	* (rock) [向卫兵扔石头] -> throw
	* (sand) [向卫兵扔沙子] -> throw

	= throw
	你朝卫兵扔了{throw_something.rock:一块石头|一把沙子}。


#### Advanced: Loops in a weave 高级：编织中的循环

通过添加标签，我们可以在编织中创建循环。以下是一个常见的模式，用于向 NPC 提问。

	- (opts)
		* '我可以从哪里弄到一套制服？'[] 你问那位开朗的卫兵。
			“当然可以。在储物柜里。”他咧嘴一笑。“不过，我想它不太适合你。”
		* '告诉我关于安保系统的事情。'
			“它很老旧了，”卫兵向你保证道。“老得像煤一样。”
		* '有狗吗？'
			“成百上千只，”卫兵回答，露出一口牙齿的笑容。“而且都很饿。”

		// 我们要求玩家至少问一个问题
		* {loop} [够了，不想再聊了]
			-> done
	- (loop)
		// 循环几次，直到卫兵觉得无聊
		{ -> opts | -> opts | }
		他挠了挠头。
		“嗯，不能整天站着聊天，”他宣布道。
	- (done)
		你向卫兵道谢，然后离开。

#### Advanced: diverting to options 高级：跳转到选项

选项也可以跳转到：但跳转会直接进入选择该选项后的输出内容，就像该选项已经被选择过一样。因此，打印的内容会忽略方括号内的文本，并且如果选项是一次性的，它会被标记为已用。

	- (opts)
	* [扮鬼脸]
		你扮了个鬼脸，士兵冲向你！ -> shove

	* (shove) [把卫兵推开] 你将卫兵推到一旁，但他又挥着拳头回来了。

	* {shove} [与他扭打] -> fight_the_guard

	- -> opts

生成的流程为：

	1: 扮鬼脸
	2: 把卫兵推开

	> 1
	你扮了个鬼脸，士兵冲向你！你将卫兵推到一旁，但他又挥着拳头回来了。

	1: 与他扭打

	>

#### Advanced: Gathers directly after an option 高级：选项后直接添加聚合点

以下内容是有效的，而且经常很有用：

	* “你还好吗，先生？”[] 我问道。
		- - (quitewell) “我很好。”他答道。
	* “先生，你的纵横字谜做得怎么样？”[] 我问道。
		-> quitewell
	* 我什么也没说[]，我的主人也保持了沉默。
	- 我们再次陷入了默契的沉默中。

注意第一个选项正下方的二级聚合点：这里实际上没有要聚合的内容，但它为我们提供了一个方便的跳转位置，以便将第二个选项跳转到这里。



# Part 3: Variables and Logic 第 3 部分：变量和逻辑

到目前为止，我们已经使用基于玩家所见内容的测试创建了条件文本和条件选项。

**ink** 同样支持变量，包括临时变量和全局变量，可用于存储数字、文本数据，甚至是故事流程命令。在逻辑功能上，**ink** 是完整的，并且包含了一些额外的结构，以帮助更好地组织分支故事中通常复杂的逻辑。

## 1) Global Variables 全局变量

最强大、也可以说对故事最有用的一种变量，是用于存储游戏状态中某些独特属性的变量——例如主角口袋中的金钱数量，或者主角的心情状态。

这种变量被称为“全局变量”，因为它可以在故事中的任何地方访问、设置和读取。（传统编程通常会避免这种用法，因为它可能导致一个程序的某部分干扰另一个无关的部分。但故事是由因果关系驱动的：在拉斯维加斯发生的事情，很少会留在拉斯维加斯。）

### Defining Global Variables 定义全局变量

全局变量可以通过 `VAR` 语句在任何地方定义。定义时需要为变量赋予一个初始值，以确定它的类型——整数、浮点数（小数）、内容，或故事地址。

    VAR knowledge_of_the_cure = false
    VAR players_name = "Emilia"
    VAR number_of_infected_people = 521
    VAR current_epilogue = -> they_all_die_of_the_plague

### Using Global Variables 使用全局变量

我们可以测试全局变量，以控制选项并提供条件文本，方式类似于之前所见的例子。

    === the_train ===
        火车晃动并发出咔哒声。{ mood > 0:然而，我感到心情还算不错，不太在意这些颠簸|这简直让我无法忍受}。
        * { not knows_about_wager } “可是，先生，我们为什么要旅行？”[] 我问道。
        * { knows_about_wager } 我思索着我们这场奇怪的冒险[]. 这会有可能吗？

#### Advanced: storing diverts as variables 高级：将跳转存储为变量

“跳转”（divert）语句本身是一种值，可以被存储、修改并跳转到。

    VAR current_epilogue = -> everybody_dies

    === continue_or_quit ===
    现在放弃，还是继续努力拯救你的王国？
    * [继续努力！] -> more_hopeless_introspection
    * [放弃] -> current_epilogue


#### Advanced: Global variables are externally visible 高级：全局变量是外部可见的

全局变量不仅可以在故事中访问和修改，也可以从运行时中访问和修改，因此它们是连接游戏主程序和故事的良好桥梁。

**ink** 层通常是存储游戏变量的好地方；不需要考虑保存/加载的问题，同时故事本身可以对当前值做出反应。


### Printing variables 打印变量

变量的值可以通过类似于序列和条件文本的内联语法打印为内容：

    VAR friendly_name_of_player = "Jackie"
    VAR age = 23

    我的名字是让·帕斯帕图（Jean Passepartout），但我的朋友都叫我 {friendly_name_of_player}。我今年 {age} 岁。

这在调试时非常有用。有关基于逻辑和变量的更复杂打印，请参阅函数部分。

### Evaluating strings 评估字符串

你可能注意到，上文提到变量可以包含“内容”，而不是“字符串”。这是有意为之，因为在 **ink** 中定义的字符串可以包含 ink 代码——尽管最终它们始终会被评估为字符串。（令人惊叹！）

    VAR a_colour = ""

    ~ a_colour = "{~red|blue|green|yellow}"

    {a_colour}

... 将生成 red、blue、green 或 yellow 之一。

注意，一旦像这样的内容被评估，其值是“粘性的”。（即量子状态已坍缩。）例如：

    暴徒打了你一拳，火花在你眼前飞舞，{a_colour} 和 {a_colour}。

... 不会产生特别有趣的效果。（如果你真的希望这有效，使用一个文本函数来打印颜色！）

这也是为什么：

    VAR a_colour = "{~red|blue|green|yellow}"

是明确禁止的；它会在故事构建时被评估，而这可能不是你想要的结果。


## 2) Logic 逻辑

显然，全局变量并不是用来作为常量的，因此我们需要一种语法来修改它们。

由于默认情况下，**ink** 脚本中的任何文本都会直接打印到屏幕上，我们需要一个标记符号来表示某行内容是用于执行数值操作的。我们使用 `~` 标记来实现这一点。

以下语句都会为变量赋值：

	=== set_some_variables ===
		~ knows_about_wager = true
		~ x = (x * x) - (y * y) + c
		~ y = 2 * x * y

以下内容会测试条件：

	{ x == 1.2 }
	{ x / 2 > 4 }
	{ y - 1 <= x * x }

### Mathematics 数学运算

**ink** 支持四种基本的数学运算符（`+`、`-`、`*` 和 `/`），以及 `%`（或 `mod`），它返回整数除法后的余数。此外，还有 `POW` 函数用于计算幂：

    {POW(3, 2)} 是 9。
    {POW(16, 0.5)} 是 4。

如果需要更复杂的运算，可以编写函数（必要时使用递归），或者调用外部游戏代码函数（用于更高级的运算）。


#### RANDOM(min, max)

如果需要，**ink** 可以使用 `RANDOM` 函数生成随机整数。`RANDOM` 的设计类似于掷骰子（是的，我们说的是 *一个骰子*），因此最小值和最大值都包含在结果范围内。

    ~ temp dice_roll = RANDOM(1, 6)
    ~ temp lazy_grading_for_test_paper = RANDOM(30, 75)
    ~ temp number_of_heads_the_serpent_has = RANDOM(3, 8)

随机数生成器可以通过种子进行初始化以便测试，详见上文的“游戏查询和函数”部分。

#### Advanced: numerical types are implicit 高级：数值类型是隐式的

操作的结果——尤其是除法——的类型基于输入类型。整数除法返回整数结果，而浮点数除法返回浮点数结果。

    ~ x = 2 / 3
    ~ y = 7 / 3
    ~ z = 1.2 / 0.5

其中，`x` 为 0，`y` 为 2，`z` 为 2.4。

#### Advanced: INT(), FLOOR() and FLOAT()

如果你不想使用隐式类型，或者想将变量舍入，可以直接对其进行类型转换。

    {INT(3.2)} 是 3。
    {FLOOR(4.8)} 是 4。
    {INT(-4.8)} 是 -4。
    {FLOOR(-4.8)} 是 -5。

    {FLOAT(4)} 仍然是 4。

### String queries 字符串查询

对于一个文本引擎来说，**ink** 对字符串处理的支持出奇地有限：假设任何你需要的字符串转换都会由游戏代码（或外部函数）处理。但我们支持三种基本查询——等于、不等于和子字符串（我们称之为 `?`，原因将在后续章节中解释）。

以下表达式都会返回 true：


	{ "Yes, please." == "Yes, please." }
	{ "No, thank you." != "Yes, please." }
	{ "Yes, please" ? "ease" }


## 3) Conditional blocks (if/else) 条件块

我们已经见过条件被用来控制选项和故事内容；**ink** 还提供了一个等价于普通 if/else-if/else 结构的功能。

### A simple 'if' 简单的 'if'

if 语法基于之前的条件格式，使用 `{`...`}` 语法来指示某些内容正在被测试。

	{ x > 0:
		~ y = x - 1
	}

可以提供 else 条件：

	{ x > 0:
		~ y = x - 1
	- else:
		~ y = x + 1
	}

### Extended if/else if/else blocks 扩展的 if/else-if/else 块

上述语法实际上是更通用结构的一种特例，类似于其他语言中的 "switch" 语句：

	{
		- x > 0:
			~ y = x - 1
		- else:
			~ y = x + 1
	}

通过这种形式，我们可以添加 "else-if" 条件：

	{
		- x == 0:
			~ y = 0
		- x > 0:
			~ y = x - 1
		- else:
			~ y = x + 1
	}

（注意，与其他部分一样，空格仅用于提高可读性，对语法没有意义。）

### Switch blocks

**ink** 还提供了真正的 switch 语句：

	{ x:
	- 0: 	zero
	- 1: 	one
	- 2: 	two
	- else: lots
	}

#### Example: context-relevant content 示例：上下文相关的内容

需要注意的是，这些条件不必基于变量，也可以使用读取计数，与其他条件类似。以下结构很常见，用于根据当前游戏状态生成相关内容：

	=== dream ===
		{
			- visited_snakes && not dream_about_snakes:
				~ fear++
				-> dream_about_snakes

			- visited_poland && not dream_about_polish_beer:
				~ fear--
				-> dream_about_polish_beer

			- else:
				// breakfast-based dreams have no effect
				-> dream_about_marmalade
		}

这种语法的优势在于易于扩展和优先级控制。

### Conditional blocks are not limited to logic 条件块不仅限于逻辑

条件块不仅可以用于逻辑控制，还可以用于控制故事内容：

    我盯着福格先生。
    { know_about_wager:
        <> “但你肯定不是认真的吧？”我质问道。
    - else:
        <> “但总得有个原因吧，”我说道。
    }
    他没有回应，只是专注地看着报纸，仿佛昆虫学家在研究他最新的标本。

你甚至可以在条件块中加入选项：

    { door_open:
        * 我大步走出车厢[]，仿佛听到我的主人小声嘟囔了一句。 -> go_outside
    - else:
        * 我请求允许离开[]，福格先生看起来有些吃惊。 -> open_door
        * 我站起身去开门[]，福格先生对此小小的反叛毫不在意。 -> open_door
    }

但请注意，上述例子中缺少编织语法和嵌套并非偶然：为了避免混淆嵌套类型，你不能在条件块中包含聚合点。

### Multiline blocks 多行块

还有另一类多行块，基于之前的替代系统扩展。以下示例都是有效的，并且效果如预期：

    // 顺序：依次显示替代内容，最后停留在最后一项
    { stopping:
        - 我走进赌场。
        - 我又走进赌场。
        - 我再次走进赌场。
    }

    // 随机：随机显示一项内容
    在桌上，我抽了一张牌。<>
    { shuffle:
        - 红心 A。
        - 黑桃 K。
        - 方块 2。
          “这次你输了！”荷官笑着说。
    }

    // 循环：依次显示每一项，然后循环
    { cycle:
        - 我屏住了呼吸。
        - 我不耐烦地等待。
        - 我停下脚步。
    }

    // 一次性：依次显示每一项，直到所有内容都被展示完
    { once:
        - 我的运气会好吗？
        - 我能赢这一局吗？
    }

#### Advanced: modified shuffles 高级：修改的随机显示

上面的随机块实际上是一个“随机循环”，会打乱内容顺序，依次播放，然后重新打乱再播放。

还有两种其他版本的随机显示：

`shuffle once` 会打乱内容顺序，播放一次后停止。

    { shuffle once:
    - 太阳很热。
    - 这是一个炎热的日子。
    }

`shuffle stopping` 会打乱内容（除了最后一项），播放后停留在最后一项。

    { shuffle stopping:
    - 一辆银色宝马呼啸而过。
    - 一辆明黄色野马漂移转弯。
    - 这里似乎有很多车。
    }

## 4) Temporary Variables 临时变量

### Temporary variables are for scratch calculations 临时变量用于快速计算

有时，全局变量显得不太方便。**ink** 提供了临时变量来进行快速的计算。

	=== near_north_pole ===
		~ temp number_of_warm_things = 0
		{ blanket:
			~ number_of_warm_things++
		}
		{ ear_muffs:
			~ number_of_warm_things++
		}
		{ gloves:
			~ number_of_warm_things++
		}
		{ number_of_warm_things > 2:
			尽管下着雪，我还是感到异常温暖。
		- else:
			那晚我比任何时候都要冷。
		}

临时变量的值在故事离开定义该变量的节（stitch）后会被丢弃。

### Knots and stitches can take parameters 节点和节可以接受参数

一个特别有用的临时变量形式是参数。任何节点（knot）或节（stitch）都可以接受一个作为参数的值。


    * [指控哈斯廷]
        -> accuse("Hastings")
    * [指控黑夫人]
        -> accuse("Claudia")
    * [指控我自己]
        -> accuse("myself")

    === accuse(who) ===
        "我指控 {who}!" 波洛宣布。
        "真的吗?" 贾普回应道。"{who == "myself":你干的?|{who}?}"
        "那为什么不呢?" 波洛反问道。



... 如果你希望将临时值从一个节传递到另一个节时，必须使用参数！

#### Example: a recursive knot definition 示例：递归节点定义

临时变量在递归中是安全使用的（与全局变量不同），因此以下代码可以正常工作。

	-> add_one_to_one_hundred(0, 1)

	=== add_one_to_one_hundred(total, x) ===
		~ total = total + x
		{ x == 100:
			-> finished(total)
		- else:
			-> add_one_to_one_hundred(total, x + 1)
		}

	=== finished(total) ===
       "结果是 {total}!" 你宣布道。
        高斯惊恐地盯着你。
		-> END


（事实上，这种定义非常有用，以至于 **ink** 提供了一种特殊的节点，叫做 `function`，它有某些限制并且可以返回一个值。请参阅下面的部分。）


#### Advanced: sending divert targets as parameters 高级：将跳转目标作为参数传递

节点/节地址本身也是一种值，由 `->` 符号表示，因此可以存储并传递。以下是合法的，并且经常有用的：

    === sleeping_in_hut ===
        你躺下并闭上了眼睛。
        -> generic_sleep (-> waking_in_the_hut)

    === generic_sleep (-> waking)
        你沉沉睡去，梦中或许能见到些许神奇。
        -> waking

    === waking_in_the_hut
        你重新站起身来，准备继续旅程。

... 但请注意 `->` 在 `generic_sleep` 定义中的使用：这是 **ink** 中唯一一个需要指定类型的参数，因为如果不加以注意，很容易写成以下内容：

    === sleeping_in_hut ===
        你躺下并闭上了眼睛。
        -> generic_sleep (waking_in_the_hut)

... 这样会把 `waking_in_the_hut` 的读取计数传递给 `sleeping` 节点，并尝试跳转到它。



## 5) Functions 函数

节点的参数使它们几乎可以看作是函数，但缺少一个关键概念——调用栈和返回值的使用。

**ink** 提供了函数功能：函数是节点，但具有以下限制和特性：

一个函数：
- 不能包含节（stitches）  
- 不能使用跳转（diverts）或提供选项  
- 可以调用其他函数  
- 可以包含打印的内容  
- 可以返回任何类型的值  
- 可以安全地递归  

（这些限制看起来可能有点苛刻，但对于更面向故事的调用栈功能，请参阅 [隧道](#1-tunnels) 部分。）

返回值通过 `~ return` 语句提供。

### Defining and calling functions 定义和调用函数

要定义一个函数，只需声明一个节点为函数：

	=== function say_yes_to_everything ===
		~ return true

	=== function lerp(a, b, k) ===
		~ return ((b - a) * k) + a

调用函数时，使用名称和括号，即使它没有参数：

	~ x = lerp(2, 8, 0.3)

	*	{say_yes_to_everything()} '是的。'

与其他语言一样，函数完成后会将流程返回到调用它的位置。尽管函数不能跳转流程，但它们仍然可以调用其他函数。

	=== function say_no_to_nothing ===
		~ return say_yes_to_everything()

### Functions don't have to return anything 函数不必返回值

函数不需要返回值，它可以简单地执行某个操作，便于打包复用：

	=== function harm(x) ===
		{ stamina < x:
			~ stamina = 0
		- else:
			~ stamina = stamina - x
		}

... 但请记住，函数不能跳转，因此尽管上述代码防止了耐力值为负数，它不会在玩家耐力值为零时导致死亡。

### Functions can be called inline 函数可以内联调用

函数可以在 `~` 内容行上调用，也可以在内容中调用。在这种情况下，如果函数有返回值，则会打印出来（以及函数想打印的任何其他内容）。如果没有返回值，则不会打印任何内容。

默认情况下，内容是“粘连”在一起的，因此以下示例：

    福格先生看起来 {describe_health(health)}。

    === function describe_health(x) ===
    {
    - x == 100:
        ~ return "精神抖擞"
    - x > 75:
        ~ return "神采奕奕"
    - x > 45:
        ~ return "有些疲惫"
    - else:
        ~ return "无精打采"
    }

将生成：

    福格先生看起来无精打采。

#### Examples 示例

例如，你可以包含以下函数：

	=== function max(a,b) ===
		{ a < b:
			~ return b
		- else:
			~ return a
		}

	=== function exp(x, e) ===
		// 返回 x 的 e 次幂，其中 e 为整数
		{ e <= 0:
			~ return 1
		- else:
			~ return x * exp(x, e - 1)
		}

然后：

    2^5 和 3^3 中的最大值是 {max(exp(2,5), exp(3,3))}。

生成：

    2^5 和 3^3 中的最大值是 32。


#### Example: turning numbers into words 将数字转换为单词

The following example is long, but appears in pretty much every inkle game to date. (Recall that a hyphenated line inside multiline curly braces indicates either "a condition to test" or, if the curly brace began with a variable, "a value to compare against".)

   === function print_num(x) ===
    {
        - x >= 1000:
            {print_num(x / 1000)} 千 { x mod 1000 > 0:{print_num(x mod 1000)}}
        - x >= 100:
            {print_num(x / 100)} 百 { x mod 100 > 0:和 {print_num(x mod 100)}}
        - x == 0:
            零
        - else:
            { x >= 20:
                { x / 10:
                    - 2: 二十
                    - 3: 三十
                    - 4: 四十
                    - 5: 五十
                    - 6: 六十
                    - 7: 七十
                    - 8: 八十
                    - 9: 九十
                }
                { x mod 10 > 0:<>-<>}
            }
            { x < 10 || x > 20:
                { x mod 10:
                    - 1: 一
                    - 2: 二
                    - 3: 三
                    - 4: 四
                    - 5: 五
                    - 6: 六
                    - 7: 七
                    - 8: 八
                    - 9: 九
                }
            - else:
                { x:
                    - 10: 十
                    - 11: 十一
                    - 12: 十二
                    - 13: 十三
                    - 14: 十四
                    - 15: 十五
                    - 16: 十六
                    - 17: 十七
                    - 18: 十八
                    - 19: 十九
                }
            }
    }

这样我们可以写出：

    ~ price = 15

    我从口袋里掏出了 {print_num(price)} 枚硬币，慢慢数了起来。
    “算了，”商人说道，“我收一半。”她拿走了 {print_num(price / 2)} 枚，把剩下的推回给我。


### Parameters can be passed by reference 参数可以通过引用传递

函数的参数也可以通过“引用”传递，这意味着函数可以直接修改被传递的变量，而不是创建一个具有该值的临时变量。

例如，大多数 **inkle** 故事中会包含以下内容：

	=== function alter(ref x, k) ===
		~ x = x + k

以下行：

	~ gold = gold + 7
	~ health = health - 4

就可以简化为：

	~ alter(gold, 7)
	~ alter(health, -4)

这样更易于阅读，且可以内联调用，实现更紧凑的代码：

    * 我吃了一个饼干[]，感觉精神了些。{alter(health, 2)}
    * 我把一个饼干递给福格先生[]，他狼吞虎咽地吃了下去。{alter(foggs_health, 1)}
    - <> 然后我们继续上路。

将简单操作封装到函数中，还可以在需要时为调试信息提供一个简单的位置。


##  6) Constants 常量


### Global Constants 全局常量

互动故事通常依赖状态机来跟踪某个更高层次过程的进度。实现这一点有很多方式，但最方便的方式是使用常量。

有时，定义常量为字符串是很方便的，这样你就可以将它们打印出来，用于游戏玩法或调试目的。

    CONST HASTINGS = "哈斯廷斯"
    CONST POIROT = "波洛"
    CONST JAPP = "贾普"

    VAR current_chief_suspect = HASTINGS

    === review_evidence ===
        { found_japps_bloodied_glove:
            ~ current_chief_suspect = POIROT
        }
        当前嫌疑人: {current_chief_suspect}

有时，给常量赋值也很有用：

	CONST PI = 3.14
	CONST VALUE_OF_TEN_POUND_NOTE = 10

有时这些数字在其他地方也会很有用：

	CONST LOBBY = 1
	CONST STAIRCASE = 2
	CONST HALLWAY = 3

	CONST HELD_BY_AGENT = -1

	VAR secret_agent_location = LOBBY
	VAR suitcase_location = HALLWAY

	=== report_progress ===
	{  secret_agent_location == suitcase_location:
		秘密特工抓住了手提箱！
		~ suitcase_location = HELD_BY_AGENT

	-  secret_agent_location < suitcase_location:
		秘密特工向前移动。
		~ secret_agent_location++
	}

常量仅仅是为了让你为故事状态赋予易于理解的名称。

## 7) Advanced: Game-side logic 高级：游戏端逻辑

在 **ink** 引擎中，有两种核心方式来提供游戏钩子。外部函数声明允许你直接调用游戏中的 C# 函数，而变量观察者是在游戏中修改 **ink** 变量时触发的回调。两者的详细描述可以参考 [运行你的 ink](RunningYourInk.md)。

# Part 4: Advanced Flow Control 高级流程控制

## 1) Tunnels 隧道

**ink** 故事的默认结构是一个“平坦”的选择树，分支并重新合并，可能会有循环，但故事始终“处于某个位置”。

然而，这种平坦的结构使得某些操作变得困难。例如，设想一个游戏，其中以下交互可以发生：

    === crossing_the_date_line ===
    * "蒙索尔!"[] 我突然惊恐地宣告。"我刚意识到，我们已经跨越了国际日期变更线！"
    - 蒙索尔·福格几乎没有抬起眉毛。"我已经调整好了。"
    * 我擦了擦额头上的汗[]。松了一口气！
    * 我点点头，心平气和[]。当然他已经调整好了！
    * 我低声诅咒[]。又一次，我被贬低了！

...但这一事件可以发生在故事中的多个位置。我们不希望为每个不同的地方编写内容的副本，但一旦内容完成，它需要知道接下来应该返回哪里。我们可以通过使用参数来实现：

	=== crossing_the_date_line(-> return_to) ===
	...
	-	-> return_to

	...

	=== outside_honolulu ===
	我们来到了大岛檀香山。
	- (postscript)
		-> crossing_the_date_line(-> done)
	- (done)
		-> END

	...

	=== outside_pitcairn_island ===
	船只沿着水面驶向小岛。
	- (postscript)
		-> crossing_the_date_line(-> done)
	- (done)
		-> END

这两个位置现在都调用并执行相同的故事段落，但一旦完成，它们会返回到需要前往的地方。

但是，如果被调用的故事部分更复杂——例如，跨越了多个节点——该怎么办？使用上面的方式，我们需要不断将 `return-to` 参数从节点传递到节点，以确保始终知道该返回哪里。

因此，**ink** 引入了一种新的分支方式，称为“隧道”，它类似于子例程，可以直接调用并管理返回流程。

### Tunnels run sub-stories 隧道执行子故事

隧道的语法看起来像一个分支，末尾还有另一个分支：

	-> crossing_the_date_line ->

这意味着“执行 crossing_the_date_line 故事，然后从这里继续”。

在隧道本身，语法比参数化的例子更简化：我们只需要使用 `->->` 来结束隧道，它意味着“继续”。

	=== crossing_the_date_line ===
	// 这是一个隧道！
	...
	- 	->->

注意，隧道节点并没有特别声明为隧道，因此编译器不会在运行时检查隧道是否确实以 `->->` 语句结束。所以，你需要小心地编写代码，确保所有进入隧道的流程都能正确退出。

隧道也可以进行链式调用，或者在结束时进行常规的分支：

	...
	// 执行隧道后，再转到 'done'
	-> crossing_the_date_line -> done
	...

	...
	// 执行一个隧道，再执行另一个隧道，然后转到 'done'
	-> crossing_the_date_line -> check_foggs_health -> done
	...

隧道也可以进行嵌套，因此以下示例是合法的：

	=== plains ===
	= night_time
		黑色的草地柔软地铺在你的脚下。
		+	[Sleep]
			-> sleep_here -> wake_here -> day_time
	= day_time
		是时候继续前进了。

	=== wake_here ===
		你在阳光下醒来。
		+	[吃点东西]
			-> eat_something ->
		+	[继续前进]
		-	->->

	=== sleep_here ===
		你躺下并试图闭上眼睛。
		-> monster_attacks ->
		然后是睡觉的时间。
		-> dream ->
		->->

... 以此类推。


#### Advanced: Tunnels can return elsewhere 隧道可以返回其他地方

有时，在故事中发生的事情可能无法确保隧道总是返回它的起点。**ink** 提供了一种语法，使你能够“从隧道返回时实际上前往其他地方”，但应谨慎使用，因为这种操作很容易导致混乱。

尽管如此，在某些情况下，这种功能是必不可少的：


	=== fall_down_cliff 
	-> hurt(5) -> 
	你还活着！你扶着自己站起来，继续前进。
	
	=== hurt(x)
		~ stamina -= x 
		{ stamina <= 0:
			->-> youre_dead
		}
	
	=== youre_dead
	突然，四周弥漫着白光。有人从你的额头上摘下一个眼镜片。‘你输了，伙计。离开椅子。’
	 
即使在不那么剧烈的情况下，我们也可能希望打破结构：
 
	-> talk_to_jim ->
 
	 === talk_to_jim
	 - (opts) 	
		*	[ 询问关于 warp lacelles ] 
			-> warp_lacells ->
		*	[ 询问关于 shield generators ] 
			-> shield_generators ->	
		* 	[ 停止交谈 ]
			->->
	 - -> opts 

	 = warp_lacells
		{ shield_generators : ->-> argue }
		"别担心 warp lacelles。它们没问题。"
		->->

	 = shield_generators
		{ warp_lacells : ->-> argue }
		"别担心 shield generators。它们没问题。"
		->->
	 
	 = argue 
	 	"这些问题怎么这么多？" 吉姆突然问道。
	 	...
	 	->->

#### Advanced: Tunnels use a call-stack 隧道使用调用栈

隧道是基于调用栈的，因此它们可以安全地递归。


## 2) Threads 线程

到目前为止，尽管有很多分支和转向，**ink** 中的一切仍然是线性的。但实际上，作家可以将故事“分叉”成不同的子部分，以涵盖更多可能的玩家行为。

我们称之为“线程”，尽管这与计算机科学中的“线程”概念有所不同：它更像是从不同地方将新内容拼接到一起。

请注意，这是一个高级功能：一旦涉及到线程，工程故事会变得更加复杂！

### Threads join multiple sections together 线程将多个部分连接在一起

线程允许你将多个来源的内容部分合并成一个整体。例如：

    == thread_example ==
    我头痛；线程很难让你理清头绪。
    <- conversation
    <- walking


    == conversation ==
    这是蒙提和我之间紧张的时刻。
     * "今天午饭吃了什么？"[] 我问。
        "午餐吃的是午餐肉和鸡蛋。" 他回答。
     * "今天天气不错。"[] 我说。
        "我见过更好的。" 他回答。
     - -> house

    == walking ==
    我们继续沿着尘土飞扬的路走。
     * [继续走]
        -> house

    == house ==
    不久后，我们到达了他的家。
    -> END

它允许将多个故事部分合并成一个部分：

    我头痛；线程很难让你理清头绪。
    这是蒙提和我之间紧张的时刻。
    我们继续沿着尘土飞扬的路走。
    1: "今天午饭吃了什么？"
    2: "今天天气不错。"
    3: 继续走

当遇到像 `<- conversation` 这样的线程语句时，编译器将会分叉故事流程。第一次分叉会执行 `conversation` 中的内容，收集所有选项。执行完 `conversation` 中的内容后，流程会继续执行下一个分叉。

所有内容都会被收集并显示给玩家。但当玩家选择一个选项时，引擎会转到该分叉的故事，并丢弃其他分支。

注意，全局变量不会被分叉，包括节点和拼接点的读取次数。

### Uses of threads 线程的用途

在普通故事中，可能永远不需要线程。

但是对于有许多独立活动的游戏来说，线程变得非常重要。假设一个游戏中角色在地图上独立移动：房间的主故事中心可能如下所示：

  	CONST HALLWAY = 1
    CONST OFFICE = 2

    VAR player_location = HALLWAY
    VAR generals_location = HALLWAY
    VAR doctors_location = OFFICE

    == run_player_location
        {
            - player_location == HALLWAY: -> hallway
        }

    == hallway ==
        <- characters_present(HALLWAY)
        * [抽屉] -> examine_drawers
        * [衣柜] -> examine_wardrobe
        * [去办公室] -> go_office
        - -> run_player_location
    = examine_drawers
        // 等等...

    // 这是线程，它将你和在房间里的角色的对话混合在一起。

    == characters_present(room)
        { generals_location == room:
            <- general_conversation
        }
        { doctors_location == room:
            <- doctor_conversation
        }
        -> DONE

    == general_conversation
        * [询问将军关于血迹斑斑的刀] 
            "这是个糟糕的事情，我可以告诉你。"
        - -> run_player_location

    == doctor_conversation
        * [询问医生关于血迹斑斑的刀] 
            "血液本身没什么奇怪的，不是吗？"
        - -> run_player_location




特别需要注意的是，我们需要一种显式的方式让玩家返回到主流程。通常情况下，线程要么需要一个参数来告知它返回的位置，要么需要结束当前的故事部分。


### When does a side-thread end? 侧线程何时结束？

侧线程在没有内容可执行时结束：注意，它们会收集选项并在后续显示（与隧道不同，隧道会收集选项并在显示后继续执行，直到达到显式的返回，可能是几步之后）。

有时，线程可能没有内容可提供——例如，或许没有与角色对话，或者我们还没写好这部分内容。此时，我们必须显式标记线程的结束。

如果不标记结束，内容的结束可能成为故事的 bug 或悬挂的故事线程，编译器会提醒我们。

### Using `-> DONE`

在我们想标记线程结束的情况下，使用 `-> DONE`：意思是“此处流程有意结束”。如果没有使用 `-> DONE`，可能会生成警告消息；我们仍然可以玩游戏，但这提醒我们还有未完成的部分。

前面示例中的线程将会生成警告；可以通过以下方式修复：

    == thread_example ==
    我头痛；线程很难让你理清头绪。
    <- conversation
    <- walking
    -> DONE

额外的 `DONE` 告诉 **ink** 流程在此结束，它应该依赖线程来进行故事的下一部分。

请注意，如果流程以条件未满足的选项结束，我们不需要使用 `-> DONE`。引擎会将其视为有效的、有意的流程结束状态。

**选项被选择后不需要 `-> DONE`**。一旦选项被选择，线程不再是线程——它只是普通的故事流程。

在这种情况下，使用 `-> END` 不会结束线程，而是结束整个故事流程。（这也是需要两种不同方式结束流程的真正原因。）

#### Example: adding the same choice to several places 示例：将相同选择添加到多个地方

线程可以用于将相同的选择添加到多个地方。当以这种方式使用时，通常会将一个分支作为参数传递，告诉故事在选择完成后该去哪里。

    === outside_the_house
    前台阶。房子里弥漫着谋杀和薰衣草的气味。
    - (top)
        <- review_case_notes(-> top)
        * [通过前门] 
            我走进了屋里。
            -> the_hallway
        * [闻闻空气]
            我讨厌薰衣草。它让我想起香皂，而香皂让我想起我的婚姻。
            -> top

    === the_hallway
    前厅。前门敞开，通向街道。一个小柜子。
    - (top)
        <- review_case_notes(-> top)
        * [通过前门] 
            我走到凉爽的阳光下。
            -> outside_the_house
        * [打开柜子]
            键，更多的键。还需要多少锁？
            -> top

    === review_case_notes(-> go_back_to)
    + {not done || TURNS_SINCE(-> done) > 10}
        [查看我的案件笔记]
        // 条件确保你不会反复查看
        {I|我} 翻阅了我到目前为止做的笔记。仍然没有明显的嫌疑人。
    - (done) -> go_back_to

注意这与隧道不同，后者执行相同的内容块，但不提供玩家选择。因此，像下面这样的布局：

    <- childhood_memories(-> next)
    * [看窗外]
        我在路上做白日梦……
    - (next) 然后哨声响起……

可能与以下内容做相同的事：

    * [回忆我的童年]
        -> think_back ->
    * [看窗外]
        我在路上做白日梦……
    - (next) 然后哨声响起……

但是，一旦被插入的选项包括多个选择，或者选择上有条件逻辑（当然，任何文本内容也是！），线程版本就变得更为实用。


#### Example: organisation of wide choice points 广泛选择点的组织

一个使用 **ink** 作为脚本的游戏，而非字面输出的游戏，通常会生成大量并行的选择，这些选择通过其他游戏内的交互来过滤，比如在环境中四处走动。线程可以在这些情况下有用，用来划分这些选择。

```
=== the_kitchen
- (top)
	<- drawers(-> top)
	<- cupboards(-> top)
	<- room_exits
= drawers (-> goback)
	// 关于抽屉的选择...  
	...
= cupboards(-> goback)
	// 关于橱柜的选择  
	...
= room_exits
	// 出口；不需要“返回点”，因为如果离开，你就会去别的地方
	...
```

# Part 5: Advanced State Tracking 第五部分：高级状态跟踪

具有大量互动的游戏很快就会变得非常复杂，编剧的工作往往与其内容一样重要，甚至更多，是保持连续性。

如果游戏文本旨在模拟任何事物——无论是扑克牌游戏、玩家迄今为止对游戏世界的了解，还是房子里各个灯开关的状态——这点就显得尤为重要。

**Ink** 并不像经典的解析器互动小说（IF）创作语言那样提供完整的世界建模系统——没有“对象”、没有“包含”或“开启”或“锁定”的概念。然而，它确实提供了一个简单而强大的系统，以非常灵活的方式跟踪状态变化，使编剧在必要时能够近似地构建世界模型。

#### Note: New feature alert! 注意：新功能提示！

这个功能对于该语言来说非常新。这意味着我们还没有开始发现它可能的所有用法——但我们很确定它会很有用！所以如果您想到一个巧妙的用法，我们很乐意知道！

## 1) Basic Lists 基本列表

状态跟踪的基本单位是状态列表，使用 LIST 关键字定义。请注意，列表与 C# 中的列表（数组）完全不同。

例如，我们可能有：

	LIST kettleState = cold, boiling, recently_boiled

这一行定义了两件事：首先是三个新值 - cold、boiling 和 recently_boiled - 其次是一个名为 kettleState 的变量，用于保存这些状态。

我们可以指定列表的值：

	~ kettleState = cold

我们可以更改值：

	*	[打开水壶]
		水壶开始冒泡并沸腾。
		~ kettleState = boiling

我们可以查询值：

	* [触摸水壶]
		{ kettleState == cold:
			水壶摸起来很凉。
		- else:
			水壶的外部非常温暖！
		}

为了方便，我们可以在定义时使用括号给列表赋值：

	LIST kettleState = cold, (boiling), recently_boiled
	// 游戏开始时，这个水壶已经被打开了。很酷吧？

…如果这种表示法看起来有点冗余，后面几个小节会有解释。


## 2) Reusing Lists 重用列表

上面的示例适用于水壶，但如果我们还有一个锅在炉子上呢？我们可以定义一个状态列表，但将它们放入变量中，并且可以有任意多个变量。

	LIST daysOfTheWeek = Monday, Tuesday, Wednesday, Thursday, Friday
	VAR today = Monday
	VAR tomorrow = Tuesday

### States can be used repeatedly 状态可以重复使用
这允许我们在多个地方使用相同的状态机。

	LIST heatedWaterStates = cold, boiling, recently_boiled
	VAR kettleState = cold
	VAR potState = cold

	*	{kettleState == cold} [打开水壶]
		水壶开始沸腾和冒泡。
		~ kettleState = boiling
	*	{potState == cold} [点燃炉子]
	 	锅里的水开始沸腾和冒泡。
	 	~ potState = boiling

但是，如果我们还添加了微波炉呢？我们可能想要开始泛化我们的功能：

	LIST heatedWaterStates = cold, boiling, recently_boiled
	VAR kettleState = cold
	VAR potState = cold
	VAR microwaveState = cold

	=== function boilSomething(ref thingToBoil, nameOfThing)
		{nameOfThing} 开始加热。
		~ thingToBoil = boiling

	=== do_cooking
	* {kettleState == cold} [打开水壶]
		{boilSomething(kettleState, "水壶")}
	* {potState == cold} [点燃炉子]
		{boilSomething(potState, "锅")}
	* {microwaveState == cold} [打开微波炉]
		{boilSomething(microwaveState, "微波炉")}

或者甚至…

	LIST heatedWaterStates = cold, boiling, recently_boiled
	VAR kettleState = cold
	VAR potState = cold
	VAR microwaveState = cold

	=== cook_with(nameOfThing, ref thingToBoil)
	+ {thingToBoil == cold} [打开 {nameOfThing}]
		{nameOfThing} 开始加热。
		~ thingToBoil = boiling
		-> do_cooking.done

	=== do_cooking
	<- cook_with("水壶", kettleState)
	<- cook_with("锅", potState)
	<- cook_with("微波炉", microwaveState)
	- (done)

注意，“heatedWaterStates”列表仍然可用，并且仍然可以进行测试和赋值。


#### List values can share names 列表值可以共享名称

重用列表会带来歧义。如果我们有：

	LIST colours = red, green, blue, purple
	LIST moods = mad, happy, blue

	VAR status = blue

…编译器如何知道您指的是哪个 blue 呢？

我们使用类似于结点和缝合所用的 . 语法来解决这些问题。

	VAR status = colours.blue

…并且编译器将在您指定之前发出错误。

请注意，状态的“族名称”和包含状态的变量是完全分开的。所以

	{ statesOfGrace == statesOfGrace.fallen:
		// is the current state "fallen"
	}

…是正确的。


#### Advanced: a LIST is actually a variable 高级：一个 LIST 实际上是一个变量

一个令人惊讶的特性是语句

	LIST statesOfGrace = ambiguous, saintly, fallen

实际上同时做了两件事：它创建了三个值，ambiguous、saintly 和 fallen，并在需要时赋予它们名称父级 statesOfGrace；同时它创建了一个名为 statesOfGrace 的变量。

这个变量可以像普通变量一样使用。因此，以下是有效的，尽管极其混乱且不建议这样做：

	LIST statesOfGrace = ambiguous, saintly, fallen

	~ statesOfGrace = 3.1415 // 将变量设置为一个不是列表值的数字

…并且这不会阻止以下内容的正常运行：

	~ temp anotherStateOfGrace = statesOfGrace.saintly




## 3) List Values 列表值

当定义一个列表时，值按顺序列出，这个顺序被认为是有意义的。事实上，我们可以将这些值当作数字来对待。（也就是说，它们是枚举。）

	LIST volumeLevel = off, quiet, medium, loud, deafening
	VAR lecturersVolume = quiet
	VAR murmurersVolume = quiet

	{ lecturersVolume < deafening:
		~ lecturersVolume++

		{ lecturersVolume > murmurersVolume:
			~ murmurersVolume++
			低语声变得更大声。
		}
	}

这些值本身可以使用通常的 {...} 语法打印，但这将打印它们的名称。

	讲师的声音变得 {lecturersVolume}。

### Converting values to numbers 将值转换为数字

如果需要，可以使用 LIST_VALUE 函数显式获取数值。请注意，列表中的第一个值的值为 1，而不是 0。

	讲师还有 {LIST_VALUE(deafening) - LIST_VALUE(lecturersVolume)} 个刻度可用。

### Converting numbers to values 将数字转换为值

你可以通过使用列表的名称作为函数来进行反向转换：

	LIST Numbers = one, two, three
	VAR score = one
	~ score = Numbers(2) // score 将是 "two"

### Advanced: defining your own numerical values 定义你自己的数值

默认情况下，列表中的值从 1 开始，每次增加 1，但如果需要，你可以指定自己的值。

	LIST primeNumbers = two = 2, three = 3, five = 5

如果你指定了一个值，但没有指定下一个值，ink 将假定下一个值递增 1。因此，以下内容是相同的：

	LIST primeNumbers = two = 2, three, five = 5


## 4) Multivalued Lists 多值列表

以下示例中都包含了一个故意的不真实内容，现在我们将其移除。列表——以及包含列表值的变量——不必仅包含一个值。

### Lists are boolean sets 列表是布尔集合


列表变量不是包含数字的变量。相反，列表就像住宿楼中的进出标牌。它包含一系列名称，每个名称都关联有一个房间号码，并有一个滑块来表示“在”或“出”。

也许没人进去：

	LIST DoctorsInSurgery = Adams, Bernard, Cartwright, Denver, Eamonn

也许每个人都在：

	LIST DoctorsInSurgery = (Adams), (Bernard), (Cartwright), (Denver), (Eamonn)

或者可能有些人在，有些人不在：

	LIST DoctorsInSurgery = (Adams), Bernard, (Cartwright), Denver, Eamonn

括号中的名称在列表的初始状态中被包含。

请注意，如果您定义自己的值，可以将括号放在整个术语周围或仅放在名称周围：

	LIST primeNumbers = (two = 2), (three) = 3, (five = 5)

#### Assiging multiple values 分配多个值

我们可以一次性分配列表的所有值，如下所示：

	~ DoctorsInSurgery = (Adams, Bernard)
	~ DoctorsInSurgery = (Adams, Bernard, Eamonn)

我们可以将空列表赋值以清空列表：

	~ DoctorsInSurgery = ()


#### Adding and removing entries 添加和移除条目

列表条目可以单独或集体添加和移除。

	~ DoctorsInSurgery = DoctorsInSurgery + Adams
 	~ DoctorsInSurgery += Adams   // 这与上面的一样
	~ DoctorsInSurgery -= Eamonn
	~ DoctorsInSurgery += (Eamonn, Denver)
	~ DoctorsInSurgery -= (Adams, Eamonn, Denver)

尝试添加已存在于列表中的条目不会有任何效果。尝试移除不存在的条目也不会有任何效果。两者都不会产生错误，并且列表永远不会包含重复的条目。

### Basic Queries 基本查询

我们有几种基本方法来获取列表中的信息：

	LIST DoctorsInSurgery = (Adams), Bernard, (Cartwright), Denver, Eamonn

	{LIST_COUNT(DoctorsInSurgery)} 	//  "2"
	{LIST_MIN(DoctorsInSurgery)} 		//  "Adams"
	{LIST_MAX(DoctorsInSurgery)} 		//  "Cartwright"
	{LIST_RANDOM(DoctorsInSurgery)} 	//  "Adams" 或者 "Cartwright"

#### Testing for emptiness 测试是否为空

像 Ink 中的大多数值一样，可以直接测试一个列表，如果它不为空则返回真。

	{ DoctorsInSurgery: 手术室今天开着。 | 每个人都回家了。 }

#### Testing for exact equality 测试是否完全相等

测试多值列表比单值列表稍微复杂一些。相等（==）现在意味着“集合相等”——也就是说，所有条目都相同。

例如，可以这样说：

	{ DoctorsInSurgery == (Adams, Bernard):
		Dr Adams 和 Dr Bernard 在一个角落激烈争吵。
	}

如果 Dr Eamonn 也在，双方将不会争吵，因为被比较的列表不相等——DoctorsInSurgery 会包含一个列表 (Adams, Bernard) 没有的 Eamonn。

不等于按预期工作：

	{ DoctorsInSurgery != (Adams, Bernard):
		至少 Adams 和 Bernard 没有在争吵。
	}

#### Testing for containment 测试是否包含

如果我们只是想简单地询问 Adams 和 Bernard 是否在场，可以使用新的运算符 has，也就是 ?。

	{ DoctorsInSurgery ? (Adams, Bernard):
		Dr Adams 和 Dr Bernard 在一个角落低声争吵。
	}

? 也可以应用于单个值：

	{ DoctorsInSurgery has Eamonn:
		Dr Eamonn 正在擦拭他的眼镜。
	}

我们也可以使用 hasnt 或 !?（不是 ?）来取反。请注意，这开始有点复杂，因为

	DoctorsInSurgery !? (Adams, Bernard)

并不意味着 Adams 和 Bernard 都不在，只是他们不同时在场（并且不在争吵）。

#### Warning: no lists contain the empty list 警告：没有列表包含空列表

请注意测试

	SomeList ? ()

将始终返回假，无论 SomeList 本身是否为空。在实践中，这是最有用的默认设置，因为您通常会想进行类似以下的测试：

	SilverWeapons ? best_weapon_to_use 
	
以在玩家空手时失败。

#### Example: basic knowledge tracking 基本知识跟踪

多值列表最简单的用法是整齐地跟踪“游戏标志”。

	LIST Facts = (Fogg_is_fairly_odd), 	first_name_phileas, (Fogg_is_English)

	{Facts ? Fogg_is_fairly_odd:I smiled politely.|I frowned. Was he a lunatic?}
	'{Facts ? first_name_phileas:Phileas|Monsieur}, really!' I cried.

特别是，它允许我们在一行中测试多个游戏标志

	{ Facts ? (Fogg_is_English, Fogg_is_fairly_odd):
		<> '我知道英国人很奇怪，但这太*不可思议*了！'
	}


#### Example: a doctor's surgery 示例：医生的诊所

我们需要一个更完整的示例，所以这里有一个。

	LIST DoctorsInSurgery = (Adams), Bernard, Cartwright, (Denver), Eamonn

	-> waiting_room

	=== function whos_in_today()
		In the surgery today are {DoctorsInSurgery}.

	=== function doctorEnters(who)
		{ DoctorsInSurgery !? who:
			~ DoctorsInSurgery += who
			Dr {who} arrives in a fluster.
		}

	=== function doctorLeaves(who)
		{ DoctorsInSurgery ? who:
			~ DoctorsInSurgery -= who
			Dr {who} leaves for lunch.
		}

	=== waiting_room
		{whos_in_today()}
		* 	[时间过去了...]
			{doctorLeaves(Adams)} {doctorEnters(Cartwright)} {doctorEnters(Eamonn)}
			{whos_in_today()}

这将产生：

	In the surgery today are Adams, Denver.

	> 时间过去了...

	Dr Adams leaves for lunch. Dr Cartwright arrives in a fluster. Dr Eamonn arrives in a fluster.

	In the surgery today are Cartwright, Denver, Eamonn.

#### Advanced: nicer list printing 高级：更美观的列表打印

基本的列表打印在游戏中不是特别吸引人。以下方法更好：

	=== function listWithCommas(list, if_empty)
	    {LIST_COUNT(list):
	    - 2:
	        	{LIST_MIN(list)} and {listWithCommas(list - LIST_MIN(list), if_empty)}
	    - 1:
	        	{list}
	    - 0:
				{if_empty}
	    - else:
	      		{LIST_MIN(list)}, {listWithCommas(list - LIST_MIN(list), if_empty)}
	    }

	LIST favouriteDinosaurs = (stegosaurs), brachiosaur, (anklyosaurus), (pleiosaur)

	My favourite dinosaurs are {listWithCommas(favouriteDinosaurs, "all extinct")}.

拥有一个 is/are 函数也是很有用的：

	=== function isAre(list)
		{LIST_COUNT(list) == 1:is|are}

	My favourite dinosaurs {isAre(favouriteDinosaurs)} {listWithCommas(favouriteDinosaurs, "all extinct")}.

并且为了严谨：

	My favourite dinosaur{LIST_COUNT(favouriteDinosaurs) != 1:s} {isAre(favouriteDinosaurs)} {listWithCommas(favouriteDinosaurs, "all extinct")}.


#### Lists don't need to have multiple entries 列表不需要包含多个条目

列表不必须包含多个值。如果您想将列表用作状态机，上述所有示例都将正常工作——使用 =, ++ 和 -- 设置值；使用 ==, <, <=, > 和 >= 测试它们。这些都将按预期工作。


### The "full" list “完整”列表

请注意，LIST_COUNT、LIST_MIN 和 LIST_MAX 是指列表中谁在/不在，而不是所有可能的医生。我们可以使用以下方法访问：

	LIST_ALL(element of list)

或

	LIST_ALL(list containing elements of a list)

	{LIST_ALL(DoctorsInSurgery)} // Adams, Bernard, Cartwright, Denver, Eamonn
	{LIST_COUNT(LIST_ALL(DoctorsInSurgery))} // "5"
	{LIST_MIN(LIST_ALL(Eamonn))} 				// "Adams"

请注意，使用 {...} 打印列表会生成一个简洁的表示；值作为单词，用逗号分隔。

#### Advanced: "refreshing" a list's type 高级：“刷新”列表的类型

如果确实需要，您可以创建一个知道其类型的空列表。

	LIST ValueList = first_value, second_value, third_value
	VAR myList = ()

	~ myList = ValueList()

然后您将能够执行：

	{ LIST_ALL(myList) }

#### Advanced: a portion of the "full" list 完整列表的一部分

您还可以使用 LIST_RANGE 函数仅检索完整列表的“切片”。有两种格式，两者都是有效的：

	LIST_RANGE(list_name, min_integer_value, max_integer_value)

和

	LIST_RANGE(list_name, min_value, max_value)
	
这里的最小值和最大值是包含在内的。如果游戏找不到这些值，它将尽可能接近，但永远不会超出范围。例如：

	{LIST_RANGE(LIST_ALL(primeNumbers), 10, 20)} 

将产生
	
	11, 13, 17, 19



### Example: Tower of Hanoi 河内塔

为了展示其中的一些概念，这里有一个功能性的河内塔示例，编写得让别人不必再写它。


	LIST Discs = one, two, three, four, five, six, seven
	VAR post1 = ()
	VAR post2 = ()
	VAR post3 = ()

	~ post1 = LIST_ALL(Discs)

	-> gameloop

	=== function can_move(from_list, to_list) ===
	    {
	    -   LIST_COUNT(from_list) == 0:
	        // no discs to move
	        ~ return false
	    -   LIST_COUNT(to_list) > 0 && LIST_MIN(from_list) > LIST_MIN(to_list):
	        // the moving disc is bigger than the smallest of the discs on the new tower
	        ~ return false
	    -   else:
	    	 // nothing stands in your way!
	        ~ return true

	    }

	=== function move_ring( ref from, ref to ) ===
	    ~ temp whichRingToMove = LIST_MIN(from)
	    ~ from -= whichRingToMove
	    ~ to += whichRingToMove

	== function getListForTower(towerNum)
	    { towerNum:
	        - 1:    ~ return post1
	        - 2:    ~ return post2
	        - 3:    ~ return post3
	    }

	=== function name(postNum)
	    the {postToPlace(postNum)} temple

	=== function Name(postNum)
	    The {postToPlace(postNum)} temple

	=== function postToPlace(postNum)
	    { postNum:
	        - 1: first
	        - 2: second
	        - 3: third
	    }

	=== function describe_pillar(listNum) ==
	    ~ temp list = getListForTower(listNum)
	    {
	    - LIST_COUNT(list) == 0:
	        {Name(listNum)} is empty.
	    - LIST_COUNT(list) == 1:
	        The {list} ring lies on {name(listNum)}.
	    - else:
	        On {name(listNum)}, are the discs numbered {list}.
	    }


	=== gameloop
	    Staring down from the heavens you see your followers finishing construction of the last of the great temples, ready to begin the work.
	- (top)
	    +  [ Regard the temples]
	        You regard each of the temples in turn. On each is stacked the rings of stone. {describe_pillar(1)} {describe_pillar(2)} {describe_pillar(3)}
	    <- move_post(1, 2, post1, post2)
	    <- move_post(2, 1, post2, post1)
	    <- move_post(1, 3, post1, post3)
	    <- move_post(3, 1, post3, post1)
	    <- move_post(3, 2, post3, post2)
	    <- move_post(2, 3, post2, post3)
	    -> DONE

	= move_post(from_post_num, to_post_num, ref from_post_list, ref to_post_list)
	    +   { can_move(from_post_list, to_post_list) }
	        [ Move a ring from {name(from_post_num)} to {name(to_post_num)} ]
	        { move_ring(from_post_list, to_post_list) }
	        { stopping:
	        -   The priests far below construct a great harness, and after many years of work, the great stone ring is lifted up into the air, and swung over to the next of the temples.
	            The ropes are slashed, and in the blink of an eye it falls once more.
	        -   Your next decree is met with a great feast and many sacrifices. After the funeary smoke has cleared, work to shift the great stone ring begins in earnest. A generation grows and falls, and the ring falls into its ordained place.
	        -   {cycle:
	            - Years pass as the ring is slowly moved.
	            - The priests below fight a war over what colour robes to wear, but while they fall and die, the work is still completed.
	            }
	        }
	    -> top



## 5) Advanced List Operations 高级列表操作

上述部分涵盖了基本的比较。还有一些更强大的功能，但——正如任何熟悉数学集合的人所知——事情开始变得有点棘手。因此，本节附有“高级”警告。

本节中的许多功能对于大多数游戏来说并不必要。

### Comparing lists 比较列表

我们可以使用 `>`, `<`, `>=` 和 `<=` 来精确地比较列表。请注意！我们使用的定义并不完全是标准的。这些定义基于比较被测试列表中元素的数值。

#### "Distinctly bigger than" “明显大于”

`LIST_A > LIST_B` 意味着“A 中的最小值大于 B 中的最大值”：换句话说，如果将它们放在数轴上，A 的全部都在 B 的全部右侧。`<` 则相反。


#### "Definitely never smaller than" “绝对不小于”

`LIST_A >= LIST_B` 意味着——现在深呼吸——“A 中的最小值至少与 B 中的最小值相等，且 A 中的最大值至少与 B 中的最大值相等”。也就是说，如果在数轴上绘制，A 的全部要么在 B 之上，要么与其重叠，但 B 不会延伸到比 A 更高的位置。

请注意，`LIST_A > LIST_B` 意味着 `LIST_A != LIST_B`，而 `LIST_A >= LIST_B` 允许 `LIST_A == LIST_B`，但排除了 `LIST_A < LIST_B`，如您所愿。

#### Health warning! 健康警告！

`LIST_A >= LIST_B` *不*等同于 `LIST_A > LIST_B or LIST_A == LIST_B`.

道德是，除非您心中有清晰的画面，否则不要使用这些操作。

### Inverting lists 反转列表

可以“反转”一个列表，这相当于通过住宿楼的进出标牌并将每个开关切换到其相反状态。

	LIST GuardsOnDuty = (Smith), (Jones), Carter, Braithwaite

	=== function changingOfTheGuard
		~ GuardsOnDuty = LIST_INVERT(GuardsOnDuty)


请注意，LIST_INVERT 在空列表上将返回一个空值，如果游戏没有足够的上下文来知道如何反转。如果需要处理这种情况，最安全的方法是手动处理：

	=== function changingOfTheGuard
		{!GuardsOnDuty: // "is GuardsOnDuty empty right now?"
			~ GuardsOnDuty = LIST_ALL(Smith)
		- else:
			~ GuardsOnDuty = LIST_INVERT(GuardsOnDuty)
		}

#### Footnote 注脚

反转的语法最初是 ~ list，但我们更改了它，因为否则以下行

	~ list = ~ list

不仅是功能性的，而且实际上会导致列表自身反转，这看起来过于反常。


### Intersecting lists 相交列表

has 或 ? 运算符在更正式的术语中是“你是我的子集吗”运算符，⊇，它包括集合相等的情况，但不包括较大的集合不完全包含较小的集合的情况。

要测试列表之间的“部分重叠”，我们使用重叠运算符 ^ 来获取 交集。

	LIST CoreValues = strength, courage, compassion, greed, nepotism, self_belief, delusions_of_godhood
	VAR desiredValues = (strength, courage, compassion, self_belief )
	VAR actualValues =  ( greed, nepotism, self_belief, delusions_of_godhood )

	{desiredValues ^ actualValues} // prints "self_belief"

结果是一个新列表，因此您可以对其进行测试：

	{desiredValues ^ actualValues: The new president has at least one desirable quality.}

	{LIST_COUNT(desiredValues ^ actualValues) == 1: Correction, the new president has only one desirable quality. {desiredValues ^ actualValues == self_belief: It's the scary one.}}




## 6) Multi-list Lists 多列表列表


到目前为止，我们所有的示例都包含了一个大的简化——即列表变量中的所有值必须来自同一个列表族。但事实并非如此。

这允许我们使用列表——迄今为止它们充当状态机和标志跟踪器的角色——来充当一般属性，这对于世界建模非常有用。

这是我们的起始时刻。结果非常强大，但也更像“真实代码”而不是之前的任何内容。


### Lists to track objects 用于跟踪对象的列表

例如，我们可能定义：

	LIST Characters = Alfred, Batman, Robin
	LIST Props = champagne_glass, newspaper

	VAR BallroomContents = (Alfred, Batman, newspaper)
	VAR HallwayContents = (Robin, champagne_glass)

然后，我们可以通过测试其状态来描述任何房间的内容：

	=== function describe_room(roomState)
		{ roomState ? Alfred: Alfred is here, standing quietly in a corner. } { roomState ? Batman: Batman's presence dominates all. } { roomState ? Robin: Robin is all but forgotten. }
		<> { roomState ? champagne_glass: A champagne glass lies discarded on the floor. } { roomState ? newspaper: On one table, a headline blares out WHO IS THE BATMAN? AND *WHO* IS HIS BARELY-REMEMBERED ASSISTANT? }

所以：

	{ describe_room(BallroomContents) }

会生成：

	Alfred is here, standing quietly in a corner. Batman's presence dominates all.

	On one table, a headline blares out WHO IS THE BATMAN? AND *WHO* IS HIS BARELY-REMEMBERED ASSISTANT?

而：

	{ describe_room(HallwayContents) }

则会显示：

	Robin is all but forgotten.

	A champagne glass lies discarded on the floor.

我们还可以基于事物的组合创建选项：

	*	{ currentRoomState ? (Batman, Alfred) } [Talk to Alfred and Batman]
		'Say, do you two know each other?'

### Lists to track multiple states 用于跟踪多重状态的列表

我们可以为具有多个状态的设备建模。回到水壶的例子……

	LIST OnOff = on, off
	LIST HotCold = cold, warm, hot

	VAR kettleState = (off, cold) // 我们需要括号，因为它现在是一个真正的多值列表


	=== function turnOnKettle() ===
	{ kettleState ? hot:
		You turn on the kettle, but it immediately flips off again.
	- else:
		The water in the kettle begins to heat up.
		~ kettleState -= off
		~ kettleState += on
		// 注意我们避免使用 "="，因为它会移除所有现有状态
	}

	=== function can_make_tea() ===
		~ return kettleState ? (hot, off)

这些混合状态可能会使状态变化变得更棘手，如上面的关闭/开启示例所示，因此以下辅助函数可能会很有用。

 	=== function changeStateTo(ref stateVariable, stateToReach)
 		// 移除所有此类型的状态
 		~ stateVariable -= LIST_ALL(stateToReach)
 		// 放回我们想要的状态
 		~ stateVariable += stateToReach

这使得代码如下成为可能：

 	~ changeState(kettleState, on)
 	~ changeState(kettleState, warm)


#### How does this affect queries? 这如何影响查询？

上述的查询大多很好地泛化到多值列表

    LIST Letters = a,b,c
    LIST Numbers = one, two, three

    VAR mixedList = (a, three, c)

	{LIST_ALL(mixedList)}   // a, one, b, two, c, three
    {LIST_COUNT(mixedList)} // 3
    {LIST_MIN(mixedList)}   // a
    {LIST_MAX(mixedList)}   // three or c, albeit unpredictably

    {mixedList ? (a,b) }        // false
    {mixedList ^ LIST_ALL(a)}   // a, c

    { mixedList >= (one, a) }   // true
    { mixedList < (three) }     // false

	{ LIST_INVERT(mixedList) }            // one, b, two


## 7) Long example: crime scene 长示例：犯罪现场

最后，这是一个长示例，展示了本节中许多概念的实际应用。您可能想在阅读之前先尝试运行它，以更好地理解各种动态部分。

	-> murder_scene

	// Helper function: popping elements from lists
	=== function pop(ref list)
	   ~ temp x = LIST_MIN(list) 
	   ~ list -= x 
	   ~ return x
	
	//
	//  System: items can have various states
	//  Some are general, some specific to particular items
	//
	

	LIST OffOn = off, on
	LIST SeenUnseen = unseen, seen
	
	LIST GlassState = (none), steamed, steam_gone
	LIST BedState = (made_up), covers_shifted, covers_off, bloodstain_visible
	
	//
	// System: inventory
	//
	
	LIST Inventory = (none), cane, knife
	
	=== function get(x)
	    ~ Inventory += x
	
	//
	// System: positioning things
	// Items can be put in and on places
	//
	
	LIST Supporters = on_desk, on_floor, on_bed, under_bed, held, with_joe
	
	=== function move_to_supporter(ref item_state, new_supporter) ===
	    ~ item_state -= LIST_ALL(Supporters)
	    ~ item_state += new_supporter
	
	
	// System: Incremental knowledge.
	// Each list is a chain of facts. Each fact supersedes the fact before 
	//
	
	VAR knowledgeState = ()
	
	=== function reached (x) 
	   ~ return knowledgeState ? x 
	
	=== function between(x, y) 
	   ~ return knowledgeState? x && not (knowledgeState ^ y)
	
	=== function reach(statesToSet) 
	   ~ temp x = pop(statesToSet)
	   {
	   - not x: 
	      ~ return false 
	
	   - not reached(x):
	      ~ temp chain = LIST_ALL(x)
	      ~ temp statesGained = LIST_RANGE(chain, LIST_MIN(chain), x)
	      ~ knowledgeState += statesGained
	      ~ reach (statesToSet) 	// set any other states left to set
	      ~ return true  	       // and we set this state, so true
	 
	    - else:
	      ~ return false || reach(statesToSet) 
	    }	
	
	//
	// Set up the game
	//
	
	VAR bedroomLightState = (off, on_desk)
	
	VAR knifeState = (under_bed)
	
	
	//
	// Knowledge chains
	//
	
	
	LIST BedKnowledge = neatly_made, crumpled_duvet, hastily_remade, body_on_bed, murdered_in_bed, murdered_while_asleep
	
	LIST KnifeKnowledge = prints_on_knife, joe_seen_prints_on_knife,joe_wants_better_prints, joe_got_better_prints
	
	LIST WindowKnowledge = steam_on_glass, fingerprints_on_glass, fingerprints_on_glass_match_knife
	
	
	//
	// Content
	//
	
	=== murder_scene ===
	    The bedroom. This is where it happened. Now to look for clues.
	- (top)
	    { bedroomLightState ? seen:     <- seen_light  }
	    <- compare_prints(-> top)

    *   (dobed) [The bed...]
        The bed was low to the ground, but not so low something might not roll underneath. It was still neatly made.
        ~ reach (neatly_made)
        - - (bedhub)
        * *     [Lift the bedcover]
                I lifted back the bedcover. The duvet underneath was crumpled.
                ~ reach (crumpled_duvet)
                ~ BedState = covers_shifted
        * *     (uncover) {reached(crumpled_duvet)}
                [Remove the cover]
                Careful not to disturb anything beneath, I removed the cover entirely. The duvet below was rumpled.
                Not the work of the maid, who was conscientious to a point. Clearly this had been thrown on in a hurry.
                ~ reach (hastily_remade)
                ~ BedState = covers_off
        * *     (duvet) {BedState == covers_off} [ Pull back the duvet ]
                I pulled back the duvet. Beneath it was a sheet, sticky with blood.
                ~ BedState = bloodstain_visible
                ~ reach (body_on_bed)
                Either the body had been moved here before being dragged to the floor - or this is was where the murder had taken place.
        * *     {BedState !? made_up} [ Remake the bed ]
                Carefully, I pulled the bedsheets back into place, trying to make it seem undisturbed.
                ~ BedState = made_up
        * *     [Test the bed]
                I pushed the bed with spread fingers. It creaked a little, but not so much as to be obnoxious.
        * *     (darkunder) [Look under the bed]
                Lying down, I peered under the bed, but could make nothing out.

        * *     {TURNS_SINCE(-> dobed) > 1} [Something else?]
                I took a step back from the bed and looked around.
                -> top
        - -     -> bedhub

    *   {darkunder && bedroomLightState ? on_floor && bedroomLightState ? on}
        [ Look under the bed ]
        I peered under the bed. Something glinted back at me.
        - - (reaching)
        * *     [ Reach for it ]
                I fished with one arm under the bed, but whatever it was, it had been kicked far enough back that I couldn't get my fingers on it.
                -> reaching
        * *     {Inventory ? cane} [Knock it with the cane]
                -> knock_with_cane

        * *     {reaching > 1 } [ Stand up ]
                I stood up once more, and brushed my coat down.
                -> top

    *   (knock_with_cane) {reaching && TURNS_SINCE(-> reaching) >= 4 &&  Inventory ? cane } [Use the cane to reach under the bed ]
        Positioning the cane above the carpet, I gave the glinting thing a sharp tap. It slid out from the under the foot of the bed.
        ~ move_to_supporter( knifeState, on_floor )
        * *     (standup) [Stand up]
                Satisfied, I stood up, and saw I had knocked free a bloodied knife.
                -> top

        * *     [Look under the bed once more]
                Moving the cane aside, I looked under the bed once more, but there was nothing more there.
                -> standup

    *   {knifeState ? on_floor} [Pick up the knife]
        Careful not to touch the handle, I lifted the blade from the carpet.
        ~ get(knife)

    *   {Inventory ? knife} [Look at the knife]
        The blood was dry enough. Dry enough to show up partial prints on the hilt!
        ~ reach (prints_on_knife)

    *   [   The desk... ]
        I turned my attention to the desk. A lamp sat in one corner, a neat, empty in-tray in the other. There was nothing else out.
        Leaning against the desk was a wooden cane.
        ~ bedroomLightState += seen

        - - (deskstate)
        * *     (pickup_cane) {Inventory !? cane}  [Pick up the cane ]
                ~ get(cane)
              I picked up the wooden cane. It was heavy, and unmarked.

        * *    { bedroomLightState !? on } [Turn on the lamp]
                -> operate_lamp ->

        * *     [Look at the in-tray ]
                I regarded the in-tray, but there was nothing to be seen. Either the victim's papers were taken, or his line of work had seriously dried up. Or the in-tray was all for show.

        + +     (open)  {open < 3} [Open a drawer]
                I tried {a drawer at random|another drawer|a third drawer}. {Locked|Also locked|Unsurprisingly, locked as well}.

        * *     {deskstate >= 2} [Something else?]
                I took a step away from the desk once more.
                -> top

        - -     -> deskstate

    *     {(Inventory ? cane) && TURNS_SINCE(-> deskstate) <= 2} [Swoosh the cane]
        I was still holding the cane: I gave it an experimental swoosh. It was heavy indeed, though not heavy enough to be used as a bludgeon.
        But it might have been useful in self-defence. Why hadn't the victim reached for it? Knocked it over?

    *   [The window...]
        I went over to the window and peered out. A dismal view of the little brook that ran down beside the house.

        - - (window_opts)
        <- compare_prints(-> window_opts)
        * *     (downy) [Look down at the brook]
                { GlassState ? steamed:
                    Through the steamed glass I couldn't see the brook. -> see_prints_on_glass -> window_opts
                }
                I watched the little stream rush past for a while. The house probably had damp but otherwise, it told me nothing.
        * *     (greasy) [Look at the glass]
                { GlassState ? steamed: -> downy }
                The glass in the window was greasy. No one had cleaned it in a while, inside or out.
        * *     { GlassState ? steamed && not see_prints_on_glass && downy && greasy }
                [ Look at the steam ]
                A cold day outside. Natural my breath should steam. -> see_prints_on_glass ->
        + +     {GlassState ? steam_gone} [ Breathe on the glass ]
                I breathed gently on the glass once more. { reached (fingerprints_on_glass): The fingerprints reappeared. }
                ~ GlassState = steamed

        + +     [Something else?]
                { window_opts < 2 || reached (fingerprints_on_glass) || GlassState ? steamed:
                    I looked away from the dreary glass.
                    {GlassState ? steamed:
                        ~ GlassState = steam_gone
                        <> The steam from my breath faded.
                    }
                    -> top
                }
                I leant back from the glass. My breath had steamed up the pane a little.
               ~ GlassState = steamed

        - -     -> window_opts

    *   {top >= 5} [Leave the room]
        I'd seen enough. I {bedroomLightState ? on:switched off the lamp, then} turned and left the room.
        -> joe_in_hall

    -   -> top
	
	
	= operate_lamp
	    I flicked the light switch.
	    { bedroomLightState ? on:
	        <> The bulb fell dark.
	        ~ bedroomLightState += off
	        ~ bedroomLightState -= on
	    - else:
	        { bedroomLightState ? on_floor: <> A little light spilled under the bed.} { bedroomLightState ? on_desk : <> The light gleamed on the polished tabletop. }
	        ~ bedroomLightState -= off
	        ~ bedroomLightState += on
	    }
	    ->->
	
	
	= compare_prints (-> backto)
	    *   { between ((fingerprints_on_glass, prints_on_knife),     fingerprints_on_glass_match_knife) } 
	[Compare the prints on the knife and the window ]
	        Holding the bloodied knife near the window, I breathed to bring out the prints once more, and compared them as best I could.
	        Hardly scientific, but they seemed very similar - very similiar indeed.
	        ~ reach (fingerprints_on_glass_match_knife)
	        -> backto
	
	= see_prints_on_glass
	    ~ reach (fingerprints_on_glass)
	    {But I could see a few fingerprints, as though someone hadpressed their palm against it.|The fingerprints were quite clear and well-formed.} They faded as I watched.
	    ~ GlassState = steam_gone
	    ->->
	
	= seen_light
	    *   {bedroomLightState !? on} [ Turn on lamp ]
	        -> operate_lamp ->
	
	    *   { bedroomLightState !? on_bed  && BedState ? bloodstain_visible }
	        [ Move the light to the bed ]
	        ~ move_to_supporter(bedroomLightState, on_bed)
	
	        I moved the light over to the bloodstain and peered closely at it. It had soaked deeply into the fibres of the cotton sheet.
	        There was no doubt about it. This was where the blow had been struck.
	        ~ reach (murdered_in_bed)
	
	    *   { bedroomLightState !? on_desk } {TURNS_SINCE(-> floorit) >= 2 }
	        [ Move the light back to the desk ]
	        ~ move_to_supporter(bedroomLightState, on_desk)
	        I moved the light back to the desk, setting it down where it had originally been.
	    *   (floorit) { bedroomLightState !? on_floor && darkunder }
	        [Move the light to the floor ]
	        ~ move_to_supporter(bedroomLightState, on_floor)
	        I picked the light up and set it down on the floor.
	    -   -> top
	
	=== joe_in_hall
	    My police contact, Joe, was waiting in the hall. 'So?' he demanded. 'Did you find anything interesting?'
	- (found)
	    *   {found == 1} 'Nothing.'
	        He shrugged. 'Shame.'
	        -> done
	    *   { Inventory ? knife } 'I found the murder weapon.'
	        'Good going!' Joe replied with a grin. 'We thought the murderer had gotten rid of it. I'll bag that for you now.'
	        ~ move_to_supporter(knifeState, with_joe)
	
	    *   {reached(prints_on_knife)} { knifeState ? with_joe }
	        'There are prints on the blade[.'],' I told him.
	        He regarded them carefully.
	        'Hrm. Not very complete. It'll be hard to get a match from these.'
	        ~ reach (joe_seen_prints_on_knife)
	    *   { reached((fingerprints_on_glass_match_knife, joe_seen_prints_on_knife)) }
	        'They match a set of prints on the window, too.'
	        'Anyone could have touched the window,' Joe replied thoughtfully. 'But if they're more complete, they should help us get a decent match!'
	        ~ reach (joe_wants_better_prints)
	    *   { between(body_on_bed, murdered_in_bed)}
	        'The body was moved to the bed at some point[.'],' I told him. 'And then moved back to the floor.'
	        'Why?'
	        * *     'I don't know.'
	                Joe nods. 'All right.'
	        * *     'Perhaps to get something from the floor?'
	                'You wouldn't move a whole body for that.'
	        * *     'Perhaps he was killed in bed.'
	                'It's just speculation at this point,' Joe remarks.
	    *   { reached(murdered_in_bed) }
	        'The victim was murdered in bed, and then the body was moved to the floor.'
	        'Why?'
	        * *     'I don't know.'
	                Joe nods. 'All right, then.'
	        * *     'Perhaps the murderer wanted to mislead us.'
	                'How so?'
	            * * *   'They wanted us to think the victim was awake[.'], I replied thoughtfully. 'That they were meeting their attacker, rather than being stabbed in their sleep.'
	            * * *   'They wanted us to think there was some kind of struggle[.'],' I replied. 'That the victim wasn't simply stabbed in their sleep.'
	            - - -   'But if they were killed in bed, that's most likely what happened. Stabbed, while sleeping.'
	                    ~ reach (murdered_while_asleep)
	        * *     'Perhaps the murderer hoped to clean up the scene.'
	                'But they were disturbed? It's possible.'
	
	    *   { found > 1} 'That's it.'
	        'All right. It's a start,' Joe replied.
	        -> done
	    -   -> found
	-   (done)
	    {
	    - between(joe_wants_better_prints, joe_got_better_prints):
	        ~ reach (joe_got_better_prints)
	        <> 'I'll get those prints from the window now.'
	    - reached(joe_seen_prints_on_knife):
	        <> 'I'll run those prints as best I can.'
	    - else:
	        <> 'Not much to go on.'
	    }
	    -> END



## 8) Summary 总结

总结一个复杂的部分，**ink** 的列表构造提供了：

### Flags 标志
* 每个列表条目是一个事件
* 使用 `+=` 标记一个事件已发生
* 使用 `?` 和 `!?` 进行测试

Example:

	LIST GameEvents = foundSword, openedCasket, metGorgon
	{ GameEvents ? openedCasket }
	{ GameEvents ? (foundSword, metGorgon) }
	~ GameEvents += metGorgon

### State machines 状态机
* 每个列表条目是一个状态
* 使用 = 设置状态；使用 ++ 和 -- 向前或向后移动
* 使用 ==, > 等进行测试


Example:

	LIST PancakeState = ingredients_gathered, batter_mix, pan_hot, pancakes_tossed, ready_to_eat
	{ PancakeState == batter_mix }
	{ PancakeState < ready_to_eat }
	~ PancakeState++

### Properties 属性
* 每个列表是不同的属性，具有该属性可以采取的状态值（开或关，亮或暗，等等）
* 通过移除旧状态然后添加新状态来改变状态
* 使用 ? 和 !? 进行测试


Example:

	LIST OnOffState = on, off
	LIST ChargeState = uncharged, charging, charged

	VAR PhoneState = (off, uncharged)

	*	{PhoneState !? uncharged } [Plug in phone]
		~ PhoneState -= LIST_ALL(ChargeState)
		~ PhoneState += charging
		You plug the phone into charge.
	*	{ PhoneState ? (on, charged) } [ Call my mother ]




# Part 6: International character support in identifiers 第六部分：标识符中的国际字符支持

默认情况下，**ink** 对故事内容中使用非 ASCII 字符没有任何限制。然而，目前在常量、变量、缝合、分流和其他命名流程元素（即 *标识符*）的名称中可使用的字符存在限制。

有时，对于使用非 ASCII 语言的编剧来说，编写故事会很不方便，因为他们必须不断切换到使用 ASCII 命名标识符，然后再切换回用于故事的语言。此外，使用作者自己语言命名标识符可以提高原始故事格式的整体可读性。

为了协助上述场景，**ink** *自动*支持一系列预定义的非 ASCII 字符范围，这些字符范围可用作标识符。通常，这些范围的选择包括官方 Unicode 字符范围的字母数字子集，足以用于命名标识符。以下部分提供了 **ink** 自动支持的非 ASCII 字符的更详细信息。

### Supported Identifier Characters 支持的标识符字符

**ink** 对标识符中使用非 ASCII 字符的支持目前限于一组预定义的字符范围。

以下是当前支持的标识符范围列表。

 - **阿拉伯语**
  
   启用阿拉伯语家族语言的字符，是官方 *阿拉伯语* Unicode 范围 `\u0600`-`\u06FF` 的子集。
  
  
 - **亚美尼亚语**
  
   启用亚美尼亚语的字符，是官方 *亚美尼亚语* Unicode 范围 `\u0530`-`\u058F` 的子集。
  
  
 - **西里尔字母**
  
   启用使用西里尔字母的语言的字符，是官方 *西里尔字母* Unicode 范围 `\u0400`-`\u04FF` 的子集。
  
  
 - **希腊语**
  
   启用使用希腊字母的语言的字符，是官方 *希腊语和科普特语* Unicode 范围 `\u0370`-`\u03FF` 的子集。
  
  
 - **希伯来语**
  
   启用使用希伯来字母的希伯来语字符，是官方 *希伯来语* Unicode 范围 `\u0590`-`\u05FF` 的子集。
  
  
 - **拉丁扩展 A**
  
   启用拉丁字母的扩展字符范围子集——完全由官方 *拉丁扩展-A* Unicode 范围 `\u0100`-`\u017F` 表示。
  
  
 - **拉丁扩展 B**
  
   启用拉丁字母的扩展字符范围子集——完全由官方 *拉丁扩展-B* Unicode 范围 `\u0180`-`\u024F` 表示。
  
 - **拉丁语补充**
  
   启用拉丁字母的扩展字符范围子集——完全由官方 *拉丁语补充* Unicode 范围 `\u0080` - `\u00FF` 表示。


**注意！** ink 文件应以 UTF-8 格式保存，以确保支持上述字符范围。

如果您希望在标识符中使用的特定字符范围尚未被支持，请随时在主要 ink 仓库上提交 [问题](/inkle/ink/issues/new) 或 [拉取请求](/inkle/ink/pulls)。

