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

# Part 4: Advanced Flow Control

## 1) Tunnels

The default structure for **ink** stories is a "flat" tree of choices, branching and joining back together, perhaps looping, but with the story always being "at a certain place".

But this flat structure makes certain things difficult: for example, imagine a game in which the following interaction can happen:

	=== crossing_the_date_line ===
	*	"Monsieur!"[] I declared with sudden horror. "I have just realised. We have crossed the international date line!"
	-	Monsieur Fogg barely lifted an eyebrow. "I have adjusted for it."
	*	I mopped the sweat from my brow[]. A relief!
	* 	I nodded, becalmed[]. Of course he had!
	*  I cursed, under my breath[]. Once again, I had been belittled!

...but it can happen at several different places in the story. We don't want to have to write copies of the content for each different place, but when the content is finished it needs to know where to return to. We can do this using parameters:

	=== crossing_the_date_line(-> return_to) ===
	...
	-	-> return_to

	...

	=== outside_honolulu ===
	We arrived at the large island of Honolulu.
	- (postscript)
		-> crossing_the_date_line(-> done)
	- (done)
		-> END

	...

	=== outside_pitcairn_island ===
	The boat sailed along the water towards the tiny island.
	- (postscript)
		-> crossing_the_date_line(-> done)
	- (done)
		-> END

Both of these locations now call and execute the same segment of storyflow, but once finished they return to where they need to go next.

But what if the section of story being called is more complex - what if it spreads across several knots? Using the above, we'd have to keep passing the 'return-to' parameter from knot to knot, to ensure we always knew where to return.

So instead, **ink** integrates this into the language with a new kind of divert, that functions rather like a subroutine, and is called a 'tunnel'.

### Tunnels run sub-stories

The tunnel syntax looks like a divert, with another divert on the end:

	-> crossing_the_date_line ->

This means "do the crossing_the_date_line story, then continue from here".

Inside the tunnel itself, the syntax is simplified from the parameterised example: all we do is end the tunnel using the `->->` statement which means, essentially, "go on".

	=== crossing_the_date_line ===
	// this is a tunnel!
	...
	- 	->->

Note that tunnel knots aren't declared as such, so the compiler won't check that tunnels really do end in `->->` statements, except at run-time. So you will need to write carefully to ensure that all the flows into a tunnel really do come out again.

Tunnels can also be chained together, or finish on a normal divert:

	...
	// this runs the tunnel, then diverts to 'done'
	-> crossing_the_date_line -> done
	...

	...
	//this runs one tunnel, then another, then diverts to 'done'
	-> crossing_the_date_line -> check_foggs_health -> done
	...

Tunnels can be nested, so the following is valid:

	=== plains ===
	= night_time
		The dark grass is soft under your feet.
		+	[Sleep]
			-> sleep_here -> wake_here -> day_time
	= day_time
		It is time to move on.

	=== wake_here ===
		You wake as the sun rises.
		+	[Eat something]
			-> eat_something ->
		+	[Make a move]
		-	->->

	=== sleep_here ===
		You lie down and try to close your eyes.
		-> monster_attacks ->
		Then it is time to sleep.
		-> dream ->
		->->

... and so on.


#### Advanced: Tunnels can return elsewhere

Sometimes, in a story, things happen. So sometimes a tunnel can't guarantee that it will always want to go back to where it came from. **ink** supplies a syntax to allow you to "returning from a tunnel but actually go somewhere else" but it should be used with caution as the possibility of getting very confused is very high indeed.

Still, there are cases where it's indispensable:

	=== fall_down_cliff 
	-> hurt(5) -> 
	You're still alive! You pick yourself up and walk on.
	
	=== hurt(x)
		~ stamina -= x 
		{ stamina <= 0:
			->-> youre_dead
		}
	
	=== youre_dead
	Suddenly, there is a white light all around you. Fingers lift an eyepiece from your forehead. 'You lost, buddy. Out of the chair.'
	 
And even in less drastic situations, we might want to break up the structure:
 
	-> talk_to_jim ->
 
	 === talk_to_jim
	 - (opts) 	
		*	[ Ask about the warp lacelles ] 
			-> warp_lacells ->
		*	[ Ask about the shield generators ] 
			-> shield_generators ->	
		* 	[ Stop talking ]
			->->
	 - -> opts 

	 = warp_lacells
		{ shield_generators : ->-> argue }
		"Don't worry about the warp lacelles. They're fine."
		->->

	 = shield_generators
		{ warp_lacells : ->-> argue }
		"Forget about the shield generators. They're good."
		->->
	 
	 = argue 
	 	"What's with all these questions?" Jim demands, suddenly. 
	 	...
	 	->->

