CSRF（Cross-site request forgery）跨站请求伪造,本质是对网站的恶意利用
	与跨站脚本（XSS）区别:XSS利用站点内的信任用户,CSRF则通过伪装成受信任用户的请求来利用受信任的网站
CSRF是一种依赖web浏览器的、被混淆过的代理人攻击（deputy attack）
常见特性:
	依靠用户标识危害网站
	利用网站对用户标识的信任
	欺骗用户的浏览器发送HTTP请求给目标站点
	另外可以通过IMG标签会触发一个GET请求，可以利用它来实现CSRF攻击。
风险:
	在于那些通过基于受信任的输入form和对特定行为无需授权的已认证的用户来执行某些行为的web应用。已经通过被保存在用户浏览器中的cookie进行认证的用户将在完全无知的情况下发送HTTP请求到那个信任他的站点，进而进行用户不愿做的行为。
防范:
	对于web站点，将持久化的授权方法（例如cookie或者HTTP授权）切换为瞬时的授权方法（在每个form中提供隐藏field）
	在form中包含秘密信息、用户指定的代号作为cookie之外的验证
	“双提交”cookie。此方法只工作于Ajax请求，但它能够作为无需改变大量form的全局修正方法。如果某个授权的cookie在form post之前正被JavaScript代码读取，那么限制跨域规则将被应用。如果服务器需要在Post请求体或者URL中包含授权cookie的请求，那么这个请求必须来自于受信任的域，因为其它域是不能从信任域读取cookie的
	用户通过在浏览其它站点前登出站点或者在浏览器会话结束后清理浏览器的cookie。
成立前提:
	攻击者了解受害者所在的站点
	攻击者的目标站点具有持久化授权cookie或者受害者具有当前会话cookie
	目标站点没有对用户在网站行为的第二授权