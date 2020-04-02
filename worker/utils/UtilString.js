let UtilString = {
    TAG: "UtilString",
    UNIT_TYPE_NONE: 0,
    UNIT_TYPE_K: 1,
    UNIT_TYPE_M: 2,

    ctor: function() {
        var self = this;
    },

    //获取头像链接
    getHURLByUin: function(uin) {
        if (!uin) return "";
        return HOST_HTTP + HOST_NAME + "/cdn/portrait/" + uin;
    },

    getHURLByUrl: function(url) {
        if (!url) return "";
        return HOST_HTTP + HOST_NAME + "/media/" + url;
    },

    //将整数转化成xxx万 xxx亿， v, 数值; model, 保留小数点后..位
    getFormatString: function(v, model) {
        var self = this;
        if (v === null) return "";
        var l = self.getFormat(v, model);
        if (l[0] === null) return "";
        if (l[1] === null) {
            return l[0] + "";
        } else {
            return l[0] + l[1];
        }
    },

    //(处理缩写字符串)v, 数值; model, 保留小数点后..位
    getFormat: function(v, model) {
        var self = this;
        var l = self.getFormatUnit(v, model);
        var str = "";
        if (l[1] === self.UNIT_TYPE_M) {
            str = qf.txt.string012;
        } else if (l[1] === self.UNIT_TYPE_K) {
            str = qf.txt.string011;
        }
        return [l[0], str];
    },

    //v, 数值; model, 保留小数点后..位
    getFormatUnit: function(v, model) {
        var self = this;
        var n = model || 2;
        if (typeof v !== "number") return v;
        var k = self.isLanguageChinese() ? 10000 : 1000;
        var m = self.isLanguageChinese() ? 100000000 : 1000000;
        var f = v;
        var u = self.UNIT_TYPE_NONE;
        if (v >= m) {
            f = v / m;
            u = self.UNIT_TYPE_M;
        } else if (v >= k) {
            f = v / k;
            u = self.UNIT_TYPE_K;
        }
        if (u > self.UNIT_TYPE_NONE) {
            var num = f * Math.pow(10, n + 1);
            num = self.roundOff(num, 2) //四舍五入
            f = num / Math.pow(10, n + 1);
        }
        return [f, u];
    },

    //保留n位有效位 小数点后最多dot位
    //例如：(23458, 3, 2)->(2.35万, 2.35, 1)
    getFormatNumber: function(number, n, dot) {
        var self = this;
        dot = dot ? dot : 2;
        n = n ? n : 4;
        var k = qf.config.LANG === "cn" ? 10000 : 1000;
        var m = qf.config.LANG === "cn" ? 100000000 : 1000000;
        var b = 0 > number;
        var u = self.UNIT_TYPE_NONE;
        number = Math.abs(number);
        if (number >= m) {
            number = number / m;
            u = self.UNIT_TYPE_M;
        } else if (number >= k) {
            number = number / k;
            u = self.UNIT_TYPE_K;
        }
        if (u > self.UNIT_TYPE_NONE) {
            var ndot = Math.pow(10, dot);
            number = Math.floor(number * ndot + 0.5);
            var net = Math.pow(10, n + 1);
            while (number >= net && ndot > 1) {
                number = Math.floor((number + 5) / 10);
                ndot = ndot / 10;
            }
            number = number / ndot;
        }
        var s = number;
        if (u === self.UNIT_TYPE_K)
            s = s + qf.txt.string011;
        else if (u === self.UNIT_TYPE_M)
            s = s + qf.txt.string012;

        if (b)
            s = "-" + s;
        //mark by Gallen
        return s /*, number, u*/ ;
    },

    //四舍五入. num, 整数; n, 向第n位取整。 例如输入125，要输出130， 则n要传入2
    roundOff: function(num, n) {
        var self = this;
        if (n > 0) {
            var scale = Math.pow(10, n - 1);
            return Math.floor(num / scale + 0.5) * scale;
        } else if (n < 0) {
            var scale = Math.pow(10, n);
            return Math.floor(num / scale + 0.5) * scale;
        } else if (n === 0)
            return num;
    },

    //判断是否是中文
    isLanguageChinese: function() {
        var lang = qf.config.LANG;
        if (lang === "cn" || lang === "zh_tr") {
            return true;
        } else {
            return false;
        }
    },

    //获取上次 在线的时间（如 几个小时前 几天前 几周前）
    formatTimer: function(lastTimer) {
        var curTimerStr = "";
        var curTimer = os.time(); //秒
        var yearTimer = 12 * 30 * 24 * 3600;
        var mothTimer = 30 * 24 * 3600 //一个月有多少秒
        var weekTimer = 7 * 24 * 3600;
        var dayTimer = 24 * 3600; //一天多少秒
        var hourTimer = 3600; //一小时是多少秒
        var minuteTmier = 60;
        var DTimer = curTimer - lastTimer;
        if ((Math.floor(DTimer / yearTimer)) > 0)
            curTimerStr = Math.floor(DTimer / yearTimer) + qf.txt.TimerUnitStr[1];
        else if ((Math.floor(DTimer / mothTimer)) > 0)
            curTimerStr = Math.floor(DTimer / mothTimer) + qf.txt.TimerUnitStr[2];
        else if (Math.floor(DTimer / weekTimer) > 0)
            curTimerStr = Math.floor(DTimer / weekTimer) + qf.txt.TimerUnitStr[3];
        else if (Math.floor(DTimer / dayTimer) > 0)
            curTimerStr = Math.floor(DTimer / dayTimer) + qf.txt.TimerUnitStr[4];
        else if (Math.floor(DTimer / hourTimer) > 0) //小时
            curTimerStr = Math.floor(DTimer / hourTimer) + qf.txt.TimerUnitStr[5];
        else if (Math.floor(DTimer / minuteTmier) > 0)
            curTimerStr = Math.floor(DTimer / minuteTmier) + qf.txt.TimerUnitStr[6];
        else
            curTimerStr = "1" + qf.txt.TimerUnitStr[6];

        return curTimerStr;
    },

    /*
    倒计时时间
    格式化时间成：x天y小时z分钟
    */
    formatRemainTime: function(remainTime) {
        remainTime = Math.ceil(remainTime / 60);
        var day = Math.floor(remainTime / 24 / 60);
        remainTime = remainTime - day * 24 * 60;
        var hour = Math.floor(remainTime / 60);
        var minute = remainTime - hour * 60;

        var ret = "";
        if (0 !== day)
            ret = ret + day + qf.txt.TimerUnitStr[4];

        if (0 !== hour)
            ret = ret + hour + qf.txt.TimerUnitStr[5];

        if (0 !== minute)
            ret = ret + minute + qf.txt.TimerUnitStr[6];

        return ret;
    },

    UTF8length: function(str) {
        return (str.replace(/[\128-\255][\128-\255]/, ' ')).length;
    },

    //按长度截取字符串
    subStringUTF8: function(s, n) {
        var self = this;

        var ret = self._subStringUTF8(s, n);
        if (ret.length === self.UTF8length(ret)) //纯英文
            if (ret.length > n / 2) return ret.substr(0, n / 2);

        return ret;
    },
    //获取精简昵称
    getFixName: function(s, byte) {
        var self = this;
        if (!s) return 0;
        var ret = self.subStringUTF8(s, (byte ? byte : 12));
        return ret;
        //if (ret !== s) return ret + ""; else return ret;
    },

    _subStringUTF8: function(s, n) {
        var self = this;
        var arrByte = this.stringToByte(s);
        var dropping = arrByte[n + 1];
        if (!dropping) return s;
        if (dropping >= 128 && dropping < 192)
            return self._subStringUTF8(s, n - 1);

        return s.substr(0, n);
    },

    //获取一个字符串的子字符串
    getSubString: function(str, start_index, end_index) {
        var self = this;
        end_index = end_index ? end_index : self.UTF8length(str);
        //将utf8字符映射到表
        var tab = str.match(/./g);
        //获取子串
        var sub = "";
        for (var i = 0; i < tab.length; i++) {
            if (i >= start_index && i <= end_index)
                sub = sub + tab[i];
        }

        return sub;
    },

    stringToByte: function(str) {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    },

    //去掉前后空格
    stringTrim: function(str) {
        if (!str) return null;
        return string.match(str, "%s*(.-)%s*$");
    },

    //是否全是空格的字符串
    isAllSpaceStr: function(str) {
        var haveNotSpaceChar = false;
        var arrByte = this.stringToByte(str);
        for (var i = 0; i < arrByte.length; i++) {

            if (32 !== arrByte[i]) {
                haveNotSpaceChar = true;
                break;
            }
        }

        if (haveNotSpaceChar)
            return false;
        else
            return true;
    },

    //按个数截取中英混合字符
    getMySubStr: function(str, from, to) {
        return str.substr(from, to);
    },

    //字符串截取 包含对中文处理
    getInitialismStr: function(str, n, replcaeStr) {
        if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
            return str;
        } else {
            var len = 0;
            var tmpStr = "";
            for (var i = 0; i < str.length; i++) { //遍历字符串
                if (/[\u4e00-\u9fa5]/.test(str[i])) { //中文 长度为两字节
                    len += 2;
                } else {
                    len += 1;
                }
                if (len > n) {
                    break;
                } else {
                    tmpStr += str[i];
                }
            }
            return tmpStr + (replcaeStr || "..");
        }
    },

    //按长度分割中英混合字符成若干字符 下标从0开始
    getMySplitStrWithLength: function(str) {
        var arrByte = this.stringToByte(str);
        var lenInByte = arrByte.length;
        var total_len = 0;
        var i = 0;
        var num = 0;
        var byteCount = 0;

        for (var j = 0; j < lenInByte; j = j + byteCount) {
            var curByte = arrByte[j];
            if (curByte > 0 && curByte <= 127) {
                byteCount = 1;
                i = 1;
            } else if (curByte >= 192 && curByte < 223) {
                byteCount = 2;
                i = 2;
            } else if (curByte >= 224 && curByte < 239) {
                byteCount = 3;
                i = 2;
            } else if (curByte >= 240 && curByte <= 247) {
                byteCount = 4;
                i = 2;
            }
            num++;
            total_len += i;
        }
        return total_len;
    },

    //将时间戳转化为时间描述字符串, 2015-12-20 11:25
    getTimeDescription: function(timestamp, separator) {
        var sep = separator || "-";
        var day_temp = new Date(parseInt(timestamp) * 1000);
        var year = day_temp.getFullYear();
        var month = day_temp.getMonth() + 1;
        var day = day_temp.getDate(); //日
        var hour = day_temp.getHours(); //时
        var min = day_temp.getMinutes(); //分
        // var second = day_temp.getSeconds();       //秒
        var numForm = function(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        };

        var day_str = cc.formatStr("%s%s%s%s%s", year, sep, numForm(month), sep, numForm(day));
        var time_str = cc.formatStr("%s %s%s%s", day_str, numForm(hour), ":", numForm(min));
        return time_str;
    },

    //将时间戳转化为时间描述字符串，2015-12-20
    getDayTime: function(timestamp, separator) {
        var sep = separator || "-";
        var date = os.date("*t", timestamp);
        var month = cc.formatStr("%02d", date.month);
        var day = cc.formatStr("%02d", date.day);
        var day_str = date.year + sep + month + sep + day;
        return day_str;
    },

    //将时间戳转化为时间描述字符串, 11:25
    getDigitalTime: function(timestamp) {
        var day_temp = new Date(parseInt(timestamp) * 1000);
        var hour = day_temp.getHours(); //时
        var min = day_temp.getMinutes(); //分
        var numForm = function(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        };
        var time_str = numForm(hour) + ":" + numForm(min);
        return time_str;
    },

    //将时间转换为小时分支秒: 00:00:00
    getHourMinSecondTime: function(timestamp, s, p) {
        s = s || ":";
        p = p || 2;

        var numForm = function(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        };
        var count = timestamp;
        var h = Math.floor(count / 3600);
        count = count % 3600;
        var m = Math.floor(count / 60);
        count = count % 60;
        var s = count;

        var time_str = cc.formatStr("%s:%s:%s", numForm(h), numForm(m), numForm(s));

        return time_str;
    },

    //将秒转化为分钟秒：00:00
    getMinSecondTime: function(timestamp, s, p) {
        s = s || ":";
        p = p || 2;

        var numForm = function(num) {
            if (num < 10) {
                return "0" + num;
            } else {
                return num;
            }
        };
        var count = timestamp;
        var _m = Math.floor(count / 60);
        count = count % 60;
        var _s = count;

        var time_str = cc.formatStr("%s" + s + "%s", numForm(_m), numForm(_s));
        return time_str;
    },

    //将时间戳转化为时间描述字符串, 2015年12月20日 11:25
    getTimeFormat: function(timestamp) {
        var self = this;
        var date = os.date("*t", timestamp);
        var month = cc.formatStr("%d", date.month);
        var day = cc.formatStr("%d", date.day);
        var hour = cc.formatStr("%d", date.hour);
        var min = cc.formatStr("%d", date.min);
        var time_str = date.year + qf.txt.TimerFormatStr[1] + month + qf.txt.TimerFormatStr[2] + day + qf.txt.TimerFormatStr[3] + " " + hour + ":" + min;
        return time_str;
    },

    //格式化时长11H25M10S
    getTimeShortStr: function(second) {
        var timestr = "";
        var sec = second % 60; //秒钟
        var min = ((second - sec) / 60) % 60; //分钟
        var hour = ((second - sec) / 60 - min) / 60; //小时
        if (hour > 0)
            timestr = hour + "H";
        if (min > 0)
            timestr = timestr + min + "M";
        if (sec > 0)
            timestr = timestr + sec + "S";
        return timestr;
    },

    getMonthDay: function(timestamp) {
        var self = this;

        var date = new Date(parseInt(timestamp) * 1000);
        var m = date.getMonth() + 1;
        var d = date.getDate();

        return m + qf.txt.txt_time_month + d + qf.txt.txt_time_day;
    },
    getYearMonthDay: function(time) {
        var self = this;

        var date = new Date(parseInt(time) * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        
        if (m < 10) {
            m = "0" + m;
        }
        if (d < 10) {
            d = "0" + d;
        }

        return y + '年' + m + '月';
    },

    getHourOfTime: function(second) {
        var self = this;

        if (!second || second <= 0) return "00";

        var hour = Math.floor(second / 3600);

        if (hour < 10) return "0" + hour;
        else return hour;
    },

    getMinOfTime: function(second) {
        var self = this;

        if (!second || second <= 0) return "00";

        var mod = second % 3600;
        var min = Math.floor(mod / 60);

        if (min < 10) return "0" + min;
        else return min;
    },

    getSecOfTime: function(second) {
        var self = this;

        if (!second || second <= 0) return "00";

        var sec = second % 60;

        if (sec < 10) return "0" + sec;
        else return sec;
    },
    //根据传进来的秒数获取对应的时间
    getTimeStr: function(second) {
        var self = this;
        if (!second || second <= 0) return "00:00:00";

        var hour = self.getHourOfTime(second);
        var min = self.getMinOfTime(second);
        var sec = self.getSecOfTime(second);

        var time_str = hour + ":" + min + ":" + sec;
        return time_str;
    },

    getTimeStr2: function(second) {
        var self = this;
        if (!second || second <= 0) return "00:00";

        var min = self.getMinOfTime(second);
        var sec = self.getSecOfTime(second);

        var time_str = min + ":" + sec;
        return time_str;
    },

    //获取url对应的图片。如果已经下载下来，则返回文件名。否则返回nil
    getFilePathByUrl: function(url) {
        if (!url || url.length === 0) return null;
        var path = qf.downloader.getFilePathByUrl(url);
        if (io.exist(path)) {
            return path;
        }
        return null;
    },

    //随机获取格言
    getRandomMotto: function(motto_list) {
        var list = motto_list || qf.txt.gameLoaddingTips001;
        var motto = list[getRandom(0, list.length - 1)];
        return motto;
    },

    //获取随机位置开始的一组格言
    getCycleMotto: function(motto_list) {
        var list = motto_list || qf.txt.gameLoaddingTips001;
        var cycle_motto = [];
        var index = getRandom(0, list.length - 1);
        for (var i = index; i < list.length; i++) {
            cycle_motto.push(list[i]);
        }

        for (var i = 0; i < index; i++) {
            cycle_motto.push(list[i]);
        }
        return cycle_motto;
    },

    getFormatBlindTime: function(time) {
        var time_str = "";
        var m = Math.floor(time / 60);
        var s = time % 60;
        if (m > 0) {
            if (s > 0) {
                time_str = m + qf.txt.mtt_lobby_string_10 + s + qf.txt.mtt_lobby_string_11;
            } else {
                time_str = m + qf.txt.mtt_lobby_string_26;
            }
        } else {
            time_str = s + qf.txt.mtt_lobby_string_11;
        }
        return time_str;
    },

    getMTTRewardContent: function(reward) {
        var self = this;
        var str = "";
        if (reward.gold && reward.gold > 0) {
            str = self.getFormatString(reward.gold) + qf.txt.global_string113;
        } else if (reward.float_ratio !== "" && parseInt(reward.float_ratio) > 0) {
            str = qf.txt.mtt_lobby_string_22 + "*" + reward.float_ratio + "%";
        }
        if (reward.score && parseInt(reward.score) > 0) {
            if (str !== "") str = str + "、";
            str = str + reward.score + qf.txt.mtt_lobby_string_12;
        }
        if (reward.coupon_id && reward.coupon_id > 0) {
            if (str !== "") str = str + "、";
            str = str + reward.coupon_name;
        }
        if (reward.ticket_id && reward.ticket_id > 0) {
            if (str !== "") str = str + "、";
            str = str + cc.formatStr(qf.txt.enter_ticket_name, reward.ticket_name);
        }
        return str;
    },

    getByteCount: function(byte) {
        var ret = 0;
        if (byte > 0 && byte <= 127) {
            ret = 1;
        } else if (byte >= 192 && byte < 223) {
            ret = 2;
        } else if (byte >= 224 && byte < 239) {
            ret = 3;
        } else if (byte >= 240 && byte <= 247) {
            ret = 4;
        }
        return ret;
    },

    //过滤表情符号
    filterEmoji: function(str) {
        var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\uE000-\uEFFF]|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
        str = str.replace(regStr, "");
        str = str.replace(/^\s+|\s+$/g, "");
        return str || "";
    },

    //获取富文本列表
    getRichText: function(content) {
        var index;
        var text = [];
        while (content.indexOf("<font>") !== -1) {
            index = content.indexOf("<font>");
            var txt1 = content.substring(0, index);
            content = content.substring(index + 6);
            index = content.indexOf("</font>");
            var txt2 = content.substring(0, index);
            content = content.substring(index + 7);
            text.push(txt1);
            text.push(txt2);
        }
        if (content !== "") {
            text.push(content);
        }
        return text;
    },

    //获取随机字符串
    randomString: function(length) {
        var str_mode = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        var len_mode = str_mode.length;
        var ret_list = [];
        for (var i = 1; i <= length; i++) {
            var r = getRandom(0, len_mode - 1);
            ret_list.push(str_mode[r]);
        }
        return ret_list.join("");
    },

    //返回插入特殊字符后的人民币 数字，88,888,888
    matchStr: function(num, letter) {
        var appendStr = "";
        var tempNum = num;
        var tempstr = "";
        while (tempNum > 0) {
            if (tempNum < 1000) {
                tempstr = (tempNum % 1000) + "";
                if (appendStr.length > 0) {
                    appendStr = tempstr + letter + appendStr;
                    tempNum = Math.floor(tempNum / 1000);
                } else {
                    appendStr = tempstr + "" + appendStr;
                    tempNum = Math.floor(tempNum / 1000);
                }
            } else {
                if (appendStr.length <= 0) {
                    tempstr = (1000 + tempNum % 1000) + "";
                    appendStr = appendStr + "" + tempstr.substr(1, 4);
                    tempNum = Math.floor(tempNum / 1000);
                } else {
                    tempstr = (1000 + tempNum % 1000) + "";
                    appendStr = tempstr.substr(2, 4) + letter + appendStr;
                    tempNum = Math.floor(tempNum / 1000);
                }
            }
        }

        if (appendStr.length <= 0)
            appendStr = tempNum + "";

        return appendStr;
    },

    /**
     * 将毫秒转换成 s'ms格式
     * @param second
     * @returns {string}
     */
    getTimeStr3: function(millsecond) {
        var self = this;
        if (!millsecond || millsecond <= 0) return "0‘00";

        var sec = Math.floor(millsecond / 1000);
        var mill_sec = Math.floor((millsecond - sec * 1000) / 10);
        // console.log(mill_sec);
        if (mill_sec < 10) {
            mill_sec = "0" + mill_sec;
        }
        var time_str = sec + "‘" + mill_sec;
        return time_str;
    },
    
};

module.exports = UtilString;