#### Advanced: Tunnels use a call-stack

Tunnels are on a call-stack, so can safely recurse.


## 2) Threads

So far, everything in ink has been entirely linear, despite all the branching and diverting. But it's actually possible for a writer to 'fork' a story into different sub-sections, to cover more possible player actions.

We call this 'threading', though it's not really threading in the sense that computer scientists mean it: it's more like stitching in new content from various places.

Note that this is definitely an advanced feature: the engineering stories becomes somewhat more complex once threads are involved!

### Threads join multiple sections together

Threads allow you to compose sections of content from multiple sources in one go. For example:

    == thread_example ==
    I had a headache; threading is hard to get your head around.
    <- conversation
    <- walking


    == conversation ==
    It was a tense moment for Monty and me.
     * "What did you have for lunch today?"[] I asked.
        "Spam and eggs," he replied.
     * "Nice weather, we're having,"[] I said.
        "I've seen better," he replied.
     - -> house

    == walking ==
    We continued to walk down the dusty road.
     * [Continue walking]
        -> house

    == house ==
    Before long, we arrived at his house.
    -> END

It allows multiple sections of story to combined together into a single section:

    I had a headache; threading is hard to get your head around.
    It was a tense moment for Monty and me.
    We continued to walk down the dusty road.
    1: "What did you have for lunch today?"
    2: "Nice weather, we're having,"
    3: Continue walking

On encountering a thread statement such as `<- conversation`, the compiler will fork the story flow. The first fork considered will run the content at `conversation`, collecting up any options it finds. Once it has run out of flow here it'll then run the other fork.

All the content is collected and shown to the player. But when a choice is chosen, the engine will move to that fork of the story and collapse and discard the others.

Note that global variables are *not* forked, including the read counts of knots and stitches.

### Uses of threads

In a normal story, threads might never be needed.

But for games with lots of independent moving parts, threads quickly become essential. Imagine a game in which characters move independently around a map: the main story hub for a room might look like the following:

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
		*	[Drawers]	-> examine_drawers
		* 	[Wardrobe] -> examine_wardrobe
		*  [Go to Office] 	-> go_office
		-	-> run_player_location
	= examine_drawers
		// etc...

	// Here's the thread, which mixes in dialogue for characters you share the room with at the moment.

	== characters_present(room)
		{ generals_location == room:
			<- general_conversation
		}
		{ doctors_location == room:
			<- doctor_conversation
		}
		-> DONE

	== general_conversation
		*	[Ask the General about the bloodied knife]
			"It's a bad business, I can tell you."
		-	-> run_player_location

	== doctor_conversation
		*	[Ask the Doctor about the bloodied knife]
			"There's nothing strange about blood, is there?"
		-	-> run_player_location



Note in particular, that we need an explicit way to return the player who has gone down a side-thread to return to the main flow. In most cases, threads will either need a parameter telling them where to return to, or they'll need to end the current story section.


### When does a side-thread end?

Side-threads end when they run out of flow to process: and note, they collect up options to display later (unlike tunnels, which collect options, display them and follow them until they hit an explicit return, possibly several moves later).

Sometimes a thread has no content to offer - perhaps there is no conversation to have with a character after all, or perhaps we have simply not written it yet. In that case, we must mark the end of the thread explicitly.

If we didn't, the end of content might be a story-bug or a hanging story thread, and we want the compiler to tell us about those.

### Using `-> DONE`

In cases where we want to mark the end of a thread, we use `-> DONE`: meaning "the flow intentionally ends here". If we don't, we might end up with a warning message - we can still play the game, but it's a reminder that we have unfinished business.

The example at the start of this section will generate a warning; it can be fixed as follows:

    == thread_example ==
    I had a headache; threading is hard to get your head around.
    <- conversation
    <- walking
    -> DONE

The extra DONE tells ink that the flow here has ended and it should rely on the threads for the next part of the story.

Note that we don't need a `-> DONE` if the flow ends with options that fail their conditions. The engine treats this as a valid, intentional, end of flow state.

**You do not need a `-> DONE` after an option has been chosen**. Once an option is chosen, a thread is no longer a thread - it is simply the normal story flow once more.

Using `-> END` in this case will not end the thread, but the whole story flow. (And this is the real reason for having two different ways to end flow.)


#### Example: adding the same choice to several places

