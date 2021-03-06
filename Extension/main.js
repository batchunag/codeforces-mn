// Generated by CoffeeScript 1.6.2
var BOX, ROW, STYLE, translate;

String.prototype.start_with = function(str) {
  return this.substr(0, str.length) === str;
};

String.prototype.end_with = function(str) {
  return this.slice(-str.length) === str;
};

String.prototype.contain = function(str) {
  return this.indexOf(str) > -1;
};

String.prototype.is_numeric = function() {
  return !isNaN(parseFloat(this)) && isFinite(this);
};

STYLE = "<style>\n  .mn-please a { color: green !important; font-weight: bold; padding: 1px 5px 2px; border-radius: 3px }\n  .mn-please a:hover { color: #fff !important; background: #069100 !important }\n  .mn-statement ul { margin-bottom: 1em }\n  .mn-statement .credit { text-align: right; font-style: italic; font-size: 110%; font-family: Georgia, serif }\n  .sample-tests .section-title { margin-bottom: 0.5em }\n  .sample-tests .title { font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif !important; font-size: 1em !important; text-transform: none !important }\n</style>";

if (location.pathname === "/" || location.pathname.match(/^\/contest\/\d+\/?$/) || location.pathname.match(/\/problemset(?!\/problem\/)/) || location.pathname.start_with("/contests")) {
  $.ajax({
    url: "http://www.codeforces.mn/extension?" + (new Date().getTime()),
    dataType: "text",
    success: function(text) {
      var c, i, ready, storage, t, total, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;

      storage = {};
      storage.updated = new Date().getTime() / 1000;
      _ref = text.split("\n")[0].split("|");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        storage["problem:" + i] = 1;
      }
      _ref1 = text.split("\n")[1].split("|");
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        c = _ref1[_j];
        i = c.split(":")[0];
        ready = Number(c.split(":")[1].split("/")[0]);
        total = Number(c.split(":")[1].split("/")[1]);
        storage["contest:" + i] = {
          ready: ready,
          total: total
        };
      }
      storage.credits = [];
      _ref2 = text.split("\n")[2].split("|");
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        t = _ref2[_k];
        storage.credits.push(t.split(":"));
      }
      storage.total = text.split("\n")[3];
      return localStorage.mn = JSON.stringify(storage);
    }
  });
}

if (location.pathname === "/") {
  BOX = "<div class=\"roundbox sidebox top-contributed\" style=\"\">\n  <div class=\"roundbox-lt\">&nbsp;</div>\n  <div class=\"roundbox-rt\">&nbsp;</div>\n  <div class=\"caption titled\">→ Top translators</div>\n  <table class=\"rtable \">\n    <tr>\n      <th class=\"left\" style=\"width:2.25em\">#</th>\n      <th>User</th>\n      <th style=\"font-weight:normal;font-size:13px\">{total}</th>\n    </tr>\n    {content}\n  </table>\n</div>";
  ROW = "<tr{style}>\n  <td class=\"left\">{place}</td>\n  <td class=\"mn-credit\">{name}</td>\n  <td>{score}</td>\n</tr>";
  /* Contribution score panel
  */

  $(function() {
    var color, content, count, place, ready, row, storage, t, _i, _len, _ref;

    $("head").append("<style>\n  .rtable tr:last-child td { border-bottom: none !important }\n  .mn-credit { font-weight: bold; color: #000; font-size: 12px !important }\n</style>");
    storage = JSON.parse(localStorage.mn || "{}");
    color = function(name, score) {
      var r;

      score = Number(score);
      r = '<span class="user-gray">' + name + '</span>';
      if (score >= 25) {
        r = '<span class="user-green">' + name + '</span>';
      }
      if (score >= 50) {
        r = '<span class="user-blue">' + name + '</span>';
      }
      if (score >= 75) {
        r = '<span class="user-orange">' + name + '</span>';
      }
      if (score >= 100) {
        r = '<span class="user-red">' + name + '</span>';
      }
      return r;
    };
    if (storage.credits) {
      content = [];
      place = 0;
      ready = 0;
      count = 0;
      _ref = storage.credits;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        t = _ref[_i];
        row = ROW.replace("{place}", ++place);
        row = row.replace("{name}", color(t[0], t[1]));
        row = row.replace("{score}", t[1]);
        count++;
        if (count > 10) {
          row = row.replace("{style}", ' style="display:none"');
        } else {
          row = row.replace("{style}", '');
        }
        ready += Number(t[1]);
        content.push(row);
      }
      content.push("<tr>\n	<td colspan=\"2\"></td>\n	<td style=\"border-left:0\"><a href=\"javascript:;\" onclick='$(this).closest(\"table\").find(\"tr\").show();$(this).closest(\"tr\").fadeOut().remove()' class=\"js-more\">бүгд &rarr;</a></td>\n</tr>");
      return $("#sidebar .top-contributed:last")[0].outerHTML = BOX.replace("{total}", "" + ready + "/" + storage.total).replace("{content}", content.join("\n"));
    }
  });
}

