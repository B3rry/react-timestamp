'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function plural(string, count, many) {
  if (count == 1) {
    return string;
  } else if (many) {
    return many;
  } else {
    return string + 's';
  }
}

var Timestamp = function (_React$Component) {
  _inherits(Timestamp, _React$Component);

  function Timestamp() {
    _classCallCheck(this, Timestamp);

    return _possibleConstructorReturn(this, (Timestamp.__proto__ || Object.getPrototypeOf(Timestamp)).apply(this, arguments));
  }

  _createClass(Timestamp, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      if (this.props.autoUpdate) {
        var interval = (typeof this.props.autoUpdate === 'number' ? this.props.autoUpdate : 1) * 1000;
        this.updateInterval = setInterval(function () {
          _this2.forceUpdate();
        }, interval);
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
    }
  }, {
    key: '_distanceOfTimeInWords',
    value: function _distanceOfTimeInWords(date, compare_to) {
      var is_comparing = false;

      if (compare_to) {
        if (compare_to.toDate) compare_to = compare_to.toDate();
        is_comparing = true;
      } else {
        compare_to = new Date();
      }
      // console.log(date.getTime() / 1000)
      // console.log(compare_to)

      var seconds = Math.floor((compare_to - date.getTime() / 1000));
      var is_ago = seconds >= 0;

      seconds = Math.abs(seconds);

      if (seconds < 60) {
        // 1 minute
        if (is_comparing) {
          return is_ago ? 'Just then' : 'Soon';
        } else {
          return 'A few seconds';
        }
      }

      var distance;
      var when = [];

      if (this.props.precision == 1) {
        if (seconds < 60 * 60) {
          // 1 hour
          distance = Math.round(seconds / 60);
          when = distance + ' ' + plural('minute', distance);
        } else if (seconds == 60 * 60 * 24) {
          distance = Math.round(seconds / (60 * 60));
          when = distance + ' ' + plural('hour', distance);
        } else if (seconds < 60 * 60 * 24) {
          // 1 day
          distance = Math.round(seconds / (60 * 60));
          when = distance + ' ' + plural('hour', distance);
        } else if (seconds < 60 * 60 * 24 * 7) {
          // 1 week
          distance = Math.round(seconds / (60 * 60 * 24));
          when = distance + ' ' + plural('day', distance);
        } else if (seconds < 60 * 60 * 24 * (365 / 12)) {
          // 1 month
          distance = Math.round(seconds / (60 * 60 * 24 * 7));
          when = distance + ' ' + plural('week', distance);
        } else if (seconds < 60 * 60 * 24 * 30 * 12) {
          // # 1 year
          distance = Math.round(seconds / (60 * 60 * 24 * (365 / 12)));
          when = distance + ' ' + plural('month', distance);
        } else {
          return this._prettyTime(date);
        }
      } else {
        when = [];

        // Years
        var YEAR = 60 * 60 * 24 * 365;
        if (seconds > YEAR) {
          distance = Math.floor(seconds / YEAR);
          when.push(distance + ' ' + plural('year', distance));
          seconds -= distance * YEAR;
        }

        // Months
        var MONTH = 60 * 60 * 24 * (365 / 12);
        if (seconds > MONTH) {
          distance = Math.floor(seconds / MONTH);
          when.push(distance + ' ' + plural('month', distance));
          seconds -= distance * MONTH;
        }

        // Days
        var DAY = 60 * 60 * 24;
        if (seconds > DAY) {
          distance = Math.floor(seconds / DAY);
          when.push(distance + ' ' + plural('day', distance));
          seconds -= distance * DAY;
        }

        // Hours
        var HOUR = 60 * 60;
        if (seconds > HOUR) {
          distance = Math.floor(seconds / HOUR);
          when.push(distance + ' ' + plural('hour', distance));
          seconds -= distance * HOUR;
        }

        // Minutes
        var MINUTE = 60;
        if (seconds > MINUTE) {
          distance = Math.floor(seconds / MINUTE);
          when.push(distance + ' ' + plural('minute', distance));
          seconds -= distance * MINUTE;
        }

        if (seconds > 0) {
          when.push(seconds + ' ' + plural('second', seconds));
        }

        when = when.slice(0, this.props.precision).join(', ');
      }

      if (is_comparing) {
        return when;
      } else if (is_ago) {
        return when + ' ago';
      } else {
        return 'in ' + when;
      }
    }
  }, {
    key: '_prettyTime',
    value: function _prettyTime(date) {
      var hours, minutes, ampm;

      // eg. 5 Nov 12, 1:37pm
      if (date.getHours() % 12 == 0) {
        hours = 12;
      } else {
        hours = date.getHours() % 12;
      }

      if (date.getMinutes() < 10) {
        minutes = '0' + date.getMinutes();
      } else {
        minutes = '' + date.getMinutes();
      }

      if (date.getHours() > 11) {
        ampm = 'pm';
      } else {
        ampm = 'am';
      }

      var day = this.props.includeDay ? DAYS[date.getDay()] + ', ' : '';

      switch (this.props.format) {
        case 'date':
          return '' + day + date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear();
        case 'time':
          return hours + ':' + minutes + ampm;
        case 'full':
        default:
          return '' + day + date.getDate() + ' ' + MONTHS[date.getMonth()] + ' ' + date.getFullYear() + ', ' + hours + ':' + minutes + ampm;
      }
    }
  }, {
    key: '_parseDate',
    value: function _parseDate(date) {
      if (date === '' || date === false || date === null) return false;

      if (typeof date === 'number' || '' + parseInt(date, 10) == date) {
        date = parseInt(date, 10);

        if (isNaN(date)) return false;

        date = new Date(date * 1000);
      }

      if (date.toJSON) {
        date = date.toJSON();
      } else {
        date = date.toString();
      }

      var t = date.split(/[:\-\+TZ\. ]/);
      for (var i in t) {
        if (t[i] !== '' && isNaN(parseInt(t[i], 10))) return false;
      }

      var d;

      if (this.props.utc) {
        d = new Date('Sun Jan 01 00:00:00 UTC 2012');
        d.setUTCFullYear(t[0]);
        d.setUTCMonth(t[1] - 1);
        d.setUTCDate(t[2]);
        d.setUTCHours(t[3]);
        d.setUTCMinutes(t[4]);
        d.setUTCSeconds(t[5]);
      } else {
        d = new Date('1/1/1970');
        d.setFullYear(t[0]);
        d.setMonth(t[1] - 1);
        d.setDate(t[2]);
        d.setHours(t[3]);
        d.setMinutes(t[4]);
        d.setSeconds(t[5]);
      }

      return d;
    }
  }, {
    key: '_formatDate',
    value: function _formatDate(date) {
      var d = this._parseDate(date);

      if (d === false) {
        return 'never';
      }

      if (this.props.format == 'ago' || this.props.format == 'future' || this.props.format == 'relative' || this.props.since || this.props.until) {
        return this._distanceOfTimeInWords(d, this.props.since || this.props.until || null);
      } else {
        return this._prettyTime(d);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(this.props.component, { className: this.props.className, style: this.props.style }, this._formatDate(this.props.time));
    }
  }]);

  return Timestamp;
}(React.Component);

Timestamp.defaultProps = {
  time: new Date(),
  utc: true,
  format: 'ago',
  precision: 1,
  since: null,
  until: null,
  includeDay: false,
  component: 'span',
  className: '',
  style: {},
  autoUpdate: false
};

module.exports = Timestamp;