Threads can be used to add the same choice into lots of different places. When using them this way, it's normal to pass a divert as a parameter, to tell the story where to go after the choice is done.

	=== outside_the_house
	The front step. The house smells. Of murder. And lavender.
	- (top)
		<- review_case_notes(-> top)
		*	[Go through the front door]
			I stepped inside the house.
			-> the_hallway
		* 	[Sniff the air]
			I hate lavender. It makes me think of soap, and soap makes me think about my marriage.
			-> top

	=== the_hallway
	The hallway. Front door open to the street. Little bureau.
	- (top)
		<- review_case_notes(-> top)
		*	[Go through the front door]
			I stepped out into the cool sunshine.
			-> outside_the_house
		* 	[Open the bureau]
			Keys. More keys. Even more keys. How many locks do these people need?
			-> top

	=== review_case_notes(-> go_back_to)
	+	{not done || TURNS_SINCE(-> done) > 10}
		[Review my case notes]
		// the conditional ensures you don't get the option to check repeatedly
	 	{I|Once again, I} flicked through the notes I'd made so far. Still not obvious suspects.
	- 	(done) -> go_back_to

Note this is different than a tunnel, which runs the same block of content but doesn't give a player a choice. So a layout like:

	<- childhood_memories(-> next)
	*	[Look out of the window]
	 	I daydreamed as we rolled along...
	 - (next) Then the whistle blew...

might do exactly the same thing as:

	*	[Remember my childhood]
		-> think_back ->
	*	[Look out of the window]
		I daydreamed as we rolled along...
	- 	(next) Then the whistle blew...

but as soon as the option being threaded in includes multiple choices, or conditional logic on choices (or any text content, of course!), the thread version becomes more practical.


#### Example: organisation of wide choice points

A game which uses ink as a script rather than a literal output might often generate very large numbers of parallel choices, intended to be filtered by the player via some other in-game interaction - such as walking around an environment. Threads can be useful in these cases simply to divide up choices.

```
=== the_kitchen
- (top)
	<- drawers(-> top)
	<- cupboards(-> top)
	<- room_exits
= drawers (-> goback)
	// choices about the drawers...
	...
= cupboards(-> goback)
	// choices about cupboards
	...
= room_exits
	// exits; doesn't need a "return point" as if you leave, you go elsewhere
	...
```

# Part 5: Advanced State Tracking

Games with lots of interaction can get very complex, very quickly and the writer's job is often as much about maintaining continuity as it is about content.

This becomes particularly important if the game text is intended to model anything - whether it's a game of cards, the player's knowledge of the gameworld so far, or the state of the various light-switches in a house.

**ink** does not provide a full world-modelling system in the manner of a classic parser IF authoring language - there are no "objects", no concepts of "containment" or being "open" or "locked". However, it does provide a simple yet powerful system for tracking state-changes in a very flexible way, to enable writers to approximate world models where necessary.

#### Note: New feature alert!

This feature is very new to the language. That means we haven't begun to discover all the ways it might be used - but we're pretty sure it's going to be useful! So if you think of a clever usage we'd love to know!


## 1) Basic Lists

The basic unit of state-tracking is a list of states, defined using the `LIST` keyword. Note that a list is really nothing like a C# list (which is an array).

For instance, we might have:

	LIST kettleState = cold, boiling, recently_boiled

This line defines two things: firstly three new values - `cold`, `boiling` and `recently_boiled` - and secondly, a variable, called `kettleState`, to hold these states.

We can tell the list what value to take:

	~ kettleState = cold

We can change the value:

	*	[Turn on kettle]
		The kettle begins to bubble and boil.
		~ kettleState = boiling

We can query the value:

	*	[Touch the kettle]
		{ kettleState == cold:
			The kettle is cool to the touch.
		- else:
		 	The outside of the kettle is very warm!
		}

For convenience, we can give a list a value when it's defined using a bracket:

	LIST kettleState = cold, (boiling), recently_boiled
	// at the start of the game, this kettle is switched on. Edgy, huh?

...and if the notation for that looks a bit redundant, there's a reason for that coming up in a few subsections time.



## 2) Reusing Lists

The above example is fine for the kettle, but what if we have a pot on the stove as well? We can then define a list of states, but put them into variables - and as many variables as we want.

	LIST daysOfTheWeek = Monday, Tuesday, Wednesday, Thursday, Friday
	VAR today = Monday
	VAR tomorrow = Tuesday

### States can be used repeatedly

