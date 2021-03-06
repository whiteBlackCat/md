GCM: Google Cloud Messaging。应用的通知消息或信息从服务器发送到所有使用这个应用的安卓系统或Chrome浏览器的应用或拓展上。
国内android应用消息推送主要有: (国内谷歌都被墙了,自然不使用GCM)
第一种:如QQ，长期驻留在系统后台并占用一部分内存来推送消息(通过后台清理应用并未实际清理该部分)
第二种:第三方推送服务(注入SDK)
第三种:GCM服务.与第三方推送服务不同的是，它是系统层级的，第三方应用的服务器把消息发送给谷歌的服务器再转接到各个用户。IOS、Windows 10系统的消息推送亦是在应用未运行的情况下由第三方服务器转给苹果或微软的服务器，再推送给用户。

优点：
（1）快捷地获取消息、资讯和通知
（2）突破网络防火长城GFW的封锁
（3）节约内存、电量(获取消息不需要打开应用)
（4）完整Android系统的体验及克服Android系统碎片化

使用GCM
第一步，安装谷歌服务
第二步，将安装好的谷歌服务，包括Google服务框架、Google账户管理、Google Play服务和Play商店授予所有权限，并允许开机自启
第三步，拨号盘输入“*#*#426#*#*”，进入Google Play服务，在第四个按钮STATUS/EVENTS中可查看目前是否连接上以及连接日志
第四步，确保出现connected并且在Device ID后面出现一串数字
第五步，如果要开启某一个应用的GCM推送，确保它被允许开机自启
第六步，打开你需要开启GCM的应用，在应用的设置中找到消息推送按钮，确保它已经打开
第七步，修改GCM的心跳间隔为5分钟，以保证推送的时效性。通过一个应用即可一键完成

Android推送方案分析（MQTT/XMPP/GCM）

方案1、使用GCM服务
简介：Google推出的云消息服务，即第二代的C2DM。
优点：Google提供的服务、原生、简单，无需实现和部署服务端。
缺点：Android版本限制（必须大于2.2版本），该服务在国内不够稳定、需要用户绑定Google帐号，受限于Google。

方案2、使用XMPP协议（Openfire + Spark + Smack）
简介：基于XML协议的通讯协议，前身是Jabber，目前已由IETF国际标准化组织完成了标准化工作。
优点：协议成熟、强大、可扩展性强、目前主要应用于许多聊天系统中，且已有开源的Java版的开发实例androidpn。
缺点：协议较复杂、冗余（基于XML）、费流量、费电，部署硬件成本高。

方案3、使用MQTT协议（更多信息见：http://mqtt.org/）
简介：轻量级的、基于代理的“发布/订阅”模式的消息传输协议。
优点：协议简洁、小巧、可扩展性强、省流量、省电，目前已经应用到企业领域（参考：http://mqtt.org/software），且已有C++版的服务端组件rsmb。
缺点：不够成熟、实现较复杂、服务端组件rsmb不开源，部署硬件成本较高。

方案4、使用HTTP轮循方式(websocket是其替代品)
简介：定时向HTTP服务端接口（Web Service API）获取最新消息。
优点：实现简单、可控性强，部署硬件成本低。
缺点：实时性差。


GCM的主要特点：
1、它允许第三方的程序服务端发送消息到他们的安卓设备。
2、GCM不能保证消息的发送和消息的顺序。
3、手机端的程序不需要一直运行来接收消息。系统会通过Intent broadcast来唤醒程序当有新的消息到来时。当然程序需要设置适当的broadcast receiver和permission。
4、它不提供任何的用户界面或者其他的东西来处理消息。C2DM只是简单的把收到的原始消息传递给程序。这个程序提供了处理这个消息的方法。比如，这个程序可能抛出一个通知，显示一个自定义的界面或者只是同步数据
5、GCM要求手机必须运行Android2.2或者更高版本并且要有Google Play Store ，或者运行具有谷歌api 的Android 2.2虚拟机。但是，你不仅限于通过Google Play Store部署你的程序。
6、它使用一个现有的连接用于谷歌服务。对前置3.0设备,这要求用户在他们的移动设备设置他们的谷歌账户。Android 4.0.4或更高对于谷歌帐户是不要求的。