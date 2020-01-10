var U = (function () {
    var _logEnabled = false;
    var log = function () {
        if (!_logEnabled || !console || !console.log) {
            return;
        }
        console.log.apply(console, arguments);
    };
    var isLogEnabled = function () {
        return _logEnabled;
    };
    var enableLog = function (enabled) {
        _logEnabled = enabled;
    };

    var str = (function () {

        var isNull = function (s) {
            return (typeof s === 'undefined' || s === null);
        };
        var isNotNull = function (s) {
            return !isNull(s);
        };

        var isEmpty = function (s) {
            if (isNull(s)) {
                return true;
            }
            if (typeof s != 'string') {
                return false;
            }
            return s.length == 0;
        };
        var isNotEmpty = function (s) {
            return !isEmpty(s);
        };

        var isNumber = function (s) {
            if (isEmpty(s)) {
                return false;
            }
            return /^[0-9]*$/.test(s);
        };

        var startsWith = function (s, prefix) {
            return s.indexOf(prefix) == 0;
        };

        var endsWith = function (str, suffix) {
            return str.indexOf(suffix, str.length - suffix.length) !== -1;
        };

        var replaceAll = function (s, s1, s2) {
            return s.replace(new RegExp(s1, "gm"), s2);
        };

        var trim = (s) => {
            return s.replace(/^\s+|\s+$/gm, '');
        };

        let isUrl = (s) => {
            if (isNotEmpty(s)) {
                let reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
                if (reg.test(s)) {
                    return true;
                }
            }
            return false;
        };

        let randomString = (len) => {
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let maxIndex = chars.length;
            let s = '';
            for (let i = 0; i < len; i++) {
                s += chars.charAt(Math.floor(Math.random() * maxIndex));
            }
            return s;
        };

        let isChinaMobile = (mobile) => {
            if (isNull(mobile))
                return false;
            if (mobile.indexOf('-') > 0) {
                mobile = mobile.split('-')[1];
            }
            let cm_reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            return cm_reg.test(mobile);
        };

        let trimChinaMobile = (mobile) => {
            if (mobile) {
                if (mobile.indexOf('-') > -1 && mobile.indexOf('86-') > -1) {
                    return mobile.split('-')[1];
                }
                return mobile;
            }
            return '';
        };

        return {
            isNull: isNull,
            isNotNull: isNotNull,
            isEmpty: isEmpty,
            isNotEmpty: isNotEmpty,
            startsWith: startsWith,
            endsWith: endsWith,
            replaceAll: replaceAll,
            trim, isChinaMobile, isUrl, randomString, isNumber, trimChinaMobile
        };
    })();

    var date = (function () {
        var pad = function (n) {
            return n < 10 ? '0' + n : n;
        };

        var inAnHour = function (date) {
            var mins = parseInt((Math.floor(new Date()) - Math.floor(new Date(date))) / (1000 * 60));
            if (mins > -60)
                return true;
            return false;
        };

        var in24Hour = function (date) {
            var mins = parseInt((Math.floor(new Date()) - Math.floor(new Date(date))) / (1000 * 60));
            if (mins > -1440)
                return true;
            return false;
        };

        var countdownTimers = function (date) {
            var timers = [0, 0, 0, 0];
            var time = parseInt(Math.floor(new Date(date) - Math.floor(new Date())) / 1000 / 60);

            var mins = parseInt(time / 60);

            if (mins < 10) {
                timers[0] = 0;
                timers[1] = mins;
            } else {
                timers[0] = parseInt(mins / 10);
                timers[1] = parseInt(mins % 10);
            }

            var seconds = time % 60;
            if (seconds < 10) {
                timers[2] = 0;
                timers[3] = seconds;
            } else {
                timers[2] = parseInt(seconds / 10);
                timers[3] = parseInt(seconds % 10);
            }

            return timers;
        };

        var foreshowTimeout = function (timers) {

            if (timers[0] === 0 && timers[1] === 0 && timers[2] === 0 && timers[3] === 0) {
                return true;
            }
            return false;

        };

        var foreshowTimeouted = function (timers) {

            if (timers[0] <= 0 && timers[1] <= 0 && timers[2] <= 0 && timers[3] <= 0) {
                return true;
            }
            return false;

        };

        var seconds2HMS = function (time) {
            let h = 0,
                m = 0,
                s = 0,
                _h,
                _m,
                _s, ret = '';

            h = Math.floor(time / 3600);
            time = Math.floor(time % 3600);
            m = Math.floor(time / 60);
            s = Math.floor(time % 60);
            if (h > 0) {
                _h = h < 10 ? '0' + h : h;
                ret += _h + ':';
            }
            _s = s < 10 ? '0' + s : s;
            _m = m < 10 ? '0' + m : m;

            ret += _m + ':' + _s;

            return ret;
        };

        var format = function (date, fmt) {
            if (!date || !fmt) {
                return null;
            }
            var o = {
                "M+": date.getMonth() + 1, // 月份
                "d+": date.getDate(), // 日
                "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 小时
                "H+": date.getHours(), // 小时
                "m+": date.getMinutes(), // 分
                "s+": date.getSeconds(), // 秒
                "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
                "S": date.getMilliseconds()
            };
            var week = {
                "0": "\u65e5",
                "1": "\u4e00",
                "2": "\u4e8c",
                "3": "\u4e09",
                "4": "\u56db",
                "5": "\u4e94",
                "6": "\u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt
                    .replace(
                        RegExp.$1,
                        ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f"
                            : "\u5468")
                            : "")
                        + week[date.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1,
                        (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k])
                            .substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };

        var formatISO8601 = function (d) {
            if (!d) {
                return null;
            }
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-'
                + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':'
                + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds())
                + 'Z';
        };
        var getInt = function (s) {
            var offset = 0;
            for (var i = 0; i < s.length; i++) {
                if (s.charAt(i) == '0') {
                    continue;
                }
                offset = i;
                break;
            }
            if (offset == 0) {
                return parseInt(s);
            }
            return parseInt(s.substr(offset));
        };
        var parse = function (v, timezoneOffset) {
            if (!v) {
                return null;
            }
            // yyyy-MM-ddTHH:mm:ssZ
            // yyyy-MM-ddTHH:mm:ss.SSSZ
            // yyyy-MM-dd HH:mm:ss.SSS
            var index = 0;
            var year = getInt(v.substr(index, 4));
            index += 5;
            var month = getInt(v.substr(index, 2)) - 1;
            index += 3;
            var day = getInt(v.substr(index, 2));
            index += 3;
            var hour = index >= v.length ? 0 : getInt(v.substr(index, 2));
            index += 3;
            var minute = index >= v.length ? 0 : getInt(v.substr(index, 2));
            index += 3;
            var second = index >= v.length ? 0 : getInt(v.substr(index, 2));
            // TODO more format
            if (v.charAt(v.length - 1) == 'Z') {
                var millSecond = v.indexOf('.') > 0 ? getInt(v.substring(v
                    .indexOf('.') + 1, v.length - 1)) : 0;
                var d = new Date();
                d.setUTCFullYear(year);
                d.setUTCMonth(month);
                d.setUTCDate(day);
                d.setUTCHours(hour);
                d.setUTCMinutes(minute);
                d.setUTCSeconds(second);
                d.setUTCMilliseconds(millSecond);
                return d;
            } else {
                var millSecond = v.indexOf('.') > 0 ? getInt(v.substring(v
                    .indexOf('.') + 1)) : 0;
                var date = new Date(year, month, day, hour, minute, second,
                    millSecond);
                if (!str.isNull(timezoneOffset)) {
                    var diff = timezoneOffset - date.getTimezoneOffset();
                    date.setTime(date.getTime() - diff * 60 * 1000);
                }
                return date;
            }
        };

        let isToday = function (date) {
            let d = U.date.format(U.date.parse(date), 'yyyy-MM-dd');
            let today = U.date.format(new Date(), 'yyyy-MM-dd');
            return d === today;
        };

        let daysDiff = (t1, t2) => {
            return Math.floor((t1 - t2) / 86400000);
        };

        return {
            pad,
            parse: parse,
            inAnHour: inAnHour,
            in24Hour: in24Hour,
            seconds2HMS: seconds2HMS,
            countdownTimers: countdownTimers,
            foreshowTimeout: foreshowTimeout,
            foreshowTimeouted: foreshowTimeouted,
            format: format,
            isToday,
            formatISO8601: formatISO8601,
            daysDiff
        };
    })();

    let array = (function () {
        let swap = function (arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        };

        let remove = function (arr, index) {
            if (isNaN(index) || index > arr.length) {
                return [];
            }
            arr.splice(index, 1);
            return arr;
        };

        let insert = function (arr, index, item) {
            arr.splice(index, 0, item);
            return arr;
        };

        let insertLast = function (arr, item) {
            arr.splice(arr.length, 0, item);
            return arr;
        };

        return {
            swap, remove, insert, insertLast
        }
    })();

    var getHashParameter = function (name) {
        var hash = window.location.hash;
        if (!hash) {
            return null;
        }
        var offset = hash.indexOf('?');
        if (offset < 0) {
            return null;
        }
        hash = hash.substr(offset + 1);
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = hash.match(reg);
        if (r == null) {
            return null;
        }
        return unescape(r[2]);
    };
    var getParameter = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    };
    var getVisitNumber = function (num) {
        let val = parseInt(num);
        if (val < 1000) {
            return val;
        }
        if (val > 1000 && val < 10000) {
            return '>' + val;
        }
        if (val > 10000) {
            return '>1万';
        }
    };

    var getDomainFromUrl = function (url) {
        var offset = url.indexOf("//");
        var offset2 = url.indexOf("/", offset + 2);
        if (offset2 == -1) {
            return url.substring(offset + 2);
        }
        return url.substring(offset + 2, offset2);
    };

    var countryCode = [
        {
            code: '86',
            name: '中国'
        },
        {
            code: '852',
            name: '香港'
        },
        {
            code: '853',
            name: '澳门'
        },
        {
            code: '886',
            name: '台湾'
        },
        {
            code: '65',
            name: '新加坡'
        },
        {
            code: '66',
            name: '泰国'
        },
        {
            code: '1',
            name: '美国'
        },
        {
            code: '60',
            name: '马来西亚'
        }];

    var convertBigDecimal = function (num) {
        if (num > 10000) {
            return (num / 10000).toFixed(1) + '万';
        }
        return num;
    };

    var isIOS = function () {
        let u = navigator.userAgent;
        var isIOS = /(iPhone|iPad|iPod|iOS)/i.test(u);
        return isIOS;
    };

    var formatCurrency = function (s, n) {
        if (s) {
            /*
             * 参数说明：
             * s：要格式化的数字
             * n：保留几位小数
             * */
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(),
                r = s.split(".")[1];
            let t = "";
            for (let i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("") + "." + r;
        } else {
            return 0;
        }

    };

    let htmlstr = (() => {

        let components2pureHtml = (cs) => {
            let html = '';
            cs.map((c, index) => {
                if (c.type === 1) {
                    if (c.text.length > 0) {
                        let text = c.text;
                        text = text.replace(/<[^>]+>/g, "");
                        text = text.replace(/\r\n/g, "<br/>");
                        text = text.replace(/\n/g, "<br/>");
                        text = text.replace(/\s/g, "&nbsp;");
                        html += '<p>' + text + '</p>';
                    }
                } else {
                    if (c.url !== '')
                        html += '<img src="' + c.url + '"/>';
                }
            });
            return html;
        };

        let html2components = (html) => {
            let div = document.createElement("div");
            div.innerHTML = html;
            let nodes = div.childNodes;
            let cs = [];
            for (let i = 0; i < nodes.length; i++) {
                let n = nodes[i];
                let name = n.nodeName.toLowerCase();
                if (name === 'p') {

                    let html = n.innerHTML.toLowerCase();
                    html = html.replace(/(<br\/>|<br>)/g, '\r\n');
                    html = html.replace(/&nbsp;/g, ' ');

                    cs.push({type: 1, text: html});
                } else if (name === 'img') {
                    cs.push({type: 2, url: n.src})
                }
            }
            return cs;
        };

        return {
            components2pureHtml, html2components
        }

    })();

    let base64 = (() => {
        let getBlobBydataURI = (dataURI, type) => {
            let binary = atob(dataURI.split(',')[1]);
            let array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: type});
        };
        return {getBlobBydataURI}
    })();

    let setWXTitle = (t) => {
        let i = document.createElement('iframe');
        i.style.display = 'none';
        i.onload = () => {
            setTimeout(() => {
                i.remove();
            }, 9);
        };
        document.body.appendChild(i);
        document.title = '河工校园淘 - ' + t;
    };

    return {
        htmlstr,
        log: log,
        isLogEnabled: isLogEnabled,
        enableLog: enableLog,
        str: str,
        date: date,
        array,
        getParameter: getParameter,
        getHashParameter: getHashParameter,
        getVisitNumber: getVisitNumber,
        getDomainFromUrl: getDomainFromUrl,
        countryCode: countryCode,
        convertBigDecimal: convertBigDecimal,
        isIOS: isIOS,
        formatCurrency, base64,
        setWXTitle
    };
})();

export default U;