This allows us to use the same state machine in multiple places.

	LIST heatedWaterStates = cold, boiling, recently_boiled
	VAR kettleState = cold
	VAR potState = cold

	*	{kettleState == cold} [Turn on kettle]
		The kettle begins to boil and bubble.
		~ kettleState = boiling
	*	{potState == cold} [Light stove]
	 	The water in the pot begins to boil and bubble.
	 	~ potState = boiling

But what if we add a microwave as well? We might want start generalising our functionality a bit:

	LIST heatedWaterStates = cold, boiling, recently_boiled
	VAR kettleState = cold
	VAR potState = cold
	VAR microwaveState = cold

	=== function boilSomething(ref thingToBoil, nameOfThing)
		The {nameOfThing} begins to heat up.
		~ thingToBoil = boiling

	=== do_cooking
	*	{kettleState == cold} [Turn on kettle]
		{boilSomething(kettleState, "kettle")}
	*	{potState == cold} [Light stove]
		{boilSomething(potState, "pot")}
	*	{microwaveState == cold} [Turn on microwave]
		{boilSomething(microwaveState, "microwave")}

or even...

	LIST heatedWaterStates = cold, boiling, recently_boiled
	VAR kettleState = cold
	VAR potState = cold
	VAR microwaveState = cold

	=== cook_with(nameOfThing, ref thingToBoil)
	+ 	{thingToBoil == cold} [Turn on {nameOfThing}]
	  	The {nameOfThing} begins to heat up.
		~ thingToBoil = boiling
		-> do_cooking.done

	=== do_cooking
	<- cook_with("kettle", kettleState)
	<- cook_with("pot", potState)
	<- cook_with("microwave", microwaveState)
	- (done)

Note that the "heatedWaterStates" list is still available as well, and can still be tested, and take a value.

#### List values can share names

Reusing lists brings with it ambiguity. If we have:

	LIST colours = red, green, blue, purple
	LIST moods = mad, happy, blue

	VAR status = blue

... how can the compiler know which blue you meant?

We resolve these using a `.` syntax similar to that used for knots and stitches.

	VAR status = colours.blue

...and the compiler will issue an error until you specify.

Note the "family name" of the state, and the variable containing a state, are totally separate. So

	{ statesOfGrace == statesOfGrace.fallen:
		// is the current state "fallen"
	}

... is correct.


#### Advanced: a LIST is actually a variable

One surprising feature is the statement

	LIST statesOfGrace = ambiguous, saintly, fallen

actually does two things simultaneously: it creates three values, `ambiguous`, `saintly` and `fallen`, and gives them the name-parent `statesOfGrace` if needed; and it creates a variable called `statesOfGrace`.

And that variable can be used like a normal variable. So the following is valid, if horribly confusing and a bad idea:

	LIST statesOfGrace = ambiguous, saintly, fallen

	~ statesOfGrace = 3.1415 // set the variable to a number not a list value

...and it wouldn't preclude the following from being fine:

	~ temp anotherStateOfGrace = statesOfGrace.saintly




## 3) List Values

When a list is defined, the values are listed in an order, and that order is considered to be significant. In fact, we can treat these values as if they *were* numbers. (That is to say, they are enums.)

	LIST volumeLevel = off, quiet, medium, loud, deafening
	VAR lecturersVolume = quiet
	VAR murmurersVolume = quiet

	{ lecturersVolume < deafening:
		~ lecturersVolume++

		{ lecturersVolume > murmurersVolume:
			~ murmurersVolume++
			The murmuring gets louder.
		}
	}

The values themselves can be printed using the usual `{...}` syntax, but this will print their name.

	The lecturer's voice becomes {lecturersVolume}.

### Converting values to numbers

The numerical value, if needed, can be got explicitly using the LIST_VALUE function. Note the first value in a list has the value 1, and not the value 0.

	The lecturer has {LIST_VALUE(deafening) - LIST_VALUE(lecturersVolume)} notches still available to him.

### Converting numbers to values

You can go the other way by using the list's name as a function:

	LIST Numbers = one, two, three
	VAR score = one
	~ score = Numbers(2) // score will be "two"

### Advanced: defining your own numerical values

By default, the values in a list start at 1 and go up by one each time, but you can specify your own values if you need to.

	LIST primeNumbers = two = 2, three = 3, five = 5

If you specify a value, but not the next value, ink will assume an increment of 1. So the following is the same:

	LIST primeNumbers = two = 2, three, five = 5


## 4) Multivalued Lists

The following examples have all included one deliberate untruth, which we'll now remove. Lists - and variables containing list values - do not have to contain only one value.