if (location.pathname.match(/\/problemset(?!\/problem\/)/)) {
  /* Highlight translated problems
  */

  $(function() {
    var storage;

    $("head").append("<style>\n  .problems tr td:nth-child(2) > div:first-child { margin-left: 14px }\n  .mn td:nth-child(2) > div:first-child { margin-left: 0 !important }\n  .mn td:nth-child(2) > div:first-child a:before { content: \"✱ \"; color: #c900a9; text-decoration: none; display: inline-block; float: left; margin-right: 4px }\n</style>");
    storage = JSON.parse(localStorage.mn || "{}");
    return $(".problems tr").each(function() {
      var problem_id;

      problem_id = $.trim($(this).find("td.id").text());
      while ($.isNumeric(problem_id.slice(-1))) {
        problem_id = problem_id.slice(0, -1);
      }
      problem_id = problem_id.slice(0, -1) + "-" + problem_id.slice(-1);
      if (storage["problem:" + problem_id] !== void 0) {
        return $(this).addClass("mn");
      }
    });
  });
}

if (location.pathname.match(/\/problemset\/problem\//)) {
  /* Append "Монголоор унших" button
  */

  $(function() {
    var problem_id, storage;

    $("head").append(STYLE);
    storage = JSON.parse(localStorage.mn || "{}");
    problem_id = location.pathname.replace("/problemset/problem/", "").replace("/", "-").toUpperCase();
    while ($.isNumeric(problem_id.slice(-1))) {
      problem_id = problem_id.slice(0, -1);
    }
    if (storage["problem:" + problem_id] !== void 0) {
      $(".problem-statement .header .title").after("<div class=\"mn-please\"><a href=\"javascript:;\">Монголоор унших</a></div>");
    }
    return $(".mn-please a").on("click", translate);
  });
}

if (location.pathname.start_with("/contests")) {
  /* Stats about translated problems
  */

  $(function() {
    var storage;

    $("head").append("<style>\n  .mn      { font-size: 0.9em; color: #666666 }\n  .mn-full { font-size: 0.9em; color: #c900a9; font-weight: 600 }\n</style>");
    storage = JSON.parse(localStorage.mn || "{}");
    return $(".contests-table tr td:nth-child(1)").each(function() {
      var contest_id, ready, span, total, _ref, _ref1;

      $(this).find("a")[0].innerHTML = "Enter";
      if ($(this).find("a").length === 2) {
        $(this).find("a:first").next()[0].outerHTML = "<span>&middot;</span> ";
        $(this).find("a")[1].innerHTML = "Virtual participation";
      } else {
        $(this).closest("tr").hide();
      }
      contest_id = $(this).find("a:first").attr("href").replace("/contest/", "");
      while (contest_id.length < 3) {
        contest_id = "0" + contest_id;
      }
      ready = ((_ref = storage["contest:" + contest_id]) != null ? _ref.ready : void 0) || 0;
      total = ((_ref1 = storage["contest:" + contest_id]) != null ? _ref1.total : void 0) || 0;
      if (ready <= 0) {
        return;
      }
      span = ready === total ? "mn-full" : "mn";
      return $(this).append("<span class=\"" + span + "\">Орчуулагдсан: " + ready + " / " + total + "</span>");
    });
  });
}

if (location.pathname.match(/^\/contest\/\d+\/?$/)) {
  /* Highlight translated problems
  */

  $(function() {
    var storage;

    $("head").append("<style>\n  .problems tr td:nth-child(2) > div:first-child { margin-left: 14px }\n  .mn td:nth-child(2) > div:first-child { margin-left: 0 !important }\n  .mn td:nth-child(2) > div:first-child a:before { content: \"✱ \"; color: #c900a9; text-decoration: none; display: inline-block; float: left; margin-right: 4px }\n</style>");
    storage = JSON.parse(localStorage.mn || "{}");
    return $(".problems tr").each(function() {
      var problem_id;

      problem_id = location.pathname.replace("/contest/", "").replace("/", "") + "-" + $.trim($(this).find("td.id").text());
      while ($.isNumeric(problem_id.slice(-1))) {
        problem_id = problem_id.slice(0, -1);
      }
      if (storage["problem:" + problem_id] !== void 0) {
        return $(this).addClass("mn");
      }
    });
  });
}

if (location.pathname.match(/^\/contest\/\d+\/problem\//)) {
  /* Append "Монголоор унших" button
  */

  $(function() {
    var problem_id, storage;

    $("head").append(STYLE);
    storage = JSON.parse(localStorage.mn || "{}");
    problem_id = location.pathname.replace("/contest/", "");
    problem_id = problem_id.replace("/problem/", "-").toUpperCase();
    while ($.isNumeric(problem_id.slice(-1))) {
      problem_id = problem_id.slice(0, -1);
    }
    if (storage["problem:" + problem_id] !== void 0) {
      $(".problem-statement .header .title").after("<div class=\"mn-please\"><a href=\"javascript:;\">Монголоор унших</a></div>");
    }
    return $(".mn-please a").on("click", translate);
  });
}

translate = function() {
  var problem_id;

  if (location.pathname.start_with("/problemset/problem/")) {
    problem_id = location.pathname.replace("/problemset/problem/", "").replace("/", "-").toUpperCase();
  }
  if (location.pathname.start_with("/contest/")) {
    problem_id = location.pathname.replace("/contest/", "");
    problem_id = problem_id.replace("/problem/", "-").toUpperCase();
  }
  while ($.isNumeric(problem_id.slice(-1))) {
    problem_id = problem_id.slice(0, -1);
  }
  while (problem_id.length < 5) {
    problem_id = "0" + problem_id;
  }
  $(".mn-please").fadeOut("fast", function() {
    return $(this).html("<strong>Орчуулж байна...</strong>").fadeIn("fast");
  });
  return $.ajax({
    url: "http://www.codeforces.mn/problemset/problem/" + (problem_id.replace("-", "/")) + ".html?" + (new Date().getTime()),
    dataType: "html",
    success: function(data) {
      var $data, body, curr, head, script;

      $(".problem-statement").addClass("mn-statement");
      $data = $("<div/>").html(data);
      $(".header .title").html("" + (problem_id.slice(-1)) + ". " + ($data.find("h1")[0].innerHTML));
      body = [];
      curr = $data.find("h1").next();
      while (curr[0] && curr[0].tagName !== "H3") {
        body.push(curr[0].outerHTML);
        curr = curr.next();
      }
      $(".header").next().html(body.join("\n"));
      body = [];
      curr = $data.find("h3").next();
      while (curr[0] && curr[0].tagName !== "H3") {
        body.push(curr[0].outerHTML);
        curr = curr.next();
      }
      $(".input-specification").html("<div class=\"section-title\">Оролт</div>" + (body.join("\n")));
      body = [];
      curr = $data.find("h3:eq(1)").next();
      while (curr[0] && curr[0].tagName !== "H3") {
        body.push(curr[0].outerHTML);
        curr = curr.next();
      }
      $(".output-specification").html("<div class=\"section-title\">Гаралт</div>" + (body.join("\n")));
      $(".sample-tests .section-title").html("Жишээ тэстүүд");
      $(".sample-tests .section-title").html("Жишээ тэстүүд");
      $(".sample-tests .sample-test .input .title").html("Оролт");
      $(".sample-tests .sample-test .output .title").html("Гаралт");
      if ($data.find("h3:eq(2)").length) {
        body = [];
        curr = $data.find("h3:eq(2)").next();
        while (curr[0] && curr[0].tagName !== "H3") {
          body.push(curr[0].outerHTML);
          curr = curr.next();
        }
        $(".problem-statement .note").html("<div class=\"section-title\">Тэмдэглэл</div>" + (body.join("\n")));
      }
      $(".mn-please").fadeOut("fast");
      head = document.getElementsByTagName("head")[0];
      script = document.createElement("script");
      script.type = "text/x-mathjax-config";
      script[(window.opera ? "innerHTML" : "text")] = 'MathJax.Hub.Config({tex2jax:{inlineMath:[["$", "$"]],displayMath:[["$$", "$$"]]}, showMathMenu:false});';
      head.appendChild(script);
      script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML";
      return head.appendChild(script);
    }
  });
};
