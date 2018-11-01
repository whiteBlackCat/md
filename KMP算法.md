与BF算法区别:模式串的移动距离,后者移动1,前者使用公式:移动位数 = 已匹配的字符数 - 对应的部分匹配值
"前缀":除了最后一个字符以外，一个字符串的全部头部组合；
"后缀":除了第一个字符以外，一个字符串的全部尾部组合。
部分匹配值:"前缀"和"后缀"的最长的共有元素的长度”
对于字符 aaronaac 计算前缀,后缀,部分匹配值:
a,         p=>0, n=>0  r = 0
aa,        p=>[a]，n=>[a] , r = a.length => 1
aar,       p=>[a,aa], n=>[r,ar]  ,r = 0
aaro,      p=>[a,aa,aar], n=>[o,ra,aro] ,r = 0
aaron      p=>[a,aa,aar,aaro], n=>[n,on,ron,aron] ,r = 0
aarona,    p=>[a,aa,aar,aaro,aaron], n=>[a,na,ona,rona,arona] ,r = a.lenght = 1
aaronaa,   p=>[a,aa,aar,aaro,aaron,aarona], n=>[a,aa,naa,onaa,ronaa,aronaa] ,  r = Math.max(a.length,aa.length) = 2
aaronaac   p=>[a,aa,aar,aaro,aaron,aarona], n=>[c,ac,aac,naac,onaac,ronaac]  r = 0
其部分匹配值为2

Kmp算法:
 function kmpGetStrPartMatchValue(str) {
   var prefix = [];
   var suffix = [];
   var partMatch = [];
   for (var i = 0, j = str.length; i < j; i++) {
    var newStr = str.substring(0, i + 1);
    if (newStr.length == 1) {
     partMatch[i] = 0;
    } else {
     for (var k = 0; k < i; k++) {
      //取前缀
      prefix[k] = newStr.slice(0, k + 1);
      suffix[k] = newStr.slice(-k - 1);
      if (prefix[k] == suffix[k]) {
       partMatch[i] = prefix[k].length;
      }
     }
     if (!partMatch[i]) {
      partMatch[i] = 0;
     }
    }
   }
   return partMatch;
  }
 
 
 
function KMP(sourceStr, searchStr) {
  //生成匹配表
  var part     = kmpGetStrPartMatchValue(searchStr);
  var sourceLength = sourceStr.length;
  var searchLength = searchStr.length;
  var result;
  var i = 0;
  var j = 0;
 
  for (; i < sourceStr.length; i++) { //最外层循环，主串
 
    //子循环
    for (var j = 0; j < searchLength; j++) {
      //如果与主串匹配
      if (searchStr.charAt(j) == sourceStr.charAt(i)) {
        //如果是匹配完成
        if (j == searchLength - 1) {
         result = i - j;
         break;
        } else {
         //如果匹配到了，就继续循环，i++是用来增加主串的下标位
         i++;
        }
      } else {
       //在子串的匹配中i是被叠加了
       if (j > 1 && part[j - 1] > 0) {
        i += (i - j - part[j - 1]);
       } else {
        //移动一位
        i = (i - j)
       }
       break;
      }
    }
 
    if (result || result == 0) {
     break;
    }
  }
 
 
  if (result || result == 0) {
   return result
  } else {
   return -1;
  }
}
 
 var s = "BBC ABCDAB ABCDABCDABDE";
 var t = "ABCDABD";
 
 
 show('indexOf',function() {
  return s.indexOf(t)
 })
 
 show('KMP',function() {
  return KMP(s,t)
 })
 
 function show(bf_name,fn) {
  var myDate = +new Date()
  var r = fn();
  var div = document.createElement('div')
  div.innerHTML = bf_name +'算法,搜索位置:' + r + ",耗时" + (+new Date() - myDate) + "ms";
   document.getElementById("test2").appendChild(div);
 }

Kmp.next
  function next(str) {
    var prefix = [];
    var suffix = [];
    var partMatch;
    var i = str.length
    var newStr = str.substring(0, i + 1);
    for (var k = 0; k < i; k++) {
     //取前缀
     prefix[k] = newStr.slice(0, k + 1);
     suffix[k] = newStr.slice(-k - 1);
     if (prefix[k] == suffix[k]) {
      partMatch = prefix[k].length;
     }
    }
    if (!partMatch) {
     partMatch = 0;
    }
    return partMatch;
  }
 
  function KMP(sourceStr, searchStr) {
    var sourceLength = sourceStr.length;
    var searchLength = searchStr.length;
    var result;
    var i = 0;
    var j = 0;
 
    for (; i < sourceStr.length; i++) { //最外层循环，主串
 
      //子循环
      for (var j = 0; j < searchLength; j++) {
        //如果与主串匹配
        if (searchStr.charAt(j) == sourceStr.charAt(i)) {
          //如果是匹配完成
          if (j == searchLength - 1) {
           result = i - j;
           break;
          } else {
           //如果匹配到了，就继续循环，i++是用来增加主串的下标位
           i++;
          }
        } else {
         if (j > 1) {
          i += i - next(searchStr.slice(0,j));
         } else {
          //移动一位
          i = (i - j)
         }
         break;
        }
      }
 
      if (result || result == 0) {
       break;
      }
    }
 
 
    if (result || result == 0) {
     return result
    } else {
     return -1;
    }
  }
 
 var s = "BBC ABCDAB ABCDABCDABDE";
 var t = "ABCDAB";
 
 
  show('indexOf',function() {
   return s.indexOf(t)
  })
 
  show('KMP.next',function() {
   return KMP(s,t)
  })
 
  function show(bf_name,fn) {
   var myDate = +new Date()
   var r = fn();
   var div = document.createElement('div')
   div.innerHTML = bf_name +'算法,搜索位置:' + r + ",耗时" + (+new Date() - myDate) + "ms";
    document.getElementById("testnext").appendChild(div);
  }


BF(Brute Force)算法:
从目标串s 的第一个字符起和模式串t的第一个字符进行比较，若相等，则继续逐个比较后续字符，否则从串s 的第二个字符起再重新和串t进行比较。
依此类推，直至串t 中的每个字符依次和串s的一个连续的字符序列相等，则称模式匹配成功，此时串t的第一个字符在串s 中的位置就是t 在s中的位置，否则模式匹配不成功
var sourceStr = "BBC ABB ABCF";
var searchStr = "ABC";
 
function BF_Optimize_2(sourceStr, searchStr) {
 var i = 0,
   j = 0;
 
  while (i < sourceStr.length) {
    // 两字母相等则继续 
    if (sourceStr.charAt(i) == searchStr.charAt(j)) {
     i++;
     j++;
    } else { // 两字母不等则角标后退重新开始匹配 
     i = i - j + 1; // i 回退到上次匹配首位的下一位 
     j = 0; // j 回退到子串的首位 
    }
 
    if (j == searchStr.length) {
     return i - j;
    }
 
  }
}