### Lists are boolean sets

A list variable is not a variable containing a number. Rather, a list is like the in/out nameboard in an accommodation block. It contains a list of names, each of which has a room-number associated with it, and a slider to say "in" or "out".

Maybe no one is in:

	LIST DoctorsInSurgery = Adams, Bernard, Cartwright, Denver, Eamonn

Maybe everyone is:

	LIST DoctorsInSurgery = (Adams), (Bernard), (Cartwright), (Denver), (Eamonn)

Or maybe some are and some aren't:

	LIST DoctorsInSurgery = (Adams), Bernard, (Cartwright), Denver, Eamonn

Names in brackets are included in the initial state of the list.

Note that if you're defining your own values, you can place the brackets around the whole term or just the name:

	LIST primeNumbers = (two = 2), (three) = 3, (five = 5)

#### Assiging multiple values

We can assign all the values of the list at once as follows:

	~ DoctorsInSurgery = (Adams, Bernard)
	~ DoctorsInSurgery = (Adams, Bernard, Eamonn)

We can assign the empty list to clear a list out:

	~ DoctorsInSurgery = ()


#### Adding and removing entries

List entries can be added and removed, singly or collectively.

	~ DoctorsInSurgery = DoctorsInSurgery + Adams
 	~ DoctorsInSurgery += Adams  // this is the same as the above
	~ DoctorsInSurgery -= Eamonn
	~ DoctorsInSurgery += (Eamonn, Denver)
	~ DoctorsInSurgery -= (Adams, Eamonn, Denver)

Trying to add an entry that's already in the list does nothing. Trying to remove an entry that's not there also does nothing. Neither produces an error, and a list can never contain duplicate entries.


### Basic Queries

We have a few basic ways of getting information about what's in a list:

	LIST DoctorsInSurgery = (Adams), Bernard, (Cartwright), Denver, Eamonn

	{LIST_COUNT(DoctorsInSurgery)} 	//  "2"
	{LIST_MIN(DoctorsInSurgery)} 		//  "Adams"
	{LIST_MAX(DoctorsInSurgery)} 		//  "Cartwright"
	{LIST_RANDOM(DoctorsInSurgery)} 	//  "Adams" or "Cartwright"

#### Testing for emptiness

Like most values in ink, a list can be tested "as it is", and will return true, unless it's empty.

	{ DoctorsInSurgery: The surgery is open today. | Everyone has gone home. }

#### Testing for exact equality

Testing multi-valued lists is slightly more complex than single-valued ones. Equality (`==`) now means 'set equality' - that is, all entries are identical.

So one might say:

	{ DoctorsInSurgery == (Adams, Bernard):
		Dr Adams and Dr Bernard are having a loud argument in one corner.
	}

If Dr Eamonn is in as well, the two won't argue, as the lists being compared won't be equal - DoctorsInSurgery will have an Eamonn that the list (Adams, Bernard) doesn't have.

Not equals works as expected:

	{ DoctorsInSurgery != (Adams, Bernard):
		At least Adams and Bernard aren't arguing.
	}

#### Testing for containment

What if we just want to simply ask if Adams and Bernard are present? For that we use a new operator, `has`, otherwise known as `?`.

	{ DoctorsInSurgery ? (Adams, Bernard):
		Dr Adams and Dr Bernard are having a hushed argument in one corner.
	}

And `?` can apply to single values too:

	{ DoctorsInSurgery has Eamonn:
		Dr Eamonn is polishing his glasses.
	}

We can also negate it, with `hasnt` or `!?` (not `?`). Note this starts to get a little complicated as

	DoctorsInSurgery !? (Adams, Bernard)

does not mean neither Adams nor Bernard is present, only that they are not *both* present (and arguing).

#### Warning: no lists contain the empty list

Note that the test 

	SomeList ? ()

will always return false, regardless of whether `SomeList` itself is empty. In practice this is the most useful default, as you'll often want to do tests like:

	SilverWeapons ? best_weapon_to_use 
	
to fail if the player is empty-handed.

#### Example: basic knowledge tracking

The simplest use of a multi-valued list is for tracking "game flags" tidily.

	LIST Facts = (Fogg_is_fairly_odd), 	first_name_phileas, (Fogg_is_English)

	{Facts ? Fogg_is_fairly_odd:I smiled politely.|I frowned. Was he a lunatic?}
	'{Facts ? first_name_phileas:Phileas|Monsieur}, really!' I cried.

In particular, it allows us to test for multiple game flags in a single line.

	{ Facts ? (Fogg_is_English, Fogg_is_fairly_odd):
		<> 'I know Englishmen are strange, but this is *incredible*!'
	}


#### Example: a doctor's surgery

We're overdue a fuller example, so here's one.

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
		*	[Time passes...]
			{doctorLeaves(Adams)} {doctorEnters(Cartwright)} {doctorEnters(Eamonn)}
			{whos_in_today()}

This produces:

	In the surgery today are Adams, Denver.

	> Time passes...

	Dr Adams leaves for lunch. Dr Cartwright arrives in a fluster. Dr Eamonn arrives in a fluster.

	In the surgery today are Cartwright, Denver, Eamonn.

#### Advanced: nicer list printing

The basic list print is not especially attractive for use in-game. The following is better:

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

It's probably also useful to have an is/are function to hand:

	=== function isAre(list)
		{LIST_COUNT(list) == 1:is|are}

	My favourite dinosaurs {isAre(favouriteDinosaurs)} {listWithCommas(favouriteDinosaurs, "all extinct")}.

And to be pendantic:

	My favourite dinosaur{LIST_COUNT(favouriteDinosaurs) != 1:s} {isAre(favouriteDinosaurs)} {listWithCommas(favouriteDinosaurs, "all extinct")}.


#### Lists don't need to have multiple entries

Lists don't *have* to contain multiple values. If you want to use a list as a state-machine, the examples above will all work - set values using `=`, `++` and `--`; test them using `==`, `<`, `<=`, `>` and `>=`. These will all work as expected.

### The "full" list

Note that `LIST_COUNT`, `LIST_MIN` and `LIST_MAX` are refering to who's in/out of the list, not the full set of *possible* doctors. We can access that using

	LIST_ALL(element of list)

or

	LIST_ALL(list containing elements of a list)

	{LIST_ALL(DoctorsInSurgery)} // Adams, Bernard, Cartwright, Denver, Eamonn
	{LIST_COUNT(LIST_ALL(DoctorsInSurgery))} // "5"
	{LIST_MIN(LIST_ALL(Eamonn))} 				// "Adams"

Note that printing a list using `{...}` produces a bare-bones representation of the list; the values as words, delimited by commas.

#### Advanced: "refreshing" a list's type

If you really need to, you can make an empty list that knows what type of list it is.

	LIST ValueList = first_value, second_value, third_value
	VAR myList = ()

	~ myList = ValueList()

You'll then be able to do:

	{ LIST_ALL(myList) }

#### Advanced: a portion of the "full" list

You can also retrieve just a "slice" of the full list, using the `LIST_RANGE` function. There are two formulations, both valid:

	LIST_RANGE(list_name, min_integer_value, max_integer_value)

and

	LIST_RANGE(list_name, min_value, max_value)
	
Min and max values here are inclusive. If the game can’t find the values, it’ll get as close as it can, but never go outside the range. So for example:

	{LIST_RANGE(LIST_ALL(primeNumbers), 10, 20)} 

will produce 
	
	11, 13, 17, 19



### Example: Tower of Hanoi

To demonstrate a few of these ideas, here's a functional Tower of Hanoi example, written so no one else has to write it.


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



## 5) Advanced List Operations

The above section covers basic comparisons. There are a few more powerful features as well, but - as anyone familiar with mathematical   sets will know - things begin to get a bit fiddly. So this section comes with an 'advanced' warning.

A lot of the features in this section won't be necessary for most games.

### Comparing lists

We can compare lists less than exactly using `>`, `<`, `>=` and `<=`. Be warned! The definitions we use are not exactly standard fare. They are based on comparing the numerical value of the elements in the lists being tested.

#### "Distinctly bigger than"

`LIST_A > LIST_B` means "the smallest value in A is bigger than the largest values in B": in other words, if put on a number line, the entirety of A is to the right of the entirety of B. `<` does the same in reverse.

#### "Definitely never smaller than"

`LIST_A >= LIST_B` means - take a deep breath now - "the smallest value in A is at least the smallest value in B, and the largest value in A is at least the largest value in B". That is, if drawn on a number line, the entirety of A is either above B or overlaps with it, but B does not extend higher than A.

Note that `LIST_A > LIST_B` implies `LIST_A != LIST_B`, and `LIST_A >= LIST_B` allows `LIST_A == LIST_B` but precludes `LIST_A < LIST_B`, as you might hope.

#### Health warning!

`LIST_A >= LIST_B` is *not* the same as `LIST_A > LIST_B or LIST_A == LIST_B`.

The moral is, don't use these unless you have a clear picture in your mind.

### Inverting lists

A list can be "inverted", which is the equivalent of going through the accommodation in/out name-board and flipping every switch to the opposite of what it was before.

	LIST GuardsOnDuty = (Smith), (Jones), Carter, Braithwaite

	=== function changingOfTheGuard
		~ GuardsOnDuty = LIST_INVERT(GuardsOnDuty)


Note that `LIST_INVERT` on an empty list will return a null value, if the game doesn't have enough context to know what invert. If you need to handle that case, it's safest to do it by hand:

	=== function changingOfTheGuard
		{!GuardsOnDuty: // "is GuardsOnDuty empty right now?"
			~ GuardsOnDuty = LIST_ALL(Smith)
		- else:
			~ GuardsOnDuty = LIST_INVERT(GuardsOnDuty)
		}

#### Footnote

The syntax for inversion was originally `~ list` but we changed it because otherwise the line

	~ list = ~ list

was not only functional, but actually caused list to invert itself, which seemed excessively perverse.

### Intersecting lists

The `has` or `?` operator is, somewhat more formally, the "are you a subset of me" operator, ⊇, which includes the sets being equal, but which doesn't include if the larger set doesn't entirely contain the smaller set.

To test for "some overlap" between lists, we use the overlap operator, `^`, to get the *intersection*.

	LIST CoreValues = strength, courage, compassion, greed, nepotism, self_belief, delusions_of_godhood
	VAR desiredValues = (strength, courage, compassion, self_belief )
	VAR actualValues =  ( greed, nepotism, self_belief, delusions_of_godhood )

	{desiredValues ^ actualValues} // prints "self_belief"

The result is a new list, so you can test it:

	{desiredValues ^ actualValues: The new president has at least one desirable quality.}

	{LIST_COUNT(desiredValues ^ actualValues) == 1: Correction, the new president has only one desirable quality. {desiredValues ^ actualValues == self_belief: It's the scary one.}}




## 6) Multi-list Lists


So far, all of our examples have included one large simplification, again - that the values in a list variable have to all be from the same list family. But they don't.

This allows us to use lists - which have so far played the role of state-machines and flag-trackers - to also act as general properties, which is useful for world modelling.

This is our inception moment. The results are powerful, but also more like "real code" than anything that's come before.

### Lists to track objects

For instance, we might define:

	LIST Characters = Alfred, Batman, Robin
	LIST Props = champagne_glass, newspaper

	VAR BallroomContents = (Alfred, Batman, newspaper)
	VAR HallwayContents = (Robin, champagne_glass)

We could then describe the contents of any room by testing its state:

	=== function describe_room(roomState)
		{ roomState ? Alfred: Alfred is here, standing quietly in a corner. } { roomState ? Batman: Batman's presence dominates all. } { roomState ? Robin: Robin is all but forgotten. }
		<> { roomState ? champagne_glass: A champagne glass lies discarded on the floor. } { roomState ? newspaper: On one table, a headline blares out WHO IS THE BATMAN? AND *WHO* IS HIS BARELY-REMEMBERED ASSISTANT? }

So then:

	{ describe_room(BallroomContents) }

produces:

	Alfred is here, standing quietly in a corner. Batman's presence dominates all.

	On one table, a headline blares out WHO IS THE BATMAN? AND *WHO* IS HIS BARELY-REMEMBERED ASSISTANT?

While:

	{ describe_room(HallwayContents) }

gives:

	Robin is all but forgotten.

	A champagne glass lies discarded on the floor.

And we could have options based on combinations of things:

	*	{ currentRoomState ? (Batman, Alfred) } [Talk to Alfred and Batman]
		'Say, do you two know each other?'

### Lists to track multiple states

We can model devices with multiple states. Back to the kettle again...

	LIST OnOff = on, off
	LIST HotCold = cold, warm, hot

	VAR kettleState = (off, cold) // we need brackets because it's a proper, multi-valued list now

	=== function turnOnKettle() ===
	{ kettleState ? hot:
		You turn on the kettle, but it immediately flips off again.
	- else:
		The water in the kettle begins to heat up.
		~ kettleState -= off
		~ kettleState += on
		// note we avoid "=" as it'll remove all existing states
	}

	=== function can_make_tea() ===
		~ return kettleState ? (hot, off)

These mixed states can make changing state a bit trickier, as the off/on above demonstrates, so the following helper function can be useful.

 	=== function changeStateTo(ref stateVariable, stateToReach)
 		// remove all states of this type
 		~ stateVariable -= LIST_ALL(stateToReach)
 		// put back the state we want
 		~ stateVariable += stateToReach

 which enables code like:

 	~ changeState(kettleState, on)
 	~ changeState(kettleState, warm)


#### How does this affect queries?

The queries given above mostly generalise nicely to multi-valued lists

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


## 7) Long example: crime scene

Finally, here's a long example, demonstrating a lot of ideas from this section in action. You might want to try playing it before reading through to better understand the various moving parts.

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



## 8) Summary

To summarise a difficult section, **ink**'s list construction provides:

### Flags
* 	Each list entry is an event
* 	Use `+=` to mark an event as having occurred
*  	Test using `?` and `!?`

Example:

	LIST GameEvents = foundSword, openedCasket, metGorgon
	{ GameEvents ? openedCasket }
	{ GameEvents ? (foundSword, metGorgon) }
	~ GameEvents += metGorgon

### State machines
* 	Each list entry is a state
*  Use `=` to set the state; `++` and `--` to step forward or backward
*  Test using `==`, `>` etc

Example:

	LIST PancakeState = ingredients_gathered, batter_mix, pan_hot, pancakes_tossed, ready_to_eat
	{ PancakeState == batter_mix }
	{ PancakeState < ready_to_eat }
	~ PancakeState++

### Properties
*	Each list is a different property, with values for the states that property can take (on or off, lit or unlit, etc)
* 	Change state by removing the old state, then adding in the new
*  Test using `?` and `!?`

Example:

	LIST OnOffState = on, off
	LIST ChargeState = uncharged, charging, charged

	VAR PhoneState = (off, uncharged)

	*	{PhoneState !? uncharged } [Plug in phone]
		~ PhoneState -= LIST_ALL(ChargeState)
		~ PhoneState += charging
		You plug the phone into charge.
	*	{ PhoneState ? (on, charged) } [ Call my mother ]




# Part 6: International character support in identifiers

By default, ink has no limitations on the use of non-ASCII characters inside the story content. However, a limitation currently exsits
on the characters that can be used for names of constants, variables, stictches, diverts and other named flow elements (a.k.a. *identifiers*).

Sometimes it is inconvenient for a writer using a non-ASCII language to write a story because they have to constantly switch to naming identifiers in ASCII and then switching back to whatever language they are using for the story. In addition, naming identifiers in the author's own language could improve the overal readibility of the raw story format.

In an effort to assist in the above scenario, ink *automatically* supports a list of pre-defined non-ASCII character ranges that can be used as identifiers. In general, those ranges have been selected to include the alpha-numeric subset of the official unicode character range, which would suffice for naming identifiers. The below section gives more detailed information on the non-ASCII characters that ink automatically supports.

### Supported Identifier Characters

The support for the additional character ranges in ink is currently limited to a predefined set of character ranges.

Below is a listing of the currently supported identifier ranges.

 - **Arabic**

   Enables characters for languages of the Arabic family and is a subset of the official *Arabic* unicode range `\u0600`-`\u06FF`.


 - **Armenian**

   Enables characters for the Armenian language and is a subset of the official *Armenian* unicode range `\u0530`-`\u058F`.


 - **Cyrillic**

   Enables characters for languages using the Cyrillic alphabet and is a subset of the official *Cyrillic* unicode range `\u0400`-`\u04FF`.


 - **Greek**

   Enables characters for languages using the Greek alphabet and is a subset of the official *Greek and Coptic* unicode range `\u0370`-`\u03FF`.


 - **Hebrew**

   Enables characters in Hebrew using the Hebrew alphabet and is a subset of the official *Hebrew* unicode range `\u0590`-`\u05FF`.


 - **Latin Extended A**

   Enables an extended character range subset of the Latin alphabet - completely represented by the official *Latin Extended-A* unicode range `\u0100`-`\u017F`.


 - **Latin Extended B**

   Enables an extended character range subset of the Latin alphabet - completely represented by the official *Latin Extended-B* unicode range `\u0180`-`\u024F`.

- **Latin 1 Supplement**

   Enables an extended character range subset of the Latin alphabet - completely represented by the official *Latin 1 Supplement* unicode range `\u0080` - `\u00FF`.


**NOTE!** ink files should be saved in UTF-8 format, which ensures that the above character ranges are supported.

If a particular character range that you would like to use within identifiers isn't supported, feel free to open an [issue](/inkle/ink/issues/new) or [pull request](/inkle/ink/pulls) on the main ink repo